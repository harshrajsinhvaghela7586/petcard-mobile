import React from "react";
import InfoPage, { InfoSection } from "@/components/InfoPage";

const SECTIONS: InfoSection[] = [
    {
        title: "Information We Collect",
        icon: "document-text-outline",
        intro:
            "PetCard may collect information that helps us provide, maintain and improve the website and app experience.",
        points: [
            "Account and profile information such as name, email address and other details provided during registration.",
            "Pet information such as pet name, profile details, health-related information, vaccination records, reminders and other information you choose to add.",
            "Information submitted through forms, support requests, feedback or other direct interactions with PetCard.",
            "Technical and device information such as browser type, device information, usage activity and diagnostic information where applicable.",
            "Analytics and performance information used to understand how the website and app are used and to improve the overall experience.",
        ],
    },
    {
        title: "How We Use Information",
        icon: "paw-outline",
        intro:
            "Information may be used to operate the PetCard experience, support users and improve our products and services.",
        points: [
            "To create and manage user accounts and pet profiles.",
            "To provide features such as digital pet identity, health records, reminders, pet information and related services.",
            "To respond to questions, support requests, feedback and other communications.",
            "To maintain, secure, troubleshoot and improve the website, application and overall user experience.",
            "To understand product usage and improve features, performance and reliability.",
            "To meet applicable legal, security and operational requirements where required.",
        ],
    },
    {
        title: "Data Security",
        icon: "lock-closed-outline",
        intro:
            "PetCard aims to handle user and pet information responsibly and to apply reasonable measures to protect information from unauthorized access, misuse or loss.",
        points: [
            "Access to information should be limited to authorized systems, personnel or service providers where necessary.",
            "Reasonable technical and organizational safeguards may be used to help protect information.",
            "No online service can guarantee absolute security, so users should also take reasonable steps to protect account credentials and access.",
        ],
    },
    {
        title: "Sharing & Disclosure",
        icon: "shield-checkmark-outline",
        intro:
            "PetCard does not intend to use or disclose personal information beyond what is reasonably required to operate the service, support users and meet applicable obligations.",
        points: [
            "Information may be shared with trusted service providers when necessary to host, operate, secure, analyze or support the PetCard service.",
            "Information may be disclosed when required by applicable law, regulation, legal process or to protect the rights, safety and security of users or the service.",
            "Where third-party services are used, their handling of information may also be subject to their own privacy terms and policies.",
        ],
    },
    {
        title: "Your Choices & Rights",
        icon: "options-outline",
        intro:
            "Depending on applicable law and the final PetCard product policy, users may have choices regarding the information they provide and how it is handled.",
        points: [
            "You may be able to review or update certain profile and pet information through the product.",
            "You may contact PetCard regarding questions, corrections or requests relating to your information.",
            "You may choose not to provide certain optional information, although some features may require specific information to function.",
            "Requests relating to account deletion or data removal will be handled according to the final PetCard data-retention and deletion policy and applicable law.",
        ],
    },
    {
        title: "Contact",
        icon: "mail-outline",
        intro:
            "For privacy-related questions, requests or concerns, please contact the PetCard team using the official support email below.",
        points: [
            "Email: info@petcard.in",
            "For account, privacy or data-related requests, please include enough information for the PetCard team to understand and process your request.",
        ],
    },
];

export default function PrivacySecurityScreen() {
    return (
        <InfoPage
            title="Privacy & Security"
            subtitle="Your pet's data and yours - handled with care."
            sections={SECTIONS}
        />
    );
}