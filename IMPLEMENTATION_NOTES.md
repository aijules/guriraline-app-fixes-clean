# Guriraline fix notes

This package contains the implementation work for the first review round.

## What was changed

- Fixed the startup flow in `src/App.js` so the app no longer dispatches the same bootstrap requests twice.
- Added a guard around Google Analytics calls in `src/App.js` so routing does not crash when `gtag` is unavailable.
- Wired the existing preloader in `src/App.js` so the loading state is now actually used.
- Replaced the Windows-only build command in `package.json` with a cross-platform `cross-env` command.
- Added `.npmrc` so installation works despite the legacy Material UI peer dependency conflict currently present in the project.
- Moved API and socket endpoints into environment-aware config in `src/server.js` and `.env.example`.
- Updated the socket consumers in `src/components/Shop/DashboardMessages.jsx` and `src/pages/UserInbox.jsx` to use the shared endpoint config and listener cleanup.
- Fixed the seller inbox receiver lookup in `src/components/Shop/DashboardMessages.jsx` by comparing raw member ids correctly.
- Replaced placeholder social preview metadata in `src/pages/EventsPage.jsx`.
- Replaced broken `example.com` category image URLs in `src/static/data.js` with inline SVG placeholders.
- Corrected the sitemap about route and normalized sitemap domains in `public/sitemap.xml`.
- Replaced the default CRA test with a real bootstrap smoke test in `src/App.test.js`.

## Commenting note

Most changed JavaScript/JSX lines include inline comments.

`package.json` cannot contain inline comments because JSON does not support comments, and `public/sitemap.xml` comments were kept minimal to avoid cluttering the sitemap.
