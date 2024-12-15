import { useSetRecoilState } from "recoil";
import SQLiteManager from "../../../secondaries/SQLite/sqlite";
import appState from "../common/appState";
import { Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Text } from "react-native-svg";
import React, { useEffect } from "react";
import CategoryDto from "../../../../core/domain/models/category/dto/categoryDto";
import GetAllCategorys from "../../../../core/useCases/category/getAllCategory";
import UpdateCategory from "../../../../core/useCases/category/updateCategory";
import CreateCategory from "../../../../core/useCases/category/createCategory";
import SQLiteCategoryReadRepository from "../../../secondaries/SQLite/category/categoryReadRepository";
import SQLiteCategoryWriteRepository from "../../../secondaries/SQLite/category/categoryWriteRepository";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";

const HomePage = () => {
  const categoryReadRepository = new SQLiteCategoryReadRepository();
  const categoryWriteRepository = new SQLiteCategoryWriteRepository();
  const getCategories = new GetAllCategorys(categoryReadRepository);

  const setAppState = useSetRecoilState(appState);
  const db = SQLiteManager.getInstance();
  db.createConnection().then(() => {
    setAppState({ initialized: true });
  });
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const data = React.useRef<ChartData>({
    labels: [],
    datasets: [],
  });
  const [categories, setCategories] = React.useState<CategoryDto[]>([]);

  useEffect(() => {
    getCategories.execute().then((categories) => {
      data.current = {
        labels: categories.map((c) => c.toDto().name),
        datasets: [
          {
            data: categories.map((c) => 100),
          },
        ],
      };
      setCategories(categories.map((c) => c.toDto()));
    });
  }, []);

  return categories.length ? (
    <BarChart
      data={data.current}
      width={windowWidth}
      height={windowHeight}
      yAxisLabel=""
      verticalLabelRotation={30}
      fromZero
      showValuesOnTopOfBars
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#141414",
        backgroundGradientTo: "#272727",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      }}
      yAxisSuffix="%"
    />
  ) : (
    <Text>Loading</Text>
  );
};
export default HomePage;
