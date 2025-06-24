import React, { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { styles } from "./styles";
import { colors } from "../../constants/theme";
import SearchInput from "../SerachInput";
import SkeletonLoader from "../SkeletonLoader";
import { useRouter } from "expo-router";
import { ProductCard } from "../ProductCard";
import { ProductProps, useProducts } from "../../contexts/ProductContext";

export default function ProductList() {
  const router = useRouter();
  const {
    products,
    isLoading,
    initialLoading,
    search,
    total,
    fetchProducts,
    handleSearchChange,
  } = useProducts();

  const renderItem = useCallback(
    ({ item }: { item: ProductProps }) => (
      <TouchableOpacity
        onPress={() => router.push(`/product/${item.id}`)}
        activeOpacity={0.8}
      >
        <ProductCard {...item} />
      </TouchableOpacity>
    ),
    []
  );

  const renderFooter = () => {
    const hasMore = products.length < total;

    if (!hasMore) {
      return (
        <View style={styles.footer}>
          <Text style={styles.noProductsFoundText}>
            No more products to load.
          </Text>
        </View>
      );
    }

    return isLoading ? (
      <ActivityIndicator
        size="small"
        color={colors.blue}
        style={styles.activityIndicator}
      />
    ) : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput value={search} onChangeText={handleSearchChange} />

      {initialLoading && products.length === 0 ? (
        <SkeletonLoader />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatlistContainer}
          ListFooterComponent={renderFooter}
          onEndReached={() => fetchProducts()}
          onRefresh={() => fetchProducts(true)}
          refreshing={isLoading && products.length === 0}
          onEndReachedThreshold={0.2}
        />
      )}
    </SafeAreaView>
  );
}
