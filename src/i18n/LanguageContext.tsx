import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { LangCode, LANGS, STRINGS, StrKey } from "./strings";
import { installAutoTranslate, setAutoTranslateLang } from "./autoTranslate";
import { petcardApi } from "@/services/petcardApi";
import { tokenStorage } from "@/services/tokenStorage";

// Keep this key stable so users retain their selected language across app updates.
const KEY = "petcard.language.v1";
const DIRTY_KEY = "petcard.language.unsynced.v1";

type Ctx = {
    lang: LangCode;
    ready: boolean;
    setLang: (language: LangCode) => void;
    applyAccountLanguage: (language: string) => void;
    t: (key: StrKey, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

// Install once. The translator only changes fixed UI strings; user-entered content
// (pet names, notes, emails, etc.) is not translated.
installAutoTranslate();

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<LangCode>("en");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let active = true;

        const restoreLanguage = async () => {
            try {
                const saved = await SecureStore.getItemAsync(KEY);
                if (active && saved && LANGS.some((item) => item.code === saved)) {
                    setLangState(saved as LangCode);
                }
            } catch {
                // Secure storage may be unavailable on web or during device recovery.
                // English remains the safe fallback.
            } finally {
                if (active) setReady(true);
            }
        };

        void restoreLanguage();
        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        // Keep the global fixed-string translator in sync with the provider.
        setAutoTranslateLang(lang);
    }, [lang]);

    /* A choice made on login/signup (no account yet) must win over the account value once, and be saved to it. */
    const signedOutChoice = useRef<LangCode | null>(null);

    /* Saves the language to the account (database). If the request fails it is remembered and retried at the next login/launch. */
    const pushToAccount = useCallback(async (value: LangCode) => {
        try {
            await petcardApi.updateProfile({ language: value });
            void SecureStore.deleteItemAsync(DIRTY_KEY).catch(() => {});
        } catch {
            void SecureStore.setItemAsync(DIRTY_KEY, value).catch(() => {});
        }
    }, []);

    /* After login the database value is the source of truth, so the same account shows the same language on every device. */
    const applyAccountLanguage = useCallback(async (value: string) => {
        if (!LANGS.some((item) => item.code === value)) return;
        const accountLang = value as LangCode;

        let dirty: string | null = null;
        try { dirty = await SecureStore.getItemAsync(DIRTY_KEY); } catch {}
        const pending = signedOutChoice.current
            ?? (dirty && LANGS.some((item) => item.code === dirty) ? (dirty as LangCode) : null);
        signedOutChoice.current = null;

        const next = pending ?? accountLang;
        setLangState(next);
        void SecureStore.setItemAsync(KEY, next).catch(() => {});
        if (next !== accountLang) void pushToAccount(next);
        else void SecureStore.deleteItemAsync(DIRTY_KEY).catch(() => {});
    }, [pushToAccount]);

    const setLang = useCallback((next: LangCode) => {
        if (!LANGS.some((item) => item.code === next)) return;
        // Switch instantly everywhere, keep it on the phone, and save it to the account when signed in.
        setLangState(next);
        void SecureStore.setItemAsync(KEY, next).catch(() => {});
        if (tokenStorage.getAccess()) void pushToAccount(next);
        else signedOutChoice.current = next;
    }, [pushToAccount]);

    const t = useCallback((key: StrKey, vars?: Record<string, string | number>) => {
        let value = STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key;
        if (vars) {
            Object.entries(vars).forEach(([name, replacement]) => {
                value = value.replaceAll(`{${name}}`, String(replacement));
            });
        }
        return value;
    }, [lang]);

    const value = useMemo(() => ({ lang, ready, setLang, applyAccountLanguage, t }), [lang, ready, setLang, applyAccountLanguage, t]);

    // Do not key/remount the navigation tree when language changes. Doing so can
    // reset the current route, form state, modals and in-progress user input.
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** Safe outside the provider too (English fallback). */
export function useLang(): Ctx {
    const ctx = useContext(LanguageContext);
    if (ctx) return ctx;

    return {
        lang: "en",
        ready: true,
        setLang: () => {},
        applyAccountLanguage: () => {},
        t: (key, vars) => {
            let value = STRINGS.en[key] ?? key;
            if (vars) {
                Object.entries(vars).forEach(([name, replacement]) => {
                    value = value.replaceAll(`{${name}}`, String(replacement));
                });
            }
            return value;
        },
    };
}
