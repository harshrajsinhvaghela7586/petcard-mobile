import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/Button/PrimaryButton";

const { width, height } = Dimensions.get("window");

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const DESIGN_SCALE = Math.min(
    width / DESIGN_WIDTH,
    height / DESIGN_HEIGHT
);

const DESIGN_LEFT =
    (width - DESIGN_WIDTH * DESIGN_SCALE) / 2;

const DESIGN_TOP =
    (height - DESIGN_HEIGHT * DESIGN_SCALE) / 2;

/*
 * RESPONSIVE HELPER
 *
 * Every fixed size (font, padding, margin, height, radius, gap...)
 * is multiplied by the same scale factor, so the layout looks
 * exactly like the design (393 x 852) on every screen size.
 *
 * - Small phones  -> everything shrinks proportionally
 * - Big phones    -> capped at 1.3 so nothing looks oversized
 */
const SCALE = Math.min(DESIGN_SCALE, 1.3);

const s = (size: number) => size * SCALE;

/*
 * Small screens (e.g. 360 x 640, iPhone SE etc.)
 * Normal phones keep the exact original spacing.
 */
const IS_SMALL_DEVICE = height < 700;

const slides = [
    {
        image: require("../../assets/images/splash1.png"),
        title: "WELCOME TO\nPETCARD",
        description: "Cherish every paw-some \nmoments that last forever",
    },
    {
        image: require("../../assets/images/splash2.png"),
        title: "WELCOME TO\nPETCARD",
        description: "Your pet's life, organized\nAll in one place.",
    },
    {
        image: require("../../assets/images/splash3.png"),
        title: "WELCOME TO\nPETCARD",
        description: "Everything they need,\nfor a happier, healthier life.",
    },
    {
        image: require("../../assets/images/splash4.png"),
        title: "WELCOME TO\nPETCARD",
        description: "Expert tips, guides & articles\nfor every pet parent.",
    },
];

interface OnboardingScreenProps {
    onFinish?: () => void;
}

export default function OnboardingScreen({
    onFinish,
}: OnboardingScreenProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const flatListRef = useRef<FlatList>(null);

    /*
     * Button press animation
     */
    const buttonScale = useRef(new Animated.Value(1)).current;

    /*
     * Slide fade animation
     */
    const contentOpacity = useRef(new Animated.Value(1)).current;

    /*
     * Auto slide
     */
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                if (prev >= slides.length - 1) {
                    return 0;
                }

                return prev + 1;
            });
        }, 1400);

        return () => clearInterval(timer);
    }, []);

    /*
     * Scroll whenever currentIndex changes.
     */
    useEffect(() => {
        flatListRef.current?.scrollToIndex({
            index: currentIndex,
            animated: true,
        });
    }, [currentIndex]);

    /*
     * Small fade animation when slide changes.
     */
    useEffect(() => {
        contentOpacity.setValue(0);

        Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [currentIndex, contentOpacity]);

    const handleScrollEnd = (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => {
        const index = Math.round(
            event.nativeEvent.contentOffset.x / width
        );

        if (
            index >= 0 &&
            index < slides.length &&
            index !== currentIndex
        ) {
            setCurrentIndex(index);
        }
    };

    const handleGetStarted = () => {
        // Small button press animation
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 80,
                useNativeDriver: true,
            }),
        ]).start();
        onFinish?.();
        // Directly open Login

        router.push("/login");

    };

    const handleSkip = () => {
        onFinish?.();
    };


    return (
        <View style={styles.container}>
            {/* TOP LEFT LIGHT PAW */}
            <View
                pointerEvents="none"
                style={[
                    styles.onboardingPaw,
                    styles.pawTopLeft,
                    {
                        transform: [
                            {
                                rotate: "15deg",
                            },
                        ],
                    },
                ]}
            >
                <Image
                    source={require("../../assets/images/paw-white.png")}
                    resizeMode="contain"
                    style={styles.pawImage}
                />

            </View>
            <View
                pointerEvents="none"
                style={[
                    styles.onboardingPaw,
                    styles.pawTopRight,
                    {
                        transform: [
                            {
                                rotate: "-15deg",
                            },
                        ],
                    },
                ]}
            >
                <Image
                    source={require("../../assets/images/paw-white.png")}
                    resizeMode="contain"
                    style={styles.pawImage}
                />
            </View>
            <FlatList
                ref={flatListRef}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                onMomentumScrollEnd={handleScrollEnd}
                renderItem={({ item }) => (
                    <Animated.View
                        style={[
                            styles.slide,
                            {
                                opacity: contentOpacity,
                            },
                        ]}
                    >
                        {/* TOP CONTENT */}
                        <View style={styles.topSection}>
                            <View style={styles.titleContainer}>
                                <Text
                                    style={styles.title}
                                    maxFontSizeMultiplier={1.1}
                                >
                                    {item.title}
                                </Text>
                            </View>

                            <View style={styles.descriptionContainer}>
                                <Text
                                    style={styles.description}
                                    maxFontSizeMultiplier={1.1}
                                >
                                    {item.description}
                                </Text>
                            </View>
                        </View>

                        {/* IMAGE AREA */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={item.image}
                                resizeMode="contain"
                                style={styles.slideImage}
                            />
                        </View>
                    </Animated.View>
                )}
            />

            {/* BOTTOM FIXED AREA */}
            <View style={styles.bottomSection}>
                <Animated.View
                    style={[
                        styles.buttonWrapper,
                        {
                            transform: [
                                {
                                    scale: buttonScale,
                                },
                            ],
                        },
                    ]}
                >
                    <PrimaryButton
                        title="Get Started"
                        onPress={handleGetStarted}
                        style={styles.getStartedButton}
                        icon={
                            <Image
                                source={require("../../assets/images/paw-white.png")}
                                resizeMode="contain"
                                style={styles.buttonPaw}
                            />
                        }
                    />
                </Animated.View>

                <Pressable
                    onPress={handleSkip}
                    style={styles.skipButton}
                >
                    <Text
                        style={styles.skipText}
                        maxFontSizeMultiplier={1.1}
                    >
                        Skip
                    </Text>
                </Pressable>

                {/* DOTS */}
                <View style={styles.dotsContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex &&
                                styles.activeDot,
                            ]}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    slide: {
        width,
        height,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },

    /*
     * FIXED TOP AREA
     *
     * This prevents title/description from moving
     * up/down when image changes.
     */
    topSection: {
        width: "100%",
        height: height * 0.30,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: height * 0.055,
    },

    titleContainer: {
        width: "100%",
        // minHeight (not fixed height) so the title is never clipped
        minHeight: s(92),
        // was "15%" of width (= 59px on 393 wide design)
        marginTop: s(59),
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
    },

    title: {
        fontSize: s(36),
        lineHeight: s(44),
        fontFamily: "Fredoka_600SemiBold",
        color: "#FF7F00",
        textAlign: "center",
        letterSpacing: 0,
    },

    descriptionContainer: {
        width: "88%",
        minHeight: s(75),
        alignItems: "center",
        justifyContent: "center",
        // small devices: extra gap between title and description
        marginTop: IS_SMALL_DEVICE ? s(16) : s(2),
    },

    description: {
        fontSize: s(16),
        fontFamily: "Nunito_700Bold",
        lineHeight: s(19),
        fontWeight: "500",
        color: "#292929",
        textAlign: "center",
    },

    /*
     * FIXED IMAGE AREA
     *
     * Every image gets exactly the same container.
     * Therefore slide change will not push the
     * button/text up or down.
     */
    imageContainer: {
        width: "100%",
        height: height * 0.55,
        alignItems: "center",
        justifyContent: "center",
        marginTop: s(5),
    },

    slideImage: {
        width: width * 0.88,
        height: height * 0.38,
    },
    buttonPaw: {
        position: "absolute",


        top: "-35%",

        width: s(40),
        height: s(40),

        marginTop: s(-11.5),
        marginLeft: s(20),

        zIndex: 10,
    },
    /*
     * FIXED BOTTOM AREA
     */
    bottomSection: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,

        height: height * 0.22,

        alignItems: "center",
        justifyContent: "flex-start",

        paddingTop: s(8),
    },

    buttonWrapper: {
        width: "88%",
    },

    getStartedButton: {
        width: "100%",
        minHeight: s(50),

        backgroundColor: "#FF7A00",
        borderRadius: s(10),

        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#FF7A00",
        shadowOffset: {
            width: 0,
            height: s(14),
        },
        shadowOpacity: 0.20,
        shadowRadius: s(15),

        elevation: 5,
    },

    getStartedButtonPressed: {
        transform: [{ translateY: s(2) }],
    },

    getStartedText: {
        color: "#FFFFFF",
        fontSize: s(16),
        fontWeight: "800",
    },
    skipButton: {
        marginTop: s(8),
        marginBottom: s(20),
        paddingVertical: s(3),
        paddingHorizontal: s(20),
    },

    skipText: {
        color: "#222222",
        fontSize: s(13),
        fontWeight: "500",
    },

    dotsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: s(8),
        gap: s(5),
    },

    dot: {
        width: s(5),
        height: s(5),
        borderRadius: s(3),
        backgroundColor: "#FFDCC2",
    },

    activeDot: {
        width: s(6),
        height: s(6),
        borderRadius: s(3),
        backgroundColor: "#FF6B00",
    },
    onboardingPaw: {
        position: "absolute",
        width: 107 * DESIGN_SCALE,
        height: 106 * DESIGN_SCALE,
        zIndex: 20,
    },

    pawImage: {
        width: "100%",
        height: "100%",
    },

    /*
     * EXACT SAME POSITION AS SPLASH SCREEN
     */

    pawTopLeft: {
        top:
            DESIGN_TOP +
            30 * DESIGN_SCALE,

        left:
            DESIGN_LEFT +
            20 * DESIGN_SCALE,
    },

    pawTopRight: {
        top:
            DESIGN_TOP +
            157 * DESIGN_SCALE,

        left:
            DESIGN_LEFT +
            293 * DESIGN_SCALE,
    },
});