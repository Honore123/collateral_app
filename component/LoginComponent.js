import React, { Component } from "react";
import { View, Text, StyleSheet, Alert, SafeAreaView } from "react-native";
import { Card, Input, Button, Icon } from "react-native-elements";
import { connect } from "react-redux";
import { loginUser } from "../redux/ActionCreators";
import ValidationComponent from "react-native-form-validator";

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
  loginUser: (creds) => dispatch(loginUser(creds)),
});

class Login extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
  handleLogin() {
    this.validate({
      email: { required: true },
      password: { required: true },
    });
    if (!this.isFormValid()) {
      Alert.alert("Error!", "Please fill all fields", [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    } else {
      this.props.loginUser(this.state);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.logoText}>C.I.S</Text>
          <Text style={styles.headerText}>Please login to your account</Text>
          <Card containerStyle={styles.cardContainer}>
            <View style={{ marginTop: 10 }}>
              <Input
                placeholder="Email"
                textContentType="emailAddress"
                value={this.state.email}
                onChangeText={(email) => this.setState({ email })}
                rightIcon={() => (
                  <Icon
                    name="envelope"
                    type="font-awesome"
                    size={20}
                    color="#A2A2A2"
                  />
                )}
                style={{ fontSize: 16 }}
              />
              <Input
                placeholder="Password"
                textContentType="password"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={(password) => this.setState({ password })}
                rightIcon={() => (
                  <Icon name="lock" type="ionicons" size={20} color="#A2A2A2" />
                )}
                style={{ fontSize: 16 }}
              />
              {this.props.auth.isLoading ? (
                <Button title="Loading" buttonStyle={styles.loginBtn} loading />
              ) : (
                <Button
                  title="LOGIN"
                  buttonStyle={styles.loginBtn}
                  onPress={() => this.handleLogin()}
                />
              )}
            </View>
          </Card>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#F4F6F9",
    marginTop: 25,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  headerText: {
    textAlign: "center",
    fontSize: 18,
    color: "#1D2226",
    marginBottom: 20,
  },
  cardContainer: {
    marginRight: 0,
    borderBottomStartRadius: 16,
    borderTopStartRadius: 16,
    shadowColor: "#4D97FF",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.13,
    shadowRadius: 6.68,
    elevation: 11,
  },
  loginBtn: {
    marginTop: 25,
    marginBottom: 20,
    backgroundColor: "#6C63FF",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
