import { useSetRecoilState } from "recoil";
import SQLiteManager from "../../../secondaries/SQLite/sqlite";
import appState from "../common/appState";
import { Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const HomePage = () => {
  const setAppState = useSetRecoilState(appState);
  const db = SQLiteManager.getInstance();
  db.createConnection().then(() => {
    setAppState({ initialized: true });
  });
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  return (
    <BarChart
      data={data}
      width={windowWidth}
      height={windowHeight - 50}
      yAxisLabel="€"
      verticalLabelRotation={30}
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#141414",
        backgroundGradientTo: "#272727",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      }}
      yAxisSuffix="$"
    />
  );
};
export default HomePage;
