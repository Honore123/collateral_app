import React, { Component } from "react";
import {
  Picker,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from "react-native";
import { Card, Input, CheckBox, Button, Icon } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";
import { connect } from "react-redux";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { baseUrl } from "../../shared/baseUrl";

const mapStateToProps = (state) => {
  return {
    houses: state.houses,
  };
};

class step8 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      image1: baseUrl + "images/avatar.png",
      image2: baseUrl + "images/avatar.png",
      image3: baseUrl + "images/avatar.png",
      image4: baseUrl + "images/avatar.png",
      isLoading: false,
      loadingImage: false,
    };
  }
  componentDidMount() {
    if (this.props.getState().image1 != undefined) {
      const { image1, image2, image3, image4 } = this.props.getState();
      this.setState({
        image1,
        image2,
        image3,
        image4,
      });
    }
  }
  static getDerivedStateFromProps = (props) => {
    const { getTotalSteps, getCurrentStep } = props;
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep(),
    };
  };

  handleHouse = () => {
    const { next, saveState } = this.props;
    this.setState({ isLoading: true });
    this.validate({
      image1: { required: true },
    });
    if (!this.isFormValid()) {
      Alert.alert("Error!", "Fields with * are mandatory", [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    } else {
      saveState({
        image1: this.state.image1,
        image2: this.state.image2,
        image3: this.state.image3,
        image4: this.state.image4,
      });
      setTimeout(() => {
        next();
        this.setState({ isLoading: false });
      }, 2000);
    }
  };

  onBack = () => {
    const { back } = this.props;

    back();
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
        console.log(capturedImage);
        this.setState({ loadingImage: true });
        const manipResult = await ImageManipulator.manipulateAsync(
          capturedImage.uri,
          [],
          { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
        );
        this.setState({ loadingImage: false });
        if (this.state.image1 === baseUrl + "images/avatar.png") {
          this.setState({ image1: manipResult });
          return;
        }
        if (this.state.image2 === baseUrl + "images/avatar.png") {
          this.setState({ image2: manipResult });
          return;
        }
        if (this.state.image3 === baseUrl + "images/avatar.png") {
          this.setState({ image3: manipResult });
          return;
        }
        if (this.state.image4 === baseUrl + "images/avatar.png") {
          this.setState({ image4: manipResult });
          return;
        }
      }
    }
  };
  render() {
    const { currentStep, totalSteps } = this.state;
    return (
      <ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.loadingImage}
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
        <Card containerStyle={{ borderTopWidth: 5, borderTopColor: "#00224F" }}>
          <View>
            <View style={styles.albumContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.state.image1.uri }}
                  style={{
                    flex: 1,
                    height: 60,
                    width: 80,
                    alignSelf: "center",
                  }}
                />
                <Image
                  source={{ uri: this.state.image2.uri }}
                  style={{
                    flex: 1,
                    height: 60,
                    width: 80,
                    alignSelf: "center",
                  }}
                />
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.state.image3.uri }}
                  style={{
                    flex: 1,
                    height: 60,
                    width: 80,
                    alignSelf: "center",
                  }}
                />
                <Image
                  source={{ uri: this.state.image4.uri }}
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
              title="Take Picture"
              buttonStyle={{
                backgroundColor: "#00224F",
              }}
              onPress={this.getImageFromCamera}
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
              {this.props.houses.isLoading || this.state.isLoading ? (
                <Button
                  title="Loading"
                  buttonStyle={{ backgroundColor: "#0CB100" }}
                  containerStyle={{ flex: 1 }}
                  loading
                />
              ) : (
                <Button
                  title="Save"
                  buttonStyle={{ backgroundColor: "#0CB100" }}
                  containerStyle={{ flex: 1 }}
                  onPress={() => this.handleHouse()}
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
  albumContainer: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
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
export default connect(mapStateToProps)(step8);
