import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  getSubrahmanyaAshtakamReaderPages,
  subrahmanyaAshtakamOpening,
} from "../content/subrahmanyaAshtakam";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  getSubrahmanyaAshtakamPageAudioTrackPaths,
  hasSubrahmanyaAshtakamPageAudio,
  SUBRAHMANYA_ASHTAKAM_AUDIO_PACK,
} from "../audio/subrahmanyaAshtakamSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "SubrahmanyaAshtakam"
  >;
};

export default function SubrahmanyaAshtakam({ navigation }: Props) {
  const route =
    useRoute<RouteProp<RootStackParamList, "SubrahmanyaAshtakam">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: subrahmanyaAshtakamOpening,
      coverHint: "సుబ్రహ్మణ్య అష్టకం →",
      deityImage: DEITY_ICONS.subramanya,
      deityLabel: "Lord Subramanya",
      readerPages: getSubrahmanyaAshtakamReaderPages(),
      audioPackId: SUBRAHMANYA_ASHTAKAM_AUDIO_PACK,
      getPageAudioTrackPaths: getSubrahmanyaAshtakamPageAudioTrackPaths,
      hasPageAudio: hasSubrahmanyaAshtakamPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      screenKey="SubrahmanyaAshtakam"
      config={config}
    />
  );
}
