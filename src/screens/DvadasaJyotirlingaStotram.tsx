import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  dvadasaJyotirlingaOpening,
  getDvadasaJyotirlingaReaderPages,
} from "../content/dvadasaJyotirlingaStotram";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  JYOTIRLINGA_AUDIO_PACK,
  getJyotirlingaPageAudioTrackPaths,
  hasJyotirlingaPageAudio,
} from "../audio/jyotirlingaSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "DvadasaJyotirlingaStotram"
  >;
};

export default function DvadasaJyotirlingaStotram({ navigation }: Props) {
  const route =
    useRoute<RouteProp<RootStackParamList, "DvadasaJyotirlingaStotram">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: dvadasaJyotirlingaOpening,
      coverHint: "ద్వాదశ జ్యోతిర్లింగ స్తోత్రం →",
      deityImage: DEITY_ICONS.shiva,
      deityLabel: "Lord Shiva",
      readerPages: getDvadasaJyotirlingaReaderPages(),
      audioPackId: JYOTIRLINGA_AUDIO_PACK,
      getPageAudioTrackPaths: getJyotirlingaPageAudioTrackPaths,
      hasPageAudio: hasJyotirlingaPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      screenKey="DvadasaJyotirlingaStotram"
      config={config}
    />
  );
}
