import { Text, View } from "react-native";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";
import { ProductProps } from "../../contexts/ProductContext";
import { styles } from "./styles";

import { memo } from "react";

export const ProductCard = memo(function ProductCard({
  name,
  price,
  expiration,
  exchange_rates,
}: ProductProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>{formatPrice(Number(price))}</Text>
      <Text style={styles.expiration}>
        Expiration: {expiration ? formatDate(expiration) : "No expiration date"}
      </Text>

      <View style={styles.exchangeRateContainer}>
        {exchange_rates.map((rate) => (
          <View style={styles.badge} key={rate.id}>
            <Text style={styles.exchangeRateText}>
              {rate.currency.toUpperCase()}:{" "}
              {formatPrice(rate.converted_price, rate.currency.toUpperCase())}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});
