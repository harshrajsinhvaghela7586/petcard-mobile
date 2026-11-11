import React, { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Modal, Pressable, StyleSheet, Text as NativeText, View } from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import PrimaryButton from "@/components/Button/PrimaryButton";
import { C, s } from "@/components/SectionHeader";

/*
 * The app's own popup. It replaces Alert.alert everywhere: same call
 * (`appAlert(title, message, buttons)`), but it looks like the rest of the app and every
 * action button uses the PrimaryButton gradient (red gradient for destructive actions).
 */

export type DialogButton = {
    text: string;
    style?: "default" | "cancel" | "destructive";
    onPress?: () => void | Promise<void>;
};
export type DialogOptions = { cancelable?: boolean; onDismiss?: () => void };
type DialogRequest = { id: number; title: string; message?: string; buttons: DialogButton[]; options?: DialogOptions };

let nextId = 1;
let queue: DialogRequest[] = [];
let listener: ((current: DialogRequest | null) => void) | null = null;
const publish = () => listener?.(queue[0] ?? null);

/** Drop-in replacement for Alert.alert. */
export function appAlert(title: string, message?: string, buttons?: DialogButton[], options?: DialogOptions) {
    queue.push({ id: nextId++, title, message, buttons: buttons?.length ? buttons : [{ text: "OK" }], options });
    publish();
}

/** Same, but resolves with true (confirm) or false (cancel / dismissed). */
export function appConfirm(opts: { title: string; message?: string; confirmText?: string; cancelText?: string; destructive?: boolean }): Promise<boolean> {
    return new Promise((resolve) => {
        appAlert(
            opts.title,
            opts.message,
            [
                { text: opts.cancelText ?? "Cancel", style: "cancel", onPress: () => resolve(false) },
                { text: opts.confirmText ?? "Yes", style: opts.destructive ? "destructive" : "default", onPress: () => resolve(true) },
            ],
            { onDismiss: () => resolve(false) }
        );
    });
}

/** Card + backdrop used by the dialogs (and by forms that need their own fields, like delete account). */
export function DialogShell({ visible, onRequestClose, children }: { visible: boolean; onRequestClose: () => void; children: React.ReactNode }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose} statusBarTranslucent>
            <View style={styles.backdrop}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} />
                <View style={styles.card}>{children}</View>
            </View>
        </Modal>
    );
}

export function DialogButtons({ buttons, onPress, busy }: { buttons: DialogButton[]; onPress: (b: DialogButton) => void; busy?: boolean }) {
    const cancel = buttons.find((b) => b.style === "cancel");
    const actions = buttons.filter((b) => b !== cancel);
    return (
        <View style={styles.actions}>
            {actions.map((b, i) => (
                <PrimaryButton
                    key={`${b.text}-${i}`}
                    compact
                    title={b.text}
                    variant={b.style === "destructive" ? "danger" : "primary"}
                    disabled={busy}
                    onPress={() => onPress(b)}
                />
            ))}
            {cancel ? (
                <Pressable style={styles.cancel} disabled={busy} onPress={() => onPress(cancel)}>
                    <Text style={styles.cancelText} maxFontSizeMultiplier={1.1}>{cancel.text}</Text>
                </Pressable>
            ) : null}
        </View>
    );
}

/** Mount once, at the root of the app. */
export function DialogHost() {
    const [current, setCurrent] = useState<DialogRequest | null>(null);
    const currentRef = useRef<DialogRequest | null>(null);
    currentRef.current = current;

    useEffect(() => {
        listener = setCurrent;
        publish();
        return () => { listener = null; };
    }, []);

    const close = useCallback(() => {
        queue.shift();
        publish();
    }, []);

    const press = useCallback((b: DialogButton) => {
        close();
        // Let the dialog close first so a follow-up dialog does not flash over it.
        setTimeout(() => { void b.onPress?.(); }, 0);
    }, [close]);

    const dismiss = useCallback(() => {
        const req = currentRef.current;
        if (!req) return;
        if (req.options?.cancelable === false) return;
        close();
        const cancel = req.buttons.find((b) => b.style === "cancel");
        setTimeout(() => { req.options?.onDismiss?.(); if (!req.options?.onDismiss) void cancel?.onPress?.(); }, 0);
    }, [close]);

    useEffect(() => {
        if (!current) return;
        const sub = BackHandler.addEventListener("hardwareBackPress", () => { dismiss(); return true; });
        return () => sub.remove();
    }, [current, dismiss]);

    return (
        <DialogShell visible={!!current} onRequestClose={dismiss}>
            {current ? (
                <>
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>{current.title}</Text>
                    {current.message ? <NativeText style={styles.message} maxFontSizeMultiplier={1.1}>{current.message}</NativeText> : null}
                    <DialogButtons buttons={current.buttons} onPress={press} />
                </>
            ) : null}
        </DialogShell>
    );
}

export const dialogStyles = {
    title: { fontFamily: "Fredoka_600SemiBold", fontSize: s(20), lineHeight: s(26), color: C.brown, textAlign: "center" as const },
    message: { fontFamily: "Nunito_600SemiBold", fontSize: s(14), lineHeight: s(20), color: C.muted, textAlign: "center" as const, marginTop: s(8) },
};

const styles = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(56,32,24,0.45)", alignItems: "center", justifyContent: "center", paddingHorizontal: s(24) },
    card: {
        width: "100%",
        maxWidth: s(360),
        backgroundColor: C.white,
        borderRadius: s(20),
        borderWidth: 1,
        borderColor: C.peachBorder,
        paddingHorizontal: s(20),
        paddingTop: s(22),
        paddingBottom: s(16),
        shadowColor: C.orange,
        shadowOffset: { width: 0, height: s(6) },
        shadowOpacity: 0.18,
        shadowRadius: s(14),
        elevation: 10,
    },
    title: dialogStyles.title,
    message: dialogStyles.message,
    actions: { marginTop: s(18), gap: s(10) },
    cancel: { height: s(44), alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1.5, borderColor: C.peachBorder, backgroundColor: C.card },
    cancelText: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },
});
