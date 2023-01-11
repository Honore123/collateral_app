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
import { connect } from "react-redux";
import ValidationComponent from "react-native-form-validator";

const mapStateToProps = (state) => {
  return {
    foundations: state.foundations,
    elevations: state.elevations,
    roofs: state.roofs,
  };
};

class step2 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      foundation: "",
      elevation: "",
      roof: "",
    };
  }
  componentDidMount() {
    if (this.props.getState().foundation != undefined) {
      const { foundation, elevation, roof } = this.props.getState();
      this.setState({
        foundation,
        elevation,
        roof,
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
      foundation: { required: true },
      elevation: { required: true },
      roof: { required: true },
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
        foundation: this.state.foundation,
        elevation: this.state.elevation,
        roof: this.state.roof,
      });

      next();
    }
  };

  onBack = () => {
    const { back } = this.props;

    back();
  };
  render() {
    const { foundations } = this.props.foundations;
    const { elevations } = this.props.elevations;
    const { roofs } = this.props.roofs;
    const { currentStep, totalSteps } = this.state;
    return (
      <ScrollView>
        <Card containerStyle={{ borderTopWidth: 5, borderTopColor: "#00224F" }}>
          <View style={styles.pickerLocation}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.foundation}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ foundation: itemValue });
              }}
            >
              <Picker.Item label="Foundation *" value="" color="#A8A8A8" />
              {foundations.map((foundation, index) => (
                <Picker.Item
                  key={index}
                  label={foundation.foundation_name}
                  value={foundation.foundation_name}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.elevation}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ elevation: itemValue });
              }}
            >
              <Picker.Item label="Elevation *" value="" color="#A8A8A8" />
              {elevations.map((elevation, index) => (
                <Picker.Item
                  key={index}
                  label={elevation.elevation_name}
                  value={elevation.elevation_name}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.roof}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ roof: itemValue });
              }}
            >
              <Picker.Item label="Roof *" value="" color="#A8A8A8" />
              {roofs.map((roof, index) => (
                <Picker.Item
                  key={index}
                  label={roof.roof_name}
                  value={roof.roof_name}
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
export default connect(mapStateToProps)(step2);
