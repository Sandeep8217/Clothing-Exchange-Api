# Rewear frontend refactor

This archive is based on the supplied App.jsx. `App.jsx` is now a thin entry component. Existing page state, API calls and handlers live in `../rewear-frontend-refactor/src/pages/Marketplace.jsx`; visual sections and modals have been extracted into their own files. Existing API helpers and `useAuth` are included for consistency with the supplied project.

## Apply safely
1. Back up your current `src` folder or commit your current working version to Git.
2. Copy the contents of this archive's `src` folder over your project's `src` folder, merging rather than replacing unrelated files.
3. Keep your existing `main.jsx` and `index.css` if they are already working.
4. Run `npm run dev` and test login, registration, clothing load/add, search/filter, and swap request.

No new navigation/page behavior has been added. The existing page remains the active screen.
