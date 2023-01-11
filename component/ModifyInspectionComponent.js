import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ModifyView from "./ModifyInspectionViewComponent";
import ModifyEdit from "./ModifyEditComponent";
const Stack = createStackNavigator();
class ModifyInspection extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Modify" component={ModifyView} />
        <Stack.Screen name="Modify Inspection" component={ModifyEdit} />
      </Stack.Navigator>
    );
  }
}
export default ModifyInspection;
