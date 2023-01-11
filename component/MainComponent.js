import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ToastAndroid,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Icon, Button } from "react-native-elements";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NetInfo from "@react-native-community/netinfo";
import { connect } from "react-redux";
import {
  fetchInspections,
  fetchBuildingTypes,
  fetchRoofs,
  fetchElevations,
  fetchFoundations,
  fetchPavements,
  fetchCeilings,
  fetchClosers,
  fetchTenures,
  fetchPropertyTypes,
  fetchProvinces,
  logoutUser,
} from "../redux/ActionCreators";
import * as SecureStore from "expo-secure-store";
import Home from "./HomeComponent";
import NewInspection from "./NewInspectionComponent";
import ManageInspection from "./ManageInspectionComponent";
import Login from "./LoginComponent";
import Account from "./AccountComponent";

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchBuildingTypes: () => dispatch(fetchBuildingTypes()),
  fetchFoundations: () => dispatch(fetchFoundations()),
  fetchElevations: () => dispatch(fetchElevations()),
  fetchPavements: () => dispatch(fetchPavements()),
  fetchCeilings: () => dispatch(fetchCeilings()),
  fetchClosers: () => dispatch(fetchClosers()),
  fetchTenures: () => dispatch(fetchTenures()),
  fetchPropertyTypes: () => dispatch(fetchPropertyTypes()),
  fetchRoofs: () => dispatch(fetchRoofs()),
  fetchProvinces: () => dispatch(fetchProvinces()),
  logoutUser: (token) => dispatch(logoutUser(token)),
});

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const home = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Home}
        options={{
          headerTitleStyle: { alignSelf: "center", color: "#181461" },
          headerLeft: () => (
            <Icon
              name="menu-fold"
              type="ant-design"
              size={24}
              iconStyle={{ color: "#181461", marginLeft: 10 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          headerRight: () => (
            <Icon
              name="user-circle-o"
              type="font-awesome"
              size={24}
              iconStyle={{ color: "#181461", marginRight: 10 }}
              onPress={() => navigation.navigate("Account Settings")}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
const newInspection = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="New Inspection"
        component={NewInspection}
        options={{
          headerTitleStyle: { alignSelf: "center", color: "#181461" },
          headerLeft: () => (
            <Icon
              name="menu-fold"
              type="ant-design"
              size={24}
              iconStyle={{ color: "#181461", marginLeft: 10 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          headerRight: () => (
            <Icon
              name="user-circle-o"
              type="font-awesome"
              size={24}
              iconStyle={{ color: "#181461", marginRight: 10 }}
              onPress={() => navigation.navigate("Account Settings")}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
const manageInspection = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Manage Inspection"
        component={ManageInspection}
        options={{
          headerTitleStyle: { alignSelf: "center", color: "#181461" },
          headerLeft: () => (
            <Icon
              name="menu-fold"
              type="ant-design"
              size={24}
              iconStyle={{ color: "#181461", marginLeft: 10 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          headerRight: () => (
            <Icon
              name="user-circle-o"
              type="font-awesome"
              size={24}
              iconStyle={{ color: "#181461", marginRight: 10 }}
              onPress={() => navigation.navigate("Account Settings")}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const accountSettings = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="My Account"
        component={Account}
        options={{
          headerTitleStyle: { alignSelf: "center", color: "#181461" },
          headerLeft: () => (
            <Icon
              name="menu-fold"
              type="ant-design"
              size={24}
              iconStyle={{ color: "#181461", marginLeft: 10 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          headerRight: () => (
            <Icon
              name="user-circle-o"
              type="font-awesome"
              size={24}
              iconStyle={{ color: "#181461", marginRight: 10 }}
              onPress={() => navigation.navigate("Account Settings")}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerHeader = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <Modal animationType="fade" transparent={true} visible={props.isLoading}>
        <TouchableWithoutFeedback>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="#181461" />
            <Text>Logging out</Text>
          </View>
        </View>
      </Modal>
      <SafeAreaView style={styles.container}>
        <View style={styles.drawerContent}>
          <View style={{ flex: 2 }}>
            <Image
              source={require("./images/avatar.png")}
              style={styles.drawerImage}
            />
          </View>
          <View style={{ flex: 3 }}>
            <Text style={styles.drawerHeaderText}>{props.user.name}</Text>
            <Text style={styles.drawerLocationText}>Kigali</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Icon
              name="close"
              type="ant-design"
              size={24}
              iconStyle={{ color: "#181461" }}
              onPress={() => {
                props.navigation.toggleDrawer();
              }}
            />
          </View>
        </View>
        <DrawerItemList {...props} />
      </SafeAreaView>
      <DrawerItem
        label="Logout"
        onPress={props.logout}
        style={{ marginTop: "50%" }}
        icon={() => <Icon name="logout" type="ant-design" size={20} />}
      />
    </DrawerContentScrollView>
  );
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  componentDidMount() {
    this.props.fetchBuildingTypes();
    this.props.fetchFoundations();
    this.props.fetchElevations();
    this.props.fetchPavements();
    this.props.fetchCeilings();
    this.props.fetchClosers();
    this.props.fetchRoofs();
    this.props.fetchTenures();
    this.props.fetchPropertyTypes();
    this.props.fetchProvinces();
    console.log(this.props.auth.isAuthenticated);

    NetInfo.addEventListener((connectionInfo) => {
      switch (connectionInfo.type) {
        case "none":
          ToastAndroid.show("Not connected", ToastAndroid.LONG);
          break;
        case "wifi":
          ToastAndroid.show("Connected to Wifi", ToastAndroid.LONG);
          break;
        case "cellular":
          ToastAndroid.show("Connected to Cellular", ToastAndroid.LONG);
          break;
        case "unknown":
          ToastAndroid.show("Unknown Connection", ToastAndroid.LONG);
          break;
        default:
          break;
      }
    });
  }
  handleLogout() {
    console.log(this.props.auth.token);
    this.setState({ isLoading: true });
    this.props.logoutUser(this.props.auth.token).then(() => {
      this.setState({ isLoading: false });
    });
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated) {
      return (
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Dashboard"
            drawerContentOptions={{
              activeTintColor: "#2A2AC0",
            }}
            drawerContent={(props) => (
              <DrawerHeader
                {...props}
                logout={this.handleLogout.bind(this)}
                user={this.props.auth.user}
                isLoading={this.state.isLoading}
              />
            )}
          >
            <Drawer.Screen
              name="Dashboard"
              component={home}
              options={{
                drawerIcon: ({ color }) => (
                  <Icon name="home" type="ant-design" size={20} color={color} />
                ),
              }}
            />
            <Drawer.Screen
              name="New Inspection"
              component={newInspection}
              initialParams={{ user: this.props.auth.user.id }}
              options={{
                drawerIcon: ({ color }) => (
                  <Icon
                    name="pluscircleo"
                    type="ant-design"
                    size={20}
                    color={color}
                  />
                ),
                unmountOnBlur: true,
              }}
            />
            <Drawer.Screen
              name="Manage Inspection"
              component={manageInspection}
              options={{
                drawerIcon: ({ color }) => (
                  <Icon
                    name="content-paste"
                    type="material-icons"
                    size={20}
                    color={color}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Account Settings"
              component={accountSettings}
              options={{
                drawerIcon: ({ color }) => (
                  <Icon name="user" type="ant-design" size={20} color={color} />
                ),
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      );
    } else {
      return <Login />;
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    backgroundColor: "#ECF1FA",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  drawerHeaderText: {
    color: "#2A2AC0",
    fontSize: 20,
    fontWeight: "bold",
  },
  drawerLocationText: {
    color: "#181461",
  },
  drawerImage: {
    margin: 10,
    width: 68,
    height: 68,
    borderRadius: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Main);
