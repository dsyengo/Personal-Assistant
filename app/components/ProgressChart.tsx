import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "@/constants/Colors";

type ProgressChartProps = {
  weeklyData?: {
    steps?: number[];
  };
  screenWidth: number;
};

const ProgressChart: React.FC<ProgressChartProps> = ({
  weeklyData,
  screenWidth,
}) => {
  // Ensure weeklyData.steps is always an array with valid data
  const stepData =
    weeklyData?.steps &&
    Array.isArray(weeklyData.steps) &&
    weeklyData.steps.length === 7
      ? weeklyData.steps
      : [0, 0, 0, 0, 0, 0, 0];

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Weekly Progress</Text>
      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              data: stepData,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ["Steps"],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundGradientFrom: Colors.light.background,
          backgroundGradientTo: Colors.light.background,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: Colors.light.primaryButton,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 16,
    borderRadius: 10,
    marginVertical: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 10,
  },
});

export default ProgressChart;
