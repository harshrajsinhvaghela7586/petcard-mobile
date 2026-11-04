/* iso, flag, dial code, allowed national-number length (min..max digits) */
export type Country = { iso: string; name: string; flag: string; dial: string; min: number; max: number };

export const COUNTRIES: Country[] = [
    { iso: "IN", name: "India", flag: "🇮🇳", dial: "+91", min: 10, max: 10 },
    { iso: "US", name: "United States", flag: "🇺🇸", dial: "+1", min: 10, max: 10 },
    { iso: "CA", name: "Canada", flag: "🇨🇦", dial: "+1", min: 10, max: 10 },
    { iso: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "+44", min: 10, max: 10 },
    { iso: "PK", name: "Pakistan", flag: "🇵🇰", dial: "+92", min: 10, max: 10 },
    { iso: "BD", name: "Bangladesh", flag: "🇧🇩", dial: "+880", min: 10, max: 10 },
    { iso: "LK", name: "Sri Lanka", flag: "🇱🇰", dial: "+94", min: 9, max: 9 },
    { iso: "NP", name: "Nepal", flag: "🇳🇵", dial: "+977", min: 10, max: 10 },
    { iso: "AE", name: "United Arab Emirates", flag: "🇦🇪", dial: "+971", min: 9, max: 9 },
    { iso: "SA", name: "Saudi Arabia", flag: "🇸🇦", dial: "+966", min: 9, max: 9 },
    { iso: "QA", name: "Qatar", flag: "🇶🇦", dial: "+974", min: 8, max: 8 },
    { iso: "KW", name: "Kuwait", flag: "🇰🇼", dial: "+965", min: 8, max: 8 },
    { iso: "SG", name: "Singapore", flag: "🇸🇬", dial: "+65", min: 8, max: 8 },
    { iso: "MY", name: "Malaysia", flag: "🇲🇾", dial: "+60", min: 9, max: 10 },
    { iso: "AU", name: "Australia", flag: "🇦🇺", dial: "+61", min: 9, max: 9 },
    { iso: "NZ", name: "New Zealand", flag: "🇳🇿", dial: "+64", min: 8, max: 10 },
    { iso: "DE", name: "Germany", flag: "🇩🇪", dial: "+49", min: 10, max: 11 },
    { iso: "FR", name: "France", flag: "🇫🇷", dial: "+33", min: 9, max: 9 },
    { iso: "ES", name: "Spain", flag: "🇪🇸", dial: "+34", min: 9, max: 9 },
    { iso: "IT", name: "Italy", flag: "🇮🇹", dial: "+39", min: 9, max: 10 },
    { iso: "NL", name: "Netherlands", flag: "🇳🇱", dial: "+31", min: 9, max: 9 },
    { iso: "ZA", name: "South Africa", flag: "🇿🇦", dial: "+27", min: 9, max: 9 },
    { iso: "NG", name: "Nigeria", flag: "🇳🇬", dial: "+234", min: 10, max: 10 },
    { iso: "BR", name: "Brazil", flag: "🇧🇷", dial: "+55", min: 10, max: 11 },
    { iso: "MX", name: "Mexico", flag: "🇲🇽", dial: "+52", min: 10, max: 10 },
    { iso: "JP", name: "Japan", flag: "🇯🇵", dial: "+81", min: 10, max: 10 },
    { iso: "CN", name: "China", flag: "🇨🇳", dial: "+86", min: 11, max: 11 },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

/** "+919876543210" -> { country, national: "9876543210" } (longest dial code match). */
export function splitPhone(full?: string | null): { country: Country; national: string } {
    const v = (full ?? "").replace(/[^\d+]/g, "");
    if (!v.startsWith("+")) return { country: DEFAULT_COUNTRY, national: v.replace(/\D/g, "") };
    const match = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length).find((c) => v.startsWith(c.dial));
    return match ? { country: match, national: v.slice(match.dial.length) } : { country: DEFAULT_COUNTRY, national: v.replace(/\D/g, "") };
}

export const joinPhone = (c: Country, national: string) => (national ? `${c.dial}${national}` : "");

/** Empty is allowed (optional field). Returns an error message or null. */
export function phoneError(c: Country, national: string): string | null {
    if (!national) return null;
    if (!/^\d+$/.test(national)) return "Digits only.";
    if (national.length < c.min || national.length > c.max) {
        return c.min === c.max ? `${c.name} numbers have ${c.min} digits.` : `${c.name} numbers have ${c.min}-${c.max} digits.`;
    }
    return null;
}
