import { appAlert } from "@/components/AppDialog";
import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { petcardApi } from "@/services/petcardApi";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { TranslatedText as Text } from "@/i18n/TranslatedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenHeader, {
    C,
    FilterTabs,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";

type Kind = "reminders" | "updates" | "offers";

type Notif = {
    id: string;
    group: string;
    kind: Kind;
    title: string;
    sub: string;
    time: string;
    icon: string;
    color: string;
    tint: string;
    unread: boolean;
    type: string;
    data?: Record<string, any>;
};

/* Notification type -> kis screen pe jaana hai */
const routeFor = (type: string): string | null => {
    if (type.includes("referral") || type.includes("reward")) return "/RewardScreen";
    if (type.includes("achievement")) return "/AchievementScreen";
    if (type === "guardian_request" || type === "contact_access_request") return "/GuardianRequestsScreen";
    if (type === "contact_access_approved") return "/GuardianRequestPreview";
    if (type === "contact_access_rejected") return null;
    if (type.startsWith("guardian")) return "/GuardianScreen";
    if (type.includes("health") || type.includes("vaccin")) return "/HealthRecordScreen";
    if (type.includes("task") || type.includes("reminder")) return "/TasksScreen";
    if (type.includes("level") || type.includes("streak")) return "/LevelScreen";
    return null;
};

const TABS = [
    { key: "all", label: "All" },
    { key: "reminders", label: "Reminders" },
    { key: "updates", label: "Updates" },
    { key: "offers", label: "Offers" },
];

const INITIAL: Notif[] = [];

export default function NotificationsScreen() {
    const [fontsLoaded] = useAppFonts();
    const [tab, setTab] = useState("all");
    const [items, setItems] = useState<Notif[]>(INITIAL);
    const [loading, setLoading] = useState(true);
    useFocusEffect(useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const { notifications } = await petcardApi.notifications({ limit: 50 });
          const mapped = notifications.map((raw: any) => {
            const type = String(raw.type ?? "update");
            const kind: Kind = type.includes("reminder") || type.includes("task") ? "reminders" : type.includes("offer") ? "offers" : "updates";
            const created = raw.createdAt ? new Date(raw.createdAt) : new Date();
            const today = new Date();
            const group = created.toDateString() === today.toDateString() ? "Today" : "Earlier";
            const stylesByKind: Record<Kind, { icon: string; color: string; tint: string }> = {
              reminders: { icon: "bell-ring", color: "#FF7A00", tint: "#FFF0D6" },
              updates: { icon: "check-circle", color: "#3B6FB6", tint: "#E6F0FA" },
              offers: { icon: "tag", color: "#FF4B32", tint: "#FFE5E1" },
            };
            return { id: String(raw.id), group, kind, title: String(raw.title ?? "PetCard update"), sub: String(raw.body ?? ""), time: created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), ...stylesByKind[kind], unread: !raw.read, type, data: raw.data ?? {} } as Notif;
          });
          if (alive) setItems(mapped);
        } catch (error) {
          if (alive) appAlert("Couldn't load notifications", error instanceof Error ? error.message : "Please try again.");
        } finally { if (alive) setLoading(false); }
      })();
      return () => { alive = false; };
    }, []));
    if (!fontsLoaded) return null;

    const markAll = async () => {
      try { await petcardApi.markNotificationsRead("all"); setItems((prev) => prev.map((n) => ({ ...n, unread: false }))); }
      catch (error) { appAlert("Couldn't update notifications", error instanceof Error ? error.message : "Please try again."); }
    };
    /* Tap = read + uske type ke page pe jao (reward -> Rewards, achievement -> Achievements ...) */
    const openNotification = async (n: Notif) => {
      if (n.unread) {
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
        try { await petcardApi.markNotificationsRead([n.id]); }
        catch { setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: true } : x))); }
      }
      const route = routeFor(n.type);
      if (route === "/GuardianRequestPreview") {
        /* approved: open the same pet preview again (needs the QR token), else the scanner */
        if (n.data?.token) router.push({ pathname: route, params: { token: String(n.data.token) } } as any);
        else router.push("/ScanQRScreen" as any);
        return;
      }
      if (route) router.push(route as any);
    };

    const filtered = items.filter((n) => tab === "all" || n.kind === tab);
    const groups = Array.from(new Set(filtered.map((n) => n.group)));

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Notifications" rightLabel="Mark all as read" onRightPress={markAll} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: s(40) }}>
                <View style={{ paddingHorizontal: SIDE, marginTop: s(4) }}>
                    <FilterTabs tabs={TABS} active={tab} onChange={setTab} />
                </View>

                {loading ? <Text style={styles.empty}>Loading notifications…</Text> : null}
                {!loading && groups.length === 0 ? (
                    <Text style={styles.empty} maxFontSizeMultiplier={1.1}>No notifications yet</Text>
                ) : null}

                {groups.map((g) => (
                    <View key={g}>
                        <Text style={styles.groupTitle} maxFontSizeMultiplier={1.1}>{g}</Text>
                        <View style={styles.card}>
                            {filtered
                                .filter((n) => n.group === g)
                                .map((n, i) => (
                                    <Pressable
                                        key={n.id}
                                        onPress={() => openNotification(n)}
                                        style={[styles.row, i > 0 && styles.rowBorder]}
                                    >
                                        <View style={[styles.icon, { backgroundColor: n.tint }]}>
                                            <MaterialCommunityIcons name={n.icon as any} size={s(22)} color={n.color} />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.title} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                                {n.title}
                                            </Text>
                                            <Text style={styles.sub} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                                {n.sub}
                                            </Text>
                                        </View>

                                        <View style={styles.right}>
                                            <Text style={styles.time} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                                {n.time}
                                            </Text>
                                            <View style={[styles.dot, !n.unread && styles.dotRead]} />
                                        </View>
                                    </Pressable>
                                ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    groupTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: C.brown,
        marginTop: s(18),
        marginBottom: s(8),
        paddingHorizontal: SIDE + s(2),
    },
    card: { ...cardStyle, marginHorizontal: SIDE, paddingHorizontal: s(10) },
    row: { flexDirection: "row", alignItems: "center", paddingVertical: s(11), gap: s(10) },
    rowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    icon: {
        width: s(40),
        height: s(40),
        borderRadius: s(20),
        alignItems: "center",
        justifyContent: "center",
    },
    title: { fontFamily: "Nunito_700Bold", fontSize: s(13), color: C.brown },
    sub: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted, marginTop: s(2) },
    right: { flexDirection: "row", alignItems: "center", gap: s(8) },
    time: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted },
    dot: { width: s(9), height: s(9), borderRadius: s(5), backgroundColor: C.orange },
    dotRead: { backgroundColor: "#EADDD5" },
    empty: {
        textAlign: "center",
        marginTop: s(60),
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(14),
        color: C.muted,
    },
});