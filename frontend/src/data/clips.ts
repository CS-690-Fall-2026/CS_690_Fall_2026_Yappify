// S-7 temporary clip store (docs/design/S-7.md decisions 7, 8, 11;
// docs/plans/S-7-plan.md "Storage and playback", Task 4.5).
//
// Browser memory only: a module-level variable, with no persistent web storage,
// browser database or network request.
// A page refresh clears the clip (decision 7). This is the one module a later
// backend replaces (decision 8).

import type { UploadResult } from "../audio/upload";

/** The signed-in user. Mocked until authentication exists (decision 8). */
export interface CurrentUser {
  id: string;
  displayName: string;
}

/** An accepted upload held in memory and not yet published. */
export interface UnpublishedClip extends UploadResult {
  id: string;
  ownerId: string;
  fileName: string;
}

const MOCK_CURRENT_USER: Readonly<CurrentUser> = Object.freeze({
  id: "user-1",
  displayName: "Demo User",
});

/** The single unpublished clip, or null when none is stored. */
let unpublishedClip: UnpublishedClip | null = null;

/** Incremented per stored clip so each clip gets a distinct id. */
let nextClipNumber = 1;

/** Returns the mock current user. */
export function getCurrentUser(): CurrentUser {
  return { ...MOCK_CURRENT_USER };
}

/**
 * Stores an accepted upload as the single unpublished clip, owned by the
 * current user. Any existing clip is replaced.
 */
export function setUnpublishedClip(result: UploadResult, fileName: string): UnpublishedClip {
  const clip: UnpublishedClip = {
    ...result,
    id: `clip-${nextClipNumber++}`,
    ownerId: getCurrentUser().id,
    fileName,
  };
  unpublishedClip = clip;
  return clip;
}

/** Returns the stored unpublished clip, or null if there is none. */
export function getUnpublishedClip(): UnpublishedClip | null {
  return unpublishedClip;
}

/** Clears the stored unpublished clip. */
export function removeUnpublishedClip(): void {
  unpublishedClip = null;
}
