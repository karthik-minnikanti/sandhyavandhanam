import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  gananayakaAshtakamOpening,
  getGananayakaAshtakamReaderPages,
} from "../content/gananayakaAshtakam";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  GANANAYAKA_ASHTAKAM_AUDIO_PACK,
  getGananayakaAshtakamPageAudioTrackPaths,
  hasGananayakaAshtakamPageAudio,
} from "../audio/gananayakaAshtakamSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GananayakaAshtakam"
  >;
};

export default function GananayakaAshtakam({ navigation }: Props) {
  const route =
    useRoute<RouteProp<RootStackParamList, "GananayakaAshtakam">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: gananayakaAshtakamOpening,
      coverHint: "గణనాయకాష్టకం →",
      deityImage: DEITY_ICONS.vinayaka,
      deityLabel: "Lord Vinayaka",
      readerPages: getGananayakaAshtakamReaderPages(),
      audioPackId: GANANAYAKA_ASHTAKAM_AUDIO_PACK,
      getPageAudioTrackPaths: getGananayakaAshtakamPageAudioTrackPaths,
      hasPageAudio: hasGananayakaAshtakamPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      screenKey="GananayakaAshtakam"
      config={config}
    />
  );
}
