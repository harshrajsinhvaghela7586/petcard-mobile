import KnowGuide, { Section } from "@/components/KnowGuide";

const SECTIONS: Section[] = [
  { type: "about", heading: "Make walks calm and safe", body: "Introduce the harness and leash gradually with treats and praise. Start indoors or in a quiet area, and keep sessions short enough that your dog can succeed." },
  { type: "timeline", heading: "Build the skill step by step", steps: [
    { tag: "01", title: "Get comfortable", text: "Let your dog sniff the harness and reward calm investigation before putting it on." },
    { tag: "02", title: "Practise indoors", text: "Attach the leash and reward your dog for walking beside you without tension." },
    { tag: "03", title: "Reward attention", text: "Say your dog's name and reward them for checking in with you during the walk." },
    { tag: "04", title: "Increase distractions slowly", text: "Move to quieter outdoor routes first, then gradually practise around more activity." },
  ]},
  { type: "list", heading: "Safer walks", tone: "good", items: [
    { title: "Use suitable equipment", text: "Choose a well-fitted harness or collar and a secure leash appropriate for your pet.", icon: "shield-check-outline" },
    { title: "Avoid leash jerks", text: "Use rewards and direction changes instead of pulling or punishment.", icon: "heart-outline" },
    { title: "Watch the environment", text: "Avoid hot pavement, traffic, unsafe dogs and areas where local rules prohibit pets.", icon: "map-marker-outline" },
  ]},
  { type: "tip", title: "Keep track of walks", body: "Add a Walk task in PetCard to keep your routine visible and consistent.", action: { label: "Open Tasks", route: "/TasksScreen" } },
];

export default function LeashTrainingScreen() {
  return <KnowGuide title="Leash Training" chip="Training" sections={SECTIONS} />;
}
