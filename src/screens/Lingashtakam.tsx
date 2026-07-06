import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  getLingashtakamReaderPages,
  lingashtakamOpening,
} from "../content/lingashtakam";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  getLingashtakamPageAudioTrackPaths,
  hasLingashtakamPageAudio,
  LINGASHTAKAM_AUDIO_PACK,
} from "../audio/lingashtakamSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Lingashtakam">;
};

export default function Lingashtakam({ navigation }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, "Lingashtakam">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: lingashtakamOpening,
      coverHint: "లింగాష్టకం →",
      deityImage: DEITY_ICONS.shiva,
      deityLabel: "Lord Shiva",
      readerPages: getLingashtakamReaderPages(),
      audioPackId: LINGASHTAKAM_AUDIO_PACK,
      getPageAudioTrackPaths: getLingashtakamPageAudioTrackPaths,
      hasPageAudio: hasLingashtakamPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      config={config}
    />
  );
}
