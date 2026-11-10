# Deliverable 4 — Backlog

Source: team Milestone 1 working document, section 4 (exported 2026-11-09). Stories are Connextra form; every story carries an evidence trace or an explicit assumption.

## 4a–4b. User stories and evidence trace

| ID | User story (Connextra form) | Evidence trace |
|---|---|---|
| S-1 | As an audio creator, I want to record a voice clip directly in Yappify so that I can express something without having to type it. | E-12, E-13: Interviewee recorded a voice clip while walking because typing was inconvenient. |
| S-2 | As an audio listener, I want to play an audio clip so that I can hear content someone has shared with me. | E-12, E-18: Interviewees described sending audio clips to individuals and groups. |
| S-3 | As an audio creator, I want to listen to my recording before publishing it so that I can check whether it communicates what I intended. | E-14, E-15: Interviewees described reluctance to send recordings they could not adequately review or that sounded disorganized. |
| S-4 | As an audio creator, I want to discard a recording and start again so that I can correct mistakes before sharing it. | E-14, E-15: Interviewees described re-recording as necessary when something was wrong with a voice clip. |
| S-5 | As an audio sharer, I want to copy a link to an audio clip so that I can share it with friends through messaging apps. | E-9, E-10, E-18; A-3: Interviewee used link workarounds to share clips; sharing occurred in both individual and group conversations. |
| S-6 | As an audio listener, I want to see a clip's duration before playing it so that I can decide whether I have enough time to listen. | E-3, E-4, E-11: Interviewees expressed different preferences for content length, depending on context. |
| S-7 | As an audio creator, I want to upload an existing audio file so that I can share audio I already have without recording it again. | E-8, E-16; A-4: Interviewees described accessing existing audio and sharing an existing song. Applying this to short clips uses A-4. |
| S-8 | As an audio creator, I want to give my clip a title so that other people can identify it before listening. | Assumption A-2. Clarifying question: Do listeners need a title, image, or description to identify clips? |
| S-9 | As an audio creator, I want to select a segment of a longer recording so that I can share only the relevant portion. | Assumption A-1; E-16; A-4. Clarifying question: Would users cut segments from longer recordings, or would they mainly share complete files? |
| S-10 | As an audio listener, I want to find clips I previously listened to so that I can return to audio I enjoyed. | E-2; A-2. Interviewee valued YouTube remembering repeatedly played music; A-2 extends discoverability to saved clips. |

## 4c. INVEST check

| Story | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| S-1 | Pass | Pass | Pass | Pass | Pass | Pass |
| S-2 | Pass | Pass | Pass | Pass | Pass | Pass |
| S-3 | Fail | Pass | Pass | Pass | Pass | Pass |
| S-4 | Fail | Pass | Pass | Pass | Pass | Pass |
| S-5 | Fail | Pass | Pass | Pass | Pass | Pass |
| S-6 | Pass | Pass | Pass | Pass | Pass | Pass |
| S-7 | Pass | Pass | Pass | Pass | Pass | Pass |
| S-8 | Pass | Pass | Pass | Pass | Pass | Pass |
| S-9 | Fail | Pass | Pass | Fail | Fail | Pass |
| S-10 | Pass | Pass | Pass | Pass | Pass | Pass |

Specific failures: S-3 — Independent: The proposed recording-preview workflow depends on S-1 providing a recording to preview. S-4 — Independent: Re-recording depends on S-1 providing the recording workflow. S-5 — Independent: Sharing a playable clip depends on S-2's playback capability being available to recipients. S-9 — Independent: Trimming an existing recording depends on the file-import workflow in S-7. S-9 — Estimable: The supported source formats and editing restrictions have not been defined, preventing a reliable estimate. S-9 — Small: Importing, displaying a selectable audio range, trimming, and exporting the result together make the proposed story too broad for a small development task.

## 4d. Acceptance criteria

| Story | AC | Criterion |
|---|---|---|
| S-1 — Record an audio clip | AC-1 | Given the user has granted microphone permission and is on the recording screen, When the user presses Record and then Stop, Then Yappify displays a completed recording with an available playback control. |
| S-2 — Play an audio clip | AC-2 | Given an audio clip is available on the playback screen, When the user presses Play, Then the clip becomes audible and the playback progress indicator advances. |
| S-3 — Preview before publishing | AC-3 | Given the user has finished recording an unpublished clip, When the user presses Preview, Then Yappify plays the recording without publishing it. |
| S-4 — Discard and re-record | AC-4 | Given the user has an unpublished recording, When the user selects Re-record, Then Yappify returns to a recording-ready state and the previous recording is no longer selected for publication. |
| S-5 — Share an audio clip | AC-5 | Given a published audio clip has a shareable URL, When the user selects Copy Link, Then Yappify copies the URL to the clipboard, and opening that URL displays the corresponding playable clip. |
| S-6 — Display clip duration | AC-6 | Given a playable audio clip has been loaded, When the user views its playback screen, Then Yappify displays the clip's duration in minutes and seconds before playback begins. |
| S-7 — Upload existing audio | AC-7 | Given the user has an audio file in a format permitted by SUPPORTED_AUDIO_FORMATS and within MAX_CLIP_DURATION , When the user selects that file for upload, Then Yappify displays the uploaded audio as a playable, unpublished clip. For content subject to licensing restrictions, publication must also follow the unresolved AUDIO_LICENSE_POLICY associated with Q-2. |
| S-8 — Add a clip title | AC-8 | Given the user has an unpublished audio clip, When the user enters a title and publishes the clip, Then the published clip displays that title alongside its playback control. |
| S-9 — Trim a recording | AC-9 | Given the user has imported a recording longer than the segment they want to share, When the user selects a start and end position and applies Trim, Then the preview plays only the selected segment. Any resulting clip must comply with the still-undecided MAX_CLIP_DURATION ; music publication remains subject to AUDIO_LICENSE_POLICY . |
| S-10 — Revisit previously played clips | AC-10 | Given a signed-in user has previously played an audio clip that remains available, When the user opens Listening History, Then that clip appears in the history and can be played again. |

## 4e. Ranking and final-release cut line

| Rank | Story | Release | Reason |
|---|---|---|---|
| 1 | S-2 — Play audio | Final | Listening is the core function of Yappify and necessary for receiving shared clips. |
| 2 | S-1 — Record audio | Final | Interviewees actually recorded voice messages when typing was inconvenient. |
| 3 | S-7 — Upload existing audio | Final | It supports sharing audio that already exists instead of requiring every clip to be recorded in the app. |
| 4 | S-3 — Preview recordings | Final | It directly addresses concern about accidentally sharing unclear or unwanted recordings. |
| 5 | S-4 — Re-record audio | Final | It gives creators a straightforward way to correct a recording before publishing. |
| 6 | S-5 — Share clip links | Final | It addresses the observed friction of getting clips into existing messaging conversations. |
| 7 | S-6 — Display duration | Final | It helps listeners with differing time preferences decide whether to play a clip. |
|  | FINAL RELEASE CUT LINE |  |  |
| 8 | S-8 — Add clip titles | Deferred | Based on an unvalidated discoverability assumption. |
| 9 | S-10 — Listening history | Deferred | Useful for repeat listening, but less essential than the core recording and sharing workflows. |
| 10 | S-9 — Trim recordings | Deferred | Requires further validation and splitting into smaller implementation stories. |
