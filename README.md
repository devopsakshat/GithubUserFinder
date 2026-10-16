# GitHub User Finder

This is the GitHub User Finder frontend with a small Express server.

## Run it

1. Open this folder in VS Code.
2. Run `npm.cmd install` in the terminal.
3. Optional: copy `.env.example` to `.env` and add your new GitHub token.
4. Run `npm.cmd start`.
5. Open http://localhost:2000.

Use the local URL above instead of opening `index.html` directly.

## Routes

- `/api/github/search?q=octocat` searches GitHub users.
- `/api/github/users/octocat` gets one user's profile.

The frontend calls these Express routes. Express calls GitHub and sends the response back.

If the PAT you uploaded was real, revoke it in GitHub and create a new one. Keep the new token in `.env`, not in `main.js`. Do not upload `.env` to GitHub.
