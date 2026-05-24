import { NextResponse } from "next/server";
import { adminAuth, isFirebaseAdminConfigured } from "./firebaseAdmin";

function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function requireFirebaseUser(request) {
  if (!isFirebaseAdminConfigured || !adminAuth) {
    return {
      authorized: false,
      response: unauthorized("Firebase Admin is not configured on the server."),
    };
  }

  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader) {
    return { authorized: false, response: unauthorized("Missing Firebase token") };
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return { authorized: false, response: unauthorized("Missing Firebase token") };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    return { authorized: true, user: decodedToken };
  } catch (error) {
    return { authorized: false, response: unauthorized("Unable to verify Firebase token") };
  }
}