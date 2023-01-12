import React, { Component } from "react";
import { ScrollView, StyleSheet, View, Text, Alert } from "react-native";
import { Card, Input, CheckBox, Button, Icon } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";

class step7 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      serviceAttached: {
        water: false,
        electricity: false,
        wifi: false,
        gas: false,
      },
      otherAttachedServices: "",
    };
  }
  componentDidMount() {
    if (this.props.getState().serviceAttached != undefined) {
      const { serviceAttached, otherAttachedServices } = this.props.getState();
      this.setState({
        serviceAttached,
        otherAttachedServices,
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
      serviceAttached: { required: true },
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
        serviceAttached: this.state.serviceAttached,
        otherAttachedServices: this.state.otherAttachedServices,
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
          <View>
            <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 16 }}>
              Service Attached
            </Text>
            <CheckBox
              title="Water"
              uncheckedIcon="square-o"
              checkedIcon="check-square-o"
              uncheckedColor="#707070"
              checked={this.state.serviceAttached.water}
              onPress={() =>
                this.setState({
                  serviceAttached: {
                    ...this.state.serviceAttached,
                    water: !this.state.serviceAttached.water,
                  },
                })
              }
            />
            <CheckBox
              title="Gas"
              uncheckedIcon="square-o"
              checkedIcon="check-square-o"
              uncheckedColor="#707070"
              checked={this.state.serviceAttached.gas}
              onPress={() =>
                this.setState({
                  serviceAttached: {
                    ...this.state.serviceAttached,
                    gas: !this.state.serviceAttached.gas,
                  },
                })
              }
            />
            <CheckBox
              title="Electricity"
              uncheckedIcon="square-o"
              checkedIcon="check-square-o"
              uncheckedColor="#707070"
              checked={this.state.serviceAttached.electricity}
              onPress={() =>
                this.setState({
                  serviceAttached: {
                    ...this.state.serviceAttached,
                    electricity: !this.state.serviceAttached.electricity,
                  },
                })
              }
            />
            <CheckBox
              title="Wifi"
              uncheckedIcon="square-o"
              checkedIcon="check-square-o"
              uncheckedColor="#707070"
              checked={this.state.serviceAttached.wifi}
              onPress={() =>
                this.setState({
                  serviceAttached: {
                    ...this.state.serviceAttached,
                    wifi: !this.state.serviceAttached.wifi,
                  },
                })
              }
            />
          </View>
          <Input
            placeholder="Other Attached services"
            placeholderTextColor="#A8A8A8"
            value={this.state.otherAttachedServices}
            onChangeText={(service) =>
              this.setState({ otherAttachedServices: service })
            }
            style={{ marginTop: 20, fontSize: 16 }}
          />
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

export default step7;
