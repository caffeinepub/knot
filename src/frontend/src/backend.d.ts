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
export interface User {
    id: bigint;
    bio: string;
    badgeLevel: string;
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
export interface backendInterface {
    endorseUser(id: bigint): Promise<void>;
    getAllLearningRequests(): Promise<Array<LearningRequest>>;
    getAllUsers(): Promise<Array<User>>;
    getCertification(workerId: bigint): Promise<CertificationResult | null>;
    getLearningRequestsForWorker(workerId: bigint): Promise<Array<LearningRequest>>;
    getUser(id: bigint): Promise<User>;
    getUsersByDistance(maxDistance: bigint): Promise<Array<User>>;
    getUsersBySkill(skill: string): Promise<Array<User>>;
    getWorkerStats(id: bigint): Promise<User>;
    init(): Promise<void>;
    registerCitizen(name: string, address: string): Promise<bigint>;
    registerWorker(name: string, skill: string, location: string, bio: string, videoURL: string): Promise<bigint>;
    submitLearningRequest(requesterId: string, targetUserId: bigint, message: string): Promise<void>;
    submitTestResult(workerId: bigint, mcqScore: bigint, practicalPassed: boolean): Promise<boolean>;
}
