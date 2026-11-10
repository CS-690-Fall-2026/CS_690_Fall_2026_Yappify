**4. Backlog**

**4a. Stories.** Write at least eight user stories in the Connextra form: "As a \<role>, I want \<capability> so that \<benefit>." Give each an ID (S-1, S-2, and so on). The role comes from your stakeholders, the capability is something a user can observe, and the benefit is backed by evidence.

**4b. Evidence trace.** Every story cites at least one E entry, or is marked Assumption with the A entry it rests on and the clarifying question you would ask a user. A story with neither has been invented. This item is graded all or nothing: one story without a trace scores zero for the item.

**4c. INVEST check.** For every story, mark Independent, Negotiable, Valuable, Estimable, Small, and Testable as pass or fail. Each fail names the specific problem, for example "depends on S-4 being built first," not just the letter.

**4d. Acceptance criteria.** Every story has at least one acceptance criterion in Given-When-Then form, with an ID (AC-1, AC-2, and so on). Given sets concrete starting conditions, When is one event or action, and Then is a result someone can observe from outside the code.

- Internal step (not acceptable): "Then the row is saved to the reminders table."
- Observable (acceptable): "Then the dashboard lists the assignment under Overdue with its due date."

A criterion must not quietly settle a Q entry. If a criterion depends on a value the interviews did not settle, such as a time limit or a price, refer to it by a named setting (for example, REMINDER_LEAD_HOURS) instead of choosing a number.

**4e. Ranking.** Rank the stories and draw a cut line: stories above it will be in your final release, and stories below it will not. Give one sentence for each story above the line saying why it is there.