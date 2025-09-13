import type { Express } from "express";
import { createServer, type Server } from "http";
import { verifyFirebaseToken, firestore, updateUserPoints } from "./firebase-admin";
import { 
  validateMoodEntry, 
  validateChatMessage, 
  validateSafetyAlert,
  validateEnergyReading,
  validateWasteEvent,
  MoodEntry,
  ChatMessage,
  SafetyAlert,
  EnergyReading,
  WasteEvent
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User profile endpoints
  app.get("/api/auth/me", verifyFirebaseToken, async (req: any, res) => {
    try {
      const userDoc = await firestore.collection('users').doc(req.user.uid).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true, data: userDoc.data() });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Mood tracking endpoints
  app.get("/api/moods", verifyFirebaseToken, async (req: any, res) => {
    try {
      const moodsSnapshot = await firestore
        .collection('users')
        .doc(req.user.uid)
        .collection('moods')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();

      const moods = moodsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, data: moods });
    } catch (error) {
      console.error("Error fetching moods:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/moods", verifyFirebaseToken, async (req: any, res) => {
    try {
      const moodData = validateMoodEntry({
        ...req.body,
        userId: req.user.uid,
        timestamp: new Date().toISOString()
      });

      const moodRef = await firestore
        .collection('users')
        .doc(req.user.uid)
        .collection('moods')
        .add(moodData);

      // Update user points
      const pointsResult = await updateUserPoints(req.user.uid, moodData.pointsAwarded);

      const newMood: MoodEntry = { id: moodRef.id, ...moodData };
      
      res.json({ 
        success: true, 
        data: newMood,
        pointsAwarded: pointsResult.newPoints
      });
    } catch (error) {
      console.error("Error creating mood entry:", error);
      res.status(400).json({ error: "Invalid mood data", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Chat endpoints
  app.get("/api/chats", verifyFirebaseToken, async (req: any, res) => {
    try {
      const chatsSnapshot = await firestore
        .collection('users')
        .doc(req.user.uid)
        .collection('chats')
        .orderBy('timestamp', 'asc')
        .limit(100)
        .get();

      const chats = chatsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, data: chats });
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/chats", verifyFirebaseToken, async (req: any, res) => {
    try {
      const chatData = validateChatMessage({
        ...req.body,
        userId: req.user.uid,
        timestamp: new Date().toISOString()
      });

      const chatRef = await firestore
        .collection('users')
        .doc(req.user.uid)
        .collection('chats')
        .add(chatData);

      const newChat: ChatMessage = { id: chatRef.id, ...chatData };
      
      // If it's a user message, generate bot response
      if (chatData.type === 'user') {
        const botResponses = [
          "That sounds challenging. Have you tried taking 5 deep breaths?",
          "I understand. Would you like to try a quick 2-minute meditation?",
          "It's normal to feel this way. Let's focus on some positive affirmations.",
          "Have you considered taking a short walk outside? Fresh air can help.",
          "Remember, it's okay to feel overwhelmed sometimes. What usually helps you relax?",
          "Would you like me to guide you through a brief mindfulness exercise?"
        ];

        const botResponse = validateChatMessage({
          userId: req.user.uid,
          type: 'bot',
          message: botResponses[Math.floor(Math.random() * botResponses.length)],
          timestamp: new Date().toISOString()
        });

        const botRef = await firestore
          .collection('users')
          .doc(req.user.uid)
          .collection('chats')
          .add(botResponse);

        const newBotChat: ChatMessage = { id: botRef.id, ...botResponse };
        
        res.json({ 
          success: true, 
          data: [newChat, newBotChat]
        });
      } else {
        res.json({ success: true, data: newChat });
      }
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(400).json({ error: "Invalid chat data", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Safety alert endpoints
  app.get("/api/safety/alerts", verifyFirebaseToken, async (req: any, res) => {
    try {
      const alertsSnapshot = await firestore
        .collection('safety_alerts')
        .where('userId', '==', req.user.uid)
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get();

      const alerts = alertsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, data: alerts });
    } catch (error) {
      console.error("Error fetching safety alerts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/safety/alerts", verifyFirebaseToken, async (req: any, res) => {
    try {
      const alertData = validateSafetyAlert({
        ...req.body,
        userId: req.user.uid,
        timestamp: new Date().toISOString()
      });

      const alertRef = await firestore.collection('safety_alerts').add(alertData);
      const newAlert: SafetyAlert = { id: alertRef.id, ...alertData };
      
      res.json({ success: true, data: newAlert });
    } catch (error) {
      console.error("Error creating safety alert:", error);
      res.status(400).json({ error: "Invalid alert data", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/safety/alerts/:id", verifyFirebaseToken, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await firestore.collection('safety_alerts').doc(id).update({
        status,
        resolvedAt: status === 'resolved' ? new Date().toISOString() : null,
        resolvedBy: status === 'resolved' ? req.user.uid : null
      });

      res.json({ success: true, message: "Alert updated successfully" });
    } catch (error) {
      console.error("Error updating safety alert:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Energy readings endpoints
  app.get("/api/energy/readings", async (req, res) => {
    try {
      const readingsSnapshot = await firestore
        .collection('energy_readings')
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();

      const readings = readingsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, data: readings });
    } catch (error) {
      console.error("Error fetching energy readings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Waste events endpoints
  app.get("/api/waste/events", verifyFirebaseToken, async (req: any, res) => {
    try {
      const eventsSnapshot = await firestore
        .collection('waste_events')
        .where('userId', '==', req.user.uid)
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();

      const events = eventsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, data: events });
    } catch (error) {
      console.error("Error fetching waste events:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/waste/events", verifyFirebaseToken, async (req: any, res) => {
    try {
      const wasteData = validateWasteEvent({
        ...req.body,
        userId: req.user.uid,
        timestamp: new Date().toISOString()
      });

      const wasteRef = await firestore.collection('waste_events').add(wasteData);

      // Update user points
      const pointsResult = await updateUserPoints(req.user.uid, wasteData.pointsAwarded);

      const newWasteEvent: WasteEvent = { id: wasteRef.id, ...wasteData };
      
      res.json({ 
        success: true, 
        data: newWasteEvent,
        pointsAwarded: pointsResult.newPoints
      });
    } catch (error) {
      console.error("Error creating waste event:", error);
      res.status(400).json({ error: "Invalid waste data", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Gamification endpoints
  app.get("/api/gamification/leaderboard", async (req, res) => {
    try {
      const usersSnapshot = await firestore
        .collection('users')
        .orderBy('points', 'desc')
        .limit(10)
        .get();

      const leaderboard = usersSnapshot.docs.map((doc: any, index: number) => ({
        rank: index + 1,
        ...doc.data()
      }));

      res.json({ success: true, data: leaderboard });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // IoT data ingestion endpoint
  app.post("/api/iot/ingest", async (req, res) => {
    try {
      const { deviceId, deviceSecret, type, data } = req.body;

      // Verify device credentials (simplified for demo)
      const deviceDoc = await firestore.collection('devices').doc(deviceId).get();
      if (!deviceDoc.exists || deviceDoc.data()?.secretKey !== deviceSecret) {
        return res.status(401).json({ error: "Invalid device credentials" });
      }

      let result;
      
      if (type === 'energy') {
        const energyData = validateEnergyReading({
          ...data,
          deviceId,
          timestamp: new Date().toISOString()
        });
        
        const energyRef = await firestore.collection('energy_readings').add(energyData);
        result = { id: energyRef.id, ...energyData };
      } else {
        return res.status(400).json({ error: "Unknown data type" });
      }

      // Update device last seen
      await firestore.collection('devices').doc(deviceId).update({
        lastSeen: new Date().toISOString(),
        status: 'online'
      });

      res.json({ success: true, data: result });
    } catch (error) {
      console.error("Error ingesting IoT data:", error);
      res.status(400).json({ error: "Invalid IoT data", message: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}