import React, { Component } from "react";
import { ScrollView, Text, View, Image, StyleSheet, Alert } from "react-native";
import { Card, Input, Button } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { baseUrl } from "../shared/baseUrl";
import { postLand } from "../redux/ActionCreators";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch) => ({
  postLand: (inspectionId, image1, image2, image3, image4, usage) =>
    dispatch(postLand(inspectionId, image1, image2, image3, image4, usage)),
});

class VacantLand extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentUsage: "",
      status: "1",
      image1: baseUrl + "images/avatar.png",
      image2: baseUrl + "images/avatar.png",
      image3: baseUrl + "images/avatar.png",
      image4: baseUrl + "images/avatar.png",
      earth_id: this.props.route.params.inspection,
      isLoading: false,
    };
  }
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
        const manipResult = await ImageManipulator.manipulateAsync(
          capturedImage.uri,
          [],
          { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
        );
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

  handleLand() {
    console.log(this.state);
    this.setState({ isLoading: true });
    this.validate({
      currentUsage: { required: true },
      image1: { required: true },
    });
    if (!this.isFormValid()) {
      Alert.alert("Error!", "Fields with * are mandatory", [
        {
          text: "OK",
          onPress: () => this.setState({ isLoading: false }),
        },
      ]);
    } else {
      this.props
        .postLand(
          this.state.earth_id,
          this.state.image1,
          this.state.image2,
          this.state.image3,
          this.state.image4,
          this.state
        )
        .then(() => {
          this.setState({
            currentUsage: "",
            image1: baseUrl + "images/avatar.png",
            image2: baseUrl + "images/avatar.png",
            image3: baseUrl + "images/avatar.png",
            image4: baseUrl + "images/avatar.png",
            earth_id: this.props.route.params.inspection,
            isLoading: false,
          });
          this.props.navigation.navigate("Pending");
        });
    }
  }

  render() {
    return (
      <ScrollView>
        <Card containerStyle={{ borderTopWidth: 5, borderTopColor: "#00224F" }}>
          <Input
            placeholder="Current usage *"
            multiline={true}
            placeholderTextColor="#A8A8A8"
            value={this.state.currentUsage}
            onChangeText={(usage) => this.setState({ currentUsage: usage })}
            style={{ marginTop: 20, fontSize: 16 }}
          />
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
          <View style={{ marginTop: 30, marginBottom: 20 }}>
            {this.state.isLoading ? (
              <Button
                title="Loading"
                buttonStyle={{ backgroundColor: "#0CB100" }}
                loading
              />
            ) : (
              <Button
                title="Submit"
                buttonStyle={{ backgroundColor: "#0CB100" }}
                onPress={() => this.handleLand()}
              />
            )}
          </View>
        </Card>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  albumContainer: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
});
export default connect(null, mapDispatchToProps)(VacantLand);
