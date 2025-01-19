import React, { useEffect } from "react";
import { Button, Icon, ListItem, Text } from "@rneui/themed";
import GetAllCategorys from "../../../../core/useCases/category/getAllCategory";
import SQLiteCategoryReadRepository from "../../../secondaries/SQLite/category/categoryReadRepository";
import CategoryDto from "../../../../core/domain/models/category/dto/categoryDto";
import { ScrollView, View } from "react-native";
import ExpenseDto from "../../../../core/domain/models/expense/dto/ExpenseDto";
import GetExpenses from "../../../../core/useCases/expense/getExpensesPerMonth";
import { IExpenseReadRepository } from "../../../../core/useCases/expense/interfaces/expenseReadRepository";
import SQLiteExpenseReadRepository from "../../../secondaries/SQLite/expense/expenseReadRepository";
import DeleteExpense from "../../../../core/useCases/expense/deleteExpense";
import { IExpenseWriteRepository } from "../../../../core/useCases/expense/interfaces/expenseWriteRepository";
import SQLiteExpenseWriteRepository from "../../../secondaries/SQLite/expense/expenseWriteRepository";
import CreateOrUpdateExpense from "../../../../core/useCases/expense/createOrUpdateExpense";
import CreateOrUpdateExpenseCommand from "../../../../core/useCases/expense/types/createOrUpdateExpenseCommand";

const Expenses: any = () => {
  // here we should use the DI
  const categoryReadRepository = new SQLiteCategoryReadRepository();
  const expenseReadRepository: IExpenseReadRepository =
    new SQLiteExpenseReadRepository();
  const expenseWriteRepository: IExpenseWriteRepository =
    new SQLiteExpenseWriteRepository();
  const getCategories = new GetAllCategorys(categoryReadRepository);
  const getExpensesPerMonth = new GetExpenses(expenseReadRepository);
  const deleteExpense = new DeleteExpense(expenseWriteRepository);
  const createOrUpdateExpenseCommand = new CreateOrUpdateExpense(
    expenseWriteRepository,
    categoryReadRepository
  );

  const [categories, setCategories] = React.useState<
    ({ expended: boolean; expenses: ExpenseDto[] } & CategoryDto)[]
  >([]);

  useEffect(() => {
    getCategories.execute().then(async (categories) => {
      const expenses = await getExpensesPerMonth.execute(new Date());

      const directDebitCatDto: CategoryDto[] = categories
        .filter((c) => c.toDto().direct === true)
        .map((c) => c.toDto());

      if (directDebitCatDto?.length) {
        directDebitCatDto.forEach((cat) => {
          if (!expenses.find((exp) => exp.toDto().category.id === cat.id)) {
            const newExp: CreateOrUpdateExpenseCommand = new ExpenseDto({
              id: null,
              amount: cat.budget,
              category: cat,
              date: new Date(),
              name: cat.name,
            });
            createOrUpdateExpenseCommand.execute(newExp);
          }
        });
      }

      setCategories(
        categories.map((c) => {
          const currentCatDto = c.toDto();
          return {
            ...currentCatDto,
            expended: false,
            expenses: expenses
              .filter((exp) => exp.toDto().category.id === currentCatDto.id)
              .map((exp) => exp.toDto()),
          };
        })
      );
    });
  }, []);

  const handleDelete = (id: number) => {
    deleteExpense.execute({ id }).then(() => {
      getCategories.execute().then(async (categories) => {
        const expenses = await getExpensesPerMonth.execute(new Date());
        setCategories(
          categories.map((c) => {
            const currentCatDto = c.toDto();
            return {
              ...currentCatDto,
              expended: false,
              expenses: expenses
                .filter((exp) => exp.toDto().category.id === currentCatDto.id)
                .map((exp) => exp.toDto()),
            };
          })
        );
      });
    });
  };

  return (
    <ScrollView>
      {categories.length > 0 ? (
        categories.map((category, index) => (
          <ListItem.Accordion
            key={category.id + "cat"}
            onPress={() => {
              setCategories((prevState) => {
                prevState[index].expended = !prevState[index].expended;
                return [...prevState];
              });
            }}
            content={
              <View
                key={category.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <Icon
                  name="category"
                  size={30}
                  style={{
                    marginRight: 10,
                  }}
                />
                <ListItem.Content>
                  <ListItem.Title>{category.name}</ListItem.Title>
                  <ListItem.Subtitle>
                    {category.expenses
                      .map((e) => e.amount)
                      .reduce((prev, current) => prev + current, 0)}{" "}
                    / {category.budget}€
                  </ListItem.Subtitle>
                </ListItem.Content>
              </View>
            }
            isExpanded={category.expended}
          >
            {category.expenses.map((exp) =>
              exp.category.id === category.id ? (
                <ListItem key={exp.id + "exp"} bottomDivider>
                  <ListItem.Content style={{ marginLeft: 40 }}>
                    <ListItem.Title>{exp.name}</ListItem.Title>
                    <ListItem.Subtitle>{exp.amount}€</ListItem.Subtitle>
                  </ListItem.Content>
                  <Button
                    radius={"sm"}
                    type="clear"
                    onPress={() => {
                      handleDelete(exp.id);
                    }}
                  >
                    <Icon name="delete" color="red" />
                  </Button>
                </ListItem>
              ) : null
            )}
          </ListItem.Accordion>
        ))
      ) : (
        <Text>Loading</Text>
      )}
    </ScrollView>
  );
};
export default Expenses;
