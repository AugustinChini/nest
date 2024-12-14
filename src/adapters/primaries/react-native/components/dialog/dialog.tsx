import React from "react";
import { Dialog, Text } from "@rneui/themed";
import { useRecoilValue } from "recoil";
import dialogState from "./dialogState";

const CtDialog = () => {
  const state = useRecoilValue(dialogState);

  return (
    <Dialog isVisible={state.visible}>
      <Dialog.Title title={state.title} />
      <Text>{state.text}</Text>
      {state.leftButton || state.rightButton ? (
        <Dialog.Actions>
          {state.leftButton ? (
            <Dialog.Button
              title={state.leftButton.title}
              onPress={state.leftButton.onTap}
            />
          ) : null}
          {state.rightButton ? (
            <Dialog.Button
              title={state.rightButton.title}
              onPress={state.rightButton.onTap}
            />
          ) : null}
        </Dialog.Actions>
      ) : null}
    </Dialog>
  );
};

export default CtDialog;
