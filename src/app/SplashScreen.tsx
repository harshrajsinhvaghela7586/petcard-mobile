import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

/* =========================================================
   FIGMA DESIGN FRAME
   ========================================================= */

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

interface SplashScreenProps {
    onFinish?: () => void;
}

type PawIndex = -1 | 0 | 1 | 2 | 3;

/* =========================================================
   PAW COMPONENT
   ========================================================= */

interface PawProps {
    style: any;
    active: boolean;
    visible: boolean;
    rotation: string;
}

function Paw({
    style,
    active,
    visible,
    rotation,
}: PawProps) {
    const orangeOpacity = useRef(
        new Animated.Value(active ? 1 : 0)
    ).current;

    useEffect(() => {
        Animated.timing(orangeOpacity, {
            toValue: active ? 1 : 0,
            duration: 160,
            useNativeDriver: true,
        }).start();

        return () => {
            orangeOpacity.stopAnimation();
        };
    }, [active, orangeOpacity]);

    return (
        <View
            pointerEvents="none"
            style={[
                styles.paw,
                style,
                {
                    opacity: visible ? 1 : 0,
                    transform: [
                        {
                            rotate: rotation,
                        },
                    ],
                },
            ]}
        >
            {/* LIGHT PAW */}
            <Image
                source={require("../../assets/images/paw-white.png")}
                resizeMode="contain"
                style={styles.whitePaw}
            />

            {/* ORANGE PAW */}
            <Animated.Image
                source={require("../../assets/images/paw.png")}
                resizeMode="contain"
                style={[
                    styles.orangePaw,
                    {
                        opacity: orangeOpacity,
                    },
                ]}
            />
        </View>
    );
}

/* =========================================================
   SPLASH SCREEN
   ========================================================= */

export default function SplashScreen({
    onFinish,
}: SplashScreenProps) {
    /* =====================================================
       DOG / ICON
       ===================================================== */

    const dogOpacity = useRef(
        new Animated.Value(0)
    ).current;

    /*
     * Start slightly enlarged.
     */
    const dogScale = useRef(
        new Animated.Value(1.15)
    ).current;

    /*
     * ONLY controls vertical movement.
     *
     * 0    = initial position
     * -45  = final moved-up position
     *
     * IMPORTANT:
     * Once it reaches -45, it stays at -45.
     * Shrinking will NOT modify this value.
     */
    const dogY = useRef(
        new Animated.Value(0)
    ).current;

    /* =====================================================
       PETCARD + TAGLINE
       ===================================================== */

    /*
     * Completely hidden during Frame 1.
     */
    const textOpacity = useRef(
        new Animated.Value(0)
    ).current;

    /*
     * Text starts BEHIND the icon.
     *
     * Frame 1:
     *   PETCARD is completely hidden because it is
     *   physically underneath the icon.
     *
     * Frame 1 -> Frame 2:
     *   Icon moves UP.
     *   Text moves DOWN from behind the icon
     *   into its final position.
     *
     * This is important: text must NOT start below
     * the icon, otherwise PETCARD becomes visible
     * immediately instead of being revealed from behind.
     */
    const textY = useRef(
        new Animated.Value(-58)
    ).current;

    /*
     * WHITE REVEAL MASK
     *
     * This sits BETWEEN PETCARD and the icon.
     * It moves with the icon while Frame 1 -> Frame 2
     * is running, so PETCARD cannot visually pass
     * through the transparent/lower parts of the icon.
     *
     * After the text reaches its final position the
     * mask fades away, leaving the final design unchanged.
     */
    const textRevealMaskOpacity = useRef(
        new Animated.Value(0)
    ).current;

    /* =====================================================
       WAVE
       ===================================================== */

    const waveOpacity = useRef(
        new Animated.Value(0)
    ).current;

    const waveScale = useRef(
        new Animated.Value(0.96)
    ).current;

    /* =====================================================
       EXIT
       ===================================================== */

    const screenOpacity = useRef(
        new Animated.Value(1)
    ).current;

    const screenScale = useRef(
        new Animated.Value(1)
    ).current;

    /* =====================================================
       PAWS

       -1 = all light
        0 = bottom-right
        1 = bottom-left
        2 = top-right
        3 = top-left
    ===================================================== */

    const [activePaw, setActivePaw] =
        useState<PawIndex>(-1);

    const [pawsVisible, setPawsVisible] =
        useState(false);

    /* =====================================================
       ANIMATION SEQUENCE
    ===================================================== */

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];

        const addTimer = (
            callback: () => void,
            delay: number
        ) => {
            const timer = setTimeout(
                callback,
                delay
            );

            timers.push(timer);

            return timer;
        };

        /* =================================================
           FRAME 1

           ONLY ICON

           0ms
           ↓
           icon appears
           ↓
           stays for 1 second
        ================================================= */

        Animated.parallel([
            Animated.timing(dogOpacity, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }),

            Animated.spring(dogScale, {
                toValue: 1.15,
                friction: 7,
                tension: 45,
                useNativeDriver: true,
            }),
        ]).start();

        /*
         * EXACT 1 SECOND ICON-ONLY HOLD
         */
        const ICON_ONLY_TIME = 1000;

        /* =================================================
           FRAME 2

           ICON + PETCARD

           VERY IMPORTANT:

           Icon and text START AT EXACTLY THE SAME TIME.

           Icon:
             0 → -45

           Text:
             opacity 0 → 1
             Y 42 → 0

           Since icon is above text,
           the text appears from BEHIND the icon.
        ================================================= */

        const ICON_MOVE_DURATION = 560;

        /*
         * Text and icon use exactly the same duration.
         *
         * This keeps their movement visually connected.
         */
        const TEXT_MOVE_DURATION = 560;

        addTimer(() => {
            /*
             * Make text exist BEFORE / AT THE SAME MOMENT
             * as the icon movement.
             */
            textOpacity.setValue(1);
            textRevealMaskOpacity.setValue(1);

            /*
             * ICON + TEXT start together.
             *
             * The mask follows the icon while it moves.
             * This gives the exact "text comes from behind
             * the icon" effect without letters showing
             * through the icon.
             */
            Animated.parallel([
                Animated.timing(dogY, {
                    toValue: -45,
                    duration: ICON_MOVE_DURATION,
                    useNativeDriver: true,
                }),

                Animated.timing(textY, {
                    toValue: 0,
                    duration: TEXT_MOVE_DURATION,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                /*
                 * Text has reached its final position.
                 * Remove the temporary mask smoothly.
                 */
                Animated.timing(textRevealMaskOpacity, {
                    toValue: 0,
                    duration: 120,
                    useNativeDriver: true,
                }).start();
            });
        }, ICON_ONLY_TIME);

        /*
         * Both animations have the same duration.
         */
        const FRAME_2_END =
            ICON_ONLY_TIME +
            Math.max(
                ICON_MOVE_DURATION,
                TEXT_MOVE_DURATION
            );

        /* =================================================
           FRAME 3

           ICON SHRINK

           IMPORTANT:

           dogY DOES NOT CHANGE.

           It has already reached -45.

           Therefore:

             move UP
                 ↓
             text comes from behind
                 ↓
             final position
                 ↓
             icon SHRINKS IN PLACE

           No additional upward movement.
           No compensation.
           No gap jump.
        ================================================= */

        const FRAME_3_DELAY = 180;

        addTimer(() => {
            Animated.parallel([
                /*
                 * SHRINK ONLY.
                 */
                Animated.spring(dogScale, {
                    toValue: 0.78,
                    friction: 8,
                    tension: 45,
                    useNativeDriver: true,
                }),

                /*
                 * IMPORTANT:
                 *
                 * dogY remains exactly -45.
                 *
                 * DO NOT change dogY here.
                 */
                Animated.timing(waveOpacity, {
                    toValue: 1,
                    duration: 240,
                    useNativeDriver: true,
                }),

                Animated.spring(waveScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 50,
                    useNativeDriver: true,
                }),
            ]).start();

            /*
             * Frame 3 starts with bottom-right orange paw.
             */
            setPawsVisible(true);
            setActivePaw(0);
        }, FRAME_2_END + FRAME_3_DELAY);

        const FRAME_3_TIME =
            FRAME_2_END + FRAME_3_DELAY;

        /* =================================================
           FRAME 4

           BOTTOM-LEFT PAW
        ================================================= */

        addTimer(() => {
            setActivePaw(1);
        }, FRAME_3_TIME + 950);

        /* =================================================
           FRAME 5

           TOP-RIGHT PAW
        ================================================= */

        addTimer(() => {
            setActivePaw(2);
        }, FRAME_3_TIME + 1900);

        /* =================================================
           FRAME 6

           TOP-LEFT PAW
        ================================================= */

        addTimer(() => {
            setActivePaw(3);
        }, FRAME_3_TIME + 2850);

        /* =================================================
           EXIT

           Keep Frame 6 visible before exiting.
        ================================================= */

        addTimer(() => {
            Animated.parallel([
                Animated.timing(screenOpacity, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),

                Animated.timing(screenScale, {
                    toValue: 1.02,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]).start(({ finished }) => {
                if (!finished) return;

                onFinish?.();
            });
        }, FRAME_3_TIME + 2850 + 1200);

        /* =================================================
           CLEANUP
        ================================================= */

        return () => {
            timers.forEach(clearTimeout);

            dogOpacity.stopAnimation();
            dogScale.stopAnimation();
            dogY.stopAnimation();

            textOpacity.stopAnimation();
            textY.stopAnimation();
            textRevealMaskOpacity.stopAnimation();

            waveOpacity.stopAnimation();
            waveScale.stopAnimation();

            screenOpacity.stopAnimation();
            screenScale.stopAnimation();
        };
    }, [
        dogOpacity,
        dogScale,
        dogY,
        textOpacity,
        textY,
        textRevealMaskOpacity,
        waveOpacity,
        waveScale,
        screenOpacity,
        screenScale,
        onFinish,
    ]);

    /* =====================================================
       RENDER
       ===================================================== */

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: screenOpacity,
                    transform: [
                        {
                            scale: screenScale,
                        },
                    ],
                },
            ]}
        >
            {/* =================================================
                PAWS
            ================================================= */}

            {/* FRAME 6 - TOP LEFT */}
            <Paw
                style={styles.pawTopLeft}
                active={activePaw === 3}
                visible={pawsVisible}
                rotation="15deg"
            />

            {/* FRAME 5 - TOP RIGHT */}
            <Paw
                style={styles.pawTopRight}
                active={activePaw === 2}
                visible={pawsVisible}
                rotation="-15deg"
            />

            {/* FRAME 4 - BOTTOM LEFT */}
            <Paw
                style={styles.pawBottomLeft}
                active={activePaw === 1}
                visible={pawsVisible}
                rotation="-18deg"
            />

            {/* FRAME 3 - BOTTOM RIGHT */}
            <Paw
                style={styles.pawBottomRight}
                active={activePaw === 0}
                visible={pawsVisible}
                rotation="0deg"
            />

            {/* =================================================
                WAVE
            ================================================= */}

            <Animated.View
                pointerEvents="none"
                style={[
                    styles.waveContainer,
                    {
                        opacity: waveOpacity,
                        transform: [
                            {
                                scale: waveScale,
                            },
                        ],
                    },
                ]}
            >
                <Svg
                    width={width * 1.4}
                    height={height * 0.30}
                    viewBox="0 0 1000 500"
                    preserveAspectRatio="none"
                >
                    <Path
                        d="
                            M 0 205

                            C 105 260,
                              215 292,
                              350 292

                            C 485 292,
                              555 170,
                              665 72

                            C 755 0,
                              865 18,
                              930 48

                            C 965 64,
                              988 88,
                              1000 115

                            L 1000 500
                            L 0 500

                            Z
                        "
                        fill="#FEF3EA"
                    />
                </Svg>
            </Animated.View>

            {/* =================================================
                TEXT LAYER

                zIndex 20

                Starts hidden.
                Appears at the SAME TIME as icon movement.

                Initial position:
                    textY = -58

                Final position:
                    textY = 0

                The text starts behind the icon.
                Dog is zIndex 30, therefore the icon
                visually covers the text while it
                moves into position.
            ================================================= */}

            <Animated.View
                pointerEvents="none"
                style={[
                    styles.textLayer,
                    {
                        opacity: textOpacity,
                        transform: [
                            {
                                translateY: textY,
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.brandRow}>
                    <Text style={styles.petText}>
                        PET
                    </Text>

                    <Text style={styles.cardText}>
                        CARD
                    </Text>
                </View>

                <View style={styles.taglineContainer}>
                    <View style={styles.line} />

                    <Text style={styles.taglineText}>
                        WORLD'S FIRST AI-ENABLED PET ID
                    </Text>

                    <View style={styles.line} />
                </View>
            </Animated.View>

            {/* =================================================
                ICON/TEXT REVEAL MASK

                White mask moves with the icon and sits
                above PETCARD but below the icon itself.

                It prevents PETCARD letters from appearing
                through the transparent/lower part of the
                dog icon during the reveal animation.
            ================================================= */}

            <Animated.View
                pointerEvents="none"
                style={[
                    styles.textRevealMask,
                    {
                        opacity: textRevealMaskOpacity,
                        transform: [
                            {
                                translateY: dogY,
                            },
                            {
                                scale: dogScale,
                            },
                        ],
                    },
                ]}
            />

            {/* =================================================
                DOG / ICON LAYER

                zIndex 30

                ALWAYS ABOVE PETCARD.

                This is what makes PETCARD appear
                from BEHIND the icon.
            ================================================= */}

            <Animated.View
                pointerEvents="none"
                style={[
                    styles.dogLayer,
                    {
                        opacity: dogOpacity,
                        transform: [
                            {
                                translateY: dogY,
                            },
                            {
                                scale: dogScale,
                            },
                        ],
                    },
                ]}
            >
                <Image
                    source={require("../../assets/images/icon.png")}
                    style={styles.dogImage}
                    resizeMode="contain"
                />
            </Animated.View>
        </Animated.View>
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

    /* =====================================================
       TEMPORARY TEXT REVEAL MASK
    ===================================================== */

    textRevealMask: {
        position: "absolute",
        left: "50%",

        /*
         * Keep the mask aligned with the lower portion
         * of the icon. It moves with dogY and dogScale.
         */
        width: Math.min(width * 0.72, 282),
        height: 72,

        marginLeft: -Math.min(width * 0.72, 282) / 2,

        top: "50%",
        marginTop: -10,

        backgroundColor: "#FFFFFF",

        /*
         * Between PETCARD (20) and icon (30).
         */
        zIndex: 25,
    },

    /* =====================================================
       DOG / ICON
    ===================================================== */

    dogLayer: {
        position: "absolute",
        left: 0,
        right: 0,

        top: "50%",

        marginTop: -110.5,

        alignItems: "center",
        justifyContent: "center",

        /*
         * IMPORTANT:
         * Dog MUST stay above text.
         */
        zIndex: 30,
    },

    dogImage: {
        width: Math.min(
            width * 0.60,
            235
        ),
        zIndex: 30,
        height: Math.min(
            width * 0.60,
            235
        ),
    },

    /* =====================================================
       PETCARD TEXT
    ===================================================== */

    textLayer: {
        position: "absolute",

        left: 0,
        right: 0,

        top: "50%",

        /*
         * This is the final position of PETCARD.
         *
         * Do NOT use flex positioning.
         * Absolute positioning prevents the icon
         * scaling from creating extra gaps.
         */
        marginTop: 32,

        alignItems: "center",

        /*
         * Below dog.
         */
        zIndex: 20,
    },

    brandRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    petText: {
        fontSize: Math.min(
            width * 0.105,
            48
        ),

        fontWeight: "900",

        color: "#1B1B1B",

        letterSpacing: -0.8,
    },

    cardText: {
        fontSize: Math.min(
            width * 0.105,
            48
        ),

        fontWeight: "900",

        color: "#FF7F00",

        letterSpacing: -0.8,
    },

    taglineContainer: {
        flexDirection: "row",

        alignItems: "center",
        justifyContent: "center",

        /*
         * Short lines like the Figma reference.
         * Previously 78% made the lines stretch too far.
         */
        width: width * 0.58,

        /*
         * Keep tagline very close to PETCARD.
         */
        marginTop: 3,
    },

    line: {
        flex: 1,

        height: 1.2,

        backgroundColor: "#FF7F00",
    },

    taglineText: {
        marginHorizontal: 5,

        fontSize: Math.min(
            width * 0.024,
            9.5
        ),

        fontWeight: "700",

        color: "#252525",

        letterSpacing: 0.4,

        textAlign: "center",
    },

    /* =====================================================
       WAVE
    ===================================================== */

    waveContainer: {
        position: "absolute",

        bottom: 0,

        left: -width * 0.20,

        width: width * 1.40,

        /*
         * Keep wave relatively short,
         * matching Figma.
         */
        height: height * 0.30,

        zIndex: 5,
    },

    /* =====================================================
       PAWS
    ===================================================== */

    paw: {
        position: "absolute",

        width: 58 * DESIGN_SCALE,

        height: 58 * DESIGN_SCALE,

        zIndex: 50,

        alignItems: "center",
        justifyContent: "center",
    },

    /*
     * paw-white.png contains transparent padding.
     */
    whitePaw: {
        position: "absolute",

        width: 107 * DESIGN_SCALE,

        height: 106 * DESIGN_SCALE,
    },

    /*
     * paw.png is tightly cropped.
     */
    orangePaw: {
        position: "absolute",

        width: 58 * DESIGN_SCALE,

        height: 53 * DESIGN_SCALE,
    },

    /* =====================================================
       FIGMA 393 x 852 PAW POSITIONS

       Same design-space positions are used on mobile
       and web/laptop.

       Uniform scaling keeps the relative positions
       consistent.
    ===================================================== */

    /* FRAME 6 */
    pawTopLeft: {
        top:
            DESIGN_TOP +
            57 * DESIGN_SCALE,

        left:
            DESIGN_LEFT +
            48 * DESIGN_SCALE,
    },

    /* FRAME 5 */
    pawTopRight: {
        top:
            DESIGN_TOP +
            187 * DESIGN_SCALE,

        left:
            DESIGN_LEFT +
            313 * DESIGN_SCALE,
    },

    /* FRAME 4 */
    pawBottomLeft: {
        top:
            DESIGN_TOP +
            621 * DESIGN_SCALE,

        left:
            DESIGN_LEFT +
            35 * DESIGN_SCALE,
    },

    /* FRAME 3 */
    pawBottomRight: {
        top:
            DESIGN_TOP +
            782 * DESIGN_SCALE,

        left:
            DESIGN_LEFT +
            315 * DESIGN_SCALE,
    },
});