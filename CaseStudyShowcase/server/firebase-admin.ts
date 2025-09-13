import admin from 'firebase-admin';

// Development mock storage
const mockStorage = {
  users: new Map<string, any>(),
  moods: new Map<string, any[]>(),
  chats: new Map<string, any[]>(),
  safetyAlerts: new Map<string, any[]>(),
  wasteEvents: new Map<string, any[]>(),
  energyReadings: new Array<any>(),
  devices: new Map<string, any>()
};

// Initialize Firebase Admin SDK only in production
let auth: any = null;
let firestore: any = null;

if (process.env.NODE_ENV !== 'development') {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });
  }
  auth = admin.auth();
  firestore = admin.firestore();
} else {
  // Mock Firestore-like interface for development
  firestore = {
    collection: (path: string) => ({
      doc: (id: string) => ({
        get: async () => {
          if (path === 'users') {
            const userData = mockStorage.users.get(id);
            return {
              exists: !!userData,
              data: () => userData,
              id
            };
          }
          if (path === 'devices') {
            const deviceData = mockStorage.devices.get(id);
            return {
              exists: !!deviceData,
              data: () => deviceData,
              id
            };
          }
          return { exists: false, data: () => null };
        },
        update: async (data: any) => {
          if (path === 'users') {
            const existing = mockStorage.users.get(id) || {};
            mockStorage.users.set(id, { ...existing, ...data });
          }
          if (path === 'devices') {
            const existing = mockStorage.devices.get(id) || {};
            mockStorage.devices.set(id, { ...existing, ...data });
          }
        },
        collection: (subPath: string) => ({
          add: async (data: any) => {
            const docId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            if (subPath === 'moods') {
              const userMoods = mockStorage.moods.get(id) || [];
              userMoods.push({ id: docId, ...data });
              mockStorage.moods.set(id, userMoods);
            } else if (subPath === 'chats') {
              const userChats = mockStorage.chats.get(id) || [];
              userChats.push({ id: docId, ...data });
              mockStorage.chats.set(id, userChats);
            }
            return { id: docId };
          },
          orderBy: (field: string, direction?: string) => ({
            limit: (count: number) => ({
              get: async () => {
                let docs: any[] = [];
                if (subPath === 'moods') {
                  docs = (mockStorage.moods.get(id) || [])
                    .sort((a, b) => direction === 'desc' 
                      ? new Date(b[field]).getTime() - new Date(a[field]).getTime()
                      : new Date(a[field]).getTime() - new Date(b[field]).getTime())
                    .slice(0, count);
                } else if (subPath === 'chats') {
                  docs = (mockStorage.chats.get(id) || [])
                    .sort((a, b) => direction === 'desc' 
                      ? new Date(b[field]).getTime() - new Date(a[field]).getTime()
                      : new Date(a[field]).getTime() - new Date(b[field]).getTime())
                    .slice(0, count);
                }
                return {
                  docs: docs.map(doc => ({
                    id: doc.id,
                    data: () => doc
                  }))
                };
              }
            })
          })
        })
      }),
      add: async (data: any) => {
        const docId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        if (path === 'safety_alerts') {
          const alerts = mockStorage.safetyAlerts.get(data.userId) || [];
          alerts.push({ id: docId, ...data });
          mockStorage.safetyAlerts.set(data.userId, alerts);
        } else if (path === 'waste_events') {
          const events = mockStorage.wasteEvents.get(data.userId) || [];
          events.push({ id: docId, ...data });
          mockStorage.wasteEvents.set(data.userId, events);
        } else if (path === 'energy_readings') {
          mockStorage.energyReadings.push({ id: docId, ...data });
        }
        return { id: docId };
      },
      where: (field: string, op: string, value: any) => ({
        orderBy: (orderField: string, direction?: string) => ({
          limit: (count: number) => ({
            get: async () => {
              let docs: any[] = [];
              if (path === 'safety_alerts') {
                docs = (mockStorage.safetyAlerts.get(value) || [])
                  .filter(item => item[field] === value)
                  .sort((a, b) => direction === 'desc' 
                    ? new Date(b[orderField]).getTime() - new Date(a[orderField]).getTime()
                    : new Date(a[orderField]).getTime() - new Date(b[orderField]).getTime())
                  .slice(0, count);
              } else if (path === 'waste_events') {
                docs = (mockStorage.wasteEvents.get(value) || [])
                  .filter(item => item[field] === value)
                  .sort((a, b) => direction === 'desc' 
                    ? new Date(b[orderField]).getTime() - new Date(a[orderField]).getTime()
                    : new Date(a[orderField]).getTime() - new Date(b[orderField]).getTime())
                  .slice(0, count);
              }
              return {
                docs: docs.map(doc => ({
                  id: doc.id,
                  data: () => doc
                }))
              };
            }
          })
        })
      }),
      orderBy: (field: string, direction?: string) => ({
        limit: (count: number) => ({
          get: async () => {
            let docs: any[] = [];
            if (path === 'users') {
              docs = Array.from(mockStorage.users.values())
                .sort((a, b) => direction === 'desc' 
                  ? (b[field] || 0) - (a[field] || 0)
                  : (a[field] || 0) - (b[field] || 0))
                .slice(0, count);
            } else if (path === 'energy_readings') {
              docs = mockStorage.energyReadings
                .sort((a, b) => direction === 'desc' 
                  ? new Date(b[field]).getTime() - new Date(a[field]).getTime()
                  : new Date(a[field]).getTime() - new Date(b[field]).getTime())
                .slice(0, count);
            }
            return {
              docs: docs.map(doc => ({
                id: doc.id || doc.uid,
                data: () => doc
              }))
            };
          }
        })
      })
    }),
    runTransaction: async (updateFn: (transaction: any) => Promise<void>) => {
      // Mock transaction - just run the update function with mock transaction object
      const mockTransaction = {
        get: async (ref: any) => {
          // Mock document reference get
          return { exists: false, data: () => null };
        },
        update: async (ref: any, data: any) => {
          // Mock update - will be handled by individual operations
        },
        set: async (ref: any, data: any) => {
          // Mock set - will be handled by individual operations
        }
      };
      await updateFn(mockTransaction);
    }
  };
}

export { auth, firestore };

// Middleware to verify Firebase ID tokens
export const verifyFirebaseToken = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Handle mock tokens in development
    if (process.env.NODE_ENV === 'development' && token.startsWith('mock-token-')) {
      // Extract user ID from mock token
      const uid = token.replace('mock-token-', '');
      req.user = {
        uid: `mock-${uid}`,
        email: 'demo@campus.edu',
        name: 'Demo User'
      };
      return next();
    }
    
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
  }
};

// Helper to get user profile from Firestore
export const getUserProfile = async (uid: string) => {
  const userDoc = await firestore.collection('users').doc(uid).get();
  return userDoc.exists ? userDoc.data() : null;
};

// Helper to update user points
export const updateUserPoints = async (uid: string, pointsToAdd: number) => {
  if (process.env.NODE_ENV === 'development') {
    // Mock points update for development
    const user = mockStorage.users.get(uid) || { points: 0, level: 1 };
    const currentPoints = user.points || 0;
    const newPoints = currentPoints + pointsToAdd;
    const newLevel = Math.floor(newPoints / 250) + 1;
    
    mockStorage.users.set(uid, {
      ...user,
      uid,
      points: newPoints,
      level: newLevel,
      lastActive: new Date().toISOString()
    });
    
    return { newPoints, newLevel };
  } else {
    // Real Firebase implementation for production
    const userRef = firestore.collection('users').doc(uid);
    const gamificationRef = firestore.collection('gamification').doc(uid);
    
    let currentPoints = 0;
    
    await firestore.runTransaction(async (transaction: any) => {
      const userDoc = await transaction.get(userRef);
      const gamificationDoc = await transaction.get(gamificationRef);
      
      currentPoints = userDoc.exists ? (userDoc.data()?.points || 0) : 0;
      const newPoints = currentPoints + pointsToAdd;
      const newLevel = Math.floor(newPoints / 250) + 1;
      
      transaction.update(userRef, { 
        points: newPoints,
        level: newLevel,
        lastActive: new Date().toISOString()
      });
      
      if (gamificationDoc.exists) {
        transaction.update(gamificationRef, {
          totalPoints: newPoints,
          level: newLevel,
          lastUpdated: new Date().toISOString()
        });
      } else {
        transaction.set(gamificationRef, {
          userId: uid,
          totalPoints: newPoints,
          level: newLevel,
          currentStreak: 0,
          longestStreak: 0,
          categoriesProgress: {
            mood: pointsToAdd,
            safety: 0,
            sustainability: 0,
            social: 0
          },
          lastUpdated: new Date().toISOString()
        });
      }
    });
    
    return { newPoints: currentPoints + pointsToAdd, newLevel: Math.floor((currentPoints + pointsToAdd) / 250) + 1 };
  }
};

export default admin;