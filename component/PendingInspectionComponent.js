import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import PendingView from "./PendingInspectionViewComponent";
import NewHouse from "./NewHouseComponent";
import Houses from "./HousesComponent";
import VacantLand from "./VacantLandComponent";
import EditInspection from "./EditInspectionComponent";

const Stack = createStackNavigator();
class PendingInspection extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Pending" component={PendingView} />
        <Stack.Screen
          name="Add House"
          component={NewHouse}
          options={{ headerTitleAlign: "center" }}
        />
        <Stack.Screen name="Vacant land" component={VacantLand} />
        <Stack.Screen name="Edit Inspection" component={EditInspection} />
        <Stack.Screen
          name="Houses"
          component={Houses}
          options={({ navigation, route }) => ({
            headerTitleAlign: "center",
            headerRight: () => (
              <Icon
                name="plussquare"
                type="ant-design"
                size={24}
                iconStyle={{ marginRight: 17 }}
                onPress={() =>
                  navigation.navigate("Add House", {
                    inspection: route.params.inspection,
                  })
                }
              />
            ),
          })}
        />
      </Stack.Navigator>
    );
  }
}

export default PendingInspection;
