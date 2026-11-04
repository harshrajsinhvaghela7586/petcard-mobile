# PetCard Google OAuth setup

## Frontend dependencies
Run from the mobile app root:

```powershell
npx expo install expo-auth-session expo-crypto
```

This pins the versions compatible with the Expo SDK in this project. Then run `npm install`.

## Frontend environment variables
Set these in your local `.env` (do not commit it) and in the EAS environment used by the `preview` profile:

```env
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-oauth-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-oauth-client-id.apps.googleusercontent.com
```

Create an Android OAuth client in Google Cloud Console using package name `com.harshrajsinh7419.petcardmobile` and the SHA-1 certificate fingerprint for the signing key used by EAS. Create a Web application OAuth client as well. Use the Web client ID as the server audience.

## Backend environment
Set `GOOGLE_OAUTH_CLIENT_IDS` on the backend deployment to a comma-separated list containing the Web client ID and Android client ID:

```env
GOOGLE_OAUTH_CLIENT_IDS=your-web-client-id.apps.googleusercontent.com,your-android-client-id.apps.googleusercontent.com
```

Install backend dependencies with `npm install`; this adds `google-auth-library`. Deploy the backend after setting the variable.

## Flow
- Login and signup screens both use Google sign-in. A verified Google email creates a PetCard account automatically if it does not exist.
- Existing accounts with the same verified email are linked to Google.
- Google-created accounts are email-verified immediately and receive the same access/refresh token session as password login. Phone number can be added later in profile/setup.
- Apple sign-in UI has been removed from both screens.

## Build
After configuring both client IDs and deploying the backend:

```powershell
npx eas-cli@latest build --platform android --profile preview
```

Do not share Google client secrets, signing keystores, or `.env` files. Client IDs are identifiers, not client secrets.
