import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LearningRequest, User } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllUsers();
      } catch (e) {
        console.error("getAllUsers failed:", e);
        return [];
      }
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
      if (!actor) return [];
      if (!query.trim()) {
        try {
          return await actor.getAllUsers();
        } catch {
          return [];
        }
      }
      // Use backend searchUsers (searches by name + skill)
      try {
        const results = await actor.searchUsers(query.trim());
        return results;
      } catch {
        // Fallback: get all and filter client-side
        try {
          const all = await actor.getAllUsers();
          const q = query.toLowerCase().trim();
          return all.filter(
            (u) =>
              u.name.toLowerCase().includes(q) ||
              u.skill.toLowerCase().includes(q) ||
              u.location.toLowerCase().includes(q),
          );
        } catch {
          return [];
        }
      }
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
      if (!actor) return [];
      try {
        return await actor.getUsersByDistance(BigInt(maxDistanceKm));
      } catch {
        // Fallback: get all and filter client-side
        try {
          const all = await actor.getAllUsers();
          return all.filter((u) => Number(u.distance) <= maxDistanceKm);
        } catch {
          return [];
        }
      }
    },
    enabled: !!actor && !isFetching && maxDistanceKm > 0,
    staleTime: 1000 * 15,
  });
}

export function useUser(id: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery<User>({
    queryKey: ["user", id?.toString()],
    queryFn: async () => {
      if (!actor || id === undefined) throw new Error("No actor or id");
      return actor.getUser(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
    staleTime: 1000 * 30,
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
      if (!actor) throw new Error("No actor");
      return actor.endorseUser(id);
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
      if (!actor) throw new Error("No actor");
      return actor.submitLearningRequest(requesterId, targetUserId, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-requests"] });
    },
  });
}
