import React, { Component } from "react";
import {
  Picker,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as SecureStore from "expo-secure-store";
import { Card, Input, CheckBox, Button } from "react-native-elements";
import { TextInputMask } from "react-native-masked-text";
import * as Location from "expo-location";
import { connect } from "react-redux";
import {
  putInspection,
  fetchDistricts,
  fetchSectors,
  fetchCells,
  fetchVillages,
  fetchInspections,
} from "../redux/ActionCreators";
import ValidationComponent from "react-native-form-validator";

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    inspections: state.inspections,
    tenures: state.tenures,
    propertytypes: state.propertytypes,
    provinces: state.provinces,
    districts: state.districts,
    sectors: state.sectors,
    cells: state.cells,
    villages: state.villages,
  };
};

const mapDispatchToProps = (dispatch) => ({
  putInspection: (inspections, token, inspectionId) =>
    dispatch(putInspection(inspections, token, inspectionId)),
  fetchInspections: (userId, token) =>
    dispatch(fetchInspections(userId, token)),
  fetchDistricts: (province) => dispatch(fetchDistricts(province)),
  fetchSectors: (district) => dispatch(fetchSectors(district)),
  fetchCells: (sector) => dispatch(fetchCells(sector)),
  fetchVillages: (cell) => dispatch(fetchVillages(cell)),
});

class EditInspection extends ValidationComponent {
  constructor(props) {
    super(props);
    const inspection = this.props.inspections.inspections.filter(
      (inspection) => inspection.id === this.props.route.params.inspectionId
    )[0];

    this.state = {
      id: inspection.id,
      inspectionDate: inspection.inspectionDate,
      propertyUPI: inspection.propertyUPI,
      province: inspection.province,
      district: inspection.district,
      sector: inspection.sector,
      cell: inspection.cell,
      village: inspection.village,
      propertyOwner: inspection.propertyOwner,
      tenureType: inspection.tenureType,
      propertyType: inspection.propertyType,
      plotSize: inspection.plotSize,
      encumbranes: inspection.encumbranes,
      mortgaged: inspection.mortgaged,
      servedBy: inspection.servedBy,
      latitude: inspection.latitude,
      longitude: inspection.longitude,
      accuracy: inspection.accuracy,
      status: "0",
      users_id: "",
      reportFile: "",
      showDate: false,
      comment: inspection.comment,
      inspectionId: inspection.id,
      isLoading: false,
      locationLoading: false,
    };
  }
  componentDidMount() {
    this.setState({ users_id: this.props.user.id });
  }
  _getLocationHander = async () => {
    this.setState({ accuracy: "Loading Coordinates..." });
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("you don't have permission");
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      console.log(location);
      Alert.alert(
        "GPS!",
        "Latitude: " +
          location.coords.latitude +
          "\n" +
          "Longitude: " +
          location.coords.longitude +
          "\n" +
          "Accuracy: " +
          location.coords.accuracy +
          " meters\n",
        [
          {
            text: "OK",
            onPress: () =>
              this.setState({ accuracy: location.coords.accuracy }),
          },
        ]
      );
      this.setState({
        accuracy: location.coords.accuracy,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert("Error!", error.message, [
        {
          text: "OK",
          onPress: () => this.setState({ accuracy: "Your GPS Coordinates *" }),
        },
      ]);
    }
  };
  handleUpdateInspection() {
    console.log(this.state);
    this.setState({ isLoading: true });
    this.validate({
      inspectionDate: { required: true },
      propertyUPI: { required: true },
      province: { required: true },
      district: { required: true },
      sector: { required: true },
      cell: { required: true },
      village: { required: true },
      propertyOwner: { required: true },
      tenureType: { required: true },
      propertyType: { required: true },
      plotSize: { required: true },
      servedBy: { required: true },
      latitude: { required: true },
      longitude: { required: true },
      accuracy: { required: true },
    });
    if (!this.isFormValid()) {
      Alert.alert("Error!", "Fields with * are mandatory", [
        {
          text: "OK",
          onPress: () => this.setState({ isLoading: false }),
        },
      ]);
    } else {
      SecureStore.getItemAsync("token").then((token) => {
        this.props
          .putInspection(this.state, token, this.state.inspectionId)
          .then(() => {
            SecureStore.getItemAsync("creds").then((result) => {
              const user = JSON.parse(result);
              this.props.fetchInspections(user.id, token).then(() => {
                this.setState({
                  inspectionDate: "",
                  propertyUPI: "",
                  province: "",
                  district: "",
                  sector: "",
                  cell: "",
                  village: "",
                  propertyOwner: "",
                  tenureType: "",
                  propertyType: "",
                  plotSize: "",
                  encumbranes: false,
                  mortgaged: false,
                  servedBy: "",
                  latitude: "",
                  longitude: "",
                  accuracy: "",
                  status: "0",
                  isLoading: false,
                  users_id: this.props.user.id,
                });
                this.props.navigation.goBack();
              });
            });
          });
      });
    }
  }
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
  onChangeProvince(province) {
    if (province !== "") {
      this.setState({ province: province, locationLoading: true });
      this.props.fetchDistricts(province).then(() => {
        this.setState({ locationLoading: false });
      });
    }
  }
  onChangeDistrict(district) {
    if (district !== "") {
      this.setState({ district: district, locationLoading: true });
      this.props.fetchSectors(district).then(() => {
        this.setState({ locationLoading: false });
      });
    }
  }
  onChangeSector(sector) {
    if (sector !== "") {
      this.setState({ sector: sector, locationLoading: true });
      this.props.fetchCells(sector).then(() => {
        this.setState({ locationLoading: false });
      });
    }
  }
  onChangeCell(cell) {
    if (cell !== "") {
      this.setState({ cell: cell, locationLoading: true });
      this.props.fetchVillages(cell).then(() => {
        this.setState({ locationLoading: false });
      });
    }
  }
  render() {
    const { tenures } = this.props.tenures;
    const { propertytypes } = this.props.propertytypes;
    const { provinces } = this.props.provinces;
    const { districts } = this.props.districts;
    const { sectors } = this.props.sectors;
    const { cells } = this.props.cells;
    const { villages } = this.props.villages;
    return (
      <ScrollView>
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
              <Text>Updating</Text>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.locationLoading}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size="large" color="#181461" />
              <Text>Loading</Text>
            </View>
          </View>
        </Modal>
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
          <View style={styles.pickerLocation}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.province}
              onValueChange={(itemValue, itemIndex) =>
                this.onChangeProvince(itemValue)
              }
            >
              <Picker.Item label="Province *" value="" color="#A8A8A8" />
              {provinces.map((province, index) => (
                <Picker.Item
                  key={index}
                  label={province.name}
                  value={province.name}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.district}
              onValueChange={(itemValue, itemIndex) =>
                this.onChangeDistrict(itemValue)
              }
            >
              <Picker.Item
                label={this.state.district + " (Previous)"}
                value={this.state.district}
              />
              {districts.map((district, index) => (
                <Picker.Item
                  key={index}
                  label={district.name}
                  value={district.name}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.sector}
              onValueChange={(itemValue, itemIndex) =>
                this.onChangeSector(itemValue)
              }
            >
              <Picker.Item
                label={this.state.sector + " (Previous)"}
                value={this.state.sector}
              />
              {sectors.map((sector, index) => (
                <Picker.Item
                  key={index}
                  label={sector.name}
                  value={sector.name}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.cell}
              onValueChange={(itemValue, itemIndex) =>
                this.onChangeCell(itemValue)
              }
            >
              <Picker.Item
                label={this.state.cell + " (Previous)"}
                value={this.state.cell}
              />
              {cells.map((cell, index) => (
                <Picker.Item key={index} label={cell.name} value={cell.name} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.village}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ village: itemValue });
              }}
            >
              <Picker.Item
                label={this.state.village + " (Previous)"}
                value={this.state.village}
              />
              {villages.map((village, index) => (
                <Picker.Item
                  key={index}
                  label={village.name}
                  value={village.name}
                />
              ))}
            </Picker>
          </View>
          <Input
            placeholder="Owner *"
            placeholderTextColor="#A8A8A8"
            value={this.state.propertyOwner}
            onChangeText={(owner) => {
              this.setState({ propertyOwner: owner });
            }}
            style={{ marginTop: 20, fontSize: 15 }}
          />
          <View style={styles.pickerLocation}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.tenureType}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ tenureType: itemValue });
              }}
            >
              <Picker.Item label="Type of Tenure *" value="" color="#A8A8A8" />
              {tenures.map((tenure, index) => (
                <Picker.Item
                  key={index}
                  label={tenure.tenure_type}
                  value={tenure.tenure_type}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerLocationMargin}>
            <Picker
              style={{ marginLeft: -8 }}
              selectedValue={this.state.propertyType}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({ propertyType: itemValue });
              }}
            >
              <Picker.Item label="Property Type *" value="" color="#A8A8A8" />
              {propertytypes.map((type, index) => (
                <Picker.Item key={index} label={type.name} value={type.name} />
              ))}
            </Picker>
          </View>
          <Input
            placeholder="Plot Size *"
            keyboardType="number-pad"
            placeholderTextColor="#A8A8A8"
            value={this.state.plotSize}
            onChangeText={(plotSize) => {
              this.setState({ plotSize: plotSize });
            }}
            style={{ marginTop: 20, fontSize: 15 }}
          />
          <View>
            <Text style={{ marginLeft: 10, fontSize: 15 }}>Encumbranes</Text>
            <CheckBox
              title="Yes"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.encumbranes === "Yes"}
              onPress={() => this.setState({ encumbranes: "Yes" })}
            />
            <CheckBox
              title="No"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.encumbranes === "No"}
              onPress={() => this.setState({ encumbranes: "No" })}
            />
            <CheckBox
              title="Not Sure"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.encumbranes === "Not Sure"}
              onPress={() => this.setState({ encumbranes: "Not Sure" })}
            />
          </View>
          <View>
            <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 15 }}>
              Mortgaged
            </Text>
            <CheckBox
              title="Yes"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.mortgaged === "Yes"}
              onPress={() => this.setState({ mortgaged: "Yes" })}
            />
            <CheckBox
              title="No"
              uncheckedIcon="dot-circle-o"
              uncheckedColor="#707070"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.mortgaged === "No"}
              onPress={() => this.setState({ mortgaged: "No" })}
            />
            <CheckBox
              title="Not Sure"
              uncheckedIcon="dot-circle-o"
              uncheckedColor="#707070"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.mortgaged === "Not Sure"}
              onPress={() => this.setState({ mortgaged: "Not Sure" })}
            />
          </View>
          <View>
            <Text style={{ marginLeft: 10, marginTop: 20, fontSize: 15 }}>
              Property is served by *
            </Text>
            <CheckBox
              title="Marram Road"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.servedBy === "Marram" ? true : false}
              onPress={() => this.setState({ servedBy: "Marram" })}
            />
            <CheckBox
              title="Tarmac Road"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.servedBy === "Tarmac" ? true : false}
              onPress={() => this.setState({ servedBy: "Tarmac" })}
            />
            <CheckBox
              title="Paved Road"
              uncheckedIcon="circle-o"
              checkedIcon="dot-circle-o"
              uncheckedColor="#707070"
              checked={this.state.servedBy === "Paved" ? true : false}
              onPress={() => this.setState({ servedBy: "Paved" })}
            />
          </View>
          <View>
            <Text style={{ fontSize: 15, marginTop: 20, marginBottom: 10 }}>
              {this.state.accuracy !== ""
                ? this.state.accuracy
                : "Your GPS Coordinates *"}
            </Text>
            <Button
              title="Get GPS Coordinates"
              buttonStyle={{
                backgroundColor: "#00224F",
              }}
              onPress={this._getLocationHander}
            />
          </View>
          <View style={{ marginTop: 30, marginBottom: 20 }}>
            <Button
              title="Update"
              buttonStyle={{ backgroundColor: "#0CB100" }}
              onPress={() => this.handleUpdateInspection()}
            />
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
export default connect(mapStateToProps, mapDispatchToProps)(EditInspection);
