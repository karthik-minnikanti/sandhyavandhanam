/**
 * Deity icons for the contents grid and reader cover pages.
 * Replace files under assets/deities/ to update artwork app-wide.
 */
export const DEITY_ICONS = {
  gayatri: require("../../assets/deities/gayatri.jpg"),
  hanuman: require("../../assets/deities/hanuman.jpg"),
  lalitha: require("../../assets/deities/lalita.jpeg"),
  shiva: require("../../assets/deities/shiva.jpg"),
  subramanya: require("../../assets/deities/subramanya.jpg"),
  venkateswara: require("../../assets/deities/venkateswara.jpeg"),
  vidhi: require("../../assets/deities/vidhi.jpg"),
  vinayaka: require("../../assets/deities/vinayaka.jpg"),
} as const;

export type DeityIconKey = keyof typeof DEITY_ICONS;
