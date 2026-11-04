# Media Library removal

- Removed `expo-media-library` from package.json and package-lock.json.
- Removed its Expo config plugin from app.json.
- `downloadCard` now opens the native share sheet using the already-installed `expo-sharing` package. The user can choose a save destination supported by the device (for example Files or a photos app if offered).
- Image selection continues to use `expo-image-picker`; it does not require `expo-media-library`.

Note: The share sheet does not guarantee direct silent saving into the Gallery. It delegates the destination choice to Android/iOS.
