import { KnowItem, s } from "@/components/KnowKit";
import KnowMenuPage from "@/components/KnowMenu";

const ITEMS: KnowItem[] = [
    { key: "issues", title: "Common Health Issues", sub: "Learn about breed specific issues", icon: "heart-plus", color: "#FF4B32", tint: "#FFE5E1", route: "HealthWellness/CommonHealthIssueScreen" },
    { key: "vaccine", title: "Vaccination Guide", sub: "Stay updated on vaccines", icon: "needle", color: "#3B6FB6", tint: "#E6F0FA", route: "HealthWellness/VaccinationGuideScreen" },
    { key: "exercise", title: "Exercise Needs", sub: "How much exercise does Milo need?", icon: "run", color: "#FF7A00", tint: "#FFE9D6", route: "HealthWellness/ExcerciseNeedScreen" },
    { key: "mental", title: "Mental Wellness", sub: "Keep Milo's mind happy", icon: "brain", color: "#7A5CFF", tint: "#EFE9FF", route: "HealthWellness/MentalWellnessScreen" },
    { key: "signs", title: "Signs to Watch", sub: "Early signs of illness", icon: "magnify", color: "#E0502F", tint: "#FFE5E1", route: "HealthWellness/SignToWatchScreen" },
    { key: "vet", title: "Vet Check-ups", sub: "Regular check-ups save lives", icon: "medical-bag", color: "#7A5CFF", tint: "#EFE9FF", route: "HealthWellness/VetCheckUpScreen" },
];

export default function HealthWellnessScreen() {
    return (
        <KnowMenuPage
            menuKey="health_wellness"
            title="Health & Wellness"
            tint="#FFE3DC"
            chip="Health Care"
            heroTitle="Healthy habits, happy Milo"
            heroSub="Regular check-ups, vaccines and daily care keep Milo feeling great."
            heading="Milo's Health at a Glance"
            sub="Keep up with regular care to keep Milo happy & healthy."
            items={ITEMS}
            boxed
            decor={[
                { name: "heart-pulse", size: 30, color: "#FF9C8C", pos: { top: s(14), right: s(20) } },
                { name: "paw", size: 24, color: "#FFC2B6", pos: { top: s(70), right: s(110) } },
                { name: "plus-circle-outline", size: 26, color: "#FFB4A6", pos: { bottom: s(18), left: s(14) } },
            ]}
        />
    );
}