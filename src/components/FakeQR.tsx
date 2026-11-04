import React, { useMemo } from "react";
import Svg, { Rect } from "react-native-svg";

/*
 * Sirf DESIGN ke liye QR jaisa pattern (scan nahi hota).
 * Real QR ke liye: npm i react-native-qrcode-svg
 *   <QRCode value={petUrl} size={...} />
 * aur is component ko us se replace kar dena.
 */
const N = 25;

function makeRng(seed: string) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        h ^= seed.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    if (h === 0) h = 1;
    return () => {
        h ^= h << 13;
        h ^= h >>> 17;
        h ^= h << 5;
        return ((h >>> 0) % 1000) / 1000;
    };
}

type Props = {
    value: string;
    size: number;
    color?: string;
    bg?: string;
    /** center me logo ke liye khaali jagah */
    logoGap?: boolean;
};

export default function FakeQR({ value, size, color = "#382018", bg = "#FFFFFF", logoGap = false }: Props) {
    const u = size / N;

    const cells = useMemo(() => {
        const rnd = makeRng(value);
        const out: [number, number][] = [];
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                const on = rnd() > 0.5;
                const finder =
                    (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
                const gap = logoGap && r >= 8 && r <= 16 && c >= 8 && c <= 16;
                if (on && !finder && !gap) out.push([r, c]);
            }
        }
        return out;
    }, [value, logoGap]);

    const origins: [number, number][] = [
        [0, 0],
        [0, N - 7],
        [N - 7, 0],
    ];

    return (
        <Svg width={size} height={size}>
            <Rect x={0} y={0} width={size} height={size} fill={bg} />

            {cells.map(([r, c]) => (
                <Rect key={`${r}-${c}`} x={c * u} y={r * u} width={u + 0.4} height={u + 0.4} fill={color} />
            ))}

            {origins.map(([r, c]) => (
                <React.Fragment key={`f-${r}-${c}`}>
                    <Rect x={c * u} y={r * u} width={7 * u} height={7 * u} fill={color} />
                    <Rect x={(c + 1) * u} y={(r + 1) * u} width={5 * u} height={5 * u} fill={bg} />
                    <Rect x={(c + 2) * u} y={(r + 2) * u} width={3 * u} height={3 * u} fill={color} />
                </React.Fragment>
            ))}
        </Svg>
    );
}