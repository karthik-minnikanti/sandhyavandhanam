import { Alert } from "react-native";

export function showAudioError(
  message = "Couldn't load audio. Check your connection and try again."
) {
  Alert.alert("Audio", message);
}
