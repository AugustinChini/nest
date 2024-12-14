import ButtonConfig from "./buttonConfig";

type DialogState = {
  visible: boolean;
  title?: string;
  text?: string;
  rightButton?: ButtonConfig;
  leftButton?: ButtonConfig;
};

export default DialogState;
