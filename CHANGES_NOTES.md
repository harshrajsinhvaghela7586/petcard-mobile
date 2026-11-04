# Latest changes (merged on top of the Google-OAuth + no-media-library build)

Install once: npx expo install expo-audio expo-notifications expo-clipboard react-native-view-shot expo-sharing expo-print expo-auth-session expo-crypto
Then make a NEW dev/APK build (notification tones + sounds are native assets).
NOTE: this zip has no assets/ folder except assets/sounds. Keep your own assets/images, assets/fonts and copy assets/sounds into your project.

## Language
- Language chosen at login/signup is saved and used everywhere; Settings > App Language changes it.
- src/i18n/autoTranslate.ts: fixed words are translated from a built-in list; every other text (Know pages, tasks, health, etc.) is translated by the SERVER (Gemini, POST /api/me/translate) and cached in MongoDB, so each sentence is translated only once for all users.
- Needs GEMINI_API_KEY on the backend. Without it, only the built-in list is translated.
- Login/signup screens (no token yet) use only the built-in list.

## Other
- Avatar frames: tiered look by level (plain 1-3, two-tone 4-6, premium gradient + glow + crown 7-10).
- Reminder tone picker, whistle sound picker, validation messages, co-guardian restrictions (see earlier notes).
- Google sign-in no longer crashes the login screen if client IDs are missing.

## Know pages (cat / rabbit / breed)
- KnowGuide asks POST /api/me/know-adapt; the server rewrites the page for the pet's species + breed (Gemini, validated, cached in MongoDB collection knowadapteds) and the app shows it. Until it arrives (or if Gemini is off) the built-in text is shown.
- Dog with "Other" breed keeps the built-in dog text. Language translation is applied on top.
- Whistle/tone preview: plays even in silent mode (expo-audio).
