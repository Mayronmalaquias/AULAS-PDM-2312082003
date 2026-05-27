import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "../constants/colors";

const SIZE = 200;
const CX = SIZE / 2;
const CY = SIZE / 2;
const OUTER_R = SIZE / 2;
const INNER_R = SIZE * 0.25;

function toRad(deg) {
  return ((deg - 90) * Math.PI) / 180;
}

function polarToCart(r, angleDeg) {
  const rad = toRad(angleDeg);
  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad),
  };
}

function buildSlicePath(startAngle, sweepAngle) {
  const endAngle = startAngle + sweepAngle;
  const largeArc = sweepAngle > 180 ? 1 : 0;

  const o1 = polarToCart(OUTER_R, startAngle);
  const o2 = polarToCart(OUTER_R, endAngle);
  const i2 = polarToCart(INNER_R, endAngle);
  const i1 = polarToCart(INNER_R, startAngle);

  return [
    `M ${o1.x} ${o1.y}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${i1.x} ${i1.y}`,
    "Z",
  ].join(" ");
}

function buildFullCirclePath(outerR, innerR) {
  // SVG arcs can't span 360°, so draw two 180° arcs
  const top = { x: CX, y: CY - outerR };
  const bot = { x: CX, y: CY + outerR };
  const itop = { x: CX, y: CY - innerR };
  const ibot = { x: CX, y: CY + innerR };

  return [
    `M ${top.x} ${top.y}`,
    `A ${outerR} ${outerR} 0 1 1 ${bot.x} ${bot.y}`,
    `A ${outerR} ${outerR} 0 1 1 ${top.x} ${top.y}`,
    `M ${itop.x} ${itop.y}`,
    `A ${innerR} ${innerR} 0 1 0 ${ibot.x} ${ibot.y}`,
    `A ${innerR} ${innerR} 0 1 0 ${itop.x} ${itop.y}`,
    "Z",
  ].join(" ");
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
      <Svg width={SIZE} height={SIZE} style={styles.chart}>
        {slices.map((slice, i) => {
          const path =
            slice.sweep >= 359.99
              ? buildFullCirclePath(OUTER_R, INNER_R)
              : buildSlicePath(slice.startAngle, slice.sweep);
          return <Path key={i} d={path} fill={slice.color} />;
        })}
      </Svg>

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
  chart: {
    marginBottom: 20,
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
