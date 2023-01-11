import React, { Component } from "react";
import {
  Picker,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Card, Input, CheckBox, Button } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";

class step4 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      encumbranes: "",
    };
  }
  componentDidMount() {
    if (this.props.getState().encumbranes != undefined) {
      const { encumbranes } = this.props.getState();
      this.setState({
        encumbranes,
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
      encumbranes: { required: true },
    });
    if (!this.isFormValid()) {
      Alert.alert("Error!", "Fields with * are mandatory", [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    } else {
      saveState({ encumbranes: this.state.encumbranes });

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
          <View>
            <Text style={{ marginLeft: 10, fontSize: 15 }}>Encumbranes</Text>
            <CheckBox
              title="Yes"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.encumbranes === "Yes"}
              onPress={() => this.setState({ encumbranes: "Yes" })}
            />
            <CheckBox
              title="No"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.encumbranes === "No"}
              onPress={() => this.setState({ encumbranes: "No" })}
            />
            <CheckBox
              title="Not Sure"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.encumbranes === "Not Sure"}
              onPress={() => this.setState({ encumbranes: "Not Sure" })}
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
});
export default step4;
