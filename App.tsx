import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import { AppProvider } from "./src/context/AppContext";
import BookCover from "./src/screens/BookCover";
import TableOfContents from "./src/screens/TableOfContents";
import Preferences from "./src/screens/Preferences";
import SandhyavandanamVidhanam from "./src/screens/SandhyavandanamVidhanam";
import YagnopaveetamVidhi from "./src/screens/YagnopaveetamVidhi";
import LalithaSahasranamam from "./src/screens/LalithaSahasranamam";
import type { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenshotMode = process.env.EXPO_PUBLIC_SCREENSHOT_MODE === "1";

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      BookCover: "",
      TableOfContents: "toc",
      Preferences: "preferences",
      SandhyavandanamVidhanam: {
        path: "sandhyavandanam/:initialPage?",
        parse: {
          initialPage: (value: string) =>
            value != null && value !== "" ? Number(value) : undefined,
        },
      },
      YagnopaveetamVidhi: "yagnopaveetam",
      LalithaSahasranamam: {
        path: "lalitha/:initialPage?",
        parse: {
          initialPage: (value: string) =>
            value != null && value !== "" ? Number(value) : undefined,
        },
      },
    },
  },
};

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer linking={linking}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0f2e1e" },
            animation: screenshotMode ? "none" : "slide_from_right",
          }}
        >
          <Stack.Screen name="BookCover" component={BookCover} />
          <Stack.Screen name="TableOfContents" component={TableOfContents} />
          <Stack.Screen name="Preferences" component={Preferences} />
          <Stack.Screen name="SandhyavandanamVidhanam" component={SandhyavandanamVidhanam} />
          <Stack.Screen name="YagnopaveetamVidhi" component={YagnopaveetamVidhi} />
          <Stack.Screen name="LalithaSahasranamam" component={LalithaSahasranamam} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
