import type { ImageSourcePropType } from "react-native";
import type { RootStackParamList } from "../types/navigation";
import type { ContentPackId } from "../contentPacks/types";
import { DEITY_ICONS, type DeityIconKey } from "./deityIcons";

/** Reader screens listed in Contents, grouped by deity or theme. */
export type CatalogScreen = Exclude<
  keyof RootStackParamList,
  "BookCover" | "TableOfContents" | "Preferences"
>;

export type CatalogItem = {
  key: CatalogScreen;
  titleTe: string;
  titleEn: string;
  description: string;
  audioPackId?: ContentPackId;
  /** Routes that accept `{ initialPage?: number }`. */
  supportsInitialPage?: boolean;
};

export type DeityGroup = {
  id: string;
  deityTe: string;
  deityEn: string;
  /** Shorter label for the contents grid tile. */
  gridLabelTe: string;
  iconKey: DeityIconKey;
  icon: ImageSourcePropType;
  items: CatalogItem[];
};

/**
 * Table of contents structure. Add a new group or item here when publishing
 * more stotrams / vidhis. Set `iconKey` and add matching file under assets/deities/.
 */
export const CONTENTS_GROUPS: DeityGroup[] = [
  {
    id: "gayatri",
    deityTe: "శ్రీ గాయత్రీ దేవి",
    deityEn: "Sri Gayatri Devi",
    gridLabelTe: "గాయత్రీ",
    iconKey: "gayatri",
    icon: DEITY_ICONS.gayatri,
    items: [
      {
        key: "SandhyavandanamVidhanam",
        titleTe: "కృష్ణ యజుర్వేద సంధ్యావందనం",
        titleEn: "Sandhyavandanam Vidhanam",
        description: "Krishna Yajurveda — Pratah / Madhyahnika / Sayam",
        audioPackId: "sandhyavandanam-audio",
        supportsInitialPage: true,
      },
      {
        key: "YagnopaveetamVidhi",
        titleTe: "యజ్ఞోపవీత ధారణ విధిః",
        titleEn: "Yagnopaveetha Dharana Vidhi",
        description: "Sacred thread wearing procedure — full text",
      },
    ],
  },
  {
    id: "lalitha",
    deityTe: "శ్రీ లలితా దేవి",
    deityEn: "Sri Lalitha Devi",
    gridLabelTe: "లలితా",
    iconKey: "lalitha",
    icon: DEITY_ICONS.lalitha,
    items: [
      {
        key: "LalithaSahasranamam",
        titleTe: "శ్రీ లలితా సహస్ర నామ స్తోత్రం",
        titleEn: "Lalitha Sahasranamam",
        description: "1000 names — Telugu text & section audio",
        audioPackId: "lalitha-audio",
        supportsInitialPage: true,
      },
    ],
  },
];
