import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZi3UqDwlu4bt9vkTgPRebWGQlNy9EeHc",
  authDomain: "todo-project-8346e.firebaseapp.com",
  projectId: "todo-project-8346e",
  storageBucket: "todo-project-8346e.firebasestorage.app",
  messagingSenderId: "383831091894",
  appId: "1:383831091894:web:f6fa1d3b9136112e891417",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
