import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Card, Icon } from "react-native-elements";
import { BackgroundImage } from "react-native-elements/dist/config";
class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.cardContent}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={(props) => {
              this.props.navigation.navigate("New Inspection");
            }}
          >
            <Card pointerEvents="none" containerStyle={{ flex: 1 }}>
              <Card.Title style={{ color: "#181461" }}>
                New Inspection
              </Card.Title>
              <View>
                <Icon
                  name="addfile"
                  type="ant-design"
                  size={50}
                  iconStyle={{ color: "#181461" }}
                />
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={(props) => {
              this.props.navigation.navigate("Manage Inspection");
            }}
          >
            <Card pointerEvents="none" containerStyle={{ flex: 1 }}>
              <Card.Title style={{ textAlign: "left", color: "#181461" }}>
                Manage Inspection
              </Card.Title>
              <View>
                <Icon
                  name="folderopen"
                  type="ant-design"
                  size={50}
                  iconStyle={{ color: "#181461" }}
                />
              </View>
            </Card>
          </TouchableOpacity>
        </View>
        <View style={styles.cardContentBelow}>
          <TouchableOpacity
            style={{ flex: 0.5 }}
            onPress={() => {
              this.props.navigation.navigate("Account Settings");
            }}
          >
            <Card containerStyle={{ flex: 1 }}>
              <Card.Title style={{ color: "#181461" }}>
                Account Setting
              </Card.Title>
              <View>
                <Icon
                  name="setting"
                  type="ant-design"
                  size={50}
                  iconStyle={{ color: "#181461" }}
                />
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContent: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  cardContentBelow: {
    justifyContent: "flex-start",
    flex: 1,
    flexDirection: "row",
  },
});
export default Home;
