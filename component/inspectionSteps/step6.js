import React, { Component } from "react";
import { ScrollView, StyleSheet, View, Text, Alert } from "react-native";
import { Card, CheckBox, Button } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";

class step6 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      servedBy: "",
    };
  }
  componentDidMount() {
    if (this.props.getState().servedBy != undefined) {
      const { servedBy } = this.props.getState();
      this.setState({
        servedBy,
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
      servedBy: { required: true },
    });
    if (!this.isFormValid()) {
      Alert.alert("Error!", "Fields with * are mandatory", [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    } else {
      saveState({ servedBy: this.state.servedBy });

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
              Property is served by *
            </Text>
            <CheckBox
              title="Marram Road"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.servedBy === "Marram" ? true : false}
              onPress={() => this.setState({ servedBy: "Marram" })}
            />
            <CheckBox
              title="Tarmac Road"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.servedBy === "Tarmac" ? true : false}
              onPress={() => this.setState({ servedBy: "Tarmac" })}
            />
            <CheckBox
              title="Paved Road"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.servedBy === "Paved" ? true : false}
              onPress={() => this.setState({ servedBy: "Paved" })}
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
                onPress={this.nextStep}
                buttonStyle={{
                  backgroundColor: "#00224F",
                }}
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
export default step6;
