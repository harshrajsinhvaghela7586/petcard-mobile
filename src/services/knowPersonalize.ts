import type { Pet } from "./petcardApi";
import { BREED_TRAITS, TYPE_PROFILES } from "@/constants/knowProfiles";
import type { Fact } from "@/components/KnowGuide";

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

/** Hardcoded dog/"Milo" guide text ko selected pet ke naam, type aur gender ke hisab se badalta hai. */
export function makePersonalizer(pet: Pet | null) {
    const name = pet?.name || "your pet";
    const type = (pet?.type || "dog").toLowerCase();
    const prof = TYPE_PROFILES[type] ?? TYPE_PROFILES.dog;
    const gender = String(pet?.gender || "").toLowerCase();
    const female = gender.startsWith("f");

    const fix = (text: string) => {
        let out = text.replace(/Milo/g, name);
        if (type !== "dog") {
            out = out
                .replace(/\bDogs\b/g, cap(prof.plural)).replace(/\bdogs\b/g, prof.plural)
                .replace(/\bDog\b/g, cap(prof.word)).replace(/\bdog\b/g, prof.word)
                .replace(/\bPuppies\b/g, cap(prof.young) + "s").replace(/\bpuppies\b/g, prof.young + "s")
                .replace(/\bPuppy\b/g, cap(prof.young)).replace(/\bpuppy\b/g, prof.young);
        }
        if (female) {
            out = out.replace(/\bHe\b/g, "She").replace(/\bhe\b/g, "she").replace(/\bhim\b/g, "her").replace(/\bhis\b/g, "her").replace(/\bHis\b/g, "Her");
        }
        return out;
    };

    const deep = (value: any): any => {
        if (typeof value === "string") return fix(value);
        if (Array.isArray(value)) return value.map(deep);
        if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deep(v)]));
        return value;
    };

    /* "Tailored for <pet>" card (breed + type ke hisab se) */
    const tailored = () => {
        const breed = (pet?.breed || "").trim();
        const trait = breed ? BREED_TRAITS.find((b) => breed.toLowerCase().includes(b.match)) : undefined;
        const facts: Fact[] = trait
            ? [
                { label: "Breed", value: breed, icon: "paw" },
                { label: "Energy", value: trait.energy, icon: "lightning-bolt-outline" },
                { label: "Grooming", value: trait.grooming, icon: "brush" },
                { label: "Vet visit", value: "Yearly check-up", icon: "stethoscope" },
            ]
            : prof.facts;
        return {
            type: "about" as const,
            heading: `Tailored for ${name}`,
            body: trait ? `${breed}: ${trait.note} ${prof.about}` : `${breed ? `${breed} · ` : ""}${prof.about}`,
            facts,
        };
    };

    return { name, type, deep, fix, tailored };
}
