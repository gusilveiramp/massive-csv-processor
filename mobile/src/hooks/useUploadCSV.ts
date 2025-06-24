import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import api from "../services/api";
import { handleError } from "../utils/handleError";

export function useUploadCSV(onUploadStarted?: () => void) {
  const [jobId, setJobId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      onUploadStarted?.();

      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "application/csv"],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) {
        setIsUploading(false);
        return;
      }

      const fileUri = result.assets[0].uri;

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: "text/csv",
        name: "data.csv",
      } as unknown as Blob);

      const response = await api.post("/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const receivedJobId = response.data.jobId;
      setJobId(receivedJobId);
    } catch (err) {
      const message = handleError(err);
      console.log("[Upload Error]:", err);
      alert("Upload Error: " + message);
      setIsUploading(false);
    }
  };

  return { jobId, isUploading, handleUpload, setJobId, setIsUploading };
}
