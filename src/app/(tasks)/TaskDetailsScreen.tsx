import PrimaryButton from "@/components/Button/PrimaryButton";
import ScreenHeader, {
    C,
    PawBackground,
    SIDE,
    cardStyle,
    s,
    useAppFonts,
} from "@/components/SectionHeader";
import { getTask } from "@/constants/tasks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import BottomNav, { useNavHeight } from "../../components/BottomNav";

export default function TaskDetailsScreen() {
    const NAV_HEIGHT = useNavHeight();
    const { task } = useLocalSearchParams<{ task?: string }>();
    const [fontsLoaded] = useAppFonts();
    if (!fontsLoaded) return null;

    const t = getTask(task);

    const rows = [
        { key: "date", label: "Date", value: t.date, icon: "calendar-blank-outline" },
        { key: "time", label: "Time", value: t.time, icon: "clock-outline" },
        { key: "repeat", label: "Repeat", value: t.repeat, icon: "repeat" },
        { key: "reminder", label: "Reminder", value: t.reminder, icon: "bell-outline" },
        { key: "reward", label: "Reward", value: `${t.xp} XP`, icon: "star" },
    ];

    const complete = () => {
        // TODO: API call to mark task complete
        router.replace({ pathname: "/TaskCompleteScreen", params: { task: t.key } } as any);
    };

    return (
        <View style={styles.container}>
            <PawBackground />
            <ScreenHeader title="Task Details" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: NAV_HEIGHT + s(24) }}
            >
                {/* HERO */}
                <View style={styles.hero}>
                    <View style={styles.heroCircle}>
                        <Image
                            source={require("../../../assets/images/tasks/image.png")}
                            resizeMode="contain"
                            style={styles.heroImg}
                        />
                    </View>
                </View>

                <View style={styles.titleRow}>
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>{t.title}</Text>
                    <MaterialCommunityIcons name="paw" size={s(18)} color={C.orange} />
                </View>
                <Text style={styles.desc} maxFontSizeMultiplier={1.1}>{t.description}</Text>

                {/* INFO */}
                <View style={styles.infoCard}>
                    {rows.map((r, i) => (
                        <View key={r.key} style={[styles.infoRow, i > 0 && styles.infoBorder]}>
                            <MaterialCommunityIcons
                                name={r.icon as any}
                                size={s(22)}
                                color={r.key === "reward" ? "#F5B400" : C.iconMuted}
                            />
                            <Text style={styles.infoLabel} maxFontSizeMultiplier={1.1}>{r.label}</Text>
                            <Text style={styles.infoValue} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                                {r.value}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* ACTIONS */}
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title="Mark as Complete"
                        onPress={complete}
                        icon={
                            <Image
                                source={require("../../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>

                <Pressable style={styles.skip} onPress={() => router.back()} hitSlop={10}>
                    <Text style={styles.skipText} maxFontSizeMultiplier={1.1}>Skip / Reschedule</Text>
                </Pressable>
            </ScrollView>

            <BottomNav active="tasks" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    hero: { alignItems: "center", marginTop: s(4) },
    heroCircle: {
        width: s(170),
        height: s(170),
        borderRadius: s(85),
        backgroundColor: "#FFEBD9",
        alignItems: "center",
        justifyContent: "center",
    },
    heroImg: { width: s(120), height: s(120) },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: s(6),
        marginTop: s(14),
    },
    title: { fontFamily: "Nunito_700Bold", fontSize: s(22), color: C.brown },
    desc: {
        textAlign: "center",
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(13),
        lineHeight: s(19),
        color: C.brown,
        marginTop: s(6),
        paddingHorizontal: SIDE,
    },

    infoCard: { ...cardStyle, marginHorizontal: SIDE, marginTop: s(18), paddingHorizontal: s(14) },
    infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: s(14), gap: s(12) },
    infoBorder: { borderTopWidth: 1, borderTopColor: C.divider },
    infoLabel: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    infoValue: { fontFamily: "Nunito_600SemiBold", fontSize: s(13), color: C.brown },

    /* PrimaryButton wrapper + paw: same as PetTypeScreen */
    buttonWrapper: {
        width: "92%",
        maxWidth: 380,
        position: "relative",
        alignSelf: "center",
        marginTop: s(34),
    },
    buttonPaw: {
        position: "absolute",
        top: "-30%",
        width: s(40),
        height: s(40),
        marginTop: s(-11.5),
        marginLeft: s(20),
        zIndex: 10,
    },
    skip: { alignItems: "center", marginTop: s(16) },
    skipText: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.orange },
});