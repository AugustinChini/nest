import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import SQLiteManager from "../../../secondaries/SQLite/sqlite";
import { useIsFocused } from "@react-navigation/native";
import { Dimensions, View } from "react-native";
import appState from "../common/appState";
import { LineChart } from "react-native-chart-kit";
import Svg, { Rect, Text as TextSVG } from "react-native-svg";
import CategoryDto from "../../../../core/domain/models/category/dto/categoryDto";
import GetAllCategorys from "../../../../core/useCases/category/getAllCategory";
import SQLiteCategoryReadRepository from "../../../secondaries/SQLite/category/categoryReadRepository";
import { LineChartData } from "react-native-chart-kit/dist/line-chart/LineChart";
import ExpenseOverlay from "../components/overlay/overlay";
import { Text } from "@rneui/themed";

const HomePage = () => {
  const categoryReadRepository = new SQLiteCategoryReadRepository();
  const getCategories = new GetAllCategorys(categoryReadRepository);

  const [overlayVisible, setOverlayVisible] = useState(false);
  const setAppState = useSetRecoilState(appState);
  const db = SQLiteManager.getInstance();
  const isFocused = useIsFocused();
  const app = useRecoilValue(appState);
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const data = React.useRef<LineChartData>({
    labels: [],
    datasets: [],
    legend: [],
  });
  const [categories, setCategories] = React.useState<CategoryDto[]>([]);

  useEffect(() => {
    db.createConnection().then(() => {
      setAppState({ initialized: true });
      fetchCategories();
    });
  }, []);

  useEffect(() => {
    if (isFocused && app.initialized) {
      fetchCategories();
    }
  }, [app.initialized, isFocused]);

  const fetchCategories = async () => {
    getCategories.execute().then((categories) => {
      const labels: string[] = [];
      categories.forEach((c) => {
        labels.push(c.toDto().name);
        labels.push("");
      });
      data.current = {
        labels,
        datasets: categories.map((c) => {
          return {
            data: [
              54, 54, 25, 25, 100, 100, 25, 25, 0, 0, 85, 85, 75, 75, 95, 95,
              10, 10, 45, 45,
            ],
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          };
        }),
      };
      setCategories(categories.map((c) => c.toDto()));
    });
  };

  const handlePointClick = () => {
    setOverlayVisible((prev) => !prev);
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
              <Svg onPress={handlePointClick}>
                <TextSVG
                  x={params.x + 40}
                  y={params.y + 20}
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  B 154€
                </TextSVG>
                <TextSVG
                  x={params.x + 10}
                  y={params.y + 55}
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  -115€
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
        onDataPointClick={handlePointClick}
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
        visible={overlayVisible}
        onBackdropPress={handlePointClick}
        category={categories[0]}
      />
    </>
  ) : (
    <Text>Loading</Text>
  );
};
export default HomePage;
