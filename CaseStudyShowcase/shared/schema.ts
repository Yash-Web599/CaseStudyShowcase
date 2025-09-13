import { z } from "zod";

// User Profile Schema
export const userProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
  role: z.enum(['student', 'admin']).default('student'),
  points: z.number().default(0),
  level: z.number().default(1),
  joinedAt: z.string(),
  lastActive: z.string()
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// Mood Entry Schema
export const moodEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  mood: z.enum(['happy', 'neutral', 'sad']),
  score: z.number().min(1).max(10),
  notes: z.string().optional(),
  timestamp: z.string(),
  pointsAwarded: z.number().default(5)
});

export const insertMoodEntrySchema = moodEntrySchema.omit({ id: true });
export type MoodEntry = z.infer<typeof moodEntrySchema>;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;

// Chat Message Schema
export const chatMessageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['user', 'bot']),
  message: z.string(),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional()
});

export const insertChatMessageSchema = chatMessageSchema.omit({ id: true });
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// Safety Alert Schema
export const safetyAlertSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['sos', 'medical', 'security', 'fire']).default('sos'),
  status: z.enum(['active', 'resolved', 'cancelled']).default('active'),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number()
  }),
  description: z.string().optional(),
  timestamp: z.string(),
  resolvedAt: z.string().optional(),
  resolvedBy: z.string().optional()
});

export const insertSafetyAlertSchema = safetyAlertSchema.omit({ id: true });
export type SafetyAlert = z.infer<typeof safetyAlertSchema>;
export type InsertSafetyAlert = z.infer<typeof insertSafetyAlertSchema>;

// Energy Reading Schema
export const energyReadingSchema = z.object({
  id: z.string(),
  deviceId: z.string(),
  building: z.string(),
  usage: z.number(),
  capacity: z.number(),
  timestamp: z.string(),
  status: z.enum(['efficient', 'moderate', 'high']).optional(),
  sensorData: z.record(z.any()).optional()
});

export const insertEnergyReadingSchema = energyReadingSchema.omit({ id: true });
export type EnergyReading = z.infer<typeof energyReadingSchema>;
export type InsertEnergyReading = z.infer<typeof insertEnergyReadingSchema>;

// Waste Event Schema
export const wasteEventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  deviceId: z.string().optional(),
  type: z.enum(['wet', 'dry', 'recycling', 'hazardous']),
  weight: z.number().optional(),
  location: z.string(),
  timestamp: z.string(),
  pointsAwarded: z.number().default(5),
  verified: z.boolean().default(false)
});

export const insertWasteEventSchema = wasteEventSchema.omit({ id: true });
export type WasteEvent = z.infer<typeof wasteEventSchema>;
export type InsertWasteEvent = z.infer<typeof insertWasteEventSchema>;

// Achievement Schema
export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  points: z.number(),
  category: z.enum(['mood', 'safety', 'sustainability', 'social']),
  requirements: z.object({
    type: z.string(),
    target: z.number(),
    timeframe: z.string().optional()
  })
});

export type Achievement = z.infer<typeof achievementSchema>;

// User Achievement Schema
export const userAchievementSchema = z.object({
  id: z.string(),
  userId: z.string(),
  achievementId: z.string(),
  unlockedAt: z.string(),
  progress: z.number().default(100)
});

export const insertUserAchievementSchema = userAchievementSchema.omit({ id: true });
export type UserAchievement = z.infer<typeof userAchievementSchema>;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

// Device Schema (for IoT)
export const deviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['energy_monitor', 'smart_bin', 'air_quality', 'occupancy']),
  location: z.string(),
  secretKey: z.string(),
  status: z.enum(['online', 'offline', 'maintenance']).default('offline'),
  lastSeen: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const insertDeviceSchema = deviceSchema.omit({ id: true, secretKey: true });
export type Device = z.infer<typeof deviceSchema>;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;

// Gamification Profile Schema
export const gamificationProfileSchema = z.object({
  userId: z.string(),
  totalPoints: z.number().default(0),
  level: z.number().default(1),
  currentStreak: z.number().default(0),
  longestStreak: z.number().default(0),
  categoriesProgress: z.object({
    mood: z.number().default(0),
    safety: z.number().default(0),
    sustainability: z.number().default(0),
    social: z.number().default(0)
  }),
  lastUpdated: z.string()
});

export type GamificationProfile = z.infer<typeof gamificationProfileSchema>;

// API Response Schemas
export const apiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  code: z.string().optional()
});

export const apiSuccessSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional()
});

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiSuccess = z.infer<typeof apiSuccessSchema>;

// Validation helpers
export const validateMoodEntry = (data: unknown) => insertMoodEntrySchema.parse(data);
export const validateChatMessage = (data: unknown) => insertChatMessageSchema.parse(data);
export const validateSafetyAlert = (data: unknown) => insertSafetyAlertSchema.parse(data);
export const validateEnergyReading = (data: unknown) => insertEnergyReadingSchema.parse(data);
export const validateWasteEvent = (data: unknown) => insertWasteEventSchema.parse(data);