// Optional Firebase wrapper. If VITE_FIREBASE_API_KEY is NOT set, firebase is disabled and code falls back to localStorage.
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

const enabled = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let currentUser: User | null = null;

export const isFirebaseEnabled = enabled;

export async function initFirebase() {
  if (!enabled) return null;
  if (app) return { app, auth, db, user: currentUser };

  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);

  // anonymous sign-in
  try {
    await signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      currentUser = user;
    });
  } catch (err) {
    console.warn('Firebase auth error', err);
  }

  return { app, auth, db, user: currentUser };
}

export async function saveActivityRemote(activity: { text: string; time: string; calories?: number }) {
  if (!db || !auth?.currentUser) return;
  try {
    const col = collection(db, 'users', auth.currentUser.uid, 'activities');
    await addDoc(col, activity);
  } catch (e) {
    console.warn('saveActivityRemote failed', e);
  }
}
export async function saveFoodRemote(food: { name: string; calories: number; time: string }) {
  if (!db || !auth?.currentUser) return;
  try {
    const col = collection(db, 'users', auth.currentUser.uid, 'foodLog');
    await addDoc(col, food);
  } catch (e) {
    console.warn('saveFoodRemote failed', e);
  }
}

// A helper to fetch top recent docs for debugging; not used on the main path.
export async function fetchRecent(collectionName: string) {
  if (!db || !auth?.currentUser) return [];
  try {
    const q = query(collection(db, 'users', auth.currentUser.uid, collectionName), orderBy('time', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn('fetchRecent failed', e);
    return [];
  }
}
