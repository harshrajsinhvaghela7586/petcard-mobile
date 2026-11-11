import { appAlert } from "@/components/AppDialog";
import { Platform } from "react-native";
import type { RefObject } from "react";
import type { View } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

/**
 * Card (Digital PetID / QR / Emergency) ko image bana kar:
 *  - downloadCard -> system share sheet (user can choose an available save destination)
 *  - printCard    -> system print dialog (PDF/printer)
 */
const snap = (ref: RefObject<View | null>, result: "tmpfile" | "base64") =>
    captureRef(ref, { format: "png", quality: 1, result });

export async function downloadCard(ref: RefObject<View | null>) {
    let uri: string;
    try {
        /* small wait so images / QR are fully drawn before the capture */
        await new Promise((r) => setTimeout(r, 150));
        uri = await snap(ref, "tmpfile");
    } catch {
        appAlert("Download failed", "Could not create the card image. Please try again.");
        return;
    }
    try {
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, {
                mimeType: "image/png",
                dialogTitle: "Save PetCard",
                UTI: "public.png",
            });
            return;
        }
    } catch {
        /* show a clear fallback message below */
    }
    appAlert(
        "Sharing unavailable",
        "Could not open the share menu. Please try again or take a screenshot of the card."
    );
}

export async function printCard(ref: RefObject<View | null>, title: string) {
    try {
        const b64 = await snap(ref, "base64");
        const html = `<html><head><meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>@page{margin:24px}body{margin:0;text-align:center;font-family:sans-serif}
img{max-width:100%;max-height:92vh}</style></head>
<body><img src="data:image/png;base64,${b64}" alt="${title.replace(/[<>"&]/g, "")}"/></body></html>`;
                await Print.printAsync({ html });

    } catch (e) {
        const msg = String((e as Error)?.message ?? "");
        if (!/cancel/i.test(msg) && Platform.OS) appAlert("Print failed", "Could not open the print dialog. Please try again.");
    }
}
