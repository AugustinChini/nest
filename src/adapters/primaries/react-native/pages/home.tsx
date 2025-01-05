import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import SQLiteManager from "../../../secondaries/SQLite/sqlite";
import { useIsFocused } from "@react-navigation/native";
import { Dimensions, View } from "react-native";
import appState from "../common/appState";
import { LineChart } from "react-native-chart-kit";
import Svg, { Text as TextSVG } from "react-native-svg";
import CategoryDto from "../../../../core/domain/models/category/dto/categoryDto";
import GetAllCategorys from "../../../../core/useCases/category/getAllCategory";
import SQLiteCategoryReadRepository from "../../../secondaries/SQLite/category/categoryReadRepository";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import ExpenseOverlay from "../components/overlay/overlay";
import { Text } from "@rneui/themed";
import GetExpenses from "../../../../core/useCases/expense/getExpensesPerMonth";
import SQLiteExpenseReadRepository from "../../../secondaries/SQLite/expense/expenseReadRepository";
import { IExpenseReadRepository } from "../../../../core/useCases/expense/interfaces/expenseReadRepository";
import { ICategoryReadRepository } from "../../../../core/useCases/category/interfaces/categoryReadRepository";
import { Dataset } from "react-native-chart-kit/dist/HelperTypes";

const HomePage = () => {
  const categoryReadRepository: ICategoryReadRepository =
    new SQLiteCategoryReadRepository();
  const expenseReadRepository: IExpenseReadRepository =
    new SQLiteExpenseReadRepository();
  const getCategories = new GetAllCategorys(categoryReadRepository);
  const getExpensesPerMonth = new GetExpenses(expenseReadRepository);

  const [overlayState, setOverlayState] = useState<{
    visible: boolean;
    category: CategoryDto | null;
  }>({ visible: false, category: null });
  const setAppState = useSetRecoilState(appState);
  const db = SQLiteManager.getInstance();
  const isFocused = useIsFocused();
  const app = useRecoilValue(appState);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const data = React.useRef<LineChartData & { sum: number[] }>({
    labels: [],
    datasets: [],
    legend: [],
    sum: [],
  });
  const [categories, setCategories] = React.useState<CategoryDto[]>([]);

  useEffect(() => {
    if (app.initialized === false)
      db.createConnection().then(() => {
        setAppState({ initialized: true });
      });
  }, []);

  useEffect(() => {
    if (isFocused && app.initialized) {
      fetchCategories();
    }
  }, [app.initialized, isFocused]);

  const fetchCategories = async () => {
    getCategories.execute().then(async (categories) => {
      const labels: string[] = [];
      const expenses = await getExpensesPerMonth.execute(new Date());
      const sumExpenses: number[] = [];
      const percentExpenses: number[] = [];

      categories.forEach((c, i) => {
        labels.push(c.toDto().name);
        labels.push("");
        sumExpenses.push(0);
        sumExpenses.push(0);
        percentExpenses.push(0);
        percentExpenses.push(0);
        const currentIndex = percentExpenses.length - 1;
        expenses.forEach((e) => {
          if (e.toDto().category.id === c.toDto().id) {
            sumExpenses[currentIndex] += e.toDto().amount;
            sumExpenses[currentIndex - 1] += e.toDto().amount;
            percentExpenses[currentIndex] = parseFloat(
              ((sumExpenses[currentIndex] / c.toDto().budget) * 100).toFixed(0)
            );
            percentExpenses[currentIndex - 1] = parseFloat(
              ((sumExpenses[currentIndex] / c.toDto().budget) * 100).toFixed(0)
            );
          }
        });
      });

      data.current = {
        labels,
        sum: sumExpenses,
        datasets: categories.map((c) => {
          return {
            data: percentExpenses,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          };
        }),
      };
      setCategories(categories.map((c) => c.toDto()));
    });
  };

  const handlePointClick = (cat: CategoryDto | null) => {
    setOverlayState((prev) => {
      if (prev.visible) return { visible: false, category: null };
      return { visible: true, category: cat };
    });
  };

  return categories.length ? (
    <>
      <LineChart
        data={data.current}
        width={windowWidth}
        height={windowHeight}
        hidePointsAtIndex={[1, 3, 5, 7, 9, 11, 13, 15, 17, 19]}
        getDotColor={() => "#e08b19"}
        yAxisLabel=""
        fromZero
        renderDotContent={(params: {
          x: number;
          y: number;
          index: number;
          indexData: number;
        }) => {
          return (
            <View key={Math.random()}>
              <Svg
                onPress={() => handlePointClick(categories[params.index / 2])}
              >
                <TextSVG
                  x={params.x + 35}
                  y={params.y + 20}
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {categories[params.index / 2].budget}€
                </TextSVG>
                <TextSVG
                  x={params.x + 35}
                  y={params.y + 40}
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {data.current.sum.length >= params.index
                    ? data.current.sum[params.index]
                    : 0}
                  €
                </TextSVG>
              </Svg>
            </View>
          );
        }}
        getDotProps={() => {
          return {
            r: "10",
          };
        }}
        onDataPointClick={(data: {
          index: number;
          value: number;
          dataset: Dataset;
          x: number;
          y: number;
          getColor: (opacity: number) => string;
        }) => handlePointClick(categories[data.index / 2])}
        bezier
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
      <ExpenseOverlay
        visible={overlayState.visible}
        onBackdropPress={() => handlePointClick(null)}
        onSubmit={fetchCategories}
        category={overlayState.category}
      />
    </>
  ) : (
    <Text>Loading</Text>
  );
};
export default HomePage;
