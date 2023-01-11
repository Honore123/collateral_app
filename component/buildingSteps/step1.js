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
import { Card, Input, Button } from "react-native-elements";
import { connect } from "react-redux";
import ValidationComponent from "react-native-form-validator";

const mapStateToProps = (state) => {
  return {
    buildingtypes: state.buildingtypes,
  };
};

class step1 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      buildingType: "",
      builtUpArea: "",
      accommodation: "",
    };
  }
  componentDidMount() {
    if (this.props.getState().buildingType != undefined) {
      const {
        buildingType,
        builtUpArea,
        accommodation,
      } = this.props.getState();
      this.setState({
        buildingType,
        builtUpArea,
        accommodation,
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
      buildingType: { required: true },
      builtUpArea: { required: true },
      accommodation: { required: true },
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
        buildingType: this.state.buildingType,
        builtUpArea: this.state.builtUpArea,
        accommodation: this.state.accommodation,
      });

      next();
    }
  };

  onBack = () => {
    const { back } = this.props;

    back();
  };
  render() {
    const { buildingtypes } = this.props.buildingtypes;
    const { currentStep, totalSteps } = this.state;
    return (
      <ScrollView>
        <Card containerStyle={{ borderTopWidth: 5, borderTopColor: "#00224F" }}>
          <View style={styles.pickerLocation}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.buildingType}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ buildingType: itemValue });
              }}
            >
              <Picker.Item label="Building Type *" value="" color="#A8A8A8" />
              {buildingtypes.map((type, index) => (
                <Picker.Item key={index} label={type.name} value={type.name} />
              ))}
            </Picker>
          </View>
          <Input
            placeholder="Built up Area *"
            keyboardType="number-pad"
            placeholderTextColor="#A8A8A8"
            value={this.state.builtUpArea}
            onChangeText={(area) => this.setState({ builtUpArea: area })}
            style={{ marginTop: 20, fontSize: 16 }}
          />
          <Input
            placeholder="Accommondation *"
            placeholderTextColor="#A8A8A8"
            multiline={true}
            value={this.state.accommodation}
            onChangeText={(accommodation) =>
              this.setState({ accommodation: accommodation })
            }
            style={{ fontSize: 16 }}
          />
          <View style={styles.containerBtn}>
            <View style={styles.BtnContent}>
              {currentStep === 1 ? (
                <View style={{ flex: 1 }}></View>
              ) : (
                <Button title="Back" containerStyle={{ flex: 1 }} />
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
    flex: 1,
  },
  BtnContent: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
});

export default connect(mapStateToProps)(step1);
