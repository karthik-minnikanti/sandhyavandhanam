import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  ganeshaPancharatnamOpening,
  getGaneshaPancharatnamReaderPages,
} from "../content/ganeshaPancharatnam";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  GANESHA_PANCHARATNAM_AUDIO_PACK,
  getGaneshaPancharatnamPageAudioTrackPaths,
  hasGaneshaPancharatnamPageAudio,
} from "../audio/ganeshaPancharatnamSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "GaneshaPancharatnam"
  >;
};

export default function GaneshaPancharatnam({ navigation }: Props) {
  const route =
    useRoute<RouteProp<RootStackParamList, "GaneshaPancharatnam">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: ganeshaPancharatnamOpening,
      coverHint: "గణేశ పంచరత్నం →",
      deityImage: DEITY_ICONS.vinayaka,
      deityLabel: "Lord Vinayaka",
      readerPages: getGaneshaPancharatnamReaderPages(),
      audioPackId: GANESHA_PANCHARATNAM_AUDIO_PACK,
      getPageAudioTrackPaths: getGaneshaPancharatnamPageAudioTrackPaths,
      hasPageAudio: hasGaneshaPancharatnamPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      screenKey="GaneshaPancharatnam"
      config={config}
    />
  );
}
