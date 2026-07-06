import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  getSankatMochanaHanumanAshtakamReaderPages,
  sankatMochanaHanumanAshtakamOpening,
} from "../content/sankatMochanaHanumanAshtakam";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  getSankatMochanaHanumanAshtakamPageAudioTrackPaths,
  hasSankatMochanaHanumanAshtakamPageAudio,
  SANKAT_MOCHANA_HANUMAN_ASHTAKAM_AUDIO_PACK,
} from "../audio/sankatMochanaHanumanAshtakamSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "SankatMochanaHanumanAshtakam"
  >;
};

export default function SankatMochanaHanumanAshtakam({ navigation }: Props) {
  const route =
    useRoute<RouteProp<RootStackParamList, "SankatMochanaHanumanAshtakam">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: sankatMochanaHanumanAshtakamOpening,
      coverHint: "సంకటమోచన హనుమదష్టకం →",
      deityImage: DEITY_ICONS.hanuman,
      deityLabel: "Lord Hanuman",
      readerPages: getSankatMochanaHanumanAshtakamReaderPages(),
      audioPackId: SANKAT_MOCHANA_HANUMAN_ASHTAKAM_AUDIO_PACK,
      getPageAudioTrackPaths: getSankatMochanaHanumanAshtakamPageAudioTrackPaths,
      hasPageAudio: hasSankatMochanaHanumanAshtakamPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      screenKey="SankatMochanaHanumanAshtakam"
      config={config}
    />
  );
}
