import React, { useEffect } from "react";
import { Icon, ListItem, Text } from "@rneui/themed";
import GetAllCategorys from "../../../../core/useCases/category/getAllCategory";
import SQLiteCategoryReadRepository from "../../../secondaries/SQLite/category/categoryReadRepository";
import CategoryDto from "../../../../core/domain/models/category/dto/categoryDto";
import { ScrollView } from "react-native";
import ExpenseDto from "../../../../core/domain/models/expense/dto/ExpenseDto";
import GetExpenses from "../../../../core/useCases/expense/getExpensesPerMonth";
import { IExpenseReadRepository } from "../../../../core/useCases/expense/interfaces/expenseReadRepository";
import SQLiteExpenseReadRepository from "../../../secondaries/SQLite/expense/expenseReadRepository";

const Expenses: any = () => {
  // here we should use the DI
  const categoryReadRepository = new SQLiteCategoryReadRepository();
  const expenseReadRepository: IExpenseReadRepository =
    new SQLiteExpenseReadRepository();
  const getCategories = new GetAllCategorys(categoryReadRepository);
  const getExpensesPerMonth = new GetExpenses(expenseReadRepository);

  const [categories, setCategories] = React.useState<
    ({ expended: boolean; expenses: ExpenseDto[] } & CategoryDto)[]
  >([]);

  useEffect(() => {
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
  }, []);

  return (
    <ScrollView>
      {categories.length > 0 ? (
        categories.map((category, index) => (
          <ListItem.Accordion
            onPress={() => {
              setCategories((prevState) => {
                prevState[index].expended = !prevState[index].expended;
                return [...prevState];
              });
            }}
            content={
              <>
                <Icon name="category" size={30} />
                <ListItem.Content>
                  <ListItem.Title>{category.name}</ListItem.Title>
                  <ListItem.Subtitle>
                    {category.expenses
                      .map((e) => e.amount)
                      .reduce((prev, current) => prev + current, 0)}{" "}
                    / {category.budget}€
                  </ListItem.Subtitle>
                </ListItem.Content>
              </>
            }
            isExpanded={category.expended}
          >
            {category.expenses.map((exp) =>
              exp.category.id === category.id ? (
                <ListItem key={exp.id} bottomDivider>
                  <ListItem.Content>
                    <ListItem.Title>{exp.name}</ListItem.Title>
                    <ListItem.Subtitle>{exp.amount}€</ListItem.Subtitle>
                  </ListItem.Content>
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
