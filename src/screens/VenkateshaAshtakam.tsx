import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  getVenkateshaAshtakamReaderPages,
  venkateshaAshtakamOpening,
} from "../content/venkateshaAshtakam";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  getVenkateshaAshtakamPageAudioTrackPaths,
  hasVenkateshaAshtakamPageAudio,
  VENKATESHA_ASHTAKAM_AUDIO_PACK,
} from "../audio/venkateshaAshtakamSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "VenkateshaAshtakam"
  >;
};

export default function VenkateshaAshtakam({ navigation }: Props) {
  const route =
    useRoute<RouteProp<RootStackParamList, "VenkateshaAshtakam">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: venkateshaAshtakamOpening,
      coverHint: "వేంకటేశ అష్టకం →",
      deityImage: DEITY_ICONS.venkateswara,
      deityLabel: "Lord Venkateswara",
      readerPages: getVenkateshaAshtakamReaderPages(),
      audioPackId: VENKATESHA_ASHTAKAM_AUDIO_PACK,
      getPageAudioTrackPaths: getVenkateshaAshtakamPageAudioTrackPaths,
      hasPageAudio: hasVenkateshaAshtakamPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      screenKey="VenkateshaAshtakam"
      config={config}
    />
  );
}
