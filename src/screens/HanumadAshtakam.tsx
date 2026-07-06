import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  getHanumadAshtakamReaderPages,
  hanumadAshtakamOpening,
} from "../content/hanumadAshtakam";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  getHanumadAshtakamPageAudioTrackPaths,
  hasHanumadAshtakamPageAudio,
  HANUMAD_ASHTAKAM_AUDIO_PACK,
} from "../audio/hanumadAshtakamSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "HanumadAshtakam">;
};

export default function HanumadAshtakam({ navigation }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, "HanumadAshtakam">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: hanumadAshtakamOpening,
      coverHint: "హనుమదష్టకం →",
      deityImage: DEITY_ICONS.hanuman,
      deityLabel: "Lord Hanuman",
      readerPages: getHanumadAshtakamReaderPages(),
      audioPackId: HANUMAD_ASHTAKAM_AUDIO_PACK,
      getPageAudioTrackPaths: getHanumadAshtakamPageAudioTrackPaths,
      hasPageAudio: hasHanumadAshtakamPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      screenKey="HanumadAshtakam"
      config={config}
    />
  );
}
