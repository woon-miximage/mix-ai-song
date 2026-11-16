import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { auth, db } from './googleAuthService';
import { GeneratedLyric, UserPreferences } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function toSafeFirestoreId(rawId: string): string {
  const cleaned = String(rawId || '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 128);
  return cleaned.length > 0 ? cleaned : `song_${Date.now()}`;
}

function truncateStr(val: string | undefined | null, maxLen: number): string | undefined {
  if (typeof val !== 'string') return undefined;
  return val.length > maxLen ? val.slice(0, maxLen) : val;
}

function clampNum(val: number | undefined, min: number, max: number, fallback: number): number {
  if (typeof val !== 'number' || Number.isNaN(val)) return fallback;
  return Math.min(max, Math.max(min, val));
}

function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefinedDeep(item)) as unknown as T;
  }
  if (
    value !== null &&
    typeof value === 'object' &&
    Object.getPrototypeOf(value) === Object.prototype
  ) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) {
        out[k] = stripUndefinedDeep(v);
      }
    }
    return out as T;
  }
  return value;
}

function buildSanitizedSongDoc(
  userId: string,
  lyric: GeneratedLyric,
  includeCreatedAt: boolean
): Record<string, unknown> {
  const safeId = toSafeFirestoreId(lyric.id);
  const validModels = ['v6', 'v6-wild', 'v6-mini'] as const;
  const sunoModelRecommended = validModels.includes(lyric.sunoModelRecommended as any)
    ? lyric.sunoModelRecommended
    : undefined;

  const docData: Record<string, unknown> = {
    id: safeId,
    ownerId: userId,
    title: truncateStr(lyric.title || 'ไม่มีชื่อเพลง', 300) || 'ไม่มีชื่อเพลง',
    stylePrompt: truncateStr(lyric.stylePrompt || '', 600) || '',
    stylePromptOptionB: truncateStr(lyric.stylePromptOptionB, 600),
    conciseStylePrompt: truncateStr(lyric.conciseStylePrompt, 300),
    genreEraFusion: truncateStr(lyric.genreEraFusion, 500),
    songwritingModeUsed: truncateStr(lyric.songwritingModeUsed, 500),
    sevenSecondHook: truncateStr(lyric.sevenSecondHook, 600),
    viralCaptionLine: truncateStr(lyric.viralCaptionLine, 600),
    prosodyEngineeringNotes: Array.isArray(lyric.prosodyEngineeringNotes)
      ? lyric.prosodyEngineeringNotes
          .filter((n): n is string => typeof n === 'string')
          .slice(0, 12)
          .map((n) => n.slice(0, 500))
      : undefined,
    modernizationReplacements: Array.isArray(lyric.modernizationReplacements)
      ? lyric.modernizationReplacements.slice(0, 30).map((m) =>
          stripUndefinedDeep({
            originalWord: String(m.originalWord || '').slice(0, 150),
            modernReplacement: String(m.modernReplacement || '').slice(0, 150),
            reason: m.reason ? String(m.reason).slice(0, 300) : undefined,
          })
        )
      : undefined,
    genreDescription: truncateStr(lyric.genreDescription, 1000),
    vocalDescription: truncateStr(lyric.vocalDescription, 1000),
    arrangementDescription: truncateStr(lyric.arrangementDescription, 1000),
    productionDescription: truncateStr(lyric.productionDescription, 1000),
    excludeStyles: truncateStr(lyric.excludeStyles || '', 600) || '',
    vocalGender: truncateStr(lyric.vocalGender || 'Not specified', 80) || 'Not specified',
    weirdness: clampNum(lyric.weirdness, 0, 100, 35),
    styleInfluence: clampNum(lyric.styleInfluence, 0, 100, 75),
    tempoBpm: truncateStr(lyric.tempoBpm, 64),
    musicalKey: truncateStr(lyric.musicalKey, 64),
    syllableScore:
      typeof lyric.syllableScore === 'number'
        ? clampNum(lyric.syllableScore, 0, 100, 90)
        : undefined,
    sunoPerformanceTips: Array.isArray(lyric.sunoPerformanceTips)
      ? lyric.sunoPerformanceTips
          .filter((t): t is string => typeof t === 'string')
          .slice(0, 12)
          .map((t) => t.slice(0, 500))
      : undefined,
    content: truncateStr(lyric.content || '', 25000) || '',
    timestamp: typeof lyric.timestamp === 'number' ? lyric.timestamp : Date.now(),
    input: stripUndefinedDeep(lyric.input || {}),
    qcReport: lyric.qcReport ? stripUndefinedDeep(lyric.qcReport) : undefined,
    validationReport: lyric.validationReport
      ? stripUndefinedDeep(lyric.validationReport)
      : undefined,
    sunoModelRecommended,
    tiktokLane: truncateStr(lyric.tiktokLane, 500),
    sunoMvVisualRecommended: truncateStr(lyric.sunoMvVisualRecommended, 300),
    aiEngineUsed: truncateStr(lyric.aiEngineUsed, 64),
    aiFallbackApplied: typeof lyric.aiFallbackApplied === 'boolean' ? lyric.aiFallbackApplied : undefined,
    updatedAt: serverTimestamp(),
  };

  if (includeCreatedAt) {
    docData.createdAt = serverTimestamp();
  }

  return stripUndefinedDeep(docData);
}

function normalizeTheme(val: unknown): UserPreferences['theme'] {
  const valid = ['light', 'charcoal', 'midnight', 'sunset', 'neon', 'emerald'] as const;
  return valid.includes(val as any) ? (val as UserPreferences['theme']) : 'light';
}

function normalizeFontSize(val: unknown): UserPreferences['fontSize'] {
  const valid = ['small', 'medium', 'large'] as const;
  return valid.includes(val as any) ? (val as UserPreferences['fontSize']) : 'medium';
}

export async function upsertUserProfile(
  user: User,
  localPrefs: UserPreferences
): Promise<UserPreferences> {
  const path = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);

  let existingSnap;
  try {
    existingSnap = await getDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  const displayName = truncateStr(user.displayName, 150);
  const email = truncateStr(user.email, 200);
  const photoURL = truncateStr(user.photoURL, 500);

  if (!existingSnap.exists()) {
    const createPayload = stripUndefinedDeep({
      uid: user.uid,
      displayName,
      email,
      photoURL,
      theme: normalizeTheme(localPrefs.theme),
      fontSize: normalizeFontSize(localPrefs.fontSize),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    try {
      await setDoc(userRef, createPayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
    return {
      theme: normalizeTheme(localPrefs.theme),
      fontSize: normalizeFontSize(localPrefs.fontSize),
    };
  } else {
    const data = existingSnap.data();
    const updatePayload = stripUndefinedDeep({
      displayName,
      email,
      photoURL,
      updatedAt: serverTimestamp(),
    });
    try {
      await updateDoc(userRef, updatePayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
    return {
      theme: normalizeTheme(data.theme),
      fontSize: normalizeFontSize(data.fontSize),
    };
  }
}

export async function updateUserPreferences(
  userId: string,
  prefs: Partial<UserPreferences>
): Promise<void> {
  const path = `users/${userId}`;
  const userRef = doc(db, 'users', userId);
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };
  if (prefs.theme) payload.theme = normalizeTheme(prefs.theme);
  if (prefs.fontSize) payload.fontSize = normalizeFontSize(prefs.fontSize);

  try {
    await updateDoc(userRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeToUserProfile(
  userId: string,
  onPrefs: (prefs: UserPreferences) => void,
  onSyncError?: (message: string) => void
): Unsubscribe {
  const path = `users/${userId}`;
  const userRef = doc(db, 'users', userId);
  return onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onPrefs({
          theme: normalizeTheme(data.theme),
          fontSize: normalizeFontSize(data.fontSize),
        });
      }
    },
    (error) => {
      onSyncError?.(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

function docDataToGeneratedLyric(data: Record<string, any>): GeneratedLyric {
  const ts =
    typeof data.timestamp === 'number'
      ? data.timestamp
      : data.createdAt instanceof Timestamp
      ? data.createdAt.toMillis()
      : Date.now();

  return {
    id: String(data.id || ''),
    title: String(data.title || 'ไม่มีชื่อเพลง'),
    stylePrompt: String(data.stylePrompt || ''),
    stylePromptOptionB: data.stylePromptOptionB,
    conciseStylePrompt: data.conciseStylePrompt,
    genreEraFusion: data.genreEraFusion,
    songwritingModeUsed: data.songwritingModeUsed,
    sevenSecondHook: data.sevenSecondHook,
    viralCaptionLine: data.viralCaptionLine,
    prosodyEngineeringNotes: data.prosodyEngineeringNotes,
    modernizationReplacements: data.modernizationReplacements,
    genreDescription: data.genreDescription,
    vocalDescription: data.vocalDescription,
    arrangementDescription: data.arrangementDescription,
    productionDescription: data.productionDescription,
    excludeStyles: String(data.excludeStyles || ''),
    vocalGender: String(data.vocalGender || 'Not specified'),
    weirdness: typeof data.weirdness === 'number' ? data.weirdness : 35,
    styleInfluence: typeof data.styleInfluence === 'number' ? data.styleInfluence : 75,
    tempoBpm: data.tempoBpm,
    musicalKey: data.musicalKey,
    syllableScore: data.syllableScore,
    sunoPerformanceTips: data.sunoPerformanceTips,
    content: String(data.content || ''),
    timestamp: ts,
    input: data.input,
    qcReport: data.qcReport,
    validationReport: data.validationReport,
    sunoModelRecommended: data.sunoModelRecommended,
    tiktokLane: data.tiktokLane,
    sunoMvVisualRecommended: data.sunoMvVisualRecommended,
  };
}

export function subscribeToUserSongs(
  userId: string,
  onSongs: (songs: GeneratedLyric[]) => void,
  onSyncError?: (message: string) => void
): Unsubscribe {
  const path = `users/${userId}/songs`;
  // Query scoped strictly by ownerId == userId to satisfy Zero-Trust list rules without requiring a composite index
  const q = query(
    collection(db, 'users', userId, 'songs'),
    where('ownerId', '==', userId),
    limit(200)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const songs = snapshot.docs
        .map((d) => docDataToGeneratedLyric(d.data()))
        .sort((a, b) => b.timestamp - a.timestamp);
      onSongs(songs);
    },
    (error) => {
      onSyncError?.(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function saveSongProject(userId: string, lyric: GeneratedLyric): Promise<void> {
  const safeId = toSafeFirestoreId(lyric.id);
  const path = `users/${userId}/songs/${safeId}`;
  const songRef = doc(db, 'users', userId, 'songs', safeId);
  const payload = buildSanitizedSongDoc(userId, { ...lyric, id: safeId }, true);

  try {
    await setDoc(songRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateSongProject(userId: string, lyric: GeneratedLyric): Promise<void> {
  const safeId = toSafeFirestoreId(lyric.id);
  const path = `users/${userId}/songs/${safeId}`;
  const songRef = doc(db, 'users', userId, 'songs', safeId);

  let existingSnap;
  try {
    existingSnap = await getDoc(songRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  if (!existingSnap.exists()) {
    await saveSongProject(userId, { ...lyric, id: safeId });
    return;
  }

  const updatePayload = stripUndefinedDeep({
    title: truncateStr(lyric.title || 'ไม่มีชื่อเพลง', 300) || 'ไม่มีชื่อเพลง',
    content: truncateStr(lyric.content || '', 25000) || '',
    qcReport: lyric.qcReport ? stripUndefinedDeep(lyric.qcReport) : undefined,
    updatedAt: serverTimestamp(),
  });

  try {
    await updateDoc(songRef, updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteSongProject(userId: string, songId: string): Promise<void> {
  const safeId = toSafeFirestoreId(songId);
  const path = `users/${userId}/songs/${safeId}`;
  const songRef = doc(db, 'users', userId, 'songs', safeId);

  try {
    await deleteDoc(songRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function clearUserSongs(userId: string, songIds: string[]): Promise<void> {
  const path = `users/${userId}/songs`;
  if (songIds.length === 0) return;

  try {
    for (let i = 0; i < songIds.length; i += 400) {
      const chunk = songIds.slice(i, i + 400);
      const batch = writeBatch(db);
      for (const rawId of chunk) {
        const safeId = toSafeFirestoreId(rawId);
        batch.delete(doc(db, 'users', userId, 'songs', safeId));
      }
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncLocalHistoryToCloud(
  userId: string,
  localHistory: GeneratedLyric[]
): Promise<void> {
  if (!localHistory || localHistory.length === 0) return;

  const path = `users/${userId}/songs`;
  const q = query(
    collection(db, 'users', userId, 'songs'),
    where('ownerId', '==', userId),
    limit(200)
  );

  let cloudIds = new Set<string>();
  try {
    const snap = await getDocs(q);
    cloudIds = new Set(snap.docs.map((d) => d.id));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }

  const missingSongs = localHistory
    .slice(0, 50)
    .filter((item) => !cloudIds.has(toSafeFirestoreId(item.id)));

  if (missingSongs.length === 0) return;

  try {
    for (let i = 0; i < missingSongs.length; i += 200) {
      const chunk = missingSongs.slice(i, i + 200);
      const batch = writeBatch(db);
      for (const song of chunk) {
        const safeId = toSafeFirestoreId(song.id);
        const songRef = doc(db, 'users', userId, 'songs', safeId);
        batch.set(songRef, buildSanitizedSongDoc(userId, { ...song, id: safeId }, true));
      }
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export type KnowledgeVaultCategory =
  | 'golden-blueprint'
  | 'viral-case-study'
  | 'daily-archive'
  | 'dsp-mastering'
  | 'sunomv-style'
  | 'custom-formula';

export interface KnowledgeVaultRecord {
  id: string;
  ownerId: string;
  category: KnowledgeVaultCategory;
  title: string;
  sourceDoc: string;
  summary: string;
  stylePrompt: string;
  sampleLyrics?: string;
  tags?: string[];
}

function buildSanitizedKnowledgeDoc(
  userId: string,
  item: Omit<KnowledgeVaultRecord, 'ownerId'>,
  includeCreatedAt: boolean
): Record<string, unknown> {
  const safeId = toSafeFirestoreId(item.id);
  const validCategories: KnowledgeVaultCategory[] = [
    'golden-blueprint',
    'viral-case-study',
    'daily-archive',
    'dsp-mastering',
    'sunomv-style',
    'custom-formula',
  ];
  const category: KnowledgeVaultCategory = validCategories.includes(item.category)
    ? item.category
    : 'custom-formula';

  const docData: Record<string, unknown> = {
    id: safeId,
    ownerId: userId,
    category,
    title: truncateStr(item.title || 'ข้อมูลเทคนิค Suno v6', 300) || 'ข้อมูลเทคนิค Suno v6',
    sourceDoc: truncateStr(item.sourceDoc || 'Suno AI Compendium 2026', 200) || 'Suno AI Compendium 2026',
    summary: truncateStr(item.summary || '', 2000) || '',
    stylePrompt: truncateStr(item.stylePrompt || '', 1000) || '',
    sampleLyrics: item.sampleLyrics ? truncateStr(item.sampleLyrics, 15000) : undefined,
    tags: Array.isArray(item.tags)
      ? item.tags
          .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
          .slice(0, 20)
          .map((t) => t.slice(0, 100))
      : undefined,
    updatedAt: serverTimestamp(),
  };

  if (includeCreatedAt) {
    docData.createdAt = serverTimestamp();
  }

  return stripUndefinedDeep(docData);
}

export async function saveKnowledgeVaultItem(
  userId: string,
  item: Omit<KnowledgeVaultRecord, 'ownerId'>
): Promise<void> {
  const safeId = toSafeFirestoreId(item.id);
  const path = `users/${userId}/knowledge_vault/${safeId}`;
  const itemRef = doc(db, 'users', userId, 'knowledge_vault', safeId);

  let existingSnap;
  try {
    existingSnap = await getDoc(itemRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  if (!existingSnap.exists()) {
    const payload = buildSanitizedKnowledgeDoc(userId, { ...item, id: safeId }, true);
    try {
      await setDoc(itemRef, payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  } else {
    const updatePayload = stripUndefinedDeep({
      title: truncateStr(item.title || 'ข้อมูลเทคนิค Suno v6', 300) || 'ข้อมูลเทคนิค Suno v6',
      summary: truncateStr(item.summary || '', 2000) || '',
      stylePrompt: truncateStr(item.stylePrompt || '', 1000) || '',
      sampleLyrics: item.sampleLyrics ? truncateStr(item.sampleLyrics, 15000) : undefined,
      tags: Array.isArray(item.tags)
        ? item.tags
            .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
            .slice(0, 20)
            .map((t) => t.slice(0, 100))
        : undefined,
      updatedAt: serverTimestamp(),
    });
    try {
      await updateDoc(itemRef, updatePayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
}

export function subscribeToUserKnowledgeVault(
  userId: string,
  onItems: (items: KnowledgeVaultRecord[]) => void,
  onSyncError?: (message: string) => void
): Unsubscribe {
  const path = `users/${userId}/knowledge_vault`;
  const q = query(
    collection(db, 'users', userId, 'knowledge_vault'),
    where('ownerId', '==', userId),
    limit(200)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: KnowledgeVaultRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: String(data.id || d.id),
          ownerId: String(data.ownerId || userId),
          category: (data.category as KnowledgeVaultCategory) || 'custom-formula',
          title: String(data.title || ''),
          sourceDoc: String(data.sourceDoc || ''),
          summary: String(data.summary || ''),
          stylePrompt: String(data.stylePrompt || ''),
          sampleLyrics: data.sampleLyrics ? String(data.sampleLyrics) : undefined,
          tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
        };
      });
      onItems(items);
    },
    (error) => {
      onSyncError?.(error instanceof Error ? error.message : String(error));
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function syncExtractedPdfKnowledgeToCloud(
  userId: string,
  seedItems: Omit<KnowledgeVaultRecord, 'ownerId'>[]
): Promise<number> {
  if (!seedItems || seedItems.length === 0) return 0;

  const path = `users/${userId}/knowledge_vault`;
  const q = query(
    collection(db, 'users', userId, 'knowledge_vault'),
    where('ownerId', '==', userId),
    limit(200)
  );

  let existingIds = new Set<string>();
  try {
    const snap = await getDocs(q);
    existingIds = new Set(snap.docs.map((d) => d.id));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }

  const missingItems = seedItems.filter(
    (item) => !existingIds.has(toSafeFirestoreId(item.id))
  );

  if (missingItems.length === 0) return existingIds.size;

  try {
    for (let i = 0; i < missingItems.length; i += 100) {
      const chunk = missingItems.slice(i, i + 100);
      const batch = writeBatch(db);
      for (const item of chunk) {
        const safeId = toSafeFirestoreId(item.id);
        const itemRef = doc(db, 'users', userId, 'knowledge_vault', safeId);
        batch.set(itemRef, buildSanitizedKnowledgeDoc(userId, { ...item, id: safeId }, true));
      }
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  return existingIds.size + missingItems.length;
}

