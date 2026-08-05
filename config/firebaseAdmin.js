const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let isInitialized = false;

// Safe helper to obtain Firebase cert credential
const getCertCredential = (config) => {
  if (typeof admin.cert === 'function') {
    return admin.cert(config);
  }
  if (admin.credential && typeof admin.credential.cert === 'function') {
    return admin.credential.cert(config);
  }
  if (admin.default && typeof admin.default.cert === 'function') {
    return admin.default.cert(config);
  }
  throw new Error('Could not resolve Firebase cert credential function');
};

// Safe helper to check active Firebase apps
const getActiveApps = () => {
  if (typeof admin.getApps === 'function') {
    return admin.getApps();
  }
  return admin.apps || [];
};

const initFirebaseAdmin = () => {
  const apps = getActiveApps();
  if (isInitialized || apps.length > 0) {
    isInitialized = true;
    return admin;
  }

  try {
    // Priority 1: Service Account JSON file path
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (serviceAccountPath && fs.existsSync(path.resolve(serviceAccountPath))) {
      const serviceAccount = require(path.resolve(serviceAccountPath));
      admin.initializeApp({
        credential: getCertCredential(serviceAccount)
      });
      isInitialized = true;
      console.log('Firebase Admin SDK initialized successfully via service account file.');
      return admin;
    }

    // Priority 2: JSON string in environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: getCertCredential(serviceAccount)
      });
      isInitialized = true;
      console.log('Firebase Admin SDK initialized successfully via service account JSON string.');
      return admin;
    }

    // Priority 3: Discrete environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
      admin.initializeApp({
        credential: getCertCredential({
          projectId,
          clientEmail,
          privateKey
        })
      });
      isInitialized = true;
      console.log('Firebase Admin SDK initialized successfully via env credentials.');
      return admin;
    }

    console.warn('⚠️ Firebase Admin SDK Warning: Credentials not found in .env. Development mode token parsing enabled.');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
  }

  return admin;
};

// Initialize on module load
initFirebaseAdmin();

/**
 * Verifies a Firebase ID Token sent from the client (Mobile App)
 * @param {string} idToken 
 * @returns {Promise<Object>} Decoded Firebase Token payload
 */
const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken) {
    throw new Error('ID Token is required');
  }

  const apps = getActiveApps();
  if (isInitialized && apps.length > 0) {
    const authInstance = typeof admin.auth === 'function' ? admin.auth() : admin.default.auth();
    const decodedToken = await authInstance.verifyIdToken(idToken);
    return decodedToken;
  }

  console.log('ℹ️ Verifying token in development fallback mode...');
  
  try {
    const parts = idToken.split('.');
    if (parts.length === 3) {
      const payloadBuf = Buffer.from(parts[1], 'base64');
      const payload = JSON.parse(payloadBuf.toString('utf-8'));
      if (payload.sub || payload.user_id || payload.email) {
        return {
          uid: payload.sub || payload.user_id || `dev-${Date.now()}`,
          email: payload.email || 'dev.user@example.com',
          name: payload.name || payload.email?.split('@')[0] || 'Mobile Yoga User',
          picture: payload.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          email_verified: payload.email_verified ?? true,
          firebase: { sign_in_provider: payload.firebase?.sign_in_provider || 'google.com' }
        };
      }
    }
  } catch (err) {
    // Ignore decode error
  }

  return {
    uid: `dev_user_${idToken.slice(0, 8)}`,
    email: `mobile_user_${idToken.slice(0, 6)}@aura.app`,
    name: 'Yoga Mobile User',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    email_verified: true,
    firebase: { sign_in_provider: 'google.com' }
  };
};

module.exports = {
  admin,
  initFirebaseAdmin,
  verifyFirebaseIdToken
};
