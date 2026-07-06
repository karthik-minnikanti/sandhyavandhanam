import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  getGovindaNamaluReaderPages,
  govindaNamaluOpening,
} from "../content/govindaNamalu";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  getGovindaNamaluPageAudioTrackPaths,
  hasGovindaNamaluPageAudio,
  GOVINDA_NAMALU_AUDIO_PACK,
} from "../audio/govindaNamaluSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "GovindaNamalu">;
};

export default function GovindaNamalu({ navigation }: Props) {
  const route = useRoute<RouteProp<RootStackParamList, "GovindaNamalu">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: govindaNamaluOpening,
      coverHint: "గోవింద నామాలు →",
      deityImage: DEITY_ICONS.venkateswara,
      deityLabel: "Lord Venkateswara",
      readerPages: getGovindaNamaluReaderPages(),
      audioPackId: GOVINDA_NAMALU_AUDIO_PACK,
      getPageAudioTrackPaths: getGovindaNamaluPageAudioTrackPaths,
      hasPageAudio: hasGovindaNamaluPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      screenKey="GovindaNamalu"
      config={config}
    />
  );
}
