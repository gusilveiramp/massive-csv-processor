import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";

export function useUploadProgress(jobId: string, onDone: () => void) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    setProgress(0);
    setDone(false);
    setError(null);

    const socket = connectSocket();

    socket.on(`upload-progress:${jobId}`, (data) => {
      setProgress(data.progress);
      if (data.done) {
        setDone(true);
        onDone();
      }
    });

    socket.on(`upload-products:failed:${jobId}`, (data) => {
      setError(data.reason || "Upload failed");
    });

    return () => {
      disconnectSocket();
    };
  }, [jobId]);

  return { progress, done, error };
}
