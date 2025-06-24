import React from "react";
import { View } from "react-native";
import { styles } from "./styles";
import UploadProgress from "../UploadProgreess";
import { AppButton } from "../AppButton";
import { useProducts } from "../../contexts/ProductContext";
import { useUploadCSV } from "../../hooks/useUploadCSV";

export default function UploadCSV() {
  const { fetchProducts } = useProducts();

  const { jobId, isUploading, handleUpload, setJobId, setIsUploading } =
    useUploadCSV();

  function handleUploadDone() {
    setIsUploading(false);
    fetchProducts(true);
    setTimeout(() => setJobId(""), 5000);
  }

  return (
    <View style={styles.container}>
      <AppButton
        title="Select CSV file to upload"
        onPress={handleUpload}
        loading={isUploading}
        disabled={isUploading}
      />
      {jobId && <UploadProgress jobId={jobId} onDone={handleUploadDone} />}
    </View>
  );
}
