import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

const SIZE = 200;
const RADIUS = SIZE / 2;

function polarToXY(angleDeg, radius) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: RADIUS + radius * Math.cos(rad),
    y: RADIUS + radius * Math.sin(rad),
  };
}

function PieSlice({ startAngle, sweepAngle, color }) {
  if (sweepAngle <= 0) return null;

  const clampedSweep = Math.min(sweepAngle, 359.99);

  // Full circle case
  if (clampedSweep >= 359) {
    return (
      <View
        style={[
          styles.fullCircle,
          { backgroundColor: color },
        ]}
      />
    );
  }

  // Use two half-masks to render any arc
  const endAngle = startAngle + clampedSweep;
  const firstHalfEnd = Math.min(startAngle + 180, endAngle);
  const needSecondHalf = clampedSweep > 180;

  return (
    <>
      {/* First half (up to 180°) */}
      <View
        style={[styles.halfCircleContainer, { transform: [{ rotate: `${startAngle}deg` }] }]}
      >
        <View style={[styles.halfCircle, { backgroundColor: color }]} />
      </View>
      {/* Second half (180° to sweep) */}
      {needSecondHalf && (
        <View
          style={[styles.halfCircleContainer, { transform: [{ rotate: `${startAngle + 180}deg` }] }]}
        >
          <View style={[styles.halfCircle, { backgroundColor: color }]} />
        </View>
      )}
    </>
  );
}

export default function PieChartView({ data }) {
  const positiveData = data.filter((d) => d.value > 0);
  const total = positiveData.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Sem dados para exibir</Text>
      </View>
    );
  }

  let currentAngle = 0;
  const slices = positiveData.map((d) => {
    const sweep = (d.value / total) * 360;
    const slice = { ...d, startAngle: currentAngle, sweep };
    currentAngle += sweep;
    return slice;
  });

  return (
    <View style={styles.wrapper}>
      {/* Pie chart */}
      <View style={styles.chartContainer}>
        {/* Background circle */}
        <View style={[styles.fullCircle, { backgroundColor: "#ddd" }]} />
        {/* Slices rendered back-to-front, using clip approach */}
        <View style={styles.pieClip}>
          {slices.map((slice, i) => (
            <PieSlice
              key={i}
              startAngle={slice.startAngle}
              sweepAngle={slice.sweep}
              color={slice.color}
            />
          ))}
        </View>
        {/* Center hole (donut) */}
        <View style={styles.centerHole} />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {slices.map((s, i) => (
          <View key={i} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: s.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>
              {s.label}
            </Text>
            <Text style={styles.legendPercent}>
              {((s.value / total) * 100).toFixed(0)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingVertical: 16,
  },
  chartContainer: {
    width: SIZE,
    height: SIZE,
    position: "relative",
    marginBottom: 20,
  },
  pieClip: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    borderRadius: RADIUS,
    overflow: "hidden",
  },
  fullCircle: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    borderRadius: RADIUS,
  },
  halfCircleContainer: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    overflow: "hidden",
  },
  halfCircle: {
    position: "absolute",
    width: RADIUS,
    height: SIZE,
    left: RADIUS,
    borderTopRightRadius: RADIUS,
    borderBottomRightRadius: RADIUS,
  },
  centerHole: {
    position: "absolute",
    width: SIZE * 0.5,
    height: SIZE * 0.5,
    borderRadius: SIZE * 0.25,
    backgroundColor: colors.background,
    top: SIZE * 0.25,
    left: SIZE * 0.25,
  },
  legend: {
    width: "100%",
    gap: 6,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 8,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    flexShrink: 0,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.primaryText,
  },
  legendPercent: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryText,
    minWidth: 36,
    textAlign: "right",
  },
  empty: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.secondaryText,
    fontSize: 14,
  },
});
