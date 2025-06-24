// src/hooks/useProductDetail.ts
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "../services/api";

import {
  formatDateInput,
  formatISOToUSDateTime,
  parseUSDateTimeToISO,
} from "../utils/formatDate";
import { handleError } from "../utils/handleError";
import { useProducts } from "../contexts/ProductContext";
import { ProductProps } from "../contexts/ProductContext";

export function useProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [expirationInput, setExpirationInput] = useState("");

  const router = useRouter();
  const { updateProductInList, removeProductFromList } = useProducts();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const productData: ProductProps = res.data;
        setProduct(productData);
        setName(productData.name);
        setPrice(String(productData.price ?? ""));
        setExpirationInput(
          productData.expiration
            ? formatISOToUSDateTime(productData.expiration)
            : ""
        );
      } catch (error) {
        const message = handleError(error);
        Alert.alert("Load product error", message);
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleExpirationChange = (text: string) => {
    setExpirationInput(formatDateInput(text));
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Name is required.");
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      Alert.alert("Validation Error", "Price must be a number.");
      return;
    }

    const isoExpiration = parseUSDateTimeToISO(expirationInput);
    if (!isoExpiration) {
      Alert.alert("Validation Error", "Expiration date is invalid.");
      return;
    }

    try {
      setIsUploading(true);

      const res = await api.patch(`/products/${id}`, {
        name: name.trim(),
        price: numericPrice,
        expiration: isoExpiration,
      });

      setProduct(res.data);
      updateProductInList(Number(id), res.data);

      Alert.alert("Success", "Product updated successfully.");
    } catch (error) {
      const message = handleError(error);
      Alert.alert("Update failed", message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/products/${id}`);
      removeProductFromList(Number(id));
      Alert.alert("Success", "Product deleted successfully.");
      router.back();
    } catch (error) {
      const message = handleError(error);
      Alert.alert("Delete failed", message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    product,
    isLoading,
    name,
    price,
    expirationInput,
    isUploading,
    isDeleting,
    setName,
    setPrice,
    handleExpirationChange,
    handleUpdate,
    handleDelete,
  };
}
