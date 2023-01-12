import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  Text,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Card, Button } from "react-native-elements";
import ValidationComponent from "react-native-form-validator";
import { connect } from "react-redux";
import {
  fetchDistricts,
  fetchSectors,
  fetchCells,
  fetchVillages,
} from "../../redux/ActionCreators";

const mapStateToProps = (state) => {
  return {
    provinces: state.provinces,
    districts: state.districts,
    sectors: state.sectors,
    cells: state.cells,
    villages: state.villages,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchDistricts: (province) => dispatch(fetchDistricts(province)),
  fetchSectors: (district) => dispatch(fetchSectors(district)),
  fetchCells: (sector) => dispatch(fetchCells(sector)),
  fetchVillages: (cell) => dispatch(fetchVillages(cell)),
});

class step2 extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
      isLoading: false,
    };
  }

  componentDidMount() {
    if (this.props.getState().province != undefined) {
      const { province, district, sector, cell, village } =
        this.props.getState();
      this.setState({
        province,
        district,
        sector,
        cell,
        village,
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
      province: { required: true },
      district: { required: true },
      sector: { required: true },
      cell: { required: true },
      village: { required: true },
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
        province: this.state.province,
        district: this.state.district,
        sector: this.state.sector,
        cell: this.state.cell,
        village: this.state.village,
      });

      next();
    }
  };

  onBack = () => {
    const { back } = this.props;

    back();
  };

  onChangeProvince(province) {
    if (province !== "") {
      this.setState({ province: province, isLoading: true });
      this.props.fetchDistricts(province).then(() => {
        this.setState({ isLoading: false });
      });
    }
  }
  onChangeDistrict(district) {
    if (district !== "") {
      this.setState({ district: district, isLoading: true });
      this.props.fetchSectors(district).then(() => {
        this.setState({ isLoading: false });
      });
    }
  }
  onChangeSector(sector) {
    if (sector !== "") {
      this.setState({ sector: sector, isLoading: true });
      this.props.fetchCells(sector).then(() => {
        this.setState({ isLoading: false });
      });
    }
  }
  onChangeCell(cell) {
    if (cell !== "") {
      this.setState({ cell: cell, isLoading: true });
      this.props.fetchVillages(cell).then(() => {
        this.setState({ isLoading: false });
      });
    }
  }
  render() {
    const { provinces } = this.props.provinces;
    const { districts } = this.props.districts;
    const { sectors } = this.props.sectors;
    const { cells } = this.props.cells;
    const { villages } = this.props.villages;
    const { currentStep, totalSteps } = this.state;
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
              <Text>Loading</Text>
            </View>
          </View>
        </Modal>

        <Card containerStyle={{ borderTopWidth: 5, borderTopColor: "#00224F" }}>
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
              <Picker.Item label="District *" value="" color="#A8A8A8" />
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
              <Picker.Item label="Sector *" value="" color="#A8A8A8" />
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
              <Picker.Item label="Cell *" value="" color="#A8A8A8" />
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
              <Picker.Item label="Village *" value="" color="#A8A8A8" />
              {villages.map((village, index) => (
                <Picker.Item
                  key={index}
                  label={village.name}
                  value={village.name}
                />
              ))}
            </Picker>
          </View>
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
                  onPress={this.onBack}
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
    marginTop: 30,
    marginBottom: 10,
    flex: 1,
  },
  BtnContent: {
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
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
export default connect(mapStateToProps, mapDispatchToProps)(step2);
