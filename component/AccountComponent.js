import React, { Component } from "react";
import { ScrollView, Alert } from "react-native";
import { Card, Input, Button } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";
import { changeAccountInfo } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeAccountInfo: (token, user) => dispatch(changeAccountInfo(token, user)),
});

class Account extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      user_id: "",
    };
  }
  componentDidMount() {
    this.setState({
      email: this.props.auth.user.email,
      user_id: this.props.auth.user.id,
    });
  }
  handleAccount() {
    this.validate({
      name: { required: true },
      password: { required: true },
      confirmPassword: { required: true },
    });
    if (!this.isFormValid()) {
      Alert.alert("Error!", "Fields with * are mandatory", [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    } else {
      SecureStore.getItemAsync("token").then((token) => {
        this.props.changeAccountInfo(token, this.state);
        this.setState({
          name: "",
          password: "",
          confirmPassword: "",
        });
      });
    }
  }
  render() {
    return (
      <ScrollView>
        <Card
          containerStyle={{
            borderTopWidth: 5,
            borderTopColor: "#181461",
            marginBottom: 20,
          }}
        >
          <Card.Title
            style={{
              marginBottom: 40,
              fontSize: 20,
              alignSelf: "flex-start",
              textTransform: "uppercase",
              color: "#181461",
            }}
          >
            {" "}
            Change Info
          </Card.Title>
          <Input
            placeholder="Email"
            placeholderTextColor="#A8A8A8"
            disabled={true}
            value={this.state.email}
            style={{
              fontSize: 16,
              color: "#000",
            }}
          />
          <Input
            placeholder="Name *"
            placeholderTextColor="#A8A8A8"
            value={this.state.name}
            onChangeText={(name) => this.setState({ name: name })}
            style={{ fontSize: 16 }}
          />
          <Input
            placeholder="Password *"
            placeholderTextColor="#A8A8A8"
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(password) => this.setState({ password: password })}
            style={{ fontSize: 16 }}
          />
          <Input
            placeholder="Confirm Password *"
            placeholderTextColor="#A8A8A8"
            secureTextEntry={true}
            value={this.state.confirmPassword}
            onChangeText={(confirm) =>
              this.setState({ confirmPassword: confirm })
            }
            style={{ fontSize: 16 }}
          />
          <Button
            title="Update"
            buttonStyle={{
              marginTop: 30,
              marginBottom: 30,
              backgroundColor: "#0CB100",
            }}
            onPress={() => this.handleAccount()}
          />
        </Card>
      </ScrollView>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Account);
