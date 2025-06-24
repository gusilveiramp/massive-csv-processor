import { AxiosError } from "axios";

interface ErrorResponseData {
  message?: string;
}
export function handleError(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<ErrorResponseData>;
    return (
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Unknown error"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}
