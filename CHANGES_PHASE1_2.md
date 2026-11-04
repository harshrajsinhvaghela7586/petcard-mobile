# Frontend changes (Phase 1 + 2)

## Install first
npx expo install expo-clipboard react-native-view-shot expo-media-library expo-sharing expo-print expo-notifications

## Backend contracts the frontend now expects
- GET/POST/DELETE /api/pets/:petId/tracker[/:kind[/:id]]  (food, water, activity, clicks, whistles). Works offline-local until ready.
- PATCH /api/pets/:petId/guardians/:userId { permissions }
- POST  /api/pets/:petId/ai/chat { message, history } -> { reply }   (Gemini key stays on server; answer only about this pet)
- POST /api/pets/:petId/tasks accepts reminder: { enabled, minutesBefore }
- POST /api/mobile-auth/signup and PATCH /api/me/profile accept `country` (ISO) next to `phone` (+dialcode digits)
- Referral reward for referrer: 200 PawPoints
