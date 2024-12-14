import { atom } from "recoil";
import AppState from "../types/appState";

const appState = atom<AppState>({
  key: "appState",
  default: {
    initialized: false,
  },
});

export default appState;
