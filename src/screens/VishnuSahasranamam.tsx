import React, { useMemo } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import StotramReaderView from "../components/StotramReaderView";
import {
  getVishnuSahasranamamReaderPages,
  vishnuSahasranamamOpening,
} from "../content/vishnuSahasranamam";
import { DEITY_ICONS } from "../content/deityIcons";
import {
  getVishnuSahasranamamPageAudioTrackPaths,
  hasVishnuSahasranamamPageAudio,
  VISHNU_SAHASRANAMAM_AUDIO_PACK,
} from "../audio/vishnuSahasranamamSectionAudio";

type Props = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "VishnuSahasranamam"
  >;
};

export default function VishnuSahasranamam({ navigation }: Props) {
  const route =
    useRoute<RouteProp<RootStackParamList, "VishnuSahasranamam">>();
  const initialPage = route.params?.initialPage ?? 0;

  const config = useMemo(
    () => ({
      opening: vishnuSahasranamamOpening,
      coverHint: "విష్ణు సహస్రనామం →",
      deityImage: DEITY_ICONS.venkateswara,
      deityLabel: "Lord Venkateswara",
      readerPages: getVishnuSahasranamamReaderPages(),
      audioPackId: VISHNU_SAHASRANAMAM_AUDIO_PACK,
      getPageAudioTrackPaths: getVishnuSahasranamamPageAudioTrackPaths,
      hasPageAudio: hasVishnuSahasranamamPageAudio,
    }),
    []
  );

  return (
    <StotramReaderView
      navigation={navigation}
      initialPage={initialPage}
      screenKey="VishnuSahasranamam"
      config={config}
    />
  );
}
