// Mock Firebase implementation for development/demo purposes
// In production, use real Firebase with valid credentials

interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  getIdToken(): Promise<string>;
}

interface MockUserCredential {
  user: MockUser;
}

class MockAuth {
  currentUser: MockUser | null = null;
  private authStateCallbacks: ((user: MockUser | null) => void)[] = [];

  async signInWithEmailAndPassword(email: string, password: string): Promise<MockUserCredential> {
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user: MockUser = {
      uid: `mock-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      getIdToken: async () => `mock-token-${Date.now()}`
    };

    this.currentUser = user;
    this.notifyAuthStateChange();
    
    return { user };
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<MockUserCredential> {
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user: MockUser = {
      uid: `mock-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      getIdToken: async () => `mock-token-${Date.now()}`
    };

    this.currentUser = user;
    this.notifyAuthStateChange();
    
    return { user };
  }

  async signInWithPopup(): Promise<MockUserCredential> {
    // Mock Google login
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user: MockUser = {
      uid: `mock-google-${Date.now()}`,
      email: 'demo@campus.edu',
      displayName: 'Demo User',
      photoURL: 'https://api.dicebear.com/7.x/initials/svg?seed=DemoUser',
      getIdToken: async () => `mock-token-${Date.now()}`
    };

    this.currentUser = user;
    this.notifyAuthStateChange();
    
    return { user };
  }

  async signOut(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.currentUser = null;
    this.notifyAuthStateChange();
  }

  async updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    if (this.currentUser) {
      Object.assign(this.currentUser, updates);
    }
  }

  async getIdToken(): Promise<string> {
    if (!this.currentUser) throw new Error('No user signed in');
    return `mock-token-${this.currentUser.uid}`;
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    this.authStateCallbacks.push(callback);
    // Immediately call with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateCallbacks.splice(index, 1);
      }
    };
  }

  private notifyAuthStateChange(): void {
    this.authStateCallbacks.forEach(callback => callback(this.currentUser));
  }
}

// Export mock auth for development
export const mockAuth = new MockAuth();

// Mock Firestore for development
class MockFirestore {
  private data: Record<string, any> = {};

  collection(path: string) {
    return {
      doc: (id: string) => ({
        get: async () => ({
          exists: this.data[`${path}/${id}`] !== undefined,
          data: () => this.data[`${path}/${id}`]
        }),
        set: async (data: any) => {
          this.data[`${path}/${id}`] = data;
        },
        update: async (updates: any) => {
          if (this.data[`${path}/${id}`]) {
            Object.assign(this.data[`${path}/${id}`], updates);
          }
        }
      })
    };
  }
}

export const mockDb = new MockFirestore();