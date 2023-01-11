import React, { Component } from "react";
import {
  View,
  Modal,
  Text,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AnimatedMultistep from "react-native-animated-multistep";
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";
import { postInspection } from "../redux/ActionCreators";

import Step1 from "./inspectionSteps/step1";
import Step2 from "./inspectionSteps/step2";
import Step3 from "./inspectionSteps/step3";
import Step4 from "./inspectionSteps/step4";
import Step5 from "./inspectionSteps/step5";
import Step6 from "./inspectionSteps/step6";
import Step7 from "./inspectionSteps/step7";

const allSteps = [
  { name: "step 1", component: Step1 },
  { name: "step 2", component: Step2 },
  { name: "step 3", component: Step3 },
  { name: "step 4", component: Step4 },
  { name: "step 5", component: Step5 },
  { name: "step 6", component: Step6 },
  { name: "step 7", component: Step7 },
];

const mapStateToProps = (state) => {
  return {
    inspections: state.inspections,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postInspection: (inspections, token) =>
    dispatch(postInspection(inspections, token)),
});

class NewInspection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  onNext = () => {
    console.log("Next");
  };

  onBack = () => {
    console.log("Back");
  };

  finish = (finalState) => {
    this.setState({ isLoading: true });
    console.log(finalState);
    SecureStore.getItemAsync("token").then((token) => {
      this.props.postInspection(finalState, token).then(() => {
        if (!this.props.inspections.isLoading) {
          this.setState({ isLoading: false });
          this.props.navigation.navigate("Manage Inspection");
        }
      });
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.isLoading}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#181461" />
              <Text>Saving data</Text>
            </View>
          </View>
        </Modal>
        <AnimatedMultistep
          steps={allSteps}
          onFinish={this.finish}
          onBack={this.onBack}
          onNext={this.onNext}
          comeInOnNext="bounceInRight"
          OutOnNext="bounceOutLeft"
          comeInOnBack="bounceInLeft"
          OutOnBack="bounceOutRight"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(NewInspection);
