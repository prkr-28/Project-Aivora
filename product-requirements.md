# Product Requirements Document

## Product Overview

**Product:** Aivora

**One-line description:** An AI-powered goal intelligence platform that turns personal ambitions into practical daily plans and helps users stay consistent.

**Product vision:** Make meaningful progress easier to start, measure, understand, and sustain by combining personalized planning, lightweight accountability, and useful reflection in one focused experience.

**Product status:** The current product is a working first version with web-based authentication, AI goal planning, progress tracking, insights, support chat, and PDF reporting.

## Problem

People often know what they want to achieve but struggle to convert a broad ambition into a realistic sequence of daily actions. Existing task lists can record activity without helping users plan the work, understand why progress is slowing, or adapt the plan when circumstances change.

Aivora addresses this by:

- Turning a goal, timeframe, and daily availability into a structured day-by-day roadmap.
- Making progress visible through completion, streak, time, and sentiment signals.
- Providing AI-generated reflections and recommendations based on progress history.
- Allowing users to adapt unfinished plans instead of abandoning them.
- Keeping planning, tracking, reflection, and reporting in one workflow.

## Product Goal

Help an authenticated user move from an unclear intention to a personalized, trackable plan in one session, then support repeated daily progress until the goal is completed or intentionally changed.

The first version should make the following outcome possible:

> A user can create a goal, receive a usable daily roadmap, record progress in under a minute, understand their current momentum, and adjust the remaining plan when needed.

## Target Users

### Primary users

- Students learning a subject or preparing for an exam
- Professionals developing skills or completing a personal project
- Freelancers and creators managing self-directed goals
- People building habits or working toward fitness and lifestyle objectives

### User characteristics

- They have a concrete outcome in mind but may not know how to sequence the work.
- They can commit a bounded amount of time per day.
- They value practical guidance more than complex project-management configuration.
- They need encouragement and visibility into momentum without feeling overwhelmed.

### Initial non-target users

- Teams requiring shared workspaces, roles, approvals, or organization billing
- Users seeking clinical mental-health advice or diagnosis
- Enterprise customers requiring formal compliance, audit, and administration features

## Core Features

### 1. Account authentication

Users can register with a name, email, and password, log in, remain authenticated across sessions, retrieve their current profile, and log out. Passwords are hashed on the backend and API access is protected by JWT authentication.

### 2. AI-generated goal roadmaps

Users provide a goal title, optional description, duration from 1 to 365 days, and available hours per day from 0.5 to 12. Aivora generates a structured daily plan containing a task, focus area, difficulty, estimated hours, and optional rest-day marker.

The plan must be validated before it is saved. If Gemini returns malformed structured output, the system may repair the response for up to three attempts and must show a useful failure state if generation still fails.

### 3. Goal dashboard

Users can view their goals, status, completion percentage, active duration, and aggregate progress. Goals can be opened, updated, or deleted. Deleting a goal also removes its progress entries.

### 4. Daily progress tracking

Users can record whether a planned day was completed, add a comment, and record hours spent. A day can be updated without creating duplicate progress entries. The system updates completed-day counts and marks a goal completed when all required days are complete.

### 5. Progress analytics and sentiment

The product calculates completion rate, completed days, current streak, total hours, and average sentiment. Progress comments receive a local sentiment score from -1 to 1 so the user can compare activity and mood over time.

### 6. Adaptive plan regeneration

Users can request a new plan for unfinished days and optionally provide feedback. Completed days must remain intact, while regenerated days continue with correct day numbering and reflect available progress context.

### 7. AI-generated insights

After progress exists, users can request an analysis containing a summary, mood trend, motivation level, blockers, recommendations, and highlights. Each generated insight is retained so users can review insight history and the latest analysis.

### 8. In-app AI support assistant

Authenticated users can ask questions about Aivora, goals, progress, insights, reports, and general productivity. The assistant receives the current conversation history and returns a concise, actionable response. Chat history is currently session-local and is not persisted.

### 9. PDF progress reports

Users can download a report for a goal containing its overview, progress statistics, recent completed activity, and available insight data. Reports are generated on demand and streamed as PDF downloads rather than stored permanently.

### 10. Accessible visual experience

The web application provides responsive layouts, loading and error states, dark/light/system theme support, charts for insight data, animated transitions, and completion feedback such as confetti. Core actions must remain understandable and usable on desktop and mobile widths.

## User Flows

### New user to first plan

1. User opens Aivora and chooses registration.
2. User enters name, email, and password.
3. Aivora validates the form, creates the account, and signs the user in.
4. User opens the goal creation flow.
5. User enters the goal, optional context, duration, and daily time budget.
6. Aivora displays a generation state while the backend requests and validates the AI plan.
7. On success, the user is taken to the goal detail view with the roadmap.
8. On failure, the user sees an actionable error and can retry without losing the form context.

### Returning user to daily progress

1. User signs in or is restored from a valid persisted token.
2. Dashboard loads the user's goals and progress summaries.
3. User opens a goal and reviews today's planned task.
4. User records completion, optional comment, and hours spent.
5. Aivora updates the goal summary and confirms the saved progress.
6. The interface refreshes progress indicators and celebrates completed work.

### Recovering an off-track plan

1. User opens a goal with incomplete or outdated remaining tasks.
2. User chooses plan regeneration and enters optional feedback.
3. Aivora uses completed days, remaining days, the existing plan, and progress history as AI context.
4. Aivora preserves completed work and replaces only the remaining plan.
5. User reviews the revised roadmap and continues tracking.

### Reviewing insights

1. User opens a goal's insights view.
2. Aivora loads the goal, progress, and stored insight history.
3. If progress exists, the user requests a new analysis.
4. Aivora generates and validates structured insight data.
5. The user reviews the summary, motivation, mood trend, blockers, recommendations, and charts.

### Exporting a report

1. User opens a goal and chooses export.
2. The API verifies goal ownership and gathers the goal, progress, latest insight, and calculated statistics.
3. PDFKit generates the report in memory.
4. The browser downloads the PDF with a goal-specific filename.

## Functional Requirements

### Authentication and authorization

- **FR-1:** The system must allow a user to register with a valid name, email, and password of at least six characters.
- **FR-2:** The system must reject duplicate email registrations and invalid credentials.
- **FR-3:** The system must issue an expiring JWT after successful registration or login.
- **FR-4:** Protected API operations must require a valid Bearer token.
- **FR-5:** Users must only read and modify their own goals, progress, and insights.
- **FR-6:** Expired or invalid sessions must clear the local token and return the user to login.

### Goal management

- **FR-7:** The system must validate goal title, duration, and daily hours before AI generation.
- **FR-8:** The system must save a successful AI plan with its owning user and goal metadata.
- **FR-9:** Users must be able to list goals, filter by status, view one goal, update basic details/status, and delete a goal.
- **FR-10:** Goal deletion must remove associated progress records and must not expose another user's data.
- **FR-11:** Regeneration must preserve completed plan days and replace only the remaining portion.

### Progress and insights

- **FR-12:** The system must allow one progress record per goal/day and must update an existing record instead of creating duplicates.
- **FR-13:** Progress records must support completion, comment, hours spent, timestamp, and sentiment score.
- **FR-14:** The system must recalculate completed days and completion status after progress changes.
- **FR-15:** The system must provide progress records and summary statistics for a goal.
- **FR-16:** The system must reject insight generation when no progress is available.
- **FR-17:** The system must preserve each successful insight generation as historical data.

### Assistant and reports

- **FR-18:** The assistant must reject empty messages and require authentication.
- **FR-19:** The assistant must use a product-focused prompt and return a text response.
- **FR-20:** The report endpoint must verify ownership before generating a PDF.
- **FR-21:** Reports must include goal metadata, progress statistics, recent progress, and the latest available insight.

### Resilience and feedback

- **FR-22:** AI structured responses must be parsed and validated before persistence.
- **FR-23:** AI endpoints must be rate-limited separately from ordinary API traffic.
- **FR-24:** The frontend must expose loading, success, empty, unauthorized, validation, and failure states for major workflows.
- **FR-25:** API failures must return consistent JSON error information where the client can act on it.

## UX Requirements

- **UX-1:** The first meaningful action on the dashboard should be creating or continuing a goal.
- **UX-2:** Goal creation should use a short, understandable wizard and clearly communicate that AI generation may take time.
- **UX-3:** Daily progress logging should require minimal interaction and preserve optional reflection for users who want it.
- **UX-4:** The goal detail view should make the current task, completion state, next action, and remaining plan easy to scan.
- **UX-5:** The product must not present AI output as guaranteed expertise. Users should be able to review and adapt generated plans.
- **UX-6:** Charts and sentiment indicators should supplement written explanations rather than being the only representation of progress.
- **UX-7:** Responsive layouts must support the primary flows on mobile and desktop without overlapping controls or losing essential actions.
- **UX-8:** Destructive actions such as deletion should require clear confirmation.
- **UX-9:** Authentication, token errors, AI failures, and empty insight states must use plain, actionable language.
- **UX-10:** Theme changes, navigation, and loading states should not erase unsaved user input.

## Non-Functional Requirements

### Performance

- **NFR-1:** Ordinary authenticated reads and progress writes should normally respond within 1 second at small-scale production load, excluding network latency.
- **NFR-2:** AI and PDF operations must provide visible progress states because their response time depends on external computation.
- **NFR-3:** Dashboard loading should avoid unnecessary duplicate requests and should remain usable as a user's goal count grows.
- **NFR-4:** The frontend production build must be deployable as a static Vite bundle.

### Security and privacy

- **NFR-5:** Passwords and provider secrets must never be sent to or stored in the browser.
- **NFR-6:** Gemini and database credentials must remain server-side and be supplied through environment variables.
- **NFR-7:** API origins must be restricted through configured CORS values.
- **NFR-8:** Authentication, AI, and general API traffic must have abuse controls appropriate to their cost.
- **NFR-9:** User prompts, comments, progress, and AI outputs must be treated as private user data and protected by ownership checks.
- **NFR-10:** Production logs and client diagnostics must not expose tokens or sensitive user content.

### Reliability and maintainability

- **NFR-11:** AI structured generation must fail visibly and safely after its retry limit rather than saving malformed data.
- **NFR-12:** Database validation and API validation should reject invalid values consistently.
- **NFR-13:** The system should expose a health endpoint for deployment checks.
- **NFR-14:** The product should have automated coverage for authorization, progress transitions, AI validation/retry behavior, and report responses before significant scale-up.

### Platform support

- **NFR-15:** The first release targets modern desktop and mobile browsers.
- **NFR-16:** Local development must support Node.js 18+, npm, a MongoDB instance, and a Gemini API key.
- **NFR-17:** The frontend and backend must support separate deployments through environment-configured API URLs and allowed origins.

## Success Metrics

### Activation

- Registration-to-first-goal completion rate
- Percentage of created goals that receive a generated plan
- Median time from registration to first saved goal
- Percentage of users who return to view their generated plan

### Engagement and progress

- Percentage of active goals with at least one progress entry
- Weekly active users recording progress
- Average completed days per active goal
- Seven-day return rate after goal creation
- Percentage of goals reaching completion or an intentional terminal status

### Feature value

- Percentage of active users generating at least one insight
- Percentage of goals using plan regeneration
- PDF report download rate
- Assistant usage rate and successful response rate
- User-reported helpfulness of plans and insights

### Quality and reliability

- AI generation success rate within three attempts
- API error rate by endpoint
- Unauthorized access rejection rate
- Median and percentile latency for ordinary API, AI, and PDF requests
- Client-side crash-free session rate

Initial baselines should be collected before setting hard targets. Product analytics and error monitoring are future integrations, so these metrics currently require server logs, database queries, or later instrumentation.

## Out of Scope for the First Version

- Team goals, shared plans, comments between users, and organization workspaces
- Payments, subscriptions, invoices, and premium feature gating
- Email verification, password reset, transactional email, and push notifications
- Native iOS or Android applications
- Calendar synchronization and external task-manager integrations
- Automatic background reminders and scheduled jobs
- Persistent chat history, multi-device chat synchronization, or assistant memory beyond submitted history
- User-uploaded files, image analysis, or durable report storage
- Custom AI model training, fine-tuning, or provider failover across Gemini, OpenAI, and Groq
- Clinical mental-health assessment, diagnosis, or treatment recommendations
- Advanced project-management features such as dependencies, team roles, Gantt charts, or resource planning
- Full product analytics, session replay, and hosted error monitoring

## Product Risks and Open Decisions

- AI plans can be plausible but unsuitable for a user's actual context; the product needs clear review and editing affordances as personalization expectations increase.
- Synchronous AI requests can become slow or expensive at scale; queued generation and job status may be required.
- Sentiment scores are approximate signals and should not be treated as objective measures of mental health or motivation.
- Browser local storage is convenient for the current JWT flow but requires careful hardening and may be replaced by a more secure session strategy.
- The PDF download path should use the same configured API base URL as the rest of the client before supporting multiple environments.
- Success metrics need an analytics and monitoring plan before they can be measured consistently in production.# Product Requirements Document

## Product Overview

**Product:** Aivora

**One-line description:** An AI-powered goal planning and progress intelligence platform that turns an ambition into a practical daily roadmap.

**Product vision:** Make meaningful progress easier to start, easier to measure, and easier to sustain by combining personalized planning, lightweight accountability, and useful reflection in one focused workspace.

**Current product shape:** Aivora is a web application with a React frontend, an authenticated REST API, MongoDB persistence, and Google Gemini-powered planning and insight features.

## Problem

People often know what they want to achieve but struggle to translate a broad ambition into a realistic sequence of daily actions. Existing task lists can record activity, but they rarely help users create a plan, adapt it when circumstances change, understand their momentum, or reflect on how they are feeling.

Aivora addresses this gap by:

- Converting a goal, time budget, and duration into a day-by-day plan.
- Making progress easy to record against individual plan days.
- Showing completion, streak, time, and sentiment signals.
- Using progress history to produce recommendations and identify blockers.
- Allowing the remaining plan to be regenerated when the original plan no longer fits.

## Product Goal

Help an authenticated user move from a vague goal to a usable first plan quickly, then provide enough daily feedback and adaptation support for the user to continue until the goal is complete.

### Product outcomes

1. A user can create a personalized roadmap without manually designing every step.
2. A user can understand what to do today and record the result in seconds.
3. A user can see whether effort and completion are trending in the right direction.
4. A user can recover from a stalled or unrealistic plan without losing completed work.
5. A user can export a durable summary of a goal journey.

## Target Users

### Primary users

- Students learning a new subject or preparing for an exam.
- Professionals building skills, completing certifications, or pursuing career goals.
- Creators, founders, and freelancers managing self-directed projects.
- Individuals pursuing fitness, habits, or other multi-day personal goals.

### User characteristics

- Has a concrete outcome in mind but may not know how to sequence the work.
- Can estimate an available number of hours per day.
- Benefits from visible momentum and small, achievable next steps.
- Wants guidance and reflection without needing a project-management system.

### Not the primary audience for v1

- Teams requiring shared goals, roles, approvals, or organization administration.
- Users needing clinical mental-health advice or diagnosis.
- Enterprises requiring SSO, audit exports, or compliance controls.

## Core Features

### 1. Account and authentication

- Register with name, email, and password.
- Log in and receive a JWT-backed session.
- Restore the session on application load.
- Log out and redirect to the login page when the session is removed or rejected.

### 2. AI goal planning

- Capture goal title, optional description, duration from 1 to 365 days, and daily availability from 0.5 to 12 hours.
- Generate a structured daily roadmap through Gemini.
- Present each day with a task, focus area, difficulty, estimated hours, and optional rest-day flag.
- Reject malformed AI output rather than saving an unusable plan. The backend retries structured generation up to three times with validation feedback.

### 3. Goal management

- List the authenticated user's goals, newest first.
- View a goal's plan, status, start date, duration, and completion count.
- Update goal title, description, or status.
- Delete a goal and its associated progress entries.
- Keep user data isolated from other users' goals.

### 4. Daily progress tracking

- Open a progress form for a plan day.
- Mark the day complete or incomplete.
- Add an optional comment and hours spent.
- Update an existing day's entry instead of creating duplicates.
- Calculate completion rate, current streak, average sentiment, and total hours spent.
- Mark a goal completed when completed days reach its duration.

### 5. Adaptive planning

- Allow a user to provide optional feedback when regenerating a plan.
- Generate only the remaining portion of the plan.
- Preserve the completed portion and continue day numbering from the user's current position.
- Prevent regeneration after the goal is already complete.

### 6. AI progress insights

- Generate insights only when progress exists.
- Analyze progress history and sentiment signals.
- Return a summary, mood trend, motivation level, blockers, recommendations, and highlights.
- Save each generation as a historical insight rather than overwriting previous results.
- Display insight history and charts for completion and mood trends.

### 7. In-app support assistant

- Provide an authenticated chat assistant from the application shell.
- Send the current message and in-session conversation history to Gemini.
- Answer questions about goals, progress, insights, reports, and productivity guidance.
- Show loading and recoverable error states when the assistant is unavailable.
- Keep chat history local to the current browser session in v1.

### 8. PDF goal reports

- Generate a report for an owned goal.
- Include goal overview, progress statistics, recent completed progress, and the latest available insight.
- Stream the PDF to the browser as a downloadable file.

### 9. Experience and accessibility basics

- Provide responsive layouts for desktop and mobile browsers.
- Support dark, light, and system theme preferences.
- Show loading, empty, success, and error states for asynchronous workflows.
- Use keyboard-accessible form controls and UI primitives.
- Provide clear confirmation or feedback for completion, regeneration, deletion, and report download actions.

## Key User Flows

### Flow 1: Create an account and first goal

1. User opens the home page and chooses registration.
2. User enters name, email, and password.
3. System validates the input, creates the account, hashes the password, and returns a JWT.
4. User opens the goal creation wizard.
5. User enters the goal, available hours, and duration.
6. System generates and validates a day-by-day plan.
7. User sees the saved plan on the goal detail page.

### Flow 2: Track a daily task

1. User opens a goal from the dashboard.
2. User selects an available plan day. The UI encourages sequential completion by requiring the previous day to be complete before tracking a later day.
3. User records completion, optional comment, and hours spent.
4. System stores or updates the unique progress entry and calculates sentiment for the comment.
5. System updates goal completion counters and status.
6. UI refreshes the plan and displays completion feedback.

### Flow 3: Recover an off-track plan

1. User opens the regenerate-plan action from a goal.
2. User optionally describes what is no longer working.
3. System loads the original plan and progress, then generates a replacement for the remaining days.
4. System validates the new structure and preserves completed days.
5. User reviews the updated plan.

### Flow 4: Review insights

1. User opens the insights view for a goal.
2. UI loads the goal, progress, and existing insight history.
3. User requests a new insight when progress is available.
4. System analyzes progress and sentiment through the AI workflow.
5. UI displays the new insight alongside historical insight results and charts.

### Flow 5: Export a goal report

1. User opens a goal and chooses export.
2. System verifies ownership and loads the goal, progress, and latest insight.
3. Backend calculates report statistics and creates a PDF in memory.
4. Browser downloads the generated report.

## Requirements

### Functional requirements

| ID    | Priority | Requirement                                                               | Acceptance criteria                                                                                                                                      |
| ----- | -------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-01 | Must     | Users can register and log in securely.                                   | Valid credentials create or authenticate an account; invalid credentials return a clear error; passwords are never returned to the client.               |
| FR-02 | Must     | Protected product data is scoped to the authenticated user.               | A user cannot read, update, regenerate, export, or delete another user's goal data.                                                                      |
| FR-03 | Must     | Users can create a goal with bounded planning inputs.                     | Title, duration, and daily hours are validated in the client and API; invalid requests are rejected without creating a goal.                             |
| FR-04 | Must     | The system creates a structured daily plan with AI.                       | A successful response contains valid daily task fields and is persisted with the goal; malformed output is retried or returned as an actionable failure. |
| FR-05 | Must     | Users can record and update daily progress.                               | Each goal/day has at most one progress record; completion, comment, and hours are persisted and visible after refresh.                                   |
| FR-06 | Must     | The system calculates progress statistics.                                | Completion rate, completed days, streak, average sentiment, and total hours are available for a goal.                                                    |
| FR-07 | Must     | Users can adapt an incomplete plan.                                       | Regeneration preserves completed days, renumbers remaining days, and refuses completed goals.                                                            |
| FR-08 | Must     | Users can generate and review AI insights.                                | Progress-backed insight output contains the required summary and recommendation fields and is retained as history.                                       |
| FR-09 | Should   | Users can ask the in-app assistant for product and productivity guidance. | Authenticated messages return a reply or a clear recoverable error; the UI remains usable while a reply is pending.                                      |
| FR-10 | Should   | Users can export a report.                                                | An owned goal produces a readable PDF download with current statistics and available insight data.                                                       |
| FR-11 | Must     | The application handles asynchronous states.                              | Goal creation, data loading, AI generation, chat, and export expose loading and failure states without silently losing user input.                       |

### User experience requirements

- The first goal creation path should be understandable without documentation.
- The next recommended action should be visually obvious on dashboard and goal detail views.
- Goal, progress, and insight pages should preserve context when requests fail and provide a retry or navigation path.
- A user should be able to distinguish planned work, completed work, and remaining work at a glance.
- AI output should be framed as guidance, not guaranteed truth or professional advice.
- Empty states should explain what action unlocks the next useful state, such as logging progress before generating insights.
- Forms should provide inline validation and preserve entered values after recoverable API failures.
- The interface should support keyboard navigation, readable contrast, responsive layouts, and reduced-motion-friendly behavior.

### Performance and reliability requirements

- Initial application loading should show a usable loading state while authentication and route data initialize.
- Normal CRUD requests should return promptly under expected small-scale usage; AI and PDF operations must expose progress indicators because they depend on external or CPU work.
- AI structured generation must stop after a bounded number of attempts.
- Progress updates must be idempotent for the same goal/day from a user perspective.
- Database queries for common goal, progress, and insight views should use the existing ownership and time-based indexes.
- API failures must return structured JSON errors for JSON requests and an appropriate PDF error for report failures.
- Rate limits must protect authentication, general API, and expensive AI endpoints.

### Platform and security requirements

- Frontend runs as a Vite-built browser SPA.
- Backend runs on Node.js and exposes an Express REST API under `/api`.
- MongoDB is the system of record for users, goals, progress, and insights.
- Gemini credentials remain server-side and are supplied through environment configuration.
- Production deployments must use HTTPS, a strong non-default JWT secret, restricted CORS origins, and protected database network access.
- The application must not expose password hashes, API keys, or internal stack traces in production responses.
- The backend must provide a public `/health` endpoint for basic deployment checks.

## Success Metrics

The following metrics define an initial measurement plan. Product analytics are not currently implemented, so these should be added through a privacy-conscious analytics layer before being used as operational dashboards.

### Activation

- Registration-to-first-goal completion rate.
- Percentage of new users who generate a plan within their first session.
- Median time from registration to first saved goal.

### Engagement and progress

- Percentage of active goals with at least one progress entry.
- Weekly active users who log progress.
- Average number of completed plan days per active goal.
- Percentage of goals reaching 25%, 50%, and 100% completion.
- Rate of users returning to a goal within seven days of their previous progress entry.

### Product quality

- Successful AI plan-generation rate, including retry outcomes.
- AI generation failure rate and median generation latency.
- Progress-save failure rate.
- Insight-generation success rate and median latency.
- PDF export success rate.
- Support assistant response error rate.

### User value

- User-reported usefulness of generated plans and insights.
- Percentage of users who regenerate a plan and continue logging progress afterward.
- Support requests or feedback indicating that plans are too generic, unrealistic, or difficult to follow.

## Out of Scope for v1

- Team collaboration, shared goals, comments from other users, and permissions beyond personal ownership.
- Native iOS or Android applications.
- Calendar synchronization, reminders, push notifications, and email campaigns.
- Payments, subscriptions, billing, and premium feature entitlements.
- Social feeds, public profiles, leaderboards, and goal sharing.
- Full project-management features such as dependencies, kanban boards, file attachments, or task assignment.
- Persistent cross-device chat history.
- Automatic plan execution or external actions taken by the AI.
- Medical, therapeutic, or mental-health diagnosis based on sentiment or motivation data.
- Training or fine-tuning a custom AI model.
- Advanced analytics, experimentation infrastructure, and enterprise reporting.

## Future Opportunities

After validating the core loop, potential extensions include reminders, calendar integration, plan templates, richer adaptive scheduling, persistent assistant history, team workspaces, offline support, and background jobs for long-running AI or report generation. These should be prioritized only after activation, retention, completion, and AI reliability data show where users need more support.
