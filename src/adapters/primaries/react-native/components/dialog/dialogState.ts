import { atom } from "recoil";
import DialogState from "../../types/dialogState";

const dialogState = atom<DialogState>({
  key: "dialogState",
  default: {
    visible: false,
  },
});

export default dialogState;
