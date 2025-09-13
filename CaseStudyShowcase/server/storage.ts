// This file is no longer needed as we're using Firebase Firestore
// Keeping it for backwards compatibility during transition

export interface IStorage {
  // Legacy interface - will be removed once Firebase migration is complete
}

export class MemStorage implements IStorage {
  constructor() {
    console.log('MemStorage is deprecated. Using Firebase Firestore instead.');
  }
}

export const storage = new MemStorage();
