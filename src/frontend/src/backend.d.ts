import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LearningRequest {
    id: bigint;
    message: string;
    timestamp: Time;
    requesterId: string;
    targetUserId: bigint;
}
export type Time = bigint;
export interface PracticalVideoSubmission {
    status: string;
    workerId: bigint;
    videoDataURI: string;
    submittedAt: Time;
    skill: string;
    workerName: string;
}
export interface User {
    id: bigint;
    bio: string;
    badgeLevel: string;
    contact: string;
    name: string;
    trustScore: bigint;
    endorsementCount: bigint;
    distance: bigint;
    skill: string;
    videoURL: string;
    location: string;
}
export interface CertificationResult {
    workerId: bigint;
    level: string;
    issuedDate: Time;
    skill: string;
    certificateId: string;
    mcqScore: bigint;
    practicalPassed: boolean;
    passed: boolean;
}
export interface Citizen {
    id: bigint;
    name: string;
    address: string;
}
export interface UserProfile {
    userType: string;
    userId: bigint;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approvePracticalVideo(workerId: bigint): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllData(): Promise<void>;
    endorseUser(id: bigint): Promise<void>;
    findCitizenByName(name: string): Promise<Citizen | null>;
    findWorkerByName(name: string): Promise<User | null>;
    getAdminStats(): Promise<{
        totalWorkers: bigint;
        totalCitizens: bigint;
        totalCertified: bigint;
        totalRequests: bigint;
    }>;
    getAllCitizens(): Promise<Array<Citizen>>;
    getAllLearningRequests(): Promise<Array<LearningRequest>>;
    getAllUsers(): Promise<Array<User>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCertification(workerId: bigint): Promise<CertificationResult | null>;
    getLearningRequestsForWorker(workerId: bigint): Promise<Array<LearningRequest>>;
    getPendingPracticalVideos(): Promise<Array<PracticalVideoSubmission>>;
    getPracticalVideoStatus(workerId: bigint): Promise<string>;
    getUser(id: bigint): Promise<User>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUsersByDistance(maxDistance: bigint): Promise<Array<User>>;
    getUsersBySkill(skill: string): Promise<Array<User>>;
    getWorkerStats(id: bigint): Promise<User>;
    getWorkerVideo(workerId: bigint): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    loginAdmin(username: string, passwordHash: string): Promise<boolean>;
    loginCitizen(username: string, passwordHash: string): Promise<Citizen | null>;
    loginWorker(username: string, passwordHash: string): Promise<User | null>;
    registerCitizen(name: string, address: string, username: string, passwordHash: string): Promise<bigint>;
    registerWorker(username: string, passwordHash: string, name: string, skill: string, location: string, bio: string, videoURL: string, distance: bigint, contact: string): Promise<bigint>;
    rejectPracticalVideo(workerId: bigint): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveWorkerVideo(workerId: bigint, dataURI: string): Promise<void>;
    searchUsers(searchText: string): Promise<Array<User>>;
    submitLearningRequest(requesterId: string, targetUserId: bigint, message: string): Promise<void>;
    submitPracticalVideo(workerId: bigint, workerName: string, skill: string, videoDataURI: string): Promise<void>;
    submitTestResult(workerId: bigint, mcqScore: bigint, practicalPassed: boolean): Promise<boolean>;
}
