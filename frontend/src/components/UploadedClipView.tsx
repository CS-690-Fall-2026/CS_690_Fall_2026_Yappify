// S-7 uploaded-audio display (docs/design/S-7.md decisions 1, 2, 11, 14, 15;
// docs/plans/S-7-plan.md "Storage and playback", Task 4.7).
//
// Shows the accepted clip and owns its playback object URL.

import React, { useEffect, useState } from "react";
import type { UnpublishedClip } from "../data/clips";
import { formatDuration } from "../utils/formatDuration";

export interface UploadedClipViewProps {
  clip: UnpublishedClip;
  onRemove: () => void;
}

interface ClipUrl {
  clipId: string;
  url: string;
}

export const UploadedClipView: React.FC<UploadedClipViewProps> = ({ clip, onRemove }) => {
  const [clipUrl, setClipUrl] = useState<ClipUrl | null>(null);

  // One object URL per clip. The cleanup revokes it on replacement (new id),
  // removal and unmount, including the StrictMode double mount (decision 14).
  useEffect(() => {
    const url = URL.createObjectURL(clip.audio);
    setClipUrl({ clipId: clip.id, url });
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [clip.id, clip.audio]);

  // Never point the player at a URL that belongs to a previous (revoked) clip.
  const src = clipUrl?.clipId === clip.id ? clipUrl.url : undefined;

  return (
    <div>
      <p>{clip.fileName}</p>
      <p>Duration: {formatDuration(clip.durationSeconds)}</p>
      <audio controls preload="metadata" src={src} />
      <span>Unpublished</span>
      <button type="button" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
};

export default UploadedClipView;
