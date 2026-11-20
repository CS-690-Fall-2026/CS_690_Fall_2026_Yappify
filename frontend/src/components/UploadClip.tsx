// S-7 upload controls (docs/design/S-7.md decisions 11, 12, 13, 15;
// docs/plans/S-7-plan.md "UI integration", Task 4.6).
//
// Holds the upload state and renders the uploaded-audio display (Task 4.7).

import React, { useState } from "react";
import { UPLOAD_ACCEPT } from "../audio/constants";
import { uploadAudio, UploadError, UploadFailedError } from "../audio/upload";
import {
  getUnpublishedClip,
  removeUnpublishedClip,
  setUnpublishedClip,
  type UnpublishedClip,
} from "../data/clips";
import { UploadedClipView } from "./UploadedClipView";

const FILE_INPUT_ID = "upload-audio-file";

export const UploadClip: React.FC = () => {
  // Mirrors the clip store.
  const [clip, setClip] = useState<UnpublishedClip | null>(() => getUnpublishedClip());
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    // Reset so selecting the same file again still fires `change`.
    input.value = "";

    // Cancelled selection: leave the clip and any message unchanged.
    if (!file) return;

    setError(null);
    setIsChecking(true);
    try {
      const result = await uploadAudio(file, { ownershipConfirmed });
      setClip(setUnpublishedClip(result, file.name));
    } catch (err) {
      // A rejected file leaves the existing clip in place (decisions 11, 12).
      setError(err instanceof UploadError ? err.message : new UploadFailedError().message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRemove = () => {
    removeUnpublishedClip();
    setClip(null);
  };

  return (
    <section aria-labelledby="upload-heading">
      <h2 id="upload-heading">Upload an Audio Clip</h2>

      <label>
        <input
          type="checkbox"
          checked={ownershipConfirmed}
          disabled={isChecking}
          onChange={(event) => setOwnershipConfirmed(event.currentTarget.checked)}
        />
        I confirm that I own this audio or have permission to upload it
      </label>

      <div>
        <label htmlFor={FILE_INPUT_ID}>Choose audio file</label>
        <input
          id={FILE_INPUT_ID}
          type="file"
          accept={UPLOAD_ACCEPT}
          disabled={isChecking}
          onChange={handleFileChange}
        />
      </div>

      {isChecking && <p>Checking audio…</p>}

      {error && (
        <p className="error-message" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      {clip && <UploadedClipView clip={clip} onRemove={handleRemove} />}
    </section>
  );
};

export default UploadClip;
