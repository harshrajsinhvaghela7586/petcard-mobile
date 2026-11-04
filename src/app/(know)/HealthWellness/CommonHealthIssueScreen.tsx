import KnowGuide, { Section } from "@/components/KnowGuide";

const SECTIONS: Section[] = [
  { type: "about", heading: "Notice changes early", body: "Changes in appetite, energy, breathing, drinking, bathroom habits, skin or behaviour can be signs that your pet needs attention. Compare changes with their normal routine and record when they began." },
  { type: "list", heading: "Signs to watch", tone: "warn", items: [
    { title: "Digestive changes", text: "Repeated vomiting, diarrhoea, a swollen abdomen or refusing food.", icon: "alert-circle-outline" },
    { title: "Skin and ears", text: "Persistent scratching, redness, odour, discharge or hair loss.", icon: "medical-bag" },
    { title: "Energy and movement", text: "Unusual tiredness, limping, weakness or reluctance to move.", icon: "walk" },
    { title: "Drinking and urination", text: "A sudden sustained increase or decrease in either.", icon: "water-outline" },
  ]},
  { type: "list", heading: "When to get urgent help", tone: "danger", items: [
    { title: "Emergency symptoms", text: "Difficulty breathing, collapse, seizures, severe bleeding, suspected poisoning or inability to urinate require urgent veterinary care.", icon: "alert" },
    { title: "Avoid self-medicating", text: "Do not give human medicines unless a veterinarian specifically instructs you to.", icon: "shield-alert-outline" },
  ]},
  { type: "tip", title: "Keep a record", body: "Use PetCard Health Records to note symptoms, dates, medication instructions and vet follow-ups. This screen provides general information, not a diagnosis.", action: { label: "Open Health Records", route: "/HealthRecordScreen" } },
];

export default function CommonHealthIssueScreen() {
  return <KnowGuide title="Common Health Issues" chip="Health & Wellness" sections={SECTIONS} />;
}
