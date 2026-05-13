import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { colors } from "../constants/colors";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={[globalStyles.screenContainer, styles.center]}>
      <Text style={globalStyles.primaryText}>Página não encontrada.</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Voltar para o início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.primaryContrast,
    fontSize: 16,
    fontWeight: "600",
  },
});
