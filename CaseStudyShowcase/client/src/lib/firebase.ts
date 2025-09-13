// Simplified Firebase implementation for development/demo purposes
import { mockAuth, mockDb } from './firebase-mock';

// For development, always use mock Firebase to avoid configuration issues
console.log('Using mock Firebase for development');

export const auth = mockAuth;
export const db = mockDb;
export default auth;