/* Must match RELATIONSHIPS in backend/src/controller/meController.js and the enum in MobileUser. */
export const RELATIONSHIPS = ["Pet Parent", "Owner", "Guardian", "Family Member", "Caretaker"] as const;
export type Relationship = (typeof RELATIONSHIPS)[number];