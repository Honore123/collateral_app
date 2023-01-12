import React, { Component } from "react";
import { ScrollView, StyleSheet, View, Text, Alert } from "react-native";
import { Card, Input, CheckBox, Button, Icon } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";
class step5 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      external: {
        painted: false,
        plastered: false,
        rendered: false,
      },
    };
  }
  componentDidMount() {
    if (this.props.getState().external != undefined) {
      const { external } = this.props.getState();
      this.setState({
        external,
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
      external: { required: true },
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
        external: this.state.external,
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
              External *
            </Text>
            <CheckBox
              title="Painted"
              uncheckedIcon="square-o"
              checkedIcon="check-square-o"
              uncheckedColor="#707070"
              checked={this.state.external.painted}
              onPress={() =>
                this.setState({
                  external: {
                    ...this.state.external,
                    painted: !this.state.external.painted,
                  },
                })
              }
            />
            <CheckBox
              title="Plastered"
              uncheckedIcon="square-o"
              checkedIcon="check-square-o"
              uncheckedColor="#707070"
              checked={this.state.external.plastered}
              onPress={() =>
                this.setState({
                  external: {
                    ...this.state.external,
                    plastered: !this.state.external.plastered,
                  },
                })
              }
            />
            <CheckBox
              title="Rendered"
              uncheckedIcon="square-o"
              checkedIcon="check-square-o"
              uncheckedColor="#707070"
              checked={this.state.external.rendered}
              onPress={() =>
                this.setState({
                  external: {
                    ...this.state.external,
                    rendered: !this.state.external.rendered,
                  },
                })
              }
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

export default step5;
