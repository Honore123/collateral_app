import React, { Component } from "react";
import { View } from "react-native";
import AnimatedMultistep from "react-native-animated-multistep";
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";
import { postHouse } from "../redux/ActionCreators";

import Step1 from "./buildingSteps/step1";
import Step2 from "./buildingSteps/step2";
import Step3 from "./buildingSteps/step3";
import Step4 from "./buildingSteps/step4";
import Step5 from "./buildingSteps/step5";
import Step6 from "./buildingSteps/step6";
import Step7 from "./buildingSteps/step7";
import Step8 from "./buildingSteps/step8";

const allSteps = [
  { name: "step 1", component: Step1 },
  { name: "step 2", component: Step2 },
  { name: "step 3", component: Step3 },
  { name: "step 4", component: Step4 },
  { name: "step 5", component: Step5 },
  { name: "step 6", component: Step6 },
  { name: "step 7", component: Step7 },
  { name: "step 8", component: Step8 },
];

const mapDispatchToProps = (dispatch) => ({
  postHouse: (inspection, image1, image2, image3, image4, house) =>
    dispatch(postHouse(inspection, image1, image2, image3, image4, house)),
});

class NewHouse extends Component {
  onNext = () => {
    console.log("Next");
  };

  onBack = () => {
    console.log("Back");
  };

  finish = (finalState) => {
    finalState["earth_id"] = this.props.route.params.inspection;
    console.log(finalState);
    this.props
      .postHouse(
        this.props.route.params.inspection,
        finalState.image1,
        finalState.image2,
        finalState.image3,
        finalState.image4,
        finalState
      )
      .then(() => {
        this.props.navigation.navigate("Houses");
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
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
export default connect(null, mapDispatchToProps)(NewHouse);
