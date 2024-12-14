import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RecoilRoot } from "recoil";
import React from "react";
import CtDialog from "./components/dialog/dialog";
import CtHeader from "./components/header/ct-header";
import HomePage from "./pages/home";
import Settings from "./pages/settings";

const App = () => {
  const Stack = createNativeStackNavigator();
  if (!__DEV__) {
    console.log = () => {};
  }
  return (
    <RecoilRoot>
      <NavigationContainer>
        <CtDialog />
        <CtHeader />
        <Stack.Navigator
          initialRouteName="home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="home" component={HomePage} />
          <Stack.Screen name="settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
};

export default App;
