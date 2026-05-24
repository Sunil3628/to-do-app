import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function readFirebaseAdminConfig() {
  const projectId =
    process.env.PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.CLIENT_EMAIL;
  const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

const firebaseAdminConfig = readFirebaseAdminConfig();

const adminApp = firebaseAdminConfig
  ? getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(firebaseAdminConfig),
      })
  : null;

const adminAuth = adminApp ? getAuth(adminApp) : null;
const isFirebaseAdminConfigured = Boolean(firebaseAdminConfig && adminAuth);

export { adminAuth, isFirebaseAdminConfigured };