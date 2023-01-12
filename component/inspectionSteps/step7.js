import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
} from "react-native";
import { Card, Input, CheckBox, Button } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import ValidationComponent from "react-native-form-validator";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { baseUrl } from "../../shared/baseUrl";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    inspections: state.inspections,
  };
};

class step7 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      latitude: "",
      longitude: "",
      accuracy: "",
      isLoading: false,
      isLoadingGps: false,
      image: baseUrl + "images/avatar.png",
    };
  }
  componentDidMount() {
    if (this.props.getState().latitude != undefined) {
      const { latitude, longitude, accuracy } = this.props.getState();
      this.setState({
        latitude,
        longitude,
        accuracy,
        image,
      });
    }
    this.setState({ isLoading: false });
    console.log(this.props.inspections.isLoading);
    console.log(this.state.isLoading);
  }

  static getDerivedStateFromProps = (props) => {
    const { getTotalSteps, getCurrentStep } = props;
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep(),
    };
  };

  onBack = () => {
    const { back } = this.props;

    back();
  };
  _getLocationHander = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("you don't have permission");
      return;
    }
    try {
      this.setState({ accuracy: "2000", isLoadingGps: true });
      while (this.state.accuracy > "10" && this.state.isLoadingGps == true) {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        this.setState({
          accuracy: location.coords.accuracy,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
      this.setState({ isLoadingGps: false });
      Alert.alert(
        "GPS!",
        "Latitude: " +
          this.state.latitude +
          "\n" +
          "Longitude: " +
          this.state.longitude +
          "\n" +
          "Accuracy: " +
          this.state.accuracy +
          " meters\n",
        [
          {
            text: "OK",
            onPress: () => console.log("Done"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error!", error.message, [
        {
          text: "OK",
          onPress: () => this.setState({ accuracy: "Your GPS Coordinates *" }),
        },
      ]);
    }
  };
  getImageFromCamera = async () => {
    const cameraPermsission = await Permissions.askAsync(Permissions.CAMERA);
    const cameraRollPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (
      cameraPermsission.status === "granted" &&
      cameraRollPermission.status === "granted"
    ) {
      let capturedImage = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
      });
      if (!capturedImage.cancelled) {
        this.setState({ isLoading: true });
        const manipResult = await ImageManipulator.manipulateAsync(
          capturedImage.uri,
          [],
          { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
        );
        console.log(manipResult);
        this.setState({ image: manipResult, isLoading: false });
      }
    }
  };
  handleInspection = () => {
    this.setState({ isLoading: true });
    const { next, saveState } = this.props;

    this.validate({
      latitude: { required: true },
      longitude: { required: true },
      accuracy: { required: true },
    });
    if (!this.isFormValid()) {
      Alert.alert("Error!", "Fields with * are mandatory", [
        {
          text: "OK",
          onPress: () => this.setState({ isLoading: false }),
        },
      ]);
    } else {
      SecureStore.getItemAsync("creds")
        .then((result) => {
          const user = JSON.parse(result);
          saveState({
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            accuracy: this.state.accuracy,
            image: this.state.image,
            users_id: user.id,
          });
        })
        .then(() => {
          next();
          this.setState({ isLoading: false });
        });
    }
  };
  render() {
    const { currentStep, totalSteps } = this.state;
    return (
      <ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isLoading}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#181461" />
              <Text>Loading Image</Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isLoadingGps}
        >
          <TouchableWithoutFeedback
            onPress={() => this.setState({ isLoadingGps: false })}
          >
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#181461" />
              <Text>Getting Coordinates</Text>
              <Text>{this.state.accuracy} m</Text>
            </View>
          </View>
        </Modal>
        <Card containerStyle={{ borderTopWidth: 5, borderTopColor: "#00224F" }}>
          <View>
            <View style={styles.albumContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.state.image.uri }}
                  style={{
                    flex: 1,
                    height: 60,
                    width: 80,
                    alignSelf: "center",
                  }}
                />
              </View>
            </View>

            <Button
              title="Land Title Picture"
              buttonStyle={{
                backgroundColor: "#00224F",
              }}
              onPress={this.getImageFromCamera}
            />
          </View>
          <View>
            <Text style={{ fontSize: 15, marginTop: 20, marginBottom: 10 }}>
              {this.state.accuracy !== ""
                ? this.state.accuracy + " meters"
                : "Your GPS Coordinates *"}
            </Text>
            <Button
              title="Get GPS Coordinates"
              buttonStyle={{
                backgroundColor: "#00224F",
              }}
              onPress={this._getLocationHander}
            />
          </View>
          <View style={styles.containerBtn}>
            <View style={styles.BtnContent}>
              {currentStep === 1 ? (
                <View style={{ flex: 1 }}></View>
              ) : (
                <Button
                  title="Back"
                  onPress={this.onBack}
                  containerStyle={{ flex: 1 }}
                  buttonStyle={{
                    backgroundColor: "#00224F",
                  }}
                />
              )}
              <View style={{ flex: 1 }}></View>
              {this.state.isLoading ? (
                <Button
                  title="Loading"
                  containerStyle={{ flex: 1 }}
                  buttonStyle={{ backgroundColor: "#0CB100" }}
                  loading
                />
              ) : (
                <Button
                  title="Save"
                  containerStyle={{ flex: 1 }}
                  buttonStyle={{ backgroundColor: "#0CB100" }}
                  onPress={() => this.handleInspection()}
                />
              )}
            </View>
          </View>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  inspectionDateContainer: {
    color: "#A8A8A8",
  },
  pickerLocation: {
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#A8A8A8",
  },
  pickerLocationMargin: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#A8A8A8",
  },
  containerBtn: {
    marginTop: 30,
    marginBottom: 10,
    flex: 1,
  },
  BtnContent: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  albumContainer: {
    flex: 1,
    marginBottom: 20,
  },
  imageContainer: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
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
export default connect(mapStateToProps)(step7);
