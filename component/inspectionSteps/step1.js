import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";
import { Card, Input, Button } from "react-native-elements";
import { TextInputMask } from "react-native-masked-text";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ValidationComponent from "react-native-form-validator";

class step1 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      inspectionDate: "",
      propertyUPI: "",
      propertyOwner: "",
      showDate: false,
      status: "0",
    };
  }
  componentDidMount() {
    if (this.props.getState().inspectionDate != undefined) {
      const {
        inspectionDate,
        propertyUPI,
        propertyOwner,
      } = this.props.getState();
      this.setState({
        inspectionDate,
        propertyUPI,
        propertyOwner,
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

  pickDateHandler() {
    this.setState({ showDate: true });
  }
  onChangeDate(date) {
    let dateNew = new Date(date);

    this.setState({
      inspectionDate:
        dateNew.getDate() +
        "-" +
        (dateNew.getMonth() + 1) +
        "-" +
        dateNew.getFullYear(),
      showDate: false,
    });
  }
  onCancelDate() {
    this.setState({ showDate: false });
  }
  nextStep = () => {
    const { next, saveState } = this.props;
    this.validate({
      inspectionDate: { required: true },
      propertyUPI: { required: true },
      propertyOwner: { required: true },
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
        inspectionDate: this.state.inspectionDate,
        propertyUPI: this.state.propertyUPI,
        propertyOwner: this.state.propertyOwner,
        status: this.state.status,
      });

      next();
    }
  };
  render() {
    const { currentStep, totalSteps } = this.state;
    return (
      <ScrollView>
        <Card containerStyle={{ borderTopWidth: 5, borderTopColor: "#00224F" }}>
          <TouchableOpacity onPress={() => this.pickDateHandler()}>
            <View style={styles.pickerLocation}>
              <Text
                style={
                  this.state.inspectionDate
                    ? {
                        fontSize: 16,
                        marginBottom: 11,
                        marginTop: 10,
                        color: "#000",
                      }
                    : {
                        fontSize: 16,
                        marginBottom: 11,
                        marginTop: 10,
                        color: "#A8A8A8",
                      }
                }
              >
                {this.state.inspectionDate
                  ? this.state.inspectionDate
                  : "Inspection Date *"}
              </Text>
              <DateTimePickerModal
                isVisible={this.state.showDate}
                mode="date"
                onConfirm={this.onChangeDate.bind(this)}
                onCancel={() => this.onCancelDate()}
              />
            </View>
          </TouchableOpacity>
          <TextInputMask
            placeholder="Property UPI *"
            placeholderTextColor="#A8A8A8"
            keyboardType="number-pad"
            type={"custom"}
            options={{
              mask: "9/99/99/99/9999",
            }}
            value={this.state.propertyUPI}
            onChangeText={(upi) => {
              this.setState({ propertyUPI: upi });
            }}
            style={{
              marginTop: 25,
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#A8A8A8",
              fontSize: 15,
            }}
          />
          <Input
            placeholder="Owner *"
            placeholderTextColor="#A8A8A8"
            value={this.state.propertyOwner}
            onChangeText={(owner) => {
              this.setState({ propertyOwner: owner });
            }}
            style={{ fontSize: 15 }}
          />
          <View style={styles.containerBtn}>
            <View style={styles.BtnContent}>
              {currentStep === 1 ? (
                <View style={{ flex: 1 }}></View>
              ) : (
                <Button
                  title="Back"
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

export default step1;
