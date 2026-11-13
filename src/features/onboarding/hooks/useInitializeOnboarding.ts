import { useEffect, useState, useRef, useTransition } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useOnboardingStore } from "../store/onboardingStore";
import { usePropertyDraft } from "./use-property-draft";

interface UseInitializeOnboardingResult {
  readonly isInitializing: boolean;
  readonly isReady: boolean;
  readonly isUnauthenticated: boolean;
  readonly isNotFound: boolean;
  readonly error: Error | null;
}

export function useInitializeOnboarding(
  draftId: string
): UseInitializeOnboardingResult {
  const [_, startTransition] = useTransition();

  // 1. Core Authentication State Selectors
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.loading);

  // 2. Zustand Store Actions
  const hydrateDraft = useOnboardingStore((state) => state.hydrateDraft);
  const resetStore = useOnboardingStore((state) => state.resetOnboarding);

  // 3. Normalized Host & Draft ID parameters
  const hostId = user?.uid?.trim() ?? "";
  const sanitizedDraftId = draftId?.trim() ?? "";

  // 4. Data Fetching Hook
  const draftQuery = usePropertyDraft(sanitizedDraftId, hostId);

  // 5. State synchronization tracker
  const [hydratedKey, setHydratedKey] = useState<string | null>(null);
  const lastHydratedKeyRef = useRef<string | null>(null);

  const currentKey = `${hostId}:${sanitizedDraftId}`;

  useEffect(() => {
    // Edge case: Handle authentication loss or missing parameters
    if (authLoading || !user || !hostId || !sanitizedDraftId) {
      if (!authLoading && !user) {
        resetStore();
        lastHydratedKeyRef.current = null;
        setHydratedKey(null);
      }
      return;
    }

    // Guard: Wait for query success and valid payload
    const draftData = draftQuery.data;

    if (!draftQuery.isSuccess || draftData == null) {
      if (draftQuery.isSuccess && draftData === null) {
        resetStore();
      }
      return;
    }

    const hydratedDraft = draftData as NonNullable<typeof draftData>;

    // Guard: Prevent duplicate hydration runs for the exact same key combination
    if (lastHydratedKeyRef.current === currentKey) {
      return;
    }

    // Hydrate Zustand store within a concurrent transition to avoid layout jank
    startTransition(() => {
      hydrateDraft({
        id: hydratedDraft.id,
        structure: hydratedDraft.structure,
        currentStep: hydratedDraft.currentStep,
        status: hydratedDraft.status,
      });

      lastHydratedKeyRef.current = currentKey;
      setHydratedKey(currentKey);
    });
  }, [
    authLoading,
    user,
    hostId,
    sanitizedDraftId,
    draftQuery.isSuccess,
    draftQuery.data,
    hydrateDraft,
    resetStore,
    currentKey,
  ]);

  // Derived state calculations
  const isUnauthenticated = !authLoading && !user;

  const isNotFound =
    !authLoading &&
    Boolean(user) &&
    Boolean(sanitizedDraftId) &&
    draftQuery.isSuccess &&
    draftQuery.data === null;

  const isErrorState = draftQuery.isError;

  const isReady = !isUnauthenticated && !isNotFound && !isErrorState && hydratedKey === currentKey;

  const isInitializing =
    authLoading ||
    (Boolean(user) && Boolean(sanitizedDraftId) && !isUnauthenticated && !isNotFound && !isErrorState && !isReady);

  return {
    isInitializing,
    isReady,
    isUnauthenticated,
    isNotFound,
    error: draftQuery.error ?? null,
  };
}