import React, { Component } from "react";
import { View, ScrollView, RefreshControl, Text } from "react-native";
import { ListItem, Button, Icon } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";
import { fetchInspections } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    inspections: state.inspections,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchInspections: (userId, token) =>
    dispatch(fetchInspections(userId, token)),
});

class ModifyView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }
  onRefresh() {
    this.setState({ refreshing: true });
    SecureStore.getItemAsync("token").then((token) => {
      SecureStore.getItemAsync("creds").then((result) => {
        const user = JSON.parse(result);
        this.props.fetchInspections(user.id, token).then(() => {
          this.setState({ refreshing: false });
        });
      });
    });
  }
  modificationHandler(inspection) {
    this.props.navigation.navigate("Modify Inspection", {
      inspectionId: inspection,
    });
  }
  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
          />
        }
      >
        {this.props.inspections.inspections.filter(
          (inspection) => inspection.status === "4"
        )[0] ? (
          this.props.inspections.inspections
            .filter((inspection) => inspection.status === "4")
            .map((inspection, index) => (
              <ListItem key={index} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>UPI {inspection.propertyUPI}</ListItem.Title>
                  <ListItem.Subtitle>
                    {inspection.inspectionDate}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <Button
                  title="Modify"
                  type="clear"
                  titleStyle={{ color: "#2A2AC0" }}
                  icon={{
                    name: "edit",
                    type: "font-awesome",
                    size: 15,
                    color: "#2A2AC0",
                  }}
                  onPress={() => this.modificationHandler(inspection.id)}
                />
              </ListItem>
            ))
        ) : (
          <View
            style={{
              alignItems: "center",
              marginTop: "50%",
              flex: 1,
            }}
          >
            <Icon
              name="warning"
              type="font-awesome"
              size={18}
              color="#9D9EA0"
            />
            <Text style={{ fontSize: 17, color: "#9D9EA0" }}>No reports</Text>
          </View>
        )}
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ModifyView);
