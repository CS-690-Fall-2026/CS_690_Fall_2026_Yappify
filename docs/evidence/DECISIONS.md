# DECISIONS.md — Milestone 1, Deliverable 2d (own interview)

Source of truth for the 2d list. An item is recorded here only after the student rules on it.
The deliverable (`compliments-and-predictions.md`) is generated from this file, never hand-written.

Scope: Deliverable 2d, "Compliments and predictions", for the student's own interview
(`~/tmp/taildrop-inbox/interview_transcript.md`, 2026-10-31 17:39, Interviewer / Participant A / Participant B).
Method: one item per turn — source quoted verbatim, proposed entry, AI recommendation, then
confirm / reject.

---

## D-001 · 2026-11-05 · citation scheme

**Item:** how the interview is cited, since every 2d row must carry a paragraph ID.

**Referenced content supplied:** the file's own structure — 69 timestamped speaker turns,
00:00 → 14:21, no paragraph IDs.

**Options offered:**

| | Option |
| --- | --- |
| A | INT-01, one paragraph per speaker turn, P01–P69 |
| B | INT-01, merge same-speaker adjacent turns (~45–50 paragraphs) |
| C | a different interview ID |
| D | timestamps only, no P IDs |

**AI recommendation:** A — deterministic and reproducible from the transcript; never merges two speakers into one ID, so a compliment cannot hide inside a block cited as evidence.

**Student's ruling: A — INT-01, turn-per-paragraph P01–P69.**

**Resulting artifact:** `evidence/INT-01-paragraph-map.md` (69 rows, generated mechanically from the transcript, not hand-written).

---

## D-002 · 2026-11-05 · 2d item, INT-01:P21

**Item:** `INT-01:P21` (Participant A, 03:57) — *"I would have sent one last week if I knew how, but I sent the whole song."*

**Referenced content supplied:** P19 (Interviewer's question, "When was the last time you sent an audio—?"), P20 (Participant A, unclear), P21 in full.

**Options offered:**

| | Option |
| --- | --- |
| A | List the hypothetical clause as a prediction; keep "I sent the whole song" citable as evidence |
| B | List as prediction, bar the whole paragraph from evidence |
| C | Not a prediction; evidence only |
| D | Drop the paragraph |

**AI recommendation:** A — the turn carries two facts: willingness that never became an event (unciteable), and an observed workaround (citable).

**Student's ruling: A — list as prediction, keep the observed half as evidence.**

**Resulting entry:**

```text
type:      Prediction (counterfactual willingness)
quote:     "I would have sent one last week if I knew how, but I sent the whole song."
source:    INT-01:P21
context:   pre-reveal; answering the question about the last time he sent an audio clip
note:      first clause describes an event that did not happen and is not evidence;
           "I sent the whole song" is observed and remains citable
status:    NOT EVIDENCE — may not be cited
```

**Consequence:** P21 is split. The evidence log (Deliverable 3) may cite the second clause only.

---

## D-003 · 2026-11-05 · 2d item, INT-01:P29

**Item:** `INT-01:P29` (Participant B, 06:46) — *"it never occurred to me to really send a snippet of audio to someone. Maybe if they were going to sing happy birthday to them."*

**Referenced content supplied:** P28 (Interviewer's question and leading follow-up), P29, P30 and P31 (both interviewees immediately reject the scenario).

**Options offered:** A list the conditional and keep the non-use as evidence · B exclude from the list, keep non-use as evidence · C list and bar the whole paragraph · D drop the paragraph.

**AI recommendation:** A — a weak conditional on the list is cheap; leaving a "maybe if" out invites it into the evidence log later.

**Student's ruling: A — list as prediction, keep non-use as evidence.**

**Resulting entry:**

```text
type:      Prediction (conditional willingness)
quote:     "Maybe if they were going to sing happy birthday to them."
source:    INT-01:P29
context:   pre-reveal; offered while explaining she has never sent an audio snippet
note:      "it never occurred to me to really send a snippet" is observed non-use and remains
           citable; P30 and P31 both reject the scenario
status:    NOT EVIDENCE — may not be cited
```

---

## D-004 · 2026-11-05 · 2d item, INT-01:P33

**Item:** `INT-01:P33` (Participant A, 07:16) — *"It wouldn't stop me. What would stop me was I didn't want the person to... I don't know what environment they're in, that other people can hear."*

**Referenced content supplied:** P32, P33, P34 (Interviewer's speculation about trolling).

**Options offered:** A list willingness, cap the blocker at Stated · B list willingness, blocker goes to Q only · C list and bar the whole paragraph · D treat the blocker as observed.

**AI recommendation:** A — willingness is textbook future-use; the named blocker (recipient's surroundings, others overhearing) is useful but stated as a hypothetical, so its ceiling is *Stated*.

**Student's ruling: A — list as prediction; blocker stays Stated-only, never Observed.**

**Resulting entry:**

```text
type:      Prediction (willingness, + stated blocker)
quote:     "It wouldn't stop me. What would stop me was I didn't want the person to... I don't know what environment they're in, that other people can hear."
source:    INT-01:P33
context:   pre-reveal; answering why he has decided not to send an audio clip
note:      both clauses are counterfactual — no clip was sent and no feature existed;
           the privacy concern may be cited at most as Stated reasoning
status:    NOT EVIDENCE — may not be cited
```

**Consequence:** the evidence log may carry "recipient's surroundings" as `Stated`; it may not be an `E` entry with status `Observed`.

---

## D-005 · 2026-11-05 · 2d item, INT-01:P55

**Item:** `INT-01:P55` (Participant B, 11:10) — *"I could see where it would be coming out more now, but I don't know, that hasn't been something that I did much."*

**Referenced content supplied:** P53, P54, P55.

**Options offered:** A list the trend forecast, keep non-use as evidence · B exclude from the list · C exclude entirely · D treat the forecast as an observation.

**AI recommendation:** A — the forecast is about other people's behaviour, made without data, so its most likely misuse is as a demand signal; one row blocks that.

**Student's ruling: A — list as prediction, keep non-use as evidence.**

**Resulting entry:**

```text
type:      Prediction (third-party trend)
quote:     "I could see where it would be coming out more now"
source:    INT-01:P55
context:   pre-reveal; about sharing noise/audio in general, not about a product
note:      forecloses the invalid citation "interviewees say demand is growing";
           "that hasn't been something that I did much" is observed non-use and remains citable
status:    NOT EVIDENCE — may not be cited
```

---

## D-006 · 2026-11-05 · 2d item, INT-01:P57

**Item:** `INT-01:P57` (Participant A, 11:45) — *"I was looking into getting a Bluetooth speaker... I can hide that in the ceiling or something, or somewhere, and then it would play from my computer on a delay."*

**Referenced content supplied:** P56, P57, P58, P59.

**Options offered:** A list the plan as a prediction, keep the search as Observed · B exclude from the list, keep the search as evidence · C list and bar the whole paragraph · D treat the plan as observed behaviour.

**AI recommendation:** A, flagged as a judgment call — the plan is about hardware, not the product, but it is the interview's only concrete future-use statement and it shows the "play it in class / prank" behaviour the team might otherwise cite without an observed instance.

**Student's ruling: A — list as prediction, keep the search as evidence.**

**Resulting entry:**

```text
type:      Prediction (stated plan)
quote:     "I can hide that in the ceiling or something, or somewhere, and then it would play from my computer on a delay."
source:    INT-01:P57
context:   pre-reveal; volunteering a prank plan at work
note:      "I was looking into getting a Bluetooth speaker" is a current action and remains
           citable as Observed; the ceiling plan is intent, not a promise
status:    NOT EVIDENCE — may not be cited
```

---

## D-007 · 2026-11-05 · 2d item, INT-01:P65

**Item:** `INT-01:P65` (Participant A, 13:43) — *"Yeah. Interesting."*

**Referenced content supplied:** P60 (reveal), P62 (name), P63, P64, P65, P66 (jointly attributed).

**Options offered:** A list it and record why the list is short · B list it, no note · C exclude as a neutral acknowledgement · D list P65–P66 as one reaction.

**AI recommendation:** C was not recommended; A recommended — "Interesting" is the transcript's only positive evaluation, and the note explains why a one-row compliment section is complete rather than unsearched.

**Student's ruling: A — list it, and record why the list is short.**

**Resulting entry:**

```text
type:      Compliment
quote:     "Yeah. Interesting."
source:    INT-01:P65
context:   post-reveal (idea disclosed at P60); reaction to a described product, not a used one
note:      the interview's only positive evaluation of the idea; minimal, and follows the pitch
status:    NOT EVIDENCE — may not be cited
```

**Consequence:** the deliverable carries one completeness sentence: the concept was disclosed at
`INT-01:P60`, so no earlier turn could be a reaction to it.

---

## D-008 · 2026-11-05 · 2d item, INT-01:P67

**Item:** `INT-01:P67` (Participant A, 13:52) — *"they're all going to be accompanied by an image to find it, I guess, or just text."*

**Referenced content supplied:** P67 and P68 together.

**Options offered:** A list as a product-shape prediction, no evidence path · B exclude as a design opinion · C list and open a Q now · D treat as evidence.

**AI recommendation:** A, flagged as a judgment call — outside a strict "about future use" reading, but it is the kind of speculation a team would otherwise paste into a requirements doc as "users need images to find clips".

**Student's ruling: A — list as prediction, no evidence path.**

**Resulting entry:**

```text
type:      Prediction (product shape)
quote:     "they're all going to be accompanied by an image to find it, I guess, or just text."
source:    INT-01:P67
context:   post-reveal, 90 s after the concept was described; hedged with "I guess"
note:      predicts what the product would have to be, not what he would do with it;
           may motivate a Q entry on clip discovery, never an E entry
status:    NOT EVIDENCE — may not be cited
```

---

## D-009 · 2026-11-05 · 2d item, INT-01:P68

**Item:** `INT-01:P68` (Participant A, 14:02) — *"it would be kind of like a gimmicky version of Spotify."*

**Referenced content supplied:** P68 in full.

**Options offered:** A list as a negative product-shape prediction · B exclude · C list and link to the reflection paragraph · D treat as evidence.

**AI recommendation:** A, flagged as a judgment call — 2d does not require positivity, and "gimmicky" is the sentence most likely to be either ignored or misquoted as validation.

**Student's ruling: A — list as prediction (negative).**

**Resulting entry:**

```text
type:      Prediction (product shape, negative)
quote:     "it would be kind of like a gimmicky version of Spotify."
source:    INT-01:P68
context:   post-reveal; volunteered after the pitch
note:      a prediction about what the product would be, plus the only unfavourable
           evaluation of the idea; "Spotify has images with albums" is a fact about an
           existing product, not about users
status:    NOT EVIDENCE — may not be cited
```

---

## D-010 · 2026-11-05 · bulk exclusion set

**Item:** every remaining turn — 15 interviewee turns of observed behaviour, generalisation, or minimal acknowledgement, plus the 27 interviewer (Interviewer) turns.

**Referenced content supplied:** the full exclusion table with the reason for each row; P34 and P58 named as interviewer speculation that reads like interviewee content; P45's speaker label flagged as contextually wrong (answers P44's "Did you ask the permission of—?", continued by P46 "But I did buy it.").

**Options offered:** A confirm all exclusions · B confirm, rule separately on P34/P58 · C confirm, reopen P18/P22 · D confirm, fix the P45 attribution.

**AI recommendation:** A — rows are mechanical; no 2d entry depends on P45.

**Student's ruling: A — confirm all exclusions, P45 label left uncorrected.**

**Consequence:** the note set keeps `P45` labelled Interviewer. No 2d row cites it. If the evidence log later wants P45, the attribution must be re-ruled first.

---

## Status: closed

Ten items ruled. Deliverable generated from this file:
`compliments-and-predictions.md` (1 compliment, 7 predictions).

---

## D-011 · 2026-11-05 · interview ID (supersedes D-001's ID)

**Item:** the ID assigned in D-001.

**Referenced content supplied:** Drive `CS 690 Fall 2026 Project/Interviews/` listing — `INT-01 - Ben`, `INT 02 - Ben`, `INT-03 - Joshua's interview`.

**Options offered:** A append INT-04 · B keep INT-01 and have the team renumber · C ask the team first.

**AI recommendation:** A — costs one rename of my own artifacts and breaks nothing already circulated.

**Student's ruling: A — my interview is INT-04.**

**Consequences:** `compliments-and-predictions.md` and `evidence/INT-04-paragraph-map.md` renamed; paragraph rule from D-001 unchanged (one speaker turn = one paragraph, P01–P69).

---

## Drive state · 2026-11-05

- Uploaded: `compliments-and-predictions.md` (5,085 B) → `CS 690 Fall 2026 Project/Interviews/` (file id `14dsx-NDF9xlWe7IXbfHto-1aV3hElgKG`).
- Downloaded for the evidence log: INT-01 (Ben), INT-02 (Ben), INT-03 (Joshua), plus the INT-02 AI recap.
- No teammate 2d list exists in the folder.

---

## D-012 · 2026-11-05 · Deliverable 3, entry E-1

**Item:** `INT-01:P04` — non-recall of ever searching for an audio-only clip.

**Referenced content supplied:** INT-01 P03 and P04 verbatim.

**Options offered:** A Stated, as drafted · B Observed · C widen to include video (P12) · D drop.

**AI recommendation:** A, with the Status flagged as a judgment call — `Observed` requires a specific past event, and a non-recall is not one.

**Student's ruling: A — Stated, claim limited to what P04 supports (no video half).**

```text
ID: E-1 | Claim: The interviewee could not recall ever having searched for an
audio-only clip. | Source: INT-01:P04 | Status: Stated | Owner: Ben
```

---

## D-013 · 2026-11-05 · Deliverable 3, entry E-2

**Item:** `INT-01:P06` — why YouTube is his main audio platform.

**Options offered:** A P06 only · B bundle P06+P07 · C Observed · D drop.

**AI recommendation:** A — one paragraph per entry keeps the citation checkable; P07 is a second, separate reason.

**Student's ruling: A — P06 only, as drafted.**

```text
ID: E-2 | Claim: He uses YouTube as his main audio platform because it remembers the
music he returns to repeatedly and puts it back in front of him. | Source: INT-01:P06
| Status: Stated | Owner: Ben
```

---

## D-014 · 2026-11-05 · Deliverable 3, entry E-3

**Item:** `INT-01:P14` — short-form aversion.

**Options offered:** A P14 only · B bundle P14–P15 · C Observed · D drop.

**AI recommendation:** A — P15 and P16 assert different things; bundling would make a row no single paragraph supports.

**Student's ruling: A — P14 only, as drafted.**

```text
ID: E-3 | Claim: He avoids short-form content, describing it as "brain rot" and saying
he would rather watch something longer of lower quality than a 5-second clip.
| Source: INT-01:P14 | Status: Stated | Owner: Ben
```

---

## D-015 · 2026-11-05 · Deliverable 3, entry E-4

**Item:** `INT-01:P16` — context-dependent length (20–30 min with a meal; ~3 h as study background).

**Options offered:** A one entry · B split in two · C Observed · D drop.

**AI recommendation:** A — the claim *is* the context-dependence; splitting drops the condition and misrepresents him.

**Student's ruling: A — one entry, as drafted.**

```text
ID: E-4 | Claim: His preferred length depends on the situation: about 20–30 minutes
when watching TV with a meal, and roughly three hours of background audio while
studying. | Source: INT-01:P16 | Status: Stated | Owner: Ben
```

---

## D-016 · 2026-11-05 · Deliverable 3, entry E-5

**Item:** `INT-01:P18` — sent videos, never an audio-only snippet.

**Options offered:** A Stated, both halves · B Observed · C split · D drop.

**AI recommendation:** A — a pattern over his history, not a dated event; both halves are load-bearing.

**Student's ruling: A — Stated, both halves, as drafted.**

```text
ID: E-5 | Claim: He has sent video clips to friends but does not think he has ever
sent a voice recording or an audio-only snippet. | Source: INT-01:P18
| Status: Stated | Owner: Ben
```

---

## D-017 · 2026-11-05 · Deliverable 3, entry E-6

**Item:** `INT-01:P20` — dislikes voice notes, asks senders to text, would not send one.
**Options:** A one entry · B split · C Observed · D drop. **Recommended:** A.
**Student's ruling: A — one entry, as drafted.**

```text
ID: E-6 | Claim: He does not send voice notes; when he receives one he is annoyed,
asks the sender to put it in text, and names the burden of listening and the risk of
miscommunication as the reasons. | Source: INT-01:P20 | Status: Stated | Owner: Ben
```

---

## D-018 · 2026-11-05 · Deliverable 3, entries E-7 and E-8

**Item:** `INT-02:P13` and `INT-02:P15` — Teams→Dovetail research workflow; audio reached through
Drive and Dovetail to fix a bad transcription.
**Options:** A two entries · B one from P13 · C one citing P13–P15 · D drop. **Recommended:** A —
P15 is the corpus's closest observed "I needed just the audio" event and should not be buried.
**Student's ruling: A — two entries, as drafted.**

```text
ID: E-7 | Claim: About a week before the interview, during user research, she took Teams
meeting recordings, used the transcription feature, and ported them into Dovetail.
| Source: INT-02:P13 | Status: Observed | Owner: Ben
ID: E-8 | Claim: In that work she reached the same audio clips through both Google Drive
and Dovetail, and separated audio from video when Dovetail's transcription was wrong and
needed correcting. | Source: INT-02:P15 | Status: Observed | Owner: Ben
```

---

## D-019 · 2026-11-05 · Deliverable 3, entries E-9 and E-10

**Item:** `INT-02:P40` and `INT-02:P42` — failed Discord embed; embed-shortener workaround.
**Options:** A two entries · B one entry citing P40–P42 · C two entries + video-only caveat · D drop.
**Recommended:** A.
**Student's ruling: A — two entries, as drafted.**

```text
ID: E-9  | Claim: When she tried to forward an Instagram Reel to a friend, the Discord
embed did not work, so the clip could not be shared that way. | Source: INT-02:P40
| Status: Observed | Owner: Ben
ID: E-10 | Claim: She now shares TikTok and Instagram Reel clips by sending
embed-shortener links instead of the original link. | Source: INT-02:P42
| Status: Observed | Owner: Ben
```

---

## D-020 · 2026-11-05 · Deliverable 3, entry E-11

**Item:** `INT-02:P52` — comfortable length ≈ 2.5–3 minutes.
**Options:** A P52 only · B bundle P48+P52 · C Observed · D drop. **Recommended:** A.
**Student's ruling: A — as drafted.**

```text
ID: E-11 | Claim: The length she is comfortable with now is about two and a half to
three minutes, roughly the length of a song. | Source: INT-02:P52
| Status: Stated | Owner: Ben
```

---

## D-021 · 2026-11-05 · Deliverable 3, entry E-12

**Item:** `INT-02:P58–P63` — voice clip sent to an iMessage group chat while walking.
**Options:** A range citation · B P58 only · C split · D drop. **Recommended:** A — the event is
spread over five fragments and P60 self-corrects the medium from video to voice.
**Student's ruling: A — one entry, source `INT-02:P58–P63`.**

```text
ID: E-12 | Claim: A week before the interview she sent a voice clip to an iMessage
group chat while walking, because texting was impractical, to express excitement about
friends who had travelled to Boston. | Source: INT-02:P58–P63 | Status: Observed
| Owner: Ben
```

---

## D-022 · 2026-11-05 · Deliverable 3, entry E-13

**Item:** `INT-02:P65` — send trigger plus send/dislike asymmetry.
**Options:** A P65 only · B bundle P65+P68 · C Observed · D drop. **Recommended:** A.
**Student's ruling: A — P65 only, as drafted.**

```text
ID: E-13 | Claim: She sends voice clips mainly when she has a lot to say and cannot be
bothered to text, even though she does not like receiving them herself.
| Source: INT-02:P65 | Status: Stated | Owner: Ben
```

---

## D-023 · 2026-11-05 · Deliverable 3, entry E-14

**Item:** `INT-02:P89` — no review or undo on a sent voice clip.
**Options:** A P89 only · B P89 + new entry from P83 · C Observed · D drop. **Recommended:** A.
**Student's ruling: A — P89 only, as drafted.**

```text
ID: E-14 | Claim: She has decided not to send a voice clip because it cannot be
reviewed or undone once sent; the only options are to re-record the whole thing or send
it and hope it is not a problem. | Source: INT-02:P89 | Status: Stated | Owner: Ben
```

---

## D-024 · 2026-11-05 · INT-03 numbering + entry E-15

**Item:** INT-03 has no paragraph IDs.
**Options:** A one Q/A block = one paragraph (P01–P12) · B number every line · C ask Joshua ·
D don't cite INT-03. **Recommended:** A — matches the doc's layout and mirrors INT-04's rule.
**Student's ruling: A — block-per-paragraph; our copy only, Joshua's doc untouched.**

```text
ID: E-15 | Claim: She has decided against sending an audio clip when the recording ran
long or her thoughts were disorganized — in her words, "where I sound dumb" — because
the message lacked coherence. | Source: INT-03:P11 | Status: Stated | Owner: Joshua
```
Artifact: `evidence/INT-03-paragraph-map.md` (12 rows).

---

## D-025 · 2026-11-05 · Deliverable 3, entry E-16

**Item:** `INT-04:P21` — sent the whole song rather than a clip.
**Options:** A observed clause only · B include motivation · C include date · D drop.
**Recommended:** A — D-002 barred "if I knew how" from evidence, and "last week" belongs to that
counterfactual clause.
**Student's ruling: A — as drafted, observed clause only.**

```text
ID: E-16 | Claim: When sharing audio, he sent the whole song rather than a short clip.
| Source: INT-04:P21 | Status: Observed | Owner: Interviewer
```

---

## D-026 · 2026-11-05 · Deliverable 3, entry E-17

**Item:** `INT-04:P56` — recognised a game enemy's sound months later.
**Options:** A Observed + [??] caveat · B drop · C narrower · D Stated. **Recommended:** A.
**Student's ruling: A — as drafted, with caveat.**

```text
ID: E-17 | Claim: Months after a coworker played a game, she tried it herself and
recognised an enemy's sound as the worst one to encounter. | Source: INT-04:P56
| Status: Observed | Owner: Interviewer | Note: the sound's name is marked [??] in the transcript.
```

---

## D-027 · 2026-11-05 · Deliverable 3, entry A-1

**Item:** clipping assumption — no interviewee described trimming a recording.
**Options:** A as drafted (Interviewer) · B owner Ben · C make it a Q · D drop. **Recommended:** A.
**Student's ruling: A — as drafted, owner Interviewer.**

```text
ID: A-1 | Claim: We assume users will cut a segment out of a longer recording to share
it, not only forward whole files or record something new. | Source: Team
| Status: Assumption | Owner: Interviewer
```

---

## D-028 · 2026-11-05 · Deliverable 3, entry A-2

**Item:** discoverability assumption; the only support is INT-04:P67, ruled non-evidence in D-008.
**Options:** A as drafted (Joshua) · B owner Interviewer · C make it a Q · D drop. **Recommended:** A.
**Student's ruling: A — as drafted.**

```text
ID: A-2 | Claim: We assume a shared clip needs a name, an image, or text alongside it
to be found again later. | Source: Team | Status: Assumption | Owner: Joshua
```

---

## D-029 · 2026-11-05 · Deliverable 3, entry A-3

**Item:** distribution assumption — clips are shared into existing chat apps.
**Options:** A as drafted (Ben) · B owner Interviewer · C make it a Q · D drop. **Recommended:** A.
**Student's ruling: A — as drafted.**

```text
ID: A-3 | Claim: We assume clips are shared into other messaging apps (iMessage, Discord)
rather than browsed inside our own product. | Source: Team | Status: Assumption
| Owner: Ben
```

---

## D-030 · 2026-11-05 · Q-2 superseded — recorded as E-18

**Item as proposed:** Q-2, asking whether sharing is one-to-one or group.

**Student's correction, verbatim:** "This evidence shows that people send messages to both
group chats and one-to-one."

**Resulting entry (replaces Q-2):**

```text
ID: E-18 | Claim: People send clips both to group chats and to one person: one interviewee
sent hers to an iMessage group chat, another sends only to individuals and has never used
a group chat for this. | Source: INT-02:P63; INT-03:P08 | Status: Observed | Owner: Ben
```

**Consequence:** no Q entry is created for the channel question. Deliberate exception to
one-paragraph-per-entry: the claim is a comparison and needs both sources.

---

## D-031 · 2026-11-05 · scope of "audio clip" (student-supplied definition)

**Item:** Q-3 as proposed asked whether "audio clip" is open — three interviewees used it for
audio-only segments, video audio tracks, and whole songs.

**Student's correction, verbatim:** "Except when specified, audio clips is not referring to full
songs but can refer to short clips of music."

**Resulting entry — recorded as an assumption, because it is our definition and the interviews
do not establish it:**

```text
ID: A-4 | Claim: We use "audio clip" to mean a short piece of audio, not a full song, unless a
context says otherwise; short spans of music count as clips. | Source: Team
| Status: Assumption | Owner: Interviewer
```

**Consequence for existing entries:** E-16 (INT-04:P21, "I sent the whole song") and any story built
on songs (INT-04:P51) sit outside the default scope and must cite this assumption.

---

## D-032 · 2026-11-05 · Deliverable 3, entry Q-4 (artifact ID: Q-2)

**Item:** licensing — what permission is needed to share a song or a span of music.
**Options:** A cite P46 + INT-01:P10 · B re-rule the P45 attribution and cite it · C make it an A ·
D drop. **Recommended:** A — P45 is uncorrected by D-010, so citing it would contradict a ruling.
**Student's ruling: A — as drafted.**

```text
ID: Q-2 | Claim: What permission or licence is needed to share a song, or a short span of
music, as a clip? | Source: INT-04:P46; INT-01:P10 | Status: Open | Owner: Interviewer
```

---

## D-033 · 2026-11-05 · Deliverable 3, entry Q-5 (artifact ID: Q-3)

**Item:** maximum clip length.
**Options:** A four sources · B two sources · C adopt ~3 min as an assumption · D drop.
**Recommended:** A — until answered, length must be a named setting.
**Student's ruling: A — as drafted.**

```text
ID: Q-3 | Claim: What is the maximum length of a clip? | Source: INT-01:P14; INT-02:P48;
INT-02:P52; INT-04:P18 | Status: Open | Owner: Ben
```

---

## Status: Deliverable 3 closed

26 items ruled across D-012–D-033. Generated artifact: `evidence/evidence-log.md` —
18 E, 4 A, 3 Q (minimums 12 / 3 / 3).

ID note (bookkeeping, not a ruling): Q entries are numbered consecutively in the artifact —
D-030's withdrawn Q-2 became E-18 and D-031's Q-3 became A-4, so the artifact's Q-2 and Q-3
correspond to D-032 and D-033.
