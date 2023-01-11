import React, { Component } from "react";
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ApprovedInspection from "./ApprovedInspectionComponent";
import PendingInspection from "./PendingInspectionComponent";
import ModifyInspection from "./ModifyInspectionComponent";
const Tab = createMaterialTopTabNavigator();

class ManageInspection extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Tab.Navigator initialRouteName="Approved">
        <Tab.Screen name="Approved" component={ApprovedInspection} />
        <Tab.Screen name="Pending" component={PendingInspection} />
        <Tab.Screen name="Modify" component={ModifyInspection} />
      </Tab.Navigator>
    );
  }
}
export default ManageInspection;
