import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import ScreenHeader, { C, PawBackground, SIDE, s, useAppFonts } from "@/components/SectionHeader";

const PET_PARENT_SINCE = new Date("2025-05-20");
const daysOfLove = Math.max(
    0,
    Math.floor((Date.now() - PET_PARENT_SINCE.getTime()) / (1000 * 60 * 60 * 24))
);

export default function EditProfileScreen() {
    const [fontsLoaded] = useAppFonts();
    const [editing, setEditing] = useState(false);

    const [name, setName] = useState("Harshrajsinh Vaghela");
    const [phone, setPhone] = useState("+91 12345 67890");
    const [email, setEmail] = useState("harshrajsinhvaghela@gmail.com");
    const [address, setAddress] = useState("Ahmedabad, Gujarat, India");

    if (!fontsLoaded) return null;

    const onRight = () => {
        if (editing) {
            // TODO: API call to save profile
            setEditing(false);
        } else {
            setEditing(true);
        }
    };

    const fields = [
        {
            key: "name",
            label: "Full Name",
            value: name,
            set: setName,
            icon: <MaterialCommunityIcons name="account-circle" size={s(26)} color={C.orange} />,
            keyboard: "default" as const,
        },
        {
            key: "phone",
            label: "Phone Number",
            value: phone,
            set: setPhone,
            icon: <Text style={{ fontSize: s(20) }}>🇮🇳</Text>,
            keyboard: "phone-pad" as const,
        },
        {
            key: "email",
            label: "Email Address",
            value: email,
            set: setEmail,
            icon: <Ionicons name="mail-outline" size={s(24)} color={C.iconMuted} />,
            keyboard: "email-address" as const,
        },
        {
            key: "address",
            label: "Address",
            value: address,
            set: setAddress,
            icon: <Ionicons name="location-outline" size={s(24)} color={C.iconMuted} />,
            keyboard: "default" as const,
        },
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <PawBackground />
            <ScreenHeader
                title="My Profile"
                rightLabel={editing ? "Save" : "Edit"}
                onRightPress={onRight}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: s(40) }}
            >
                {/* AVATAR + SUMMARY */}
                <View style={styles.top}>
                    <View>
                        <View style={styles.avatar}>
                            <Image
                                source={require("../../assets/images/pets/huchiko.png")}
                                resizeMode="contain"
                                style={styles.avatarImg}
                            />
                        </View>
                        <Pressable style={styles.camera}>
                            <Ionicons name="camera" size={s(15)} color={C.brown} />
                        </Pressable>
                    </View>

                    <View style={styles.summary}>
                        <Text style={styles.parentName} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            {name || "Parent Name"}
                        </Text>
                        <View style={styles.summaryRow}>
                            <MaterialCommunityIcons name="paw" size={s(16)} color={C.orange} />
                            <Text style={styles.summaryText} maxFontSizeMultiplier={1.1}>Pet Parent</Text>
                        </View>
                        <Text style={styles.summaryText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            {phone}
                        </Text>
                        <Text style={styles.summaryText} maxFontSizeMultiplier={1.1} numberOfLines={1}>
                            {email}
                        </Text>
                    </View>
                </View>

                {/* PERSONAL INFORMATION */}
                <Text style={styles.sectionTitle} maxFontSizeMultiplier={1.1}>Personal Information</Text>

                {fields.map((f) => (
                    <View key={f.key} style={[styles.field, editing && styles.fieldEditing]}>
                        <View style={styles.fieldIcon}>{f.icon}</View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.fieldLabel} maxFontSizeMultiplier={1.1}>{f.label}</Text>
                            <TextInput
                                value={f.value}
                                onChangeText={f.set}
                                editable={editing}
                                keyboardType={f.keyboard}
                                autoCapitalize={f.key === "email" ? "none" : "words"}
                                maxFontSizeMultiplier={1.1}
                                style={styles.fieldInput}
                                placeholderTextColor={C.muted}
                            />
                        </View>
                        <Ionicons
                            name={editing ? "pencil" : "chevron-forward"}
                            size={s(editing ? 16 : 22)}
                            color={editing ? C.orange : C.brown}
                        />
                    </View>
                ))}

                {/* PET PARENT SINCE */}
                <View style={styles.sinceCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.sinceTitle} maxFontSizeMultiplier={1.1}>Pet Parent Since</Text>
                        <Text style={styles.sinceDate} maxFontSizeMultiplier={1.1}>20 May 2025</Text>
                        <Text style={styles.sinceNote} maxFontSizeMultiplier={1.1}>
                            That's {daysOfLove} days of love & care !
                        </Text>
                    </View>
                    <View style={styles.calendar}>
                        <MaterialCommunityIcons name="calendar-blank-outline" size={s(64)} color={C.brown} />
                        <MaterialCommunityIcons
                            name="paw"
                            size={s(26)}
                            color={C.orange}
                            style={styles.calendarPaw}
                        />
                    </View>
                </View>

                <Pressable style={styles.logoutLink} onPress={() => router.back()}>
                    <Text style={styles.logoutLinkText} maxFontSizeMultiplier={1.1}>
                        {editing ? "Tap Save (top right) when you're done" : "Tap Edit (top right) to change details"}
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF", overflow: "hidden" },

    top: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: SIDE + s(6),
        marginTop: s(6),
        gap: s(16),
    },
    avatar: {
        width: s(128),
        height: s(128),
        borderRadius: s(64),
        backgroundColor: C.peach,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    avatarImg: { width: s(112), height: s(112) },
    camera: {
        position: "absolute",
        right: s(2),
        bottom: s(6),
        width: s(30),
        height: s(30),
        borderRadius: s(15),
        backgroundColor: C.white,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: s(3),
        shadowOffset: { width: 0, height: s(1) },
        elevation: 3,
    },
    summary: { flex: 1, gap: s(4) },
    parentName: { fontFamily: "Fredoka_600SemiBold", fontSize: s(20), color: C.brown },
    summaryRow: { flexDirection: "row", alignItems: "center", gap: s(6) },
    summaryText: { fontFamily: "Nunito_600SemiBold", fontSize: s(14), color: C.brown },

    sectionTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(16),
        color: C.brown,
        marginTop: s(22),
        marginBottom: s(10),
        paddingHorizontal: SIDE + s(6),
    },

    field: {
        flexDirection: "row",
        alignItems: "center",
        gap: s(10),
        marginHorizontal: SIDE,
        marginBottom: s(12),
        paddingVertical: s(10),
        paddingHorizontal: s(10),
        borderRadius: s(12),
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.orange,
    },
    fieldEditing: { backgroundColor: C.white },
    fieldIcon: { width: s(30), alignItems: "center", justifyContent: "center" },
    fieldLabel: { fontFamily: "Nunito_700Bold", fontSize: s(14), color: C.brown },
    fieldInput: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: s(12),
        color: C.brown,
        padding: 0,
        marginTop: s(2),
    },

    sinceCard: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: SIDE,
        marginTop: s(10),
        padding: s(18),
        borderRadius: s(14),
        backgroundColor: C.peach,
        borderWidth: 1,
        borderColor: C.orange,
    },
    sinceTitle: { fontFamily: "Nunito_700Bold", fontSize: s(15), color: C.brown },
    sinceDate: { fontFamily: "Nunito_600SemiBold", fontSize: s(13), color: C.brown, marginTop: s(8) },
    sinceNote: { fontFamily: "Nunito_600SemiBold", fontSize: s(12), color: C.brown, marginTop: s(10) },
    calendar: { width: s(72), height: s(72), alignItems: "center", justifyContent: "center" },
    calendarPaw: { position: "absolute", bottom: s(18) },

    logoutLink: { alignItems: "center", marginTop: s(20) },
    logoutLinkText: { fontFamily: "Nunito_600SemiBold", fontSize: s(11), color: C.muted },
});