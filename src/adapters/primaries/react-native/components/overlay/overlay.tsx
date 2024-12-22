import React from "react";
import { Button, Overlay, Icon, Divider, Input } from "@rneui/themed";
import { ToastAndroid, View } from "react-native";
import styles from "./styles";
import CreateOrUpdateExpenseCommand from "../../../../../core/useCases/expense/types/createOrUpdateExpenseCommand";
import CreateOrUpdateExpense from "../../../../../core/useCases/expense/createOrUpdateExpense";
import { Text } from "@rneui/base";
import CategoryDto from "../../../../../core/domain/models/category/dto/categoryDto";
import SQLiteExpenseWriteRepository from "../../../../secondaries/SQLite/expense/expenseWriteRepository";
import SQLiteCategoryReadRepository from "../../../../secondaries/SQLite/category/categoryReadRepository";

const ExpenseOverlay = (props: {
  category: CategoryDto;
  visible: boolean;
  onBackdropPress: () => void;
}) => {
  const { visible } = props;

  const expenseWriteRepository = new SQLiteExpenseWriteRepository();
  const categoryReadRepository = new SQLiteCategoryReadRepository();

  const createOrUpdateExpenseCommand = new CreateOrUpdateExpense(
    expenseWriteRepository,
    categoryReadRepository
  );

  const [expense, setExpense] = React.useState<
    Partial<CreateOrUpdateExpenseCommand>
  >({
    name: "",
    amount: 0,
    date: new Date(),
    category: props.category,
  });

  const handleChangeExpense = (field: string, newVal: string) => {
    setExpense((prevState) => ({ ...prevState, [field]: newVal }));
  };

  const saveExpense = async () => {
    if (!expense.name || !expense.amount || !expense.category) return;
    await createOrUpdateExpenseCommand.execute(
      expense as CreateOrUpdateExpenseCommand
    );
    ToastAndroid.showWithGravity(
      "Expense saved",
      ToastAndroid.SHORT,
      ToastAndroid.TOP
    );
  };

  return visible ? (
    <Overlay isVisible={true} onBackdropPress={props.onBackdropPress}>
      <View style={styles.mainContainer}>
        <Text h4>Add Expense for {props.category.name}</Text>
        <Input
          onChange={(e) => {
            handleChangeExpense("name", e.nativeEvent.text);
          }}
          placeholder="Name"
          leftIcon={{ name: "label-important-outline" }}
          value={expense.name || ""}
          containerStyle={styles.input}
        />
        <Input
          onChange={(e) => {
            const val = parseFloat(e.nativeEvent.text);
            handleChangeExpense("amount", isNaN(val) ? "0" : val.toString());
          }}
          placeholder="Amount"
          keyboardType="numeric"
          leftIcon={{ name: "euro" }}
          value={expense.amount?.toString() || "0"}
          style={styles.input}
        />
      </View>
      <View style={styles.overlayContainer}>
        <View style={styles.buttonView}>
          <Button
            radius={"sm"}
            type="solid"
            buttonStyle={styles.cancelButton}
            onPress={props.onBackdropPress}
          >
            <Icon name="cancel" color="white" />
            Cancel
          </Button>
        </View>
        <View style={styles.buttonView}>
          <Button
            radius={"sm"}
            type="solid"
            onPress={() => {
              saveExpense();
              props.onBackdropPress();
            }}
          >
            <Icon name="save" color="white" />
            OK
          </Button>
        </View>
      </View>
    </Overlay>
  ) : null;
};

export default ExpenseOverlay;
