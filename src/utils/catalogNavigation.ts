import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import type { CatalogItem } from "../content/catalog";

type StackNavigation = NativeStackNavigationProp<RootStackParamList>;
type StackNavigate = StackNavigation["navigate"];

function readerRoute(
  item: CatalogItem,
  initialPage?: number
): { name: keyof RootStackParamList; params?: { initialPage?: number } } {
  const params =
    item.supportsInitialPage && initialPage != null && initialPage > 0
      ? { initialPage }
      : undefined;

  return params !== undefined
    ? { name: item.key, params }
    : { name: item.key };
}

/** Reader back — return to the contents list. */
export function navigateToContents(navigation: Pick<StackNavigation, "navigate">) {
  navigation.navigate("TableOfContents");
}

/** @deprecated Use navigateToContents from reader screens */
export function navigateToCover(navigation: Pick<StackNavigation, "navigate">) {
  navigateToContents(navigation);
}

/** Cover → Continue: keep Cover and Contents in the stack under the reader. */
export function openReaderFromCover(
  navigation: NativeStackNavigationProp<RootStackParamList, "BookCover">,
  item: CatalogItem,
  initialPage?: number
) {
  const reader = readerRoute(item, initialPage);
  navigation.reset({
    index: 2,
    routes: [
      { name: "BookCover" },
      { name: "TableOfContents" },
      reader,
    ],
  });
}

export function navigateToCatalogItem(
  navigate: StackNavigate,
  item: CatalogItem,
  initialPage?: number
) {
  const route = readerRoute(item, initialPage);

  switch (item.key) {
    case "SandhyavandanamVidhanam":
      navigate("SandhyavandanamVidhanam", route.params);
      return;
    case "LalithaSahasranamam":
      navigate("LalithaSahasranamam", route.params);
      return;
    case "DakshinamurthyStotram":
      navigate("DakshinamurthyStotram", route.params);
      return;
    case "Lingashtakam":
      navigate("Lingashtakam", route.params);
      return;
    case "ArunachalaAshtakam":
      navigate("ArunachalaAshtakam", route.params);
      return;
    case "ChandrasekharaAshtakam":
      navigate("ChandrasekharaAshtakam", route.params);
      return;
    case "DvadasaJyotirlingaStotram":
      navigate("DvadasaJyotirlingaStotram", route.params);
      return;
    case "SankatMochanaHanumanAshtakam":
      navigate("SankatMochanaHanumanAshtakam", route.params);
      return;
    case "HanumanChalisa":
      navigate("HanumanChalisa", route.params);
      return;
    case "HanumadAshtakam":
      navigate("HanumadAshtakam", route.params);
      return;
    case "GaneshaPancharatnam":
      navigate("GaneshaPancharatnam", route.params);
      return;
    case "GananayakaAshtakam":
      navigate("GananayakaAshtakam", route.params);
      return;
    case "GovindaNamalu":
      navigate("GovindaNamalu", route.params);
      return;
    case "VenkateshaAshtakam":
      navigate("VenkateshaAshtakam", route.params);
      return;
    case "VishnuSahasranamam":
      navigate("VishnuSahasranamam", route.params);
      return;
    case "SubrahmanyaAshtakam":
      navigate("SubrahmanyaAshtakam", route.params);
      return;
    case "YagnopaveetamVidhi":
      navigate("YagnopaveetamVidhi");
  }
}
