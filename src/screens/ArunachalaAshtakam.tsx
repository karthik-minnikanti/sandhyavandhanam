import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  arunachalaAshtakamOpening,
  getArunachalaAshtakamReaderPages,
} from "../content/arunachalaAshtakam";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  ARUNACHALA_AUDIO_PACK,
  getArunachalaPageAudioTrackPaths,
  hasArunachalaPageAudio,
} from "../audio/arunachalaSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ArunachalaAshtakam">;
};

export default function ArunachalaAshtakam({ navigation }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, "ArunachalaAshtakam">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: arunachalaAshtakamOpening,
      coverHint: "అరుణాచలాష్టకం →",
      deityImage: DEITY_ICONS.shiva,
      deityLabel: "Lord Shiva",
      readerPages: getArunachalaAshtakamReaderPages(),
      audioPackId: ARUNACHALA_AUDIO_PACK,
      getPageAudioTrackPaths: getArunachalaPageAudioTrackPaths,
      hasPageAudio: hasArunachalaPageAudio,
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
