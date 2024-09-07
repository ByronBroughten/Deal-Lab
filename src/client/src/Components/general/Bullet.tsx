import React from "react";
import { StyleSheet, Text, View } from "react-native";
import theme from "../../theme/Theme";

interface BulletProps {
  text: string | React.ReactElement;
  key: string;
}

const styles = StyleSheet.create({
  bulletItem: {
    marginTop: theme.s2,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    flex: 1,
  },
  bullet: {
    width: 12,
  },
  bulletText: {
    flex: 1,
  },
  normalText: { fontSize: 16 },
});

export function Bullet({ text, key }: BulletProps) {
  return (
    <View style={styles.bulletItem} key={key}>
      <View style={styles.row}>
        <View style={styles.bullet}>
          <Text style={styles.normalText}>{"\u2022" + " "}</Text>
        </View>
        <View style={styles.bulletText}>
          <Text style={styles.normalText}>{text}</Text>
        </View>
      </View>
    </View>
  );
}
