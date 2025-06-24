import { Image, SafeAreaView, View } from "react-native";
import { styles } from "./styles";

export default function Header() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={require("../../assets/images/react-logo.png")} />
      </View>
    </SafeAreaView>
  );
}
