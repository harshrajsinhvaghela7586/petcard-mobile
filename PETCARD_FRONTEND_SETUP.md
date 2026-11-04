# PetCard mobile setup

- Install dependencies with `npm install`.
- Set `EXPO_PUBLIC_API_URL` in `.env` to the backend origin without spaces or trailing slash.
- For a physical phone, use the development computer's reachable LAN IPv4 address; both devices must be on the same Wi-Fi.
- Run `npx expo start -c`.

Breed options now load from `GET /api/catalog/breeds?petType=...` and fall back to local choices only when the catalogue request fails.

The frontend source ZIP supplied for this task did not include its root `package.json`, `app.json`, or lockfile. `package.json`, `app.json`, `tsconfig.json`, and `.env.example` were reconstructed from the configuration supplied in chat. Run `npm install` to generate a matching lockfile in your environment.
