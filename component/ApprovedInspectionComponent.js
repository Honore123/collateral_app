import React, { Component } from "react";
import {
  ScrollView,
  RefreshControl,
  Alert,
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { ListItem, Button, Icon } from "react-native-elements";
import { connect } from "react-redux";
import { fetchInspections } from "../redux/ActionCreators";
import * as FileSystem from "expo-file-system";
import { DownloadLink } from "../shared/baseUrl";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as SecureStore from "expo-secure-store";
import Loading from "./LoadingComponent";

const mapStateToProps = (state) => {
  return {
    inspections: state.inspections,
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetchInspections: (userId, token) =>
    dispatch(fetchInspections(userId, token)),
});
class ApprovedInspection extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  downloadInspection(file, owner) {
    console.log(file);
    this.setState({ isLoading: true });
    FileSystem.downloadAsync(
      DownloadLink + file,
      FileSystem.documentDirectory + owner + ".pdf"
    )
      .then(async ({ uri }) => {
        const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (perm.status != "granted") {
          return;
        }

        try {
          const asset = await MediaLibrary.createAssetAsync(uri);
          const album = await MediaLibrary.getAlbumAsync("CIS");
          if (album == null) {
            await MediaLibrary.createAlbumAsync("CIS", asset, false);
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }
          Alert.alert(
            "Success!",
            "Report has been downloaded check in your file",
            [
              {
                text: "OK",
                onPress: () => this.setState({ isLoading: false }),
              },
            ]
          );
        } catch (e) {
          Alert.alert("Error!", e.message, [
            {
              text: "OK",
              onPress: () => this.setState({ isLoading: false }),
            },
          ]);
        }
      })
      .catch((error) => {
        Alert.alert("Error!", error.message, [
          {
            text: "OK",
            onPress: () => console.log("clicked ok"),
          },
        ]);
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
              <Text>Downloading</Text>
            </View>
          </View>
        </Modal>
        {this.props.inspections.inspections.filter(
          (inspection) => inspection.status === "2"
        )[0] ? (
          this.props.inspections.inspections
            .filter((inspection) => inspection.status === "2")
            .map((inspection, index) => (
              <ListItem key={index} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>UPI {inspection.propertyUPI}</ListItem.Title>
                  <ListItem.Subtitle>
                    {inspection.inspectionDate}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <Button
                  title="Download"
                  type="clear"
                  titleStyle={{ color: "#2A2AC0" }}
                  icon={{
                    name: "download",
                    type: "font-awesome",
                    size: 15,
                    color: "#2A2AC0",
                  }}
                  onPress={() =>
                    this.downloadInspection(
                      inspection.reportFile,
                      inspection.propertyOwner
                    )
                  }
                />
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(ApprovedInspection);
