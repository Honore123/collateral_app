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

class step5 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      mortgaged: "",
    };
  }
  componentDidMount() {
    if (this.props.getState().mortgaged != undefined) {
      const { mortgaged } = this.props.getState();
      this.setState({
        mortgaged,
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
      mortgaged: { required: true },
    });
    if (!this.isFormValid()) {
      Alert.alert("Error!", "Fields with * are mandatory", [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    } else {
      saveState({ mortgaged: this.state.mortgaged });

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
            <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 15 }}>
              Mortgaged
            </Text>
            <CheckBox
              title="Yes"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.mortgaged === "Yes"}
              onPress={() => this.setState({ mortgaged: "Yes" })}
            />
            <CheckBox
              title="No"
              uncheckedIcon="dot-circle-o"
              uncheckedColor="#707070"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.mortgaged === "No"}
              onPress={() => this.setState({ mortgaged: "No" })}
            />
            <CheckBox
              title="Not Sure"
              uncheckedIcon="dot-circle-o"
              uncheckedColor="#707070"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.mortgaged === "Not Sure"}
              onPress={() => this.setState({ mortgaged: "Not Sure" })}
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
export default step5;
