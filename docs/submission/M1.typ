#set page(paper: "us-letter", margin: 0.75in)
#set text(size: 10pt, font: "Liberation Serif")
#set heading(numbering: "1.1")
#show heading.where(level: 1): it => { pagebreak(weak: true); it }
#set table(stroke: 0.5pt + luma(160), inset: 4pt)

#align(center)[
  #text(size: 20pt, weight: "bold")[CS 690 — Project Milestone 1]
  #v(0.4em)
  #text(size: 14pt)[Yappify — requirements, specifications, and a first story]
  #v(0.8em)
  Joshua George · Ben Shuster · Luke Hill \
  Repository: #link("https://github.com/CS-690-Fall-2026/CS_690_Fall_2026_Yappify") \
  Commit: `5d4dbd2`
]

= Table of contents
#table(columns: (2.6in, 1fr), [*Deliverable*], [*Page or repository path*],
  [1 — Proposal follow-up], [#context [p. #counter(page).at(<d1>).first()]],
  [2 — User interviews], [#context [p. #counter(page).at(<d2>).first()]],
  [3 — Evidence log], [docs/evidence/evidence-log.md],
  [4 — Backlog], [docs/backlog.md],
  [5 — Design docs], [docs/design/S-1.md, docs/design/S-7.md],
  [6e — Test output], [#context [p. #counter(page).at(<d6e>).first()]],
  [7 — Traceability matrix], [#context [p. #counter(page).at(<d7>).first()]],
)

= Deliverable 1 — Proposal follow-up <d1>
Each item below is from the proposal approval feedback; the response says what changed and where.
#table(columns: (2.5in, 1fr), [*Feedback item*], [*Response*],
  [Target user. “Students 13 to 25” is a market, not a role. Narrow it, preferably to adults only; say what these users do today and which team member can reach one.], [Partially addressed. The backlog now uses three roles — audio creator, audio listener, audio sharer — and the stories are written in those terms (\`docs/backlog.md\` §4a). The proposal's 13–25 age statement has not been narrowed, and the privacy/moderation obligation for minors remains open.],
  [Logic. Liking, commenting and following are mostly storing data. Add at least one capability with real rules.], [Addressed. S-7 adds clip validation with \`SUPPORTED\_AUDIO\_FORMATS\` and \`MAX\_CLIP\_DURATION\`, typed rejection errors, and an invariant that every accepted clip has a permitted format and a duration ≤ the configured maximum (\`docs/design/S-7.md\` §§4–6; AC-7). No moderation or reporting capability was added.],
  [Non-goals and cut line. Give a reason for each non-goal; replace “cost is prohibitively expensive” with a measurable trigger.], [Not changed. The proposal's three non-goals still carry no cost/risk/dependency reason, and the cut-line note still reads “cost is prohibitively expensive”. The deferred stories in \`docs/backlog.md\` §4e do carry a reason each.],
  [Success measures. Say how each is measured and what counts as a miss.], [Not changed. “Noticeably longer than one second” and “90% uptime” still have no measurement method in the proposal.],
  [Right size. Section 5 repeated the scope checks; argue why the project is the right size for three people in one semester.], [Not changed. The proposal's section 5 still repeats the scope checks.],
  [Team record and interviews. Add the meeting record, ideas considered and working agreement; rewrite interview questions 2, 3 and 5 as specific past events.], [Partially addressed. The repository README records the three roles (Joshua George — backend and auth; Ben Shuster — frontend; Luke Hill — DevOps and QA). No meeting record or working agreement exists. Five interview questions ask about a specific past event (Q1, Q4, Q6, Q11, Q12 in §2a); questions 2, 3 and 5 remain preference questions and were not rewritten.],
)

= Deliverable 2 — User interviews <d2>
== 2a. Interview questions
#enum([Describe the last time you tried to find an audio clip.], [What is your preferred method (audio, video, game, etc) of consuming content? Why?], [Tell us about some of the most used audio/music/podcast apps and sites you use. Why do you use them?], [What did you do the last time you wanted to share a short audio clip with a friend? Was it a good experience?], [Do you have a preferred length for the content you consume? Why?], [When was the last time you sent an audio / voice clip to a friend?], [What was the contents?], [Why did you choose to send an audio clip?], [Was it an individual or a group chat?], [Do you have any specific types of clips that you prefer?], [Have you sent voice notes or audio clips when using a standard messaging app like IMessage?], [In the past when you have decided not to send an audio clip, why did you not choose to do so?], [Who else should we talk to?])

== 2b. Interviews and participation
Four interviews with real people. Every team member took part in at least one.
#table(columns: (0.8in, 1.9in, 1.1in, 1.3in), [*ID*], [*Interviewee role*], [*Date*], [*Team members*],
  [INT-01], [audio-platform user (role not recorded)], [not recorded], [Ben Shuster],
  [INT-02], [user-research participant], [not recorded in notes], [Ben Shuster],
  [INT-03], [student interviewee], [not recorded], [Joshua George],
  [INT-04], [two participants, A and B], [2026-10-31], [Luke Hill],
)

== 2c. Raw notes and paragraph IDs
Paragraph IDs follow `INT-nn:Pnn`. Full notes are in the repository:
#table(columns: (1in, 3.2in, 0.9in), [*Interview*], [*Path*], [*Paragraphs*],
  [INT-01], [docs/evidence/drive/INT-01-ben-notes.txt], [27],
  [INT-02], [docs/evidence/drive/INT-02-ben-notes.txt], [112 recorded, 99 parsed],
  [INT-03], [docs/evidence/drive/INT-03-joshua-notes.txt], [12],
  [INT-04], [docs/evidence/transcript/interview_transcript.md + INT-04-paragraph-map.md], [69],
)
INT-02 paragraphs P100–P112 did not parse; no evidence entry cites them (risk recorded in the ledger).

== 2d. Compliments and predictions
Nothing on this list is evidence and nothing here is cited by a story or criterion.
#set text(size: 8pt)
#table(columns: (0.5in, 0.5in, 1.1in, 2.6in, 1in), [*ID*], [*Para*], [*Type*], [*Quote*], [*Source*],
  [C-1], [P65], [Compliment], [“Yeah. Interesting.”], [INT-04:P65],
  [PR-1], [P21], [Prediction — counterfactual willingness], [“I would have sent one last week if I knew how, but I sent the whole song.”], [INT-04:P21],
  [PR-2], [P29], [Prediction — conditional willingness], [“Maybe if they were going to sing happy birthday to them.”], [INT-04:P29],
  [PR-3], [P33], [Prediction — willingness, with a stated blocker], [“It wouldn't stop me. What would stop me was I didn't want the person to... I don't know what environment they're in, that other people can hear.”], [INT-04:P33],
  [PR-4], [P55], [Prediction — third-party trend], [“I could see where it would be coming out more now”], [INT-04:P55],
  [PR-5], [P57], [Prediction — stated plan], [“I can hide that in the ceiling or something, or somewhere, and then it would play from my computer on a delay.”], [INT-04:P57],
  [PR-6], [P67], [Prediction — product shape], [“they're all going to be accompanied by an image to find it, I guess, or just text.”], [INT-04:P67],
  [PR-7], [P68], [Prediction — product shape (negative)], [“it would be kind of like a gimmicky version of Spotify.”], [INT-04:P68],
)
#set text(size: 10pt)

== 2e–2f. AI summaries and synthetic users
No AI interview summary was used, and no synthetic-user session was run.

== Most useful finding
The interviews did not show a general appetite for sending audio clips: INT-01 has never sent a voice recording (E-5) and finds receiving one annoying (E-6); INT-02’s attempt to share a Reel failed at the embedding step (E-9); INT-04’s participants described voice notes only when typing is inconvenient. That shaped the cut line: the seven final stories are playback, recording, upload, preview, re-record, link sharing and duration, while titles, listening history and trimming were deferred (`docs/backlog.md` §4e).

= Deliverable 3 — Evidence log
Eighteen E entries, four A entries and three Q entries across four interviews, each with a paragraph source, status and owner. Full table: `docs/evidence/evidence-log.md`.

= Deliverable 4 — Backlog
Ten Connextra stories with evidence traces, INVEST checks, acceptance criteria and a ranked cut line; seven stories are in the final release and three are deferred. Full tables: `docs/backlog.md`.

= Deliverable 5 — Design docs
Two design docs, each with the nine sections: `docs/design/S-1.md` (record, AC-1) and `docs/design/S-7.md` (upload, AC-7). S-7 carries the rule requirement: `SUPPORTED_AUDIO_FORMATS`, `MAX_CLIP_DURATION`, typed rejection errors, and the invariant that every accepted clip has a permitted format and a duration at or below the maximum. S-1’s tests are `test_ac1_record_and_stop_displays_playback`; S-7’s are `test_ac7_valid_audio_upload_displays_playback`.

= Deliverable 6e — Test output <d6e>
Command, from a fresh clone: `cd frontend && npm install && npx playwright install chromium && npm test`. The backend has no tests at this commit (`backend/` does not exist).
```
  -  2 [chromium] › tests/ac-07-upload.spec.ts:26:1 › test_ac7_valid_audio_upload_displays_playback
  ✓  1 [chromium] › tests/ac-01-record.spec.ts:39:1 › test_ac1_record_and_stop_displays_playback (352ms)

  1 skipped
  1 passed (1.1s)
```
The skipped test is AC-7 for S-7, the story not built in this milestone; its reason names AC-7.

= Deliverable 7 — Traceability matrix <d7>
#table(columns: (1.5in, 0.6in, 0.6in, 2.8in), [*Evidence ID*], [*Story*], [*AC*], [*Test name*],
  [E-12, E-13], [S-1], [AC-1], [test\_ac1\_record\_and\_stop\_displays\_playback],
  [E-12, E-18], [S-2], [AC-2], [Not yet written],
  [E-14, E-15], [S-3], [AC-3], [Not yet written],
  [E-14, E-15], [S-4], [AC-4], [Not yet written],
  [E-9, E-10, E-18, A-3], [S-5], [AC-5], [Not yet written],
  [E-3, E-4, E-11], [S-6], [AC-6], [Not yet written],
  [E-8, E-16, A-4], [S-7], [AC-7], [test\_ac7\_valid\_audio\_upload\_displays\_playback],
  [A-2], [S-8], [AC-8], [Not yet written],
  [A-1, E-16, A-4], [S-9], [AC-9], [Not yet written],
  [E-2, A-2], [S-10], [AC-10], [Not yet written],
)
