import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookCover from "./src/screens/BookCover";
import TableOfContents from "./src/screens/TableOfContents";
import SandhyavandanamVidhanam from "./src/screens/SandhyavandanamVidhanam";
import YagnopaveetamVidhi from "./src/screens/YagnopaveetamVidhi";
import type { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0f2e1e" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="BookCover" component={BookCover} />
        <Stack.Screen name="TableOfContents" component={TableOfContents} />
        <Stack.Screen name="SandhyavandanamVidhanam" component={SandhyavandanamVidhanam} />
        <Stack.Screen name="YagnopaveetamVidhi" component={YagnopaveetamVidhi} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
