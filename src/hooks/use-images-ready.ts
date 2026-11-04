import { useEffect, useMemo, useState } from "react";
import { Image } from "react-native";
import { Asset } from "expo-asset";

/*
 * Loads bundled images (require(...)) into memory before a screen is shown, so the page appears
 * complete instead of images popping in one by one.
 *
 *   const ready = useImagesReady([require("a.png"), require("b.png")]);
 *   if (!ready) return <ScreenLoader />;
 *
 * - images already loaded once are not loaded again (instant on the next visit)
 * - never blocks for long: after `timeoutMs` the screen is shown anyway
 */
const warmed = new Set<number>();

async function warm(module: number) {
  if (warmed.has(module)) return;
  try {
    const asset = Asset.fromModule(module);
    if (!asset.downloaded) await asset.downloadAsync();
    const uri = asset.localUri ?? asset.uri;
    if (uri) await Image.prefetch(uri).catch(() => false);
  } catch {
    /* A failed preload only means the image loads normally when drawn. */
  }
  warmed.add(module);
}

export function preloadImages(sources: Array<number | undefined | null>): Promise<void> {
  const list = sources.filter((m): m is number => typeof m === "number");
  return Promise.all(list.map(warm)).then(() => undefined);
}

export function useImagesReady(sources: Array<number | undefined | null>, enabled = true, timeoutMs = 3500): boolean {
  const list = useMemo(() => sources.filter((m): m is number => typeof m === "number"), [sources.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps
  const [ready, setReady] = useState(() => enabled && list.every((m) => warmed.has(m)));

  useEffect(() => {
    if (!enabled) { setReady(false); return; }
    if (list.every((m) => warmed.has(m))) { setReady(true); return; }
    let alive = true;
    setReady(false);
    const timer = setTimeout(() => { if (alive) setReady(true); }, timeoutMs);
    preloadImages(list).then(() => { if (alive) { clearTimeout(timer); setReady(true); } });
    return () => { alive = false; clearTimeout(timer); };
  }, [list, enabled, timeoutMs]);

  return ready;
}
