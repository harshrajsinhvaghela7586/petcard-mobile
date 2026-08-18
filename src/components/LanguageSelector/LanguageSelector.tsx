import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    ChevronDown,
    Globe,
} from "lucide-react-native";

export const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "nl", label: "Dutch" },
    { code: "it", label: "Italian" },
];

interface LanguageSelectorProps {
    value: string;
    onChange: (language: string) => void;
}

export default function LanguageSelector({
    value,
    onChange,
}: LanguageSelectorProps) {
    const [open, setOpen] = useState(false);

    const selectedLanguage =
        LANGUAGES.find((item) => item.code === value) ??
        LANGUAGES[0];

    const handleSelect = (code: string) => {
        onChange(code);
        setOpen(false);
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.selector,
                    pressed && styles.pressed,
                ]}
                onPress={() => setOpen((prev) => !prev)}
            >
                <Globe
                    size={20}
                    color="#F28A3D"
                    strokeWidth={2}
                />

                <Text style={styles.selectedText}>
                    {selectedLanguage.label}
                </Text>

                <ChevronDown
                    size={18}
                    color="#6E625B"
                    strokeWidth={2}
                    style={[
                        styles.chevron,
                        open && styles.chevronOpen,
                    ]}
                />
            </Pressable>

            {open && (
                <View style={styles.dropdown}>
                    {LANGUAGES.map((language) => {
                        const isSelected =
                            language.code === value;

                        return (
                            <Pressable
                                key={language.code}
                                style={[
                                    styles.option,
                                    isSelected &&
                                        styles.selectedOption,
                                ]}
                                onPress={() =>
                                    handleSelect(language.code)
                                }
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        isSelected &&
                                            styles.selectedOptionText,
                                    ]}
                                >
                                    {language.label}
                                </Text>

                                {isSelected && (
                                    <Text style={styles.check}>
                                        ✓
                                    </Text>
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        zIndex: 1000,
        alignSelf: "flex-end",
    },

    selector: {
        height: 48,
        minWidth: 170,
        paddingHorizontal: 16,
        borderRadius: 25,

        backgroundColor: "#FFFFFF",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 4,
    },

    pressed: {
        transform: [
            {
                scale: 0.98,
            },
        ],
    },

    selectedText: {
        marginLeft: 9,
        marginRight: 7,

        fontSize: 16,
        fontWeight: "600",
        color: "#2E241F",
    },

    chevron: {
        marginTop: 2,
    },

    chevronOpen: {
        transform: [
            {
                rotate: "180deg",
            },
        ],
    },

    dropdown: {
        position: "absolute",
        top: 54,
        right: 0,

        width: 170,

        backgroundColor: "#FFFFFF",

        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#F0E5DE",

        paddingVertical: 6,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.12,
        shadowRadius: 10,

        elevation: 8,

        zIndex: 2000,
    },

    option: {
        minHeight: 42,
        paddingHorizontal: 15,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    selectedOption: {
        backgroundColor: "#FFF4EC",
    },

    optionText: {
        fontSize: 14,
        color: "#4E4038",
    },

    selectedOptionText: {
        color: "#F16D1D",
        fontWeight: "600",
    },

    check: {
        color: "#F16D1D",
        fontSize: 16,
        fontWeight: "700",
    },
});