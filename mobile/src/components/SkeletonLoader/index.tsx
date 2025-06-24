import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions } from "react-native";
import { styles } from "./styles";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SkeletonLoader() {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.shimmerWrapper}>
            <Animated.View
              style={[styles.shimmer, { transform: [{ translateX }] }]}
            />
          </View>

          <View style={styles.shimmerWrapper}>
            <Animated.View
              style={[styles.shimmer, { transform: [{ translateX }] }]}
            />
          </View>

          <View style={[styles.shimmerWrapper, { width: "60%" }]}>
            <Animated.View
              style={[styles.shimmer, { transform: [{ translateX }] }]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
