import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LearningRequest, User } from "../backend.d.ts";
import { getAuthUser } from "../utils/auth";
import { useActor } from "./useActor";

/**
 * Returns the currently logged-in worker's local profile (if any).
 * Used ONLY as a self-fallback so the current user can see themselves
 * even before the backend has confirmed their registration.
 * Other workers' localStorage data is intentionally excluded — they
 * must come from the backend so that cross-device consistency is maintained.
 */
function getCurrentWorkerLocalProfile(): User | null {
  try {
    const auth = getAuthUser();
    if (!auth || auth.role !== "worker") return null;
    const raw = localStorage.getItem(
      `knot_worker_profile_${auth.id.toString()}`,
    );
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      id: BigInt(parsed.id ?? auth.id),
      name: parsed.name ?? "",
      skill: parsed.skill ?? "",
      location: parsed.location ?? "",
      trustScore: BigInt(parsed.trustScore ?? 0),
      endorsementCount: BigInt(parsed.endorsementCount ?? 0),
      badgeLevel: parsed.badgeLevel ?? "None",
      distance: BigInt(parsed.distance ?? 5),
      bio: parsed.bio ?? "",
      videoURL: parsed.videoURL ?? "",
      contact: parsed.contact ?? "",
    } as User;
  } catch {
    return null;
  }
}

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      let backendUsers: User[] = [];
      if (actor) {
        try {
          backendUsers = await actor.getAllUsers();
        } catch (e) {
          console.error("getAllUsers failed:", e);
        }
      }

      // Only add the current logged-in worker as fallback if not already in backend results
      const selfProfile = getCurrentWorkerLocalProfile();
      if (selfProfile) {
        const backendIds = new Set(backendUsers.map((u) => u.id.toString()));
        if (!backendIds.has(selfProfile.id.toString())) {
          return [...backendUsers, selfProfile];
        }
      }
      return backendUsers;
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 15,
    retry: 5,
    retryDelay: 3000,
  });
}

export function useSearchUsers(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["search-users", query],
    queryFn: async () => {
      let backendResults: User[] = [];

      if (actor) {
        if (!query.trim()) {
          try {
            backendResults = await actor.getAllUsers();
          } catch {
            backendResults = [];
          }
        } else {
          try {
            backendResults = await actor.searchUsers(query.trim());
          } catch {
            try {
              const all = await actor.getAllUsers();
              const q = query.toLowerCase().trim();
              backendResults = all.filter(
                (u) =>
                  u.name.toLowerCase().includes(q) ||
                  u.skill.toLowerCase().includes(q) ||
                  u.location.toLowerCase().includes(q),
              );
            } catch {
              backendResults = [];
            }
          }
        }
      }

      // Only add self as fallback if not already in backend results
      const selfProfile = getCurrentWorkerLocalProfile();
      if (selfProfile) {
        const backendIds = new Set(backendResults.map((u) => u.id.toString()));
        if (!backendIds.has(selfProfile.id.toString())) {
          const q = query.toLowerCase().trim();
          const selfMatches =
            !q ||
            selfProfile.name.toLowerCase().includes(q) ||
            selfProfile.skill.toLowerCase().includes(q) ||
            selfProfile.location.toLowerCase().includes(q);
          if (selfMatches) {
            backendResults = [...backendResults, selfProfile];
          }
        }
      }

      return backendResults;
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 15,
  });
}

export function useNearbyUsers(maxDistanceKm: number) {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["nearby-users", maxDistanceKm],
    queryFn: async () => {
      let backendResults: User[] = [];

      if (actor) {
        try {
          backendResults = await actor.getUsersByDistance(
            BigInt(maxDistanceKm),
          );
        } catch {
          try {
            const all = await actor.getAllUsers();
            backendResults = all.filter(
              (u) => Number(u.distance) <= maxDistanceKm,
            );
          } catch {
            backendResults = [];
          }
        }
      }

      // Only add self as fallback if not already in backend results
      const selfProfile = getCurrentWorkerLocalProfile();
      if (selfProfile) {
        const backendIds = new Set(backendResults.map((u) => u.id.toString()));
        if (
          !backendIds.has(selfProfile.id.toString()) &&
          Number(selfProfile.distance) <= maxDistanceKm
        ) {
          backendResults = [...backendResults, selfProfile];
        }
      }

      return backendResults;
    },
    enabled: !!actor && !isFetching && maxDistanceKm > 0,
    staleTime: 1000 * 15,
  });
}

export function useUser(id: bigint | undefined) {
  const { actor } = useActor();
  return useQuery<User>({
    queryKey: ["user", id?.toString()],
    queryFn: async () => {
      if (id === undefined) throw new Error("No id");

      // Try backend first
      if (actor) {
        try {
          const user = await actor.getUser(id);
          if (user) return user;
        } catch {
          // fall through to localStorage fallback
        }
      }

      // Fallback: check localStorage (saved during worker registration)
      const localKey = `knot_worker_profile_${id.toString()}`;
      const raw = localStorage.getItem(localKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          return {
            id: BigInt(parsed.id ?? id),
            name: parsed.name ?? "",
            skill: parsed.skill ?? "",
            location: parsed.location ?? "",
            trustScore: BigInt(parsed.trustScore ?? 0),
            endorsementCount: BigInt(parsed.endorsementCount ?? 0),
            badgeLevel: parsed.badgeLevel ?? "None",
            distance: BigInt(parsed.distance ?? 5),
            bio: parsed.bio ?? "",
            videoURL: parsed.videoURL ?? "",
            contact: parsed.contact ?? "",
          } as User;
        } catch {
          // ignore parse error
        }
      }

      throw new Error("User not found");
    },
    enabled:
      id !== undefined &&
      (!!actor ||
        !!localStorage.getItem(`knot_worker_profile_${id?.toString()}`)),
    staleTime: 1000 * 30,
    retry: 3,
    retryDelay: 2000,
  });
}

export function useUsersBySkill(skill: string) {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["users-skill", skill],
    queryFn: async () => {
      if (!actor) return [];
      if (skill === "All") return actor.getAllUsers();
      return actor.getUsersBySkill(skill);
    },
    enabled: !!actor && !isFetching && !!skill,
    staleTime: 1000 * 30,
  });
}

export function useAllLearningRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<LearningRequest[]>({
    queryKey: ["learning-requests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLearningRequests();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useEndorseUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      // Try backend first
      if (actor) {
        try {
          await actor.endorseUser(id);
          return;
        } catch {
          // fall through to localStorage fallback
        }
      }

      // Fallback: update localStorage directly
      const localKey = `knot_worker_profile_${id.toString()}`;
      const raw = localStorage.getItem(localKey);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const newCount = Number(parsed.endorsementCount ?? 0) + 1;
          const newTrust = Number(parsed.trustScore ?? 0) + 1;
          const newBadge =
            newCount >= 15
              ? "Gold"
              : newCount >= 7
                ? "Silver"
                : newCount >= 3
                  ? "Bronze"
                  : "None";
          localStorage.setItem(
            localKey,
            JSON.stringify({
              ...parsed,
              endorsementCount: newCount,
              trustScore: newTrust,
              badgeLevel: newBadge,
            }),
          );
          return;
        } catch {
          // ignore
        }
      }

      throw new Error("Could not endorse user");
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id.toString()] });
    },
  });
}

export function useSubmitLearningRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      requesterId,
      targetUserId,
      message,
    }: {
      requesterId: string;
      targetUserId: bigint;
      message: string;
    }) => {
      // Try backend first
      if (actor) {
        try {
          return await actor.submitLearningRequest(
            requesterId,
            targetUserId,
            message,
          );
        } catch {
          // fall through to local fallback
        }
      }
      // Local fallback: save to localStorage so it never fails
      const key = "knot_learn_requests";
      let existing: Array<{
        requesterId: string;
        targetUserId: string;
        message: string;
        timestamp: number;
      }> = [];
      try {
        existing = JSON.parse(localStorage.getItem(key) ?? "[]");
      } catch {
        /**/
      }
      existing.push({
        requesterId,
        targetUserId: targetUserId.toString(),
        message,
        timestamp: Date.now(),
      });
      localStorage.setItem(key, JSON.stringify(existing));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-requests"] });
    },
  });
}
