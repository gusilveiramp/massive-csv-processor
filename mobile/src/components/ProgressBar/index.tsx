import { View, Text } from "react-native";
import { styles } from "./styles";

type Props = {
  progress: number;
};

export default function ProgressBar({ progress }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
  );
}
