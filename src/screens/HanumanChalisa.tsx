import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  getHanumanChalisaReaderPages,
  hanumanChalisaOpening,
} from "../content/hanumanChalisa";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  getHanumanChalisaPageAudioTrackPaths,
  hasHanumanChalisaPageAudio,
  HANUMAN_CHALISA_AUDIO_PACK,
} from "../audio/hanumanChalisaSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "HanumanChalisa">;
};

export default function HanumanChalisa({ navigation }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, "HanumanChalisa">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: hanumanChalisaOpening,
      coverHint: "హనుమాన్ చాలీసా →",
      deityImage: DEITY_ICONS.hanuman,
      deityLabel: "Lord Hanuman",
      readerPages: getHanumanChalisaReaderPages(),
      audioPackId: HANUMAN_CHALISA_AUDIO_PACK,
      getPageAudioTrackPaths: getHanumanChalisaPageAudioTrackPaths,
      hasPageAudio: hasHanumanChalisaPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      screenKey="HanumanChalisa"
      config={config}
    />
  );
}
