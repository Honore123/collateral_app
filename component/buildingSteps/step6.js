import React, { Component } from "react";
import {
  Picker,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
  Image,
} from "react-native";
import { Card, Input, CheckBox, Button, Icon } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";

class step6 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      fenceLength: "",
      securedByGate: false,
    };
  }
  componentDidMount() {
    if (this.props.getState().fenceLength != undefined) {
      const { fenceLength, securedByGate } = this.props.getState();
      this.setState({
        fenceLength,
        securedByGate,
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

  nextStep = () => {
    const { next, saveState } = this.props;
    this.validate({
      fenceLength: { required: true },
      securedByGate: { required: true },
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
        fenceLength: this.state.fenceLength,
        securedByGate: this.state.securedByGate,
      });

      next();
    }
  };

  onBack = () => {
    const { back } = this.props;

    back();
  };
  render() {
    const { currentStep, totalSteps } = this.state;
    return (
      <ScrollView>
        <Card containerStyle={{ borderTopWidth: 5, borderTopColor: "#00224F" }}>
          <Input
            placeholder="Fence Length *"
            keyboardType="number-pad"
            placeholderTextColor="#A8A8A8"
            value={this.state.fenceLength}
            onChangeText={(length) => this.setState({ fenceLength: length })}
            style={{ marginTop: 20, fontSize: 15 }}
          />
          <View>
            <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 16 }}>
              Secured by gate
            </Text>
            <CheckBox
              title="Yes"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.securedByGate}
              onPress={() => this.setState({ securedByGate: true })}
            />
            <CheckBox
              title="No"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={!this.state.securedByGate}
              onPress={() => this.setState({ securedByGate: false })}
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
              <Button
                title="Next"
                containerStyle={{ flex: 1 }}
                buttonStyle={{
                  backgroundColor: "#00224F",
                }}
                onPress={this.nextStep}
              />
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
});
export default step6;
