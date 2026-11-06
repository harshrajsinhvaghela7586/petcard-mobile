import type { Fact } from "@/components/KnowGuide";

/* Pet type ke hisab se base guidance (har Know page ke upar "Tailored for <pet>" card me dikhta hai). */
export type TypeProfile = {
    plural: string; word: string; young: string;
    about: string; facts: Fact[];
};

export const TYPE_PROFILES: Record<string, TypeProfile> = {
    dog: {
        plural: "dogs", word: "dog", young: "puppy",
        about: "Dogs thrive on routine, daily exercise and company. Meals, walks, play and rest at regular times keep them healthy and calm.",
        facts: [
            { label: "Meals", value: "2 a day (adult)", icon: "food-drumstick-outline" },
            { label: "Exercise", value: "30 – 90 min daily", icon: "dog-service" },
            { label: "Water", value: "Always fresh", icon: "water-outline" },
            { label: "Vet visit", value: "Yearly check-up", icon: "stethoscope" },
        ],
    },
    cat: {
        plural: "cats", word: "cat", young: "kitten",
        about: "Cats like calm routines, climbing spots, scratching posts and short bursts of play. Indoor cats especially need daily play and fresh water.",
        facts: [
            { label: "Meals", value: "2 – 3 small meals", icon: "food-drumstick-outline" },
            { label: "Play", value: "2 × 10 – 15 min", icon: "cat" },
            { label: "Litter", value: "Scoop daily", icon: "broom" },
            { label: "Vet visit", value: "Yearly check-up", icon: "stethoscope" },
        ],
    },
    rabbit: {
        plural: "rabbits", word: "rabbit", young: "kit",
        about: "Rabbits need unlimited hay, fresh greens, safe space to hop every day and gentle handling. Sudden diet changes can upset their gut.",
        facts: [
            { label: "Diet", value: "Mostly hay", icon: "grass" },
            { label: "Hop time", value: "3+ hours daily", icon: "rabbit" },
            { label: "Water", value: "Fresh daily", icon: "water-outline" },
            { label: "Vet visit", value: "Exotic vet yearly", icon: "stethoscope" },
        ],
    },
};

/*
 * Breeds the app has full, breed-specific Know guides for (same list and spelling rules as the backend's
 * config/breeds.js). Anything else typed under "Other" is kept as the pet's breed but is NOT shown in the
 * Know section: it just says "Your dog" / "Your cat" / "Your rabbit" (see knowPersonalize.ts).
 * `match` points at the entry in BREED_TRAITS below.
 */
const SUPPORTED_BREEDS: { type: string; match: string; names: string[] }[] = [
    { type: "dog", match: "hungarian vizsla", names: ["hungarian vizsla", "vizsla", "magyar vizsla"] },
    { type: "dog", match: "border collie", names: ["border collie", "bordercollie"] },
    { type: "dog", match: "japanese akita", names: ["japanese akita", "akita", "akita inu", "japanese akita inu"] },
    { type: "cat", match: "persian", names: ["persian", "persian cat", "persian cats"] },
    { type: "cat", match: "himalayan", names: ["himalayan", "himalayan cat", "himalayan cats", "himmie"] },
    { type: "rabbit", match: "holland lop", names: ["holland lop", "hollandlop", "holland lop rabbit", "holland lops"] },
    { type: "rabbit", match: "newzealand bunny", names: ["newzealand bunny", "new zealand bunny", "new zealand", "new zealand rabbit", "newzealand", "newzealand rabbit", "nz bunny", "nz white"] },
];

const norm = (v: string) => String(v || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Returns the BREED_TRAITS `match` key when the typed breed is one of the 7 supported breeds of this pet type, else null. */
export function supportedBreedMatch(type: string, breed: string): string | null {
    const q = norm(breed);
    if (q.length < 3) return null;
    const hit = SUPPORTED_BREEDS.find((b) =>
        b.type === type && b.names.some((n) => norm(n) === q || ` ${q} `.includes(` ${norm(n)} `))
    );
    return hit ? hit.match : null;
}

/* Common breeds: energy / grooming / note. Match is case-insensitive "contains". */
export const BREED_TRAITS: { match: string; energy: string; grooming: string; note: string }[] = [
    { match: "hungarian vizsla", energy: "Very high", grooming: "Weekly brush", note: "A people-focused, high-energy working dog; provide daily exercise, training and warm rest in cold weather." },
    { match: "border collie", energy: "Very high", grooming: "Brush 2–3×/week", note: "Highly intelligent and driven; combine physical activity with daily mental enrichment and calm rest." },
    { match: "japanese akita", energy: "Medium", grooming: "Brush 2–3×/week; seasonal shedding", note: "A large, reserved double-coated breed; manage heat, maintain a healthy weight and discuss bloat warning signs with your vet." },
    { match: "persian", energy: "Low", grooming: "Daily coat and eye care", note: "A flat-faced long-haired cat; gently groom daily, keep eyes clean and watch for noisy or laboured breathing." },
    { match: "himalayan", energy: "Low", grooming: "Daily coat and eye care", note: "A calm, long-haired flat-faced cat; prevent coat mats and seek veterinary advice for breathing or eye concerns." },
    { match: "holland lop", energy: "Medium", grooming: "Weekly brush; check ears", note: "A small lop-eared rabbit; provide unlimited grass hay, monitor teeth and ears, and keep its litter area clean." },
    { match: "newzealand bunny", energy: "Medium", grooming: "Weekly brush", note: "A larger rabbit that needs room to hop, unlimited hay and daily checks for sore hocks and healthy body condition." },
    { match: "labrador", energy: "High", grooming: "Weekly brush", note: "Loves food and swimming; watch the weight and hips." },
    { match: "golden", energy: "High", grooming: "Brush 2–3×/week", note: "Friendly and eager; sheds a lot and needs regular exercise." },
    { match: "german shepherd", energy: "Very high", grooming: "Brush 2–3×/week", note: "Needs a job and mental work; watch hips and elbows." },
    { match: "beagle", energy: "High", grooming: "Weekly brush", note: "Follows its nose; keep on leash and clean the ears often." },
    { match: "pug", energy: "Low – medium", grooming: "Weekly + face folds", note: "Flat face: avoid heat and heavy exercise; clean skin folds." },
    { match: "bulldog", energy: "Low", grooming: "Weekly + skin folds", note: "Flat face: overheats easily; keep cool and lean." },
    { match: "husky", energy: "Very high", grooming: "Daily in shedding season", note: "Cold-weather breed; needs lots of exercise and cool shade." },
    { match: "shih tzu", energy: "Low – medium", grooming: "Daily brush", note: "Long coat mats easily; regular trims and eye cleaning." },
    { match: "pomeranian", energy: "Medium", grooming: "Brush 3×/week", note: "Small and bold; dental care and careful handling matter." },
    { match: "rottweiler", energy: "High", grooming: "Weekly brush", note: "Strong and loyal; needs early training and socialising." },
    { match: "indie", energy: "Medium – high", grooming: "Low", note: "Hardy and adaptable; keep ticks/fleas in check." },
    { match: "desi", energy: "Medium – high", grooming: "Low", note: "Hardy and adaptable; keep ticks/fleas in check." },
    { match: "persian", energy: "Low", grooming: "Daily brush", note: "Long coat mats; wipe eyes daily and watch breathing in heat." },
    { match: "siamese", energy: "High", grooming: "Weekly brush", note: "Vocal and social; needs play and company." },
    { match: "maine coon", energy: "Medium", grooming: "Brush 2–3×/week", note: "Large and gentle; sturdy scratching posts and joint care." },
    { match: "bengal", energy: "Very high", grooming: "Weekly brush", note: "Athletic and curious; needs climbing and puzzle toys." },
    { match: "holland lop", energy: "Medium", grooming: "Weekly brush", note: "Floppy ears need regular checks; dental care via hay." },
    { match: "lionhead", energy: "Medium", grooming: "Brush 2×/week", note: "Mane needs brushing; keep cool." },
];
