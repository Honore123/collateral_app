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
import { connect } from "react-redux";
import ValidationComponent from "react-native-form-validator";

const mapStateToProps = (state) => {
  return {
    tenures: state.tenures,
    propertytypes: state.propertytypes,
  };
};

class step3 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      tenureType: "",
      propertyType: "",
      plotSize: "",
    };
  }
  componentDidMount() {
    if (this.props.getState().tenureType != undefined) {
      const { tenureType, propertyType, plotSize } = this.props.getState();
      this.setState({
        tenureType,
        propertyType,
        plotSize,
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
      tenureType: { required: true },
      propertyType: { required: true },
      plotSize: { required: true },
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
        tenureType: this.state.tenureType,
        propertyType: this.state.propertyType,
        plotSize: this.state.plotSize,
      });

      next();
    }
  };

  onBack = () => {
    const { back } = this.props;

    back();
  };
  render() {
    const { tenures } = this.props.tenures;
    const { propertytypes } = this.props.propertytypes;
    const { currentStep, totalSteps } = this.state;
    return (
      <ScrollView>
        <Card containerStyle={{ borderTopWidth: 5, borderTopColor: "#00224F" }}>
          <View style={styles.pickerLocation}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.tenureType}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ tenureType: itemValue });
              }}
            >
              <Picker.Item label="Type of Tenure *" value="" color="#A8A8A8" />
              {tenures.map((tenure, index) => (
                <Picker.Item
                  key={index}
                  label={tenure.tenure_type}
                  value={tenure.tenure_type}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.propertyType}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ propertyType: itemValue });
              }}
            >
              <Picker.Item label="Property Type *" value="" color="#A8A8A8" />
              {propertytypes.map((type, index) => (
                <Picker.Item key={index} label={type.name} value={type.name} />
              ))}
            </Picker>
          </View>
          <Input
            placeholder="Plot Size *"
            keyboardType="number-pad"
            placeholderTextColor="#A8A8A8"
            value={this.state.plotSize}
            onChangeText={(plotSize) => {
              this.setState({ plotSize: plotSize });
            }}
            style={{ marginTop: 20, fontSize: 15 }}
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
    flex: 1,
  },
  BtnContent: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
});
export default connect(mapStateToProps)(step3);
