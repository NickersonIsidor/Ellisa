// server/firebase.ts
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let firebaseAdmin: any;

try {
  // Look for service account file
  const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    // If service account file exists, use it
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseAdmin = admin;
    console.log("Firebase initialized with service account file");
  } else if (process.env.FIREBASE_CREDENTIALS) {
    // If environment variable exists, use it
    const credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({
      credential: admin.credential.cert(credentials)
    });
    firebaseAdmin = admin;
    console.log("Firebase initialized with environment variables");
  } else {
    // Otherwise use a mock
    console.log("Using mock Firebase for development");
    firebaseAdmin = {
      auth: () => ({
        verifyIdToken: async () => ({ uid: 'mock-user-id', email: 'mock@example.com' }),
        createUser: async () => ({ uid: 'mock-user-id' }),
        getUserByEmail: async () => ({ uid: 'mock-user-id', email: 'mock@example.com' })
      })
    };
  }
} catch (error) {
  // Log the error but continue with a mock
  console.error("Error initializing Firebase:", error);
  console.log("Falling back to mock Firebase");
  firebaseAdmin = {
    auth: () => ({
      verifyIdToken: async () => ({ uid: 'mock-user-id', email: 'mock@example.com' }),
      createUser: async () => ({ uid: 'mock-user-id' }),
      getUserByEmail: async () => ({ uid: 'mock-user-id', email: 'mock@example.com' })
    })
  };
}

export default firebaseAdmin;