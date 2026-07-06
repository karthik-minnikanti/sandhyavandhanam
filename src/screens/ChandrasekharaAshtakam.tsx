import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  chandrasekharaAshtakamOpening,
  getChandrasekharaAshtakamReaderPages,
} from "../content/chandrasekharaAshtakam";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  CHANDRASEKHARA_AUDIO_PACK,
  getChandrasekharaPageAudioTrackPaths,
  hasChandrasekharaPageAudio,
} from "../audio/chandrasekharaSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "ChandrasekharaAshtakam"
  >;
};

export default function ChandrasekharaAshtakam({ navigation }: Props) {
  const route =
    useRoute<RouteProp<RootStackParamList, "ChandrasekharaAshtakam">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: chandrasekharaAshtakamOpening,
      coverHint: "చంద్రశేఖరాష్టకం →",
      deityImage: DEITY_ICONS.shiva,
      deityLabel: "Lord Shiva",
      readerPages: getChandrasekharaAshtakamReaderPages(),
      audioPackId: CHANDRASEKHARA_AUDIO_PACK,
      getPageAudioTrackPaths: getChandrasekharaPageAudioTrackPaths,
      hasPageAudio: hasChandrasekharaPageAudio,
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
