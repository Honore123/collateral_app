import React from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";

const styles = StyleSheet.create({
  LoadingView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export const Loading = () => {
  return (
    <View style={styles.LoadingView}>
      <ActivityIndicator size="large" color="#181461" />
    </View>
  );
};
