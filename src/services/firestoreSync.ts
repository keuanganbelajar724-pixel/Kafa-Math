import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import {
  signInAnonymously,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { db, auth } from './firebase';
import { ChildProfile, ParentSettings, DailyQuest } from '../types';
import { DEFAULT_PROFILES, DEFAULT_PARENT_SETTINGS } from './storage';

const PROFILES_COLLECTION = 'child_profiles';
const SETTINGS_COLLECTION = 'parent_settings';
const QUESTS_COLLECTION = 'daily_quests';
const LEADERBOARD_COLLECTION = 'leaderboard';

// Auto authenticate anonymously if not logged in
export async function ensureAuthUser(): Promise<User | null> {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user);
      } else {
        try {
          const res = await signInAnonymously(auth);
          resolve(res.user);
        } catch (err) {
          console.warn('Anonymous auth failed, fallback to local', err);
          resolve(null);
        }
      }
    });
  });
}

// 1. Sync & Fetch Child Profiles from Firestore
export async function fetchProfilesFromFirestore(): Promise<ChildProfile[]> {
  try {
    const colRef = collection(db, PROFILES_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: ChildProfile[] = [];
      snap.forEach((d) => {
        list.push(d.data() as ChildProfile);
      });
      return list;
    }
  } catch (err) {
    console.warn('Failed to read profiles from Firestore:', err);
  }
  return [];
}

// 2. Save / Update single Profile to Firestore
export async function saveProfileToFirestore(profile: ChildProfile): Promise<void> {
  try {
    const docRef = doc(db, PROFILES_COLLECTION, profile.id);
    await setDoc(docRef, {
      ...profile,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Also update public leaderboard snapshot
    const leaderDocRef = doc(db, LEADERBOARD_COLLECTION, profile.id);
    await setDoc(leaderDocRef, {
      id: profile.id,
      name: profile.name,
      xp: profile.xp,
      level: profile.level,
      levelTitle: profile.levelTitle,
      coins: profile.coins,
      avatarId: profile.avatarId,
      grade: profile.grade,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Failed to save profile to Firestore:', err);
  }
}

// 3. Save all profiles to Firestore (Batch/Bootstrap)
export async function saveAllProfilesToFirestore(profiles: ChildProfile[]): Promise<void> {
  try {
    for (const p of profiles) {
      await saveProfileToFirestore(p);
    }
  } catch (err) {
    console.warn('Failed saving all profiles to Firestore:', err);
  }
}

// 4. Real-time subscribe to Profiles
export function subscribeToProfiles(onUpdate: (profiles: ChildProfile[]) => void): () => void {
  try {
    const colRef = collection(db, PROFILES_COLLECTION);
    return onSnapshot(colRef, (snap) => {
      if (!snap.empty) {
        const list: ChildProfile[] = [];
        snap.forEach((d) => list.push(d.data() as ChildProfile));
        onUpdate(list);
      }
    }, (err) => {
      console.warn('Error listening to profiles:', err);
    });
  } catch (e) {
    return () => {};
  }
}

// 5. Parent Settings
export async function fetchParentSettingsFromFirestore(): Promise<ParentSettings | null> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'global_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ParentSettings;
    }
  } catch (err) {
    console.warn('Failed reading parent settings:', err);
  }
  return null;
}

export async function saveParentSettingsToFirestore(settings: ParentSettings): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'global_config');
    await setDoc(docRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Failed saving parent settings:', err);
  }
}

// 6. Real-time Leaderboard for students across Indonesia
export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  level: number;
  levelTitle: string;
  coins: number;
  avatarId: string;
  grade: string;
}

export function subscribeToLeaderboard(onUpdate: (entries: LeaderboardEntry[]) => void): () => void {
  try {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('xp', 'desc'),
      limit(20)
    );
    return onSnapshot(q, (snap) => {
      const list: LeaderboardEntry[] = [];
      snap.forEach((d) => list.push(d.data() as LeaderboardEntry));
      onUpdate(list);
    }, (err) => {
      console.warn('Leaderboard subscription error:', err);
    });
  } catch (e) {
    return () => {};
  }
}
