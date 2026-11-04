import React, { useEffect, useState } from "react";
import { Image, ImageProps, ImageSourcePropType } from "react-native";

/** Remote image fail / empty uri ho to `fallback` (bundled asset) dikhata hai. */
export default function SafeImage({ source, fallback, ...rest }: Omit<ImageProps, "source"> & { source?: ImageSourcePropType | null; fallback: ImageSourcePropType }) {
    const [failed, setFailed] = useState(false);
    const key = typeof source === "object" && source && "uri" in source ? (source as { uri?: string }).uri : String(source ?? "");
    useEffect(() => { setFailed(false); }, [key]);
    const hasRemote = typeof source === "object" && source && !Array.isArray(source) && "uri" in source ? !!(source as { uri?: string }).uri : !!source;
    return <Image {...rest} source={failed || !hasRemote ? fallback : (source as ImageSourcePropType)} onError={() => setFailed(true)} />;
}
