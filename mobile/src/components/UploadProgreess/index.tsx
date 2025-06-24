import React from "react";
import { View, Text } from "react-native";
import ProgressBar from "../ProgressBar";
import { styles } from "./styles";
import { useUploadProgress } from "../../hooks/useUploadProgress";

interface UploadProgressProps {
  jobId: string;
  onDone: () => void;
}

export default function UploadProgress({ jobId, onDone }: UploadProgressProps) {
  const { progress, done, error } = useUploadProgress(jobId, onDone);

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : done ? (
        <Text style={styles.success}>✅ Upload completed</Text>
      ) : (
        <ProgressBar progress={progress} />
      )}
    </View>
  );
}
