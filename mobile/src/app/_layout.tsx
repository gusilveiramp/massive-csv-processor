import { Stack } from "expo-router";
import { colors } from "../constants/theme";
import { View } from "react-native";
import styles from "./styles";
import { ProductProvider } from "../contexts/ProductContext";

export default function RootLayout() {
  return (
    <ProductProvider>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.darkBlue,
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Home",
              contentStyle: {
                backgroundColor: colors.darkBlue,
              },
            }}
          />
          <Stack.Screen
            name="product/[id]"
            options={{
              title: "",
              headerShown: true,
              headerBackTitle: "back",
              headerTintColor: colors.white,
              headerTransparent: true,
              contentStyle: {
                backgroundColor: colors.darkBlue,
              },
            }}
          />
        </Stack>
      </View>
    </ProductProvider>
  );
}
