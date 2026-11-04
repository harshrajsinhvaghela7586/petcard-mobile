# App-wide language implementation notes

## Changes made in this pass
- Kept the existing language system and supported language codes: English, Hindi, Spanish, French, German, Dutch and Italian.
- Restored the saved language from `expo-secure-store` before marking the language provider ready.
- Validated saved language codes against the supported language list.
- Kept language changes immediate and persisted them asynchronously.
- Removed the `key={lang}` remount of the entire navigation subtree. Changing language must not reset the current route, form values, modal state or in-progress work.
- Kept the existing fixed-string translation layer and its server translation fallback; no UI redesign or route changes were made.
- Disabled the login/signup language selector until the persisted language has been restored, preventing a startup race from overwriting the user's saved selection.

## Important scope / remaining work
This ZIP already contained a global fixed-string translation layer (`src/i18n/autoTranslate.ts`). It translates exact whole-string matches from its local dictionary and can request translations for missing strings from the backend endpoint `/api/me/translate`. This means:
- Text that is present in the local dictionary changes immediately.
- Unmatched text can remain in English until the backend translation endpoint returns a translation.
- If the translation endpoint requires authentication, screens before login may not be able to translate missing strings.
- Backend-provided content, pet/user-entered text, API validation errors, and notification payloads are not guaranteed to be localized by this UI layer.
- This pass does not claim that every visible string on every screen has a reviewed, human-quality translation.

## Validation needed on device
1. Select Hindi on login or signup, close and reopen the app, and verify Hindi is restored.
2. Navigate to home, tasks, know, profile, settings and pet setup; check that labels translate.
3. Switch language while on a form and verify the route and entered values remain intact.
4. Test French and Spanish while signed in and signed out.
5. Verify `/api/me/translate` works for the signed-out flow if you expect all login/signup labels to be translated.

---
## Update: language saved in DB + full-app translation

**How it works now**
- Default is English. When the user picks a language it changes everywhere instantly, is kept on the phone, and is saved to the account (`MobileUser.language`) via `PATCH /api/me/profile`. If saving fails it is remembered and retried at the next launch/login.
- After login the **database value wins**, so the same account shows the same language on every device. (Exception: a language picked on the login/signup screen *before* logging in is applied and saved to the account.)
- `GET /api/translations/:lang` (public) returns every already-translated string for a language in one request. The app loads it when the language changes. Strings not in it fall back to the old per-string `POST /api/translate`, and the fixed dictionary in `autoTranslate.ts`.
- Dates/months/weekdays follow the app language (`appLocale()` + dictionary entries).
- Know guides: the pet name is mapped back to the sample name "Milo" for lookups, so pre-translated guide text works for any pet.
- The AI chat replies in the account language (Dutch and Italian were missing before) and the emergency warning is translated.

**One-time step to get complete translations (needs your GEMINI_API_KEY + MONGODB_URI)**
```
cd frontend && node scripts/extract-ui-strings.cjs     # refreshes backend/data/ui-strings.json (~2000 strings)
cd ../backend && npm run seed:translations             # all 6 languages; or: npm run seed:translations -- hi es
```
Re-run both after adding new screens/text. Without seeding, translation still works but each new sentence is translated on first use (slower, needs Gemini at runtime).

**Fixed in this pass**
- Backend rejected `nl` / `it` as account languages.
- 7 broken Know-section links (Outdoor Safety, Toxic Items x2, Emergency Card x3, Health Records x2, Playtime, Exercise Needs).
- 9 TypeScript errors; stale `careScore` test.
