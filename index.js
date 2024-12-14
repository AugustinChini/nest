/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./src/adapters/primaries/react-native/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
