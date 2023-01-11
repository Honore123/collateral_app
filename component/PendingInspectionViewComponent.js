import React, { Component } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { ListItem, Button, Icon } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import { connect } from "react-redux";
import { inspectionSubmit, fetchInspections } from "../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    inspections: state.inspections,
  };
};
const mapDispatchToProps = (dispatch) => ({
  inspectionSubmit: (inspectionId, status, token) =>
    dispatch(inspectionSubmit(inspectionId, status, token)),
  fetchInspections: (userId, token) =>
    dispatch(fetchInspections(userId, token)),
});

class PendingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selecInspection: "",
      selecType: "",
      refreshing: false,
      isLoading: false,
    };
  }
  onRefresh() {
    this.setState({ refreshing: true });
    SecureStore.getItemAsync("token").then((token) => {
      SecureStore.getItemAsync("creds").then((result) => {
        const user = JSON.parse(result);
        this.props.fetchInspections(user.id, token).then(() => {
          this.setState({ refreshing: false });
        });
      });
    });
  }
  modalHandler(inspection, property) {
    this.setState({
      selecInspection: inspection,
      modalVisible: true,
      selecType: property,
    });
  }
  modifyHander(inspection) {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate("Houses", { inspection: inspection });
  }
  vacantHander(inspection) {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate("Vacant land", { inspection: inspection });
  }
  editHandler(inspection) {
    this.setState({ modalVisible: false });
    this.props.navigation.navigate("Edit Inspection", {
      inspectionId: inspection,
    });
  }
  submitHandler(inspectionId) {
    this.setState({ isLoading: true });
    const status = { status: "1" };
    SecureStore.getItemAsync("token").then((token) => {
      this.props.inspectionSubmit(inspectionId, status, token).then(() => {
        this.setState({ modalVisible: false, isLoading: false });
      });
    });
  }
  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
          />
        }
      >
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
              <Text>Submitting</Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <TouchableWithoutFeedback
            onPress={() => this.setState({ modalVisible: false })}
          >
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {this.state.selecType === "Land with Building" ? (
                <Button
                  title="Buildings"
                  type="clear"
                  onPress={this.modifyHander.bind(
                    this,
                    this.state.selecInspection
                  )}
                />
              ) : (
                <Button
                  title="Vacant Land"
                  type="clear"
                  onPress={this.vacantHander.bind(
                    this,
                    this.state.selecInspection
                  )}
                />
              )}
              <Button
                title="Edit"
                type="clear"
                containerStyle={{ alignSelf: "stretch" }}
                onPress={this.editHandler.bind(
                  this,
                  this.state.selecInspection
                )}
              />
              <Button
                title="Submit"
                type="clear"
                onPress={this.submitHandler.bind(
                  this,
                  this.state.selecInspection
                )}
              />

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => this.setState({ modalVisible: false })}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {this.props.inspections.inspections.filter(
          (inspection) => inspection.status === "0" || inspection.status === "1"
        )[0] ? (
          this.props.inspections.inspections
            .filter(
              (inspection) =>
                inspection.status === "0" || inspection.status === "1"
            )
            .map((inspection, index) => (
              <ListItem key={index} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>UPI {inspection.propertyUPI}</ListItem.Title>
                  <ListItem.Subtitle>
                    {inspection.inspectionDate}
                  </ListItem.Subtitle>
                </ListItem.Content>
                {inspection.status === "1" ? (
                  <Icon
                    name="checkcircle"
                    type="ant-design"
                    size={24}
                    color="green"
                  />
                ) : (
                  <Button
                    title="More"
                    type="clear"
                    titleStyle={{ color: "#2A2AC0" }}
                    icon={{
                      name: "ellipsis-h",
                      type: "font-awesome",
                      size: 15,
                      color: "#2A2AC0",
                    }}
                    onPress={() =>
                      this.modalHandler(inspection.id, inspection.propertyType)
                    }
                  />
                )}
              </ListItem>
            ))
        ) : (
          <View
            style={{
              alignItems: "center",
              marginTop: "50%",
              flex: 1,
            }}
          >
            <Icon
              name="warning"
              type="font-awesome"
              size={18}
              color="#9D9EA0"
            />
            <Text style={{ fontSize: 17, color: "#9D9EA0" }}>No reports</Text>
          </View>
        )}
      </ScrollView>
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
  button: {
    marginTop: 10,
    borderRadius: 2,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
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
export default connect(mapStateToProps, mapDispatchToProps)(PendingView);
