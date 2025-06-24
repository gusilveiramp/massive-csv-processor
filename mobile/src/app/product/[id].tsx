import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import Header from "../../components/Header";
import { colors } from "../../constants/theme";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import AppTextInput from "../../components/TextInput";
import { ProductCard } from "../../components/ProductCard";
import { AppButton } from "../../components/AppButton";
import { formatPriceInput } from "../../utils/formatPrice";
import { useProductDetail } from "../../hooks/useProductDetail";

export default function ProductDetail() {
  const {
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
  } = useProductDetail();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: colors.white }}>Product not found.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Header />
          <ProductCard
            name={product.name}
            price={product.price}
            expiration={product.expiration}
            exchange_rates={product.exchange_rates}
          />

          <Text style={styles.inputLabel}>Name</Text>
          <AppTextInput
            value={name}
            onChangeText={setName}
            placeholder="Product name"
          />

          <Text style={styles.inputLabel}>Price</Text>
          <AppTextInput
            value={price}
            onChangeText={(text) => setPrice(formatPriceInput(text))}
            placeholder="Product price"
            keyboardType="decimal-pad"
          />

          <Text style={styles.inputLabel}>Expiration</Text>
          <AppTextInput
            value={expirationInput}
            onChangeText={handleExpirationChange}
            placeholder="DD/MM/YYYY HH:MM:SS"
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <AppButton
              title="Save"
              onPress={handleUpdate}
              loading={isUploading}
              disabled={isUploading}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color={colors.red} />
              ) : (
                <>
                  <Ionicons
                    name="trash-bin-outline"
                    size={24}
                    color={colors.red}
                  />
                  <Text style={styles.deleteText}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
