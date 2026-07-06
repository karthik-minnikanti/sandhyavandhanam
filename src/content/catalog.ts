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
  {
    id: "shiva",
    deityTe: "శ్రీ శివ",
    deityEn: "Lord Shiva",
    gridLabelTe: "శివ",
    iconKey: "shiva",
    icon: DEITY_ICONS.shiva,
    items: [
      {
        key: "Lingashtakam",
        titleTe: "శ్రీ లింగాష్టకం",
        titleEn: "Lingashtakam",
        description: "Adi Shankaracharya — 8 verses on the Shiva Linga",
        audioPackId: "lingashtakam-audio",
        supportsInitialPage: true,
      },
      {
        key: "ArunachalaAshtakam",
        titleTe: "అరుణాచలాష్టకం",
        titleEn: "Arunachala Ashtakam",
        description: "Tiruvannamalai — smarana of Arunachala",
        audioPackId: "arunachala-audio",
        supportsInitialPage: true,
      },
      {
        key: "ChandrasekharaAshtakam",
        titleTe: "శ్రీ చంద్రశేఖరాష్టకం",
        titleEn: "Chandrasekhara Ashtakam",
        description: "Markandeya — Chandrashekhara stuti",
        audioPackId: "chandrasekhara-audio",
        supportsInitialPage: true,
      },
      {
        key: "DvadasaJyotirlingaStotram",
        titleTe: "ద్వాదశ జ్యోతిర్లింగ స్తోత్రం",
        titleEn: "Dvadasa Jyotirlinga Stotram",
        description: "12 sacred jyotirlinga shrines",
        audioPackId: "jyotirlinga-audio",
        supportsInitialPage: true,
      },
      {
        key: "DakshinamurthyStotram",
        titleTe: "దక్షిణామూర్తి స్తోత్రం",
        titleEn: "Dakshinamurthy Stotram",
        description: "Adi Shankaracharya — dhyanam & 10 verses",
        audioPackId: "dakshinamurthy-audio",
        supportsInitialPage: true,
      },
    ],
  },
];

export type LastReading = {
  screenKey: CatalogScreen;
  page: number;
  title: string;
};

const CATALOG_SCREENS = new Set<string>(
  CONTENTS_GROUPS.flatMap((g) => g.items.map((i) => i.key))
);

export function isCatalogScreen(key: string): key is CatalogScreen {
  return CATALOG_SCREENS.has(key);
}

export function findCatalogItem(screenKey: CatalogScreen): CatalogItem | undefined {
  for (const group of CONTENTS_GROUPS) {
    const item = group.items.find((i) => i.key === screenKey);
    if (item) return item;
  }
  return undefined;
}

export function findGroupForScreen(screenKey: CatalogScreen): DeityGroup | undefined {
  return CONTENTS_GROUPS.find((g) => g.items.some((i) => i.key === screenKey));
}

export function findCatalogItemByTitle(
  title: string
): { item: CatalogItem; group: DeityGroup } | null {
  for (const group of CONTENTS_GROUPS) {
    for (const item of group.items) {
      if (item.titleTe === title) return { item, group };
    }
  }
  return null;
}
