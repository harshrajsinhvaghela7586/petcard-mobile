import React, { useState } from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Fredoka_600SemiBold } from "@expo-google-fonts/fredoka";
import { Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";

import PrimaryButton from "@/components/Button/PrimaryButton";

const { width, height } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const SCALE = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
const UI_SCALE = Math.min(SCALE, 1.3);
const s = (size: number) => size * UI_SCALE;

/* =========================================================
   DATA
========================================================= */

type TaskItem = {
    id: string;
    title: string;
    subtitle: string;
    emoji: string;
};

const POPULAR_TASKS: TaskItem[] = [
    { id: "meal", title: "Morning Meal", subtitle: "08:00 AM", emoji: "🥣" },
    { id: "walk", title: "Evening Walk", subtitle: "06:00 PM", emoji: "🦮" },
    { id: "play", title: "Playtime / Exercise", subtitle: "04:00 PM", emoji: "🎾" },
    { id: "groom", title: "Brush / Grooming", subtitle: "Every Sunday", emoji: "🪮" },
    { id: "treat", title: "Give Treat", subtitle: "Anytime", emoji: "🦴" },
];

/* Custom task ke liye icon choices */
const EMOJI_OPTIONS = ["⭐", "🐾", "🛁", "💊", "🧸", "🚿", "🩺", "🥛"];

export default function FirstDailyTaskScreen() {
    const [fontsLoaded] = useFonts({
        Fredoka_600SemiBold,
        Nunito_700Bold,
    });

    const [tasks, setTasks] = useState<TaskItem[]>(POPULAR_TASKS);
    const [selected, setSelected] = useState<string[]>([]);

    /* custom task modal */
    const [modalVisible, setModalVisible] = useState(false);
    const [customName, setCustomName] = useState("");
    const [customTime, setCustomTime] = useState("");
    const [customEmoji, setCustomEmoji] = useState(EMOJI_OPTIONS[0]);

    if (!fontsLoaded) return null;

    const closeModal = () => {
        setModalVisible(false);
        setCustomName("");
        setCustomTime("");
        setCustomEmoji(EMOJI_OPTIONS[0]);
    };

    const handleAddCustomTask = () => {
        const name = customName.trim();
        if (!name) return;

        const newTask: TaskItem = {
            id: `custom-${Date.now()}`,
            title: name,
            subtitle: customTime.trim() || "Anytime",
            emoji: customEmoji,
        };

        setTasks((prev) => [...prev, newTask]);
        setSelected((prev) => [...prev, newTask.id]); // auto-select
        closeModal();
    };

    const toggleTask = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleContinue = () => {
        const chosen = tasks.filter((t) => selected.includes(t.id));
        console.log("Selected tasks:", chosen);
        router.push("/GeneratingPetIdScreen");
    };

    const handleSkip = () => {
        router.push("/GeneratingPetIdScreen");
    };

    const handleCustomTask = () => {
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
            {/* BACKGROUND PAWS */}
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopLeft]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawTopRight]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomLeft]}
            />
            <Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[styles.backgroundPaw, styles.pawBottomRight]}
            />

            {/* CONTENT */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} maxFontSizeMultiplier={1.1}>
                        Add your First Daily Task!
                    </Text>
                    <Text style={styles.subtitle} maxFontSizeMultiplier={1.1}>
                        Small steps, happy pets!{"\n"}Let&apos;s create your first
                        task for today.
                    </Text>
                </View>

                <ScrollView
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.popularCard}>
                        <Text style={styles.popularTitle} maxFontSizeMultiplier={1.1}>
                            Popular Tasks to Get Started
                        </Text>

                        <View style={styles.taskList}>
                            {tasks.map((item) => {
                                const isSelected = selected.includes(item.id);
                                return (
                                    <View key={item.id} style={styles.taskRow}>
                                        <View style={styles.iconBox}>
                                            <Text style={styles.iconEmoji}>{item.emoji}</Text>
                                        </View>

                                        <View style={styles.taskTextWrapper}>
                                            <Text
                                                style={styles.taskTitle}
                                                numberOfLines={1}
                                                maxFontSizeMultiplier={1.1}
                                            >
                                                {item.title}
                                            </Text>
                                            <Text
                                                style={styles.taskSubtitle}
                                                numberOfLines={1}
                                                maxFontSizeMultiplier={1.1}
                                            >
                                                {item.subtitle}
                                            </Text>
                                        </View>

                                        <Pressable
                                            onPress={() => toggleTask(item.id)}
                                            hitSlop={s(8)}
                                            accessibilityRole="button"
                                            accessibilityLabel={`${isSelected ? "Remove" : "Add"} ${item.title}`}
                                            style={[
                                                styles.addButton,
                                                isSelected && styles.addButtonSelected,
                                            ]}
                                        >
                                            <Ionicons
                                                name={isSelected ? "checkmark" : "add"}
                                                size={s(18)}
                                                color={isSelected ? "#FFFFFF" : "#FF7A00"}
                                            />
                                        </Pressable>
                                    </View>
                                );
                            })}
                        </View>

                        <Pressable
                            onPress={handleCustomTask}
                            accessibilityRole="button"
                            style={styles.customButton}
                        >
                            <Ionicons name="add" size={s(16)} color="#FF7A00" />
                            <Text style={styles.customText} maxFontSizeMultiplier={1.1}>
                                Create Custom Task
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>

            {/* BOTTOM ACTIONS */}
            <View style={styles.bottomSection}>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton
                        title="Continue"
                        onPress={handleContinue}
                        icon={
                            <Image
                                source={require("../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </View>

                <Pressable onPress={handleSkip} style={styles.skipButton}>
                    <Text style={styles.skipText} maxFontSizeMultiplier={1.1}>
                        Skip for now
                    </Text>
                </Pressable>
            </View>

            {/* CUSTOM TASK MODAL */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <KeyboardAvoidingView
                    style={styles.modalKeyboard}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <Pressable style={styles.modalBackdrop} onPress={closeModal}>
                        <Pressable style={styles.modalCard} onPress={() => {}}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle} maxFontSizeMultiplier={1.1}>
                                    Create Custom Task
                                </Text>
                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel="Close"
                                    onPress={closeModal}
                                    hitSlop={10}
                                >
                                    <Ionicons name="close" size={s(22)} color="#381B0E" />
                                </Pressable>
                            </View>

                            <Text style={styles.inputLabel} maxFontSizeMultiplier={1.1}>
                                Task Name
                            </Text>
                            <TextInput
                                value={customName}
                                onChangeText={setCustomName}
                                placeholder="Eg. Give vitamins"
                                placeholderTextColor="#A69A91"
                                maxLength={30}
                                maxFontSizeMultiplier={1.1}
                                style={styles.textInput}
                            />

                            <Text style={styles.inputLabel} maxFontSizeMultiplier={1.1}>
                                Time (optional)
                            </Text>
                            <TextInput
                                value={customTime}
                                onChangeText={setCustomTime}
                                placeholder="Eg. 07:30 AM"
                                placeholderTextColor="#A69A91"
                                maxLength={20}
                                maxFontSizeMultiplier={1.1}
                                style={styles.textInput}
                            />

                            <Text style={styles.inputLabel} maxFontSizeMultiplier={1.1}>
                                Icon
                            </Text>
                            <View style={styles.emojiRow}>
                                {EMOJI_OPTIONS.map((emoji) => (
                                    <Pressable
                                        key={emoji}
                                        onPress={() => setCustomEmoji(emoji)}
                                        style={[
                                            styles.emojiOption,
                                            customEmoji === emoji && styles.emojiOptionSelected,
                                        ]}
                                    >
                                        <Text style={styles.emojiOptionText}>{emoji}</Text>
                                    </Pressable>
                                ))}
                            </View>

                            {/* SUBMIT - same gradient PrimaryButton */}
                            <PrimaryButton
                                title="Add Task"
                                onPress={handleAddCustomTask}
                                disabled={!customName.trim()}
                                style={styles.submitButton}
                            />
                        </Pressable>
                    </Pressable>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    content: {
        flex: 1,
        paddingTop: height * 0.112,
    },

    /* HEADER (identical on all screens) */
    header: {
        alignItems: "center",
        paddingHorizontal: s(5),
    },

    title: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(32),
        lineHeight: s(36),
        color: "#FF7F00",
        textAlign: "center",
        letterSpacing: 0,
    },

    subtitle: {
        marginTop: s(2),
        fontFamily: "Nunito_700Bold",
        fontSize: s(20),
        lineHeight: s(28),
        color: "#381B0E",
        textAlign: "center",
    },

    /* LIST */
    list: {
        flex: 1,
        marginTop: s(18),
    },

    listContent: {
        paddingHorizontal: s(16),
        paddingBottom: s(130),
    },

    popularCard: {
        borderWidth: 1,
        borderColor: "#FF7F00",
        borderRadius: s(14),
        backgroundColor: "#FFFCF9",
        paddingHorizontal: s(12),
        paddingTop: s(14),
        paddingBottom: s(14),
    },

    popularTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        lineHeight: s(19),
        color: "#381B0E",
        marginBottom: s(10),
    },

    taskList: {
        gap: s(9),
    },

    taskRow: {
        minHeight: s(58),
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FFE0C4",
        borderRadius: s(11),
        backgroundColor: "#FFFAF4",
        paddingHorizontal: s(12),
        paddingVertical: s(7),
    },

    iconBox: {
        width: s(38),
        height: s(38),
        alignItems: "center",
        justifyContent: "center",
    },

    iconEmoji: {
        fontSize: s(26),
    },

    taskTextWrapper: {
        flex: 1,
        marginLeft: s(12),
        justifyContent: "center",
    },

    taskTitle: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        lineHeight: s(19),
        color: "#381B0E",
    },

    taskSubtitle: {
        marginTop: s(1),
        fontFamily: "Nunito_700Bold",
        fontSize: s(12),
        lineHeight: s(16),
        color: "#6B554A",
    },

    addButton: {
        width: s(26),
        height: s(26),
        borderRadius: s(13),
        borderWidth: 1.5,
        borderColor: "#FF7A00",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },

    addButtonSelected: {
        backgroundColor: "#FF7A00",
    },

    customButton: {
        marginTop: s(12),
        height: s(44),
        borderRadius: s(11),
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: "#FF7A00",
        backgroundColor: "#FFF3E6",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: s(6),
    },

    customText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: "#FF7A00",
    },

    /* CUSTOM TASK MODAL */
    modalKeyboard: {
        flex: 1,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(25, 15, 10, 0.32)",
        justifyContent: "center",
        paddingHorizontal: s(25),
    },

    modalCard: {
        borderRadius: s(16),
        padding: s(18),
        backgroundColor: "#FFFCF9",
        borderWidth: 1,
        borderColor: "#FFDCC0",
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: s(12),
    },

    modalTitle: {
        fontFamily: "Fredoka_600SemiBold",
        fontSize: s(22),
        color: "#FF7F00",
    },

    inputLabel: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: "#381B0E",
        marginBottom: s(6),
        marginTop: s(8),
    },

    textInput: {
        height: s(44),
        borderWidth: 1,
        borderColor: "#FFDCC0",
        borderRadius: s(10),
        paddingHorizontal: s(12),
        backgroundColor: "#FFFFFF",
        fontFamily: "Nunito_700Bold",
        fontSize: s(14),
        color: "#381B0E",
    },

    emojiRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: s(8),
    },

    emojiOption: {
        width: s(40),
        height: s(40),
        borderRadius: s(10),
        borderWidth: 1,
        borderColor: "#FFDCC0",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    emojiOptionSelected: {
        borderColor: "#FF7A00",
        borderWidth: 1.5,
        backgroundColor: "#FFE0C4",
    },

    emojiOptionText: {
        fontSize: s(22),
    },

    submitButton: {
        marginTop: s(20),
        height: s(50),
        borderRadius: s(15),
    },

    /* BACKGROUND PAWS */
    backgroundPaw: {
        position: "absolute",
        width: 72 * SCALE,
        height: 72 * SCALE,
        opacity: 0.075,
        zIndex: 0,
    },

    pawTopLeft: {
        top: 40 * SCALE,
        left: 24 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    pawTopRight: {
        top: 160 * SCALE,
        right: 17 * SCALE,
        transform: [{ rotate: "15deg" }],
    },

    pawBottomLeft: {
        bottom: 105 * SCALE,
        left: 16 * SCALE,
        transform: [{ rotate: "12deg" }],
    },

    pawBottomRight: {
        bottom: 20 * SCALE,
        right: 20 * SCALE,
        transform: [{ rotate: "-12deg" }],
    },

    /* BOTTOM ACTIONS (identical on all screens) */
    bottomSection: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: width * 0.02,
        paddingTop: s(10),
        paddingBottom: height * 0.014,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        zIndex: 20,
    },

    buttonWrapper: {
        width: "96%",
        maxWidth: 380,
        position: "relative",
        alignSelf: "center",
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

    skipButton: {
        height: s(34),
        alignItems: "center",
        justifyContent: "center",
        marginTop: s(1),
    },

    skipText: {
        fontFamily: "Nunito_700Bold",
        fontSize: s(13),
        lineHeight: s(18),
        fontWeight: "900",
        color: "#8B6D5C",
        textAlign: "center",
    },
});