import React, { useEffect } from "react";
import { Avatar, Button, Input, ListItem, Switch, Text } from "@rneui/themed";
import GetAllCategorys from "../../../../core/useCases/category/getAllCategory";
import UpdateCategory from "../../../../core/useCases/category/updateCategory";
import CreateCategory from "../../../../core/useCases/category/createCategory";
import DeleteCategory from "../../../../core/useCases/category/deleteCategory";
import SQLiteCategoryReadRepository from "../../../secondaries/SQLite/category/categoryReadRepository";
import SQLiteCategoryWriteRepository from "../../../secondaries/SQLite/category/categoryWriteRepository";
import CreateCategoryCommand from "../../../../core/useCases/category/types/createCategoryCommand";
import UpdateCategoryCommand from "../../../../core/useCases/category/types/updateCategoryCommand";
import CategoryDto from "../../../../core/domain/models/category/dto/categoryDto";
import { ScrollView, ToastAndroid, View } from "react-native";

const Settings: any = () => {
  // here we should use the DI
  const categoryReadRepository = new SQLiteCategoryReadRepository();
  const categoryWriteRepository = new SQLiteCategoryWriteRepository();
  const getCategories = new GetAllCategorys(categoryReadRepository);
  const createCategory = new CreateCategory(categoryWriteRepository);
  const deleteCategory = new DeleteCategory(categoryWriteRepository);
  const updateCategory = new UpdateCategory(
    categoryWriteRepository,
    categoryReadRepository
  );

  useEffect(() => {
    getCategories.execute().then((categories) =>
      setCategories([
        {
          id: -1,
          name: "",
          budget: 0,
          direct: false,
          temporary: false,
        },
        ...categories.map((c) => c.toDto()),
      ])
    );
  }, []);

  const [expanded, setExpanded] = React.useState(false);
  const [categories, setCategories] = React.useState<CategoryDto[]>([]);

  const handleChangeCategory = (updatedCat: CategoryDto, index: number) => {
    setCategories((prevState) => {
      prevState[index] = updatedCat;
      return [...prevState];
    });
  };

  const saveCat = async (index: number, newCat?: CategoryDto) => {
    try {
      let toSaveCat = newCat || categories[index];
      if (toSaveCat.id === -1 && toSaveCat) {
        const createCategoryCommand: CreateCategoryCommand = {
          name: toSaveCat.name,
          budget: toSaveCat.budget,
          direct: toSaveCat.direct,
          temporary: toSaveCat.temporary,
        };
        await createCategory.execute(createCategoryCommand);
      } else {
        const updateCategoryCommand: UpdateCategoryCommand = {
          id: toSaveCat.id,
          name: toSaveCat.name,
          budget: toSaveCat.budget,
          direct: toSaveCat.direct,
          temporary: toSaveCat.temporary,
        };
        await updateCategory.execute(updateCategoryCommand);
      }

      ToastAndroid.showWithGravity(
        "Category saved",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    } catch (e) {
      ToastAndroid.showWithGravity(
        "Category not saved",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
  };

  function handleDeleteCategory(index: number): void {
    deleteCategory.execute({ id: categories[index].id });
    setCategories((prevState) => {
      prevState.splice(index, 1);
      return [...prevState];
    });
  }

  return (
    <ScrollView>
      {categories.length > 0 ? (
        categories.map((category, index) => (
          <ListItem.Swipeable
            key={category.id}
            onPress={() => {
              setExpanded(!expanded);
            }}
            rightContent={() => (
              <Button
                title="Delete"
                onPress={() => handleDeleteCategory(index)}
                icon={{ name: "delete", color: "white" }}
                buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
              />
            )}
          >
            <ListItem.Content>
              <Input
                onChange={(e) =>
                  handleChangeCategory(
                    { ...category, name: e.nativeEvent.text },
                    index
                  )
                }
                onEndEditing={() => saveCat(index)}
                placeholder="Category"
                leftIcon={{ name: "money" }}
                value={category.name}
              />

              <Input
                onEndEditing={() => saveCat(index)}
                onChange={(e) => {
                  const val = parseFloat(e.nativeEvent.text);
                  handleChangeCategory(
                    { ...category, budget: isNaN(val) ? 0 : val },
                    index
                  );
                }}
                placeholder="Budget"
                keyboardType="numeric"
                leftIcon={{ name: "euro" }}
                value={category.budget.toString()}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Switch
                  value={category.direct}
                  onValueChange={(value) => {
                    let updatedCat = { ...category, direct: value };
                    handleChangeCategory(updatedCat, index);
                    saveCat(index, updatedCat);
                  }}
                />
                <Text style={{ paddingLeft: 5 }}>Bank Direct Debit</Text>
              </View>
            </ListItem.Content>
          </ListItem.Swipeable>
        ))
      ) : (
        <Text>Loading</Text>
      )}
    </ScrollView>
  );
};
export default Settings;
