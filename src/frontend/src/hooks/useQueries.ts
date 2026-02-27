import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LearningRequest, User } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
    retry: 3,
    retryDelay: 2000,
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
