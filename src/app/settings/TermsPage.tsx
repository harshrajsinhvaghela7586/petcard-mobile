import React from "react";
import InfoPage, { InfoSection } from "@/components/InfoPage";

const SECTIONS: InfoSection[] = [
    {
        title: "Use of the Service",
        icon: "document-text-outline",
        intro:
            "PetCard provides a digital pet-care experience designed to help users organize pet information, everyday care activities and related resources.",
        points: [
            "You may use the PetCard website and application only for lawful and intended personal or organizational purposes.",
            "You are responsible for using the features available to you in accordance with applicable laws and these terms.",
            "PetCard features, content and functionality may be updated, modified, suspended or discontinued as the product evolves.",
            "Some features may require an account, accurate information or additional permissions to work as intended.",
        ],
    },
    {
        title: "Accounts & User Responsibilities",
        icon: "person-outline",
        intro:
            "Users are expected to provide accurate information and use their account responsibly so that the PetCard experience remains reliable and safe.",
        points: [
            "You are responsible for maintaining the confidentiality of your account credentials and for activity performed through your account.",
            "Information entered into a pet profile, guardian profile or related feature should be accurate and kept reasonably up to date.",
            "You should not use PetCard to submit unlawful, misleading, abusive or harmful content.",
            "You should not attempt to interfere with, disrupt, reverse engineer or gain unauthorized access to the website, application or related systems.",
            "Where multiple guardians are supported, you should only provide access to people you trust and are authorized to involve in the pet-care process.",
        ],
    },
    {
        title: "Pet Information & User Content",
        icon: "paw-outline",
        intro:
            "PetCard allows users to add and manage information related to their pets. You remain responsible for the information and content you choose to provide.",
        points: [
            "You are responsible for ensuring that information you provide about your pet is accurate to the best of your knowledge.",
            "Health, vaccination, medication and emergency information should be reviewed and updated when necessary.",
            "PetCard is intended to help organize information and should not be treated as a replacement for professional veterinary care or emergency services.",
            "You should not upload content that violates another person's rights or any applicable law.",
        ],
    },
    {
        title: "Privacy & Data",
        icon: "lock-closed-outline",
        intro:
            "Your use of PetCard is also subject to the applicable PetCard Privacy Policy, which describes how information may be collected, used and handled.",
        points: [
            "The Privacy Policy should be reviewed together with these Terms of Service.",
            "PetCard aims to use reasonable measures to protect information handled through the service.",
            "Users should protect their own login credentials and take reasonable steps to prevent unauthorized account access.",
            "Additional terms may apply where third-party services, payment systems, app stores or external platforms are involved.",
        ],
    },
    {
        title: "Service Limitations & Changes",
        icon: "construct-outline",
        intro:
            "Like any digital platform, PetCard may occasionally experience maintenance, interruptions, technical limitations or changes in functionality.",
        points: [
            "PetCard may perform planned or emergency maintenance that temporarily affects availability.",
            "Features may change as the platform develops, including improvements, additions, removals or replacements.",
            "PetCard does not guarantee that every feature will be continuously available, error-free or suitable for every individual use case.",
            "Users should maintain appropriate backups or alternative access to information that is especially important to them.",
        ],
    },
    {
        title: "Contact & Support",
        icon: "mail-outline",
        intro:
            "For questions about these Terms of Service, support requests or other concerns relating to PetCard, please contact the PetCard team.",
        points: [
            "Email: info@petcard.in",
            "When contacting support, provide enough context for the team to understand your request and respond appropriately.",
        ],
    },
];

export default function TermsScreen() {
    return (
        <InfoPage
            title="Terms & Conditions"
            subtitle="Please read these terms before using PetCard."
            sections={SECTIONS}
        />
    );
}