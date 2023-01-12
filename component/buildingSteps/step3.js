import React, { Component } from "react";
import { ScrollView, StyleSheet, View, Text, Alert, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Card, Input, CheckBox, Button, Icon } from "react-native-elements";
import { connect } from "react-redux";
import ValidationComponent from "react-native-form-validator";

const mapStateToProps = (state) => {
  return {
    pavements: state.pavements,
    ceilings: state.ceilings,
    closers: state.closers,
  };
};

class step3 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      pavement: "",
      ceiling: "",
      doorAndWindows: "",
    };
  }
  componentDidMount() {
    if (this.props.getState().pavement != undefined) {
      const { pavement, ceiling, doorAndWindows } = this.props.getState();
      this.setState({
        pavement,
        ceiling,
        doorAndWindows,
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
      pavement: { required: true },
      ceiling: { required: true },
      doorAndWindows: { required: true },
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
        pavement: this.state.pavement,
        ceiling: this.state.ceiling,
        doorAndWindows: this.state.doorAndWindows,
      });

      next();
    }
  };

  onBack = () => {
    const { back } = this.props;

    back();
  };
  render() {
    const { pavements } = this.props.pavements;
    const { ceilings } = this.props.ceilings;
    const { closers } = this.props.closers;
    const { currentStep, totalSteps } = this.state;
    return (
      <ScrollView>
        <Card containerStyle={{ borderTopWidth: 5, borderTopColor: "#00224F" }}>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.pavement}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ pavement: itemValue });
              }}
            >
              <Picker.Item label="Pavement *" value="" color="#A8A8A8" />
              {pavements.map((pavement, index) => (
                <Picker.Item
                  key={index}
                  label={pavement.pavement_name}
                  value={pavement.pavement_name}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.ceiling}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ ceiling: itemValue });
              }}
            >
              <Picker.Item label="Ceiling *" value="" color="#A8A8A8" />
              {ceilings.map((ceiling, index) => (
                <Picker.Item
                  key={index}
                  label={ceiling.ceiling_name}
                  value={ceiling.ceiling_name}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.doorAndWindows}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ doorAndWindows: itemValue });
              }}
            >
              <Picker.Item label="Doors & Windows *" value="" color="#A8A8A8" />
              {closers.map((closer, index) => (
                <Picker.Item
                  key={index}
                  label={closer.doorwindow}
                  value={closer.doorwindow}
                />
              ))}
            </Picker>
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

export default connect(mapStateToProps)(step3);
