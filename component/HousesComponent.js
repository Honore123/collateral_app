import React, { Component } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { ListItem, Button, Icon } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";
import { fetchHouses, inspectionSubmit } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    houses: state.houses,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchHouses: (inspectionId) => dispatch(fetchHouses(inspectionId)),
  inspectionSubmit: (inspectionId, status, token) =>
    dispatch(inspectionSubmit(inspectionId, status, token)),
});

class Houses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      loadingHouse: false,
    };
  }
  componentDidMount() {
    this.setState({ loadingHouse: true });
    this.props.fetchHouses(this.props.route.params.inspection).then(() => {
      this.setState({ loadingHouse: false });
    });
  }
  submitHandler() {
    this.setState({ isLoading: true });
    const status = { status: "1" };
    SecureStore.getItemAsync("token").then((token) => {
      this.props
        .inspectionSubmit(this.props.route.params.inspection, status, token)
        .then(() => {
          this.setState({ isLoading: false });
          this.props.navigation.navigate("Pending");
        });
    });
  }
  render() {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.loadingHouse}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#181461" />
              <Text>Fetching Houses</Text>
            </View>
          </View>
        </Modal>
        {this.props.houses.houses.map((house, index) => (
          <ListItem
            key={index}
            bottomDivider
            style={{ borderTopColor: "#00224F", borderTopWidth: 4 }}
          >
            <ListItem.Content>
              <ListItem.Title>Building {index + 1}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}

        <View>
          {this.props.houses.houses.filter((house) => house) ? (
            this.state.isLoading ? (
              <Button
                title="Loading"
                buttonStyle={{ backgroundColor: "#0CB100", borderRadius: 0 }}
                icon={{ name: "check", size: 20, color: "#FFFFFF" }}
                loading
              />
            ) : (
              <Button
                title="Submit"
                buttonStyle={{ backgroundColor: "#0CB100", borderRadius: 0 }}
                icon={{ name: "check", size: 20, color: "#FFFFFF" }}
                onPress={() => this.submitHandler()}
              />
            )
          ) : (
            <View
              style={{
                alignItems: "center",
                marginTop: "50%",
                flex: 1,
              }}
            >
              <Text style={{ fontSize: 17, color: "#9D9EA0" }}>No House</Text>
            </View>
          )}
        </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(Houses);
