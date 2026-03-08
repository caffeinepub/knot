/**
 * REST API client for KNOT backend.
 * Replaces all ICP/Motoko actor calls with standard fetch() requests.
 * API_BASE defaults to /api (proxied to localhost:3001 in dev, or VITE_API_URL in prod).
 */

const API_BASE =
  ((import.meta as any).env?.VITE_API_URL as string | undefined) || "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types (number instead of bigint, mirrors backend JSON) ────────────────
export interface ApiUser {
  id: number;
  name: string;
  skill: string;
  location: string;
  trustScore: number;
  endorsementCount: number;
  badgeLevel: string;
  distance: number;
  bio: string;
  videoURL: string;
  contact: string;
}

export interface ApiCitizen {
  id: number;
  name: string;
  address: string;
}

export interface ApiLearningRequest {
  id: number;
  requesterId: string;
  targetUserId: number;
  message: string;
  timestamp: number;
}

export interface ApiCertificationResult {
  workerId: number;
  skill: string;
  level: string;
  passed: boolean;
  issuedDate: number;
  certificateId: string;
  mcqScore: number;
  practicalPassed: boolean;
  pendingReview?: boolean;
  workerName?: string;
}

export interface ApiPracticalVideoSubmission {
  workerId: number;
  workerName: string;
  skill: string;
  videoDataURI: string;
  status: string;
  submittedAt: number;
}

export interface ApiAdminStats {
  totalWorkers: number;
  totalCitizens: number;
  totalCertified: number;
  totalRequests: number;
}

// ─── All API methods ────────────────────────────────────────────────────────
export const api = {
  // Users / Workers
  getAllUsers: () => request<ApiUser[]>("/users"),
  getUser: (id: number) => request<ApiUser>(`/users/${id}`),
  searchUsers: (q: string) =>
    request<ApiUser[]>(`/users/search?q=${encodeURIComponent(q)}`),
  getUsersBySkill: (skill: string) =>
    request<ApiUser[]>(`/users/skill/${encodeURIComponent(skill)}`),
  getUsersByDistance: (maxKm: number) =>
    request<ApiUser[]>(`/users/distance/${maxKm}`),
  registerWorker: (data: {
    username: string;
    passwordHash: string;
    name: string;
    skill: string;
    location: string;
    bio: string;
    videoURL: string;
    distance: number;
    contact: string;
  }) =>
    request<{ id: number }>("/users/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  loginWorker: (username: string, passwordHash: string) =>
    request<ApiUser | null>("/users/login", {
      method: "POST",
      body: JSON.stringify({ username, passwordHash }),
    }),
  findWorkerByName: (name: string) =>
    request<ApiUser | null>(`/users/find-by-name/${encodeURIComponent(name)}`),
  endorseUser: (id: number) =>
    request<void>(`/users/endorse/${id}`, { method: "POST" }),
  getWorkerStats: (id: number) => request<ApiUser>(`/users/stats/${id}`),

  // Citizens
  registerCitizen: (
    name: string,
    address: string,
    username: string,
    passwordHash: string,
  ) =>
    request<{ id: number }>("/citizens/register", {
      method: "POST",
      body: JSON.stringify({ name, address, username, passwordHash }),
    }),
  loginCitizen: (username: string, passwordHash: string) =>
    request<ApiCitizen | null>("/citizens/login", {
      method: "POST",
      body: JSON.stringify({ username, passwordHash }),
    }),
  findCitizenByName: (name: string) =>
    request<ApiCitizen | null>(
      `/citizens/find-by-name/${encodeURIComponent(name)}`,
    ),
  getAllCitizens: () => request<ApiCitizen[]>("/citizens"),

  // Learning Requests
  getAllLearningRequests: () =>
    request<ApiLearningRequest[]>("/learning-requests"),
  getLearningRequestsForWorker: (workerId: number) =>
    request<ApiLearningRequest[]>(`/learning-requests/worker/${workerId}`),
  submitLearningRequest: (
    requesterId: string,
    targetUserId: number,
    message: string,
  ) =>
    request<void>("/learning-requests", {
      method: "POST",
      body: JSON.stringify({ requesterId, targetUserId, message }),
    }),

  // Certification
  submitTestResult: (
    workerId: number,
    mcqScore: number,
    practicalPassed: boolean,
  ) =>
    request<boolean>("/certification/submit-test", {
      method: "POST",
      body: JSON.stringify({ workerId, mcqScore, practicalPassed }),
    }),
  getCertification: (workerId: number) =>
    request<ApiCertificationResult | null>(`/certification/${workerId}`),
  submitPracticalVideo: (
    workerId: number,
    workerName: string,
    skill: string,
    videoDataURI: string,
  ) =>
    request<void>("/certification/submit-practical", {
      method: "POST",
      body: JSON.stringify({ workerId, workerName, skill, videoDataURI }),
    }),
  getPracticalVideoStatus: (workerId: number) =>
    request<string>(`/certification/practical-status/${workerId}`),
  getPendingPracticalVideos: () =>
    request<ApiPracticalVideoSubmission[]>("/certification/practical-pending"),
  approvePracticalVideo: (workerId: number) =>
    request<boolean>(`/certification/approve/${workerId}`, { method: "POST" }),
  rejectPracticalVideo: (workerId: number) =>
    request<boolean>(`/certification/reject/${workerId}`, { method: "POST" }),

  // Videos
  saveWorkerVideo: (workerId: number, dataURI: string) =>
    request<void>("/videos/save", {
      method: "POST",
      body: JSON.stringify({ workerId, dataURI }),
    }),
  getWorkerVideo: (workerId: number) => request<string>(`/videos/${workerId}`),

  // Admin
  getAdminStats: () => request<ApiAdminStats>("/admin/stats"),
  loginAdmin: (username: string, passwordHash: string) =>
    request<boolean>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, passwordHash }),
    }),
  clearAllData: () => request<void>("/admin/clear", { method: "POST" }),
};
