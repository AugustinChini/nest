import React, { useEffect } from "react";
import { Avatar, Input, ListItem, Text } from "@rneui/themed";
import { add } from "date-fns";
import {
  NativeSyntheticEvent,
  TextInputEndEditingEventData,
} from "react-native";
import GetAllCategorys from "../../../../core/useCases/category/getAllCategory";
import SQLiteCategoryReadRepository from "../../../secondaries/SQLite/category/categoryReadRepository";
import Category from "../../../../core/domain/models/category/category";

const Settings = () => {
  const orderReadRepository = new SQLiteCategoryReadRepository();
  const getOrders = new GetAllCategorys(orderReadRepository);

  useEffect(() => {
    getOrders
      .execute()
      .then((categories) =>
        setCategories([
          {
            id: 0,
            name: "",
            budget: 0,
            direct: false,
            temporary: false,
          } as unknown as Category,
          ...categories,
        ])
      );
  }, []);

  const [expanded, setExpanded] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);

  const addCategory = (
    e: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {};

  return (
    categories.length > 0 &&
    categories.map((category) => (
      <ListItem.Accordion
        content={
          <ListItem.Content>
            <Input
              onEndEditing={addCategory}
              placeholder="Category"
              leftIcon={{ name: "euro" }}
            />
          </ListItem.Content>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}
      >
        <ListItem>
          <Avatar
            rounded
            source={{
              uri: "https://randomuser.me/api/portraits/men/32.jpg",
            }}
          />
          <ListItem.Content>
            <ListItem.Title>John Doe</ListItem.Title>
            <ListItem.Subtitle>Principle Engineer</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        <ListItem>
          <Avatar
            rounded
            source={{
              uri: "https://randomuser.me/api/portraits/men/36.jpg",
            }}
          />
          <ListItem.Content>
            <ListItem.Title>Albert</ListItem.Title>
            <ListItem.Subtitle>Staff Engineer</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </ListItem.Accordion>
    ))
  );
};
export default Settings;
