/** Resolve a server catalogue avatar key to a bundled fallback asset. */
const AVATARS: Record<string, any[]> = {
  dog: [
    require("../../assets/images/chooseAvatar/DogAvatar/Huchiko.png"),
    require("../../assets/images/chooseAvatar/DogAvatar/Browny.png"),
    require("../../assets/images/chooseAvatar/DogAvatar/Noir.png"),
  ],
  cat: [
    require("../../assets/images/chooseAvatar/CatAvatar/Kiki.png"),
    require("../../assets/images/chooseAvatar/CatAvatar/Oreo.png"),
  ],
  rabbit: [
    require("../../assets/images/chooseAvatar/RabbitAvatar/Cupid.png"),
    require("../../assets/images/chooseAvatar/RabbitAvatar/Waffle.png"),
  ],
};
const DEFAULTS: Record<string, any> = {
  dog: require("../../assets/images/pets/huchiko.png"),
  cat: require("../../assets/images/pets/kiki.png"),
  rabbit: require("../../assets/images/pets/cupid.png"),
};

export function getPetAvatarSource(type?: string | null, avatarKey?: string | null, localId?: string | null) {
  const normalizedType = (type || "dog").toLowerCase();
  const files = AVATARS[normalizedType] ?? AVATARS.dog;
  const aliases: Record<string, number> = { huchiko: 0, browny: 1, noir: 2, kiki: 0, oreo: 1, cupid: 0, waffle: 1 };
  const normalizedKey = (localId || avatarKey || "").toLowerCase();
  if (normalizedKey in aliases) return files[aliases[normalizedKey]] ?? DEFAULTS[normalizedType] ?? DEFAULTS.dog;
  const explicit = normalizedKey.match(/(?:avatar[_-]?)?(\d+)$/);
  if (explicit) {
    const index = Math.max(0, Number(explicit[1]) - 1);
    return files[index] ?? DEFAULTS[normalizedType] ?? DEFAULTS.dog;
  }
  return DEFAULTS[normalizedType] ?? DEFAULTS.dog;
}

const DOG_STICKERS = [
  require("../../assets/images/chooseSticker/Huchiko/image2.png"),
  require("../../assets/images/chooseSticker/Huchiko/image1.png"),
  require("../../assets/images/chooseSticker/Huchiko/image3.png"),
  require("../../assets/images/chooseSticker/Huchiko/image4.png"),
  require("../../assets/images/chooseSticker/Huchiko/image5.png"),
  require("../../assets/images/chooseSticker/Huchiko/image6.png"),
  require("../../assets/images/chooseSticker/Huchiko/image7.png"),
  require("../../assets/images/chooseSticker/Huchiko/image8.png"),
  require("../../assets/images/chooseSticker/Huchiko/image9.png"),
  require("../../assets/images/chooseSticker/Huchiko/image10.png"),
  require("../../assets/images/chooseSticker/Huchiko/image11.png"),
  require("../../assets/images/chooseSticker/Huchiko/image12.png"),
  require("../../assets/images/chooseSticker/Huchiko/image13.png"),
  require("../../assets/images/chooseSticker/Huchiko/image14.png"),
  require("../../assets/images/chooseSticker/Huchiko/image15.png"),
];

export function getPetStickerSource(type?: string | null, stickerKey?: string | null) {
  if ((type || "").toLowerCase() !== "dog" || !stickerKey) return null;
  const match = stickerKey.match(/-(\d+)$/);
  if (!match) return null;
  return DOG_STICKERS[Number(match[1]) - 1] ?? null;
}
