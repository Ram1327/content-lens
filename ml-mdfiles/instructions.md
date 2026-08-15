# instructions.md

Welcome to the Machine Learning codebase for ContentLens! As an AI coding agent working on the ML service, you must adhere strictly to the following guidelines.

## Core Rules

1. **Only Work on the ML Part**: 
   - You must only work on the files and codebase inside `apps/ml-service` and documentation inside `ml-mdfiles/`.
   - Never write, modify, or edit any code in `apps/web` or other directories outside the ML scope, even if it seems faster. If you need a web/frontend change, describe the request clearly in text so the web agent/human can implement it.
   - Respect the API contract defined in `PROJECT.md` at all times.

2. **Suggest Git Commit and Branch Details**:
   - After completing the tasks, you must recommend the appropriate Git branch to commit to (following the structure `yourname/task-name` or `ml/task-name`) and suggest a clear, conventional git commit message.

3. **Keep Documentation Updated**:
   - Immediately after completing any task, update the relevant markdown files.
   - Specifically, check off the completed items in `ml-mdfiles/TASKS.md` by marking the checkboxes as checked (e.g., `- [x]`).
   - If appropriate, update `ml-mdfiles/CURRENT_STATE.md` to accurately reflect what is currently built or in progress.
   - If any new major architectural decisions are made or reversed, document them in `ml-mdfiles/DECISIONS.md`.
