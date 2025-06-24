import { SafeAreaView } from "react-native";

import Header from "../components/Header";
import UploadCSV from "../components/UploadCSV";
import ProductList from "../components/ProductList";
import styles from "./styles";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <UploadCSV />
      <ProductList />
    </SafeAreaView>
  );
}
