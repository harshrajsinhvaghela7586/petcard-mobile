import React, { useEffect } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
    TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

const AnimatedGradient =
    Animated.createAnimatedComponent(LinearGradient);

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;

    // Optional icon
    icon?: React.ReactNode;
}

const PrimaryButton = ({
    title,
    onPress,
    style,
    textStyle,
    disabled = false,
    icon,
}: PrimaryButtonProps) => {
    const gradientX = useSharedValue(0);

    useEffect(() => {
        gradientX.value = withRepeat(
            withTiming(-140, {
                duration: 6000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, []);

    const animatedGradientStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: gradientX.value,
                },
            ],
        };
    });

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                style,
                pressed && styles.pressed,
                disabled && styles.disabled,
            ]}
        >
            <AnimatedGradient
                colors={[
                    "#ff7a00",
                    "#ff9b2f",
                    "#ff8400",
                    "#ffb347",
                    "#ff7a00",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.gradient,
                    animatedGradientStyle,
                ]}
            />

            <View style={styles.content}>
                <Text style={[styles.text, textStyle]}>
                    {title}
                </Text>

                {icon && (
                    <View style={styles.iconContainer}>
                        {icon}
                    </View>
                )}
            </View>
        </Pressable>
    );
};

export default PrimaryButton;

const styles = StyleSheet.create({
    button: {
        height: 52,
        borderRadius: 14,
        overflow: "hidden",

        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#ff7a00",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 14,

        elevation: 6,
    },

    gradient: {
        position: "absolute",

        width: "260%",
        height: "260%",

        left: "-80%",
        top: "-80%",

        borderRadius: 14,
    },

    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    text: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },

    iconContainer: {
        marginLeft: 7,
        alignItems: "center",
        justifyContent: "center",
    },

    pressed: {
        transform: [
            {
                translateY: 2,
            },
        ],
        opacity: 0.92,
    },

    disabled: {
        opacity: 0.5,
    },
});