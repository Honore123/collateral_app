import * as ActionTypes from "./actionTypes";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { baseUrl } from "../shared/baseUrl";

export const loginUser = (creds) => (dispatch) => {
  dispatch(requestLogin(creds));

  return fetch(baseUrl + "users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error("Wrong Credentials");
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw error;
      }
    )
    .then((response) => response.json())
    .then((response) => {
      if (response.user) {
        SecureStore.setItemAsync("token", response.token);
        SecureStore.setItemAsync("creds", JSON.stringify(response.user));

        dispatch(fetchInspections(response.user.id, response.token));
        dispatch(receiveLogin(response));
      } else {
        var error = new Error("Error " + response.status);
        error.response = response;
        throw error;
      }
    })
    .catch((error) => {
      Alert.alert("Error!", error.message, [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
      dispatch(loginError(error.message));
    });
};

export const requestLogin = (creds) => ({
  type: ActionTypes.LOGIN_REQUEST,
  creds,
});

export const receiveLogin = (response) => ({
  type: ActionTypes.LOGIN_SUCCESS,
  response: response,
});

export const loginError = (message) => ({
  type: ActionTypes.LOGIN_FAILURE,
  message,
});

export const requestLogout = () => ({
  type: ActionTypes.LOGOUT_REQUEST,
});

export const receiveLogout = () => ({
  type: ActionTypes.LOGOUT_SUCCESS,
});

export const logoutUser = (token) => (dispatch) => {
  dispatch(requestLogout());
  const bearer = "Bearer " + token;
  return fetch(baseUrl + "users/logout", {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: bearer,
    },
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error("Logout Error");
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw error;
      }
    )
    .then((response) => response.json())
    .then((response) => {
      if (response.message) {
        SecureStore.deleteItemAsync("token");
        SecureStore.deleteItemAsync("creds");

        dispatch(receiveLogout());
      } else {
        var error = new Error("Error " + response.status);
        error.response = response;
        throw error;
      }
    })
    .catch((error) => {
      Alert.alert("Error! logout", error.message, [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
      dispatch(loginError(error.message));
    });
};

export const changeAccount = (user) => ({
  type: ActionTypes.CHANGE_ACCOUNT,
  payload: user,
});

export const changeAccountInfo = (token, user) => (dispatch) => {
  return fetch(baseUrl + "users/change_account/" + user.user_id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error("Logout Error");
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw error;
      }
    )
    .then((response) => response.json())
    .then((response) => {
      if (response.email) {
        SecureStore.setItemAsync("creds", JSON.stringify(response));
        dispatch(changeAccount(response));
        Alert.alert("Updated", "User info, updated successfully", [
          {
            text: "OK",
            onPress: () => console.log("clicked ok"),
          },
        ]);
      } else {
        var error = new Error("Error " + response.status);
        error.response = response;
        throw error;
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
};

export const fetchInspections = (userId, token) => (dispatch) => {
  dispatch(requestInspection());
  return fetch(baseUrl + "inspections/" + userId, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((inspections) => dispatch(addInspections(inspections)))
    .catch((error) => {
      Alert.alert("Error!", error.message, [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
      dispatch(inspectionsFailed(error.message));
    });
};
export const postInspection = (inspections, token) => (dispatch) => {
  dispatch(requestInspection());
  const data = new FormData();
  if (inspections.image != baseUrl + "images/avatar.png") {
    data.append("document", {
      name: "landTitle",
      type: "image/jpg",
      uri: inspections.image.uri,
    });
  } else {
    data.append("document", null);
  }

  data.append("info", JSON.stringify(inspections));
  return fetch(baseUrl + "inspections", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    credentials: "same-origin",
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.message = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => {
      Alert.alert("Saved!", "Your Inspection has been saved", [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
      return response.json();
    })
    .then((response) => dispatch(addInspection(response)))
    .catch((error) => {
      Alert.alert("Error!", error.message, [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    });
};
export const putInspection = (inspections, token, inspectionId) => (
  dispatch
) => {
  dispatch(requestInspection());
  return fetch(baseUrl + "inspections/modify/" + inspectionId, {
    method: "PUT",
    body: JSON.stringify(inspections),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    credentials: "same-origin",
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.message = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => {
      Alert.alert("Updated!", "Your Inspection has been updated", [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
      return response.json();
    })
    .then((response) => dispatch(updateInspection(response)))
    .catch((error) => {
      Alert.alert("Error!", error.message, [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    });
};
export const inspectionSubmit = (inspectionId, status, token) => (dispatch) => {
  dispatch(requestInspection());
  return fetch(baseUrl + "inspections/" + inspectionId, {
    method: "PUT",
    body: JSON.stringify(status),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    credentials: "same-origin",
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.message = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => {
      Alert.alert("Submited!", "Wait for administration's feedback", [
        {
          text: "OK",
          onPress: () => console.log("Click ok"),
        },
      ]);
      return response.json();
    })
    .then((response) => dispatch(inspectionStatus(response)))
    .catch((error) => {
      Alert.alert("Error!", error.message, [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    });
};
export const updateInspection = (inspection) => ({
  type: ActionTypes.UPDATE_INSPECTIION,
  payload: inspection,
});
export const inspectionStatus = (inspection) => ({
  type: ActionTypes.INSPECTION_SUBMIT,
  payload: inspection,
});
export const requestInspection = () => ({
  type: ActionTypes.REQUEST_INSPECTION,
});
export const addInspections = (inspections) => ({
  type: ActionTypes.ADD_INSPECTIONS,
  payload: inspections,
});
export const addInspection = (inspection) => ({
  type: ActionTypes.ADD_INSPECTION,
  payload: inspection,
});
export const inspectionsFailed = (errmess) => ({
  type: ActionTypes.INSPECTIONS_FAILED,
  payload: errmess,
});

export const fetchHouses = (inspectionId) => (dispatch) => {
  return fetch(baseUrl + "property/" + inspectionId)
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((houses) => dispatch(addHouses(houses)))
    .catch((error) => {
      Alert.alert("Error!", error.message, [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
      dispatch(housesFailed(error.message));
    });
};
export const postHouse = (
  inspectionId,
  image1,
  image2,
  image3,
  image4,
  house
) => (dispatch) => {
  dispatch(housesLoading());
  const data = new FormData();
  if (image1 != baseUrl + "images/avatar.png") {
    data.append("image1", {
      name: "building1",
      type: "image/jpg",
      uri: image1.uri,
    });
  } else {
    data.append("image1", null);
  }
  if (image2 != baseUrl + "images/avatar.png") {
    data.append("image2", {
      name: "building2",
      type: "image/jpg",
      uri: image2.uri,
    });
  } else {
    data.append("image2", null);
  }
  if (image3 != baseUrl + "images/avatar.png") {
    data.append("image3", {
      name: "building3",
      type: "image/jpg",
      uri: image3.uri,
    });
  } else {
    data.append("image3", null);
  }
  if (image4 != baseUrl + "images/avatar.png") {
    data.append("image4", {
      name: "building4",
      type: "image/jpg",
      uri: image4.uri,
    });
  } else {
    data.append("image4", null);
  }

  data.append("info", JSON.stringify(house));

  console.log(data);
  return fetch(baseUrl + "property/" + inspectionId, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: data,
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.message = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => {
      Alert.alert("Saved!", "Building has been saved", [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
      return response.json();
    })
    .then((response) => dispatch(addHouse(response)))
    .catch((error) => {
      Alert.alert("Error!", error.message, [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    });
};

export const postLand = (
  inspectionId,
  image1,
  image2,
  image3,
  image4,
  usage
) => (dispatch) => {
  const data = new FormData();
  if (image1 != baseUrl + "images/avatar.png") {
    data.append("image1", {
      name: "land1",
      type: "image/jpg",
      uri: image1.uri,
    });
  } else {
    data.append("image1", null);
  }
  if (image2 != baseUrl + "images/avatar.png") {
    data.append("image2", {
      name: "land2",
      type: "image/jpg",
      uri: image2.uri,
    });
  } else {
    data.append("image2", null);
  }
  if (image3 != baseUrl + "images/avatar.png") {
    data.append("image3", {
      name: "land3",
      type: "image/jpg",
      uri: image3.uri,
    });
  } else {
    data.append("image3", null);
  }
  if (image4 != baseUrl + "images/avatar.png") {
    data.append("image4", {
      name: "land4",
      type: "image/jpg",
      uri: image4.uri,
    });
  } else {
    data.append("image4", null);
  }

  data.append("usage", JSON.stringify(usage));

  console.log(data);
  return fetch(baseUrl + "vacant_land/" + inspectionId, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: data,
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.message = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => {
      Alert.alert("Submited!", "Wait for administration's feedback", [
        {
          text: "OK",
          onPress: () => console.log("Click ok"),
        },
      ]);
      return response.json();
    })
    .then((response) => dispatch(inspectionStatus(response)))
    .catch((error) => {
      Alert.alert("Error!", error.message, [
        {
          text: "OK",
          onPress: () => console.log("clicked ok"),
        },
      ]);
    });
};

export const addHouse = (house) => ({
  type: ActionTypes.ADD_HOUSE,
  payload: house,
});
export const addHouses = (houses) => ({
  type: ActionTypes.ADD_HOUSES,
  payload: houses,
});
export const housesFailed = (errmess) => ({
  type: ActionTypes.HOUSES_FAILED,
  payload: errmess,
});
export const housesLoading = () => ({
  type: ActionTypes.HOUSES_LOADING,
});

export const fetchBuildingTypes = () => (dispatch) => {
  return fetch(baseUrl + "buildingType")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((types) => dispatch(addBuildingTypes(types)))
    .catch((error) => {
      dispatch(buildingTypeFailed(error.message));
    });
};

export const addBuildingTypes = (types) => ({
  type: ActionTypes.ADD_BUILDINGTYPES,
  payload: types,
});

export const buildingTypeFailed = (errmess) => ({
  type: ActionTypes.BUILDINGTYPES_FAILED,
  payload: errmess,
});

export const fetchFoundations = () => (dispatch) => {
  return fetch(baseUrl + "foundations")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((foundations) => dispatch(addFoundations(foundations)))
    .catch((error) => dispatch(foundationsFailed(error.message)));
};

export const addFoundations = (foundations) => ({
  type: ActionTypes.ADD_FOUNDATIONS,
  payload: foundations,
});

export const foundationFailed = (errmess) => ({
  type: ActionTypes.FOUNDATIONS_FAILED,
  payload: errmess,
});

export const fetchElevations = () => (dispatch) => {
  return fetch(baseUrl + "elevations")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((elevations) => dispatch(addElevations(elevations)))
    .catch((error) => dispatch(elevationsFailed(error.message)));
};

export const addElevations = (elevations) => ({
  type: ActionTypes.ADD_ELEVATIONS,
  payload: elevations,
});

export const elevationsFailed = (errmess) => ({
  type: ActionTypes.ELEVATIONS_FAILED,
  payload: errmess,
});

export const fetchRoofs = () => (dispatch) => {
  return fetch(baseUrl + "roofs")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((roofs) => dispatch(addRoofs(roofs)))
    .catch((error) => dispatch(roofsFailed(error.message)));
};

export const addRoofs = (roofs) => ({
  type: ActionTypes.ADD_ROOFS,
  payload: roofs,
});

export const roofsFailed = (errmess) => ({
  type: ActionTypes.ROOFS_FAILED,
  payload: errmess,
});

export const fetchPavements = () => (dispatch) => {
  return fetch(baseUrl + "pavements")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((pavements) => dispatch(addPavements(pavements)))
    .catch((error) => dispatch(pavementsFailed(error.message)));
};

export const addPavements = (pavements) => ({
  type: ActionTypes.ADD_PAVEMENTS,
  payload: pavements,
});

export const pavementsFailed = (errmess) => ({
  type: ActionTypes.PAVEMENTS_FAILED,
  payload: errmess,
});

export const fetchCeilings = () => (dispatch) => {
  return fetch(baseUrl + "ceilings")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((ceilings) => dispatch(addCeilings(ceilings)))
    .catch((error) => dispatch(ceilingsFailed(error.message)));
};

export const addCeilings = (ceilings) => ({
  type: ActionTypes.ADD_CEILINGS,
  payload: ceilings,
});

export const ceilingsFailed = (errmess) => ({
  type: ActionTypes.CEILINGS_FAILED,
  payload: errmess,
});

export const fetchClosers = () => (dispatch) => {
  return fetch(baseUrl + "closers")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((closers) => dispatch(addClosers(closers)))
    .catch((error) => dispatch(closersFailed(error.message)));
};

export const addClosers = (closers) => ({
  type: ActionTypes.ADD_CLOSERS,
  payload: closers,
});

export const closersFailed = (errmess) => ({
  type: ActionTypes.CLOSERS_FAILED,
  payload: errmess,
});

export const fetchPropertyTypes = () => (dispatch) => {
  return fetch(baseUrl + "propertyType")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((types) => dispatch(addPropertyType(types)))
    .catch((error) => dispatch(propertyTypeFailed(error.message)));
};

export const addPropertyType = (types) => ({
  type: ActionTypes.ADD_PROPERTYTYPE,
  payload: types,
});

export const propertyTypeFailed = (errmess) => ({
  type: ActionTypes.PROPERTYTYPE_FAILED,
  payload: errmess,
});

export const fetchTenures = () => (dispatch) => {
  return fetch(baseUrl + "tenures")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((tenures) => dispatch(addTenures(tenures)))
    .catch((error) => dispatch(tenuresFailed(error.message)));
};

export const addTenures = (tenures) => ({
  type: ActionTypes.ADD_TENURES,
  payload: tenures,
});

export const tenuresFailed = (errmess) => ({
  type: ActionTypes.TENURES_FAILED,
  payload: errmess,
});

export const fetchProvinces = () => (dispatch) => {
  return fetch(baseUrl + "province")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((provinces) => dispatch(addProvinces(provinces)))
    .catch((error) => dispatch(provincesFailed(error.message)));
};

export const addProvinces = (provinces) => ({
  type: ActionTypes.ADD_PROVINCES,
  payload: provinces,
});

export const provincesFailed = (errmess) => ({
  type: ActionTypes.PROVINCES_FAILED,
  payload: errmess,
});

export const fetchDistricts = (province) => (dispatch) => {
  dispatch(loadingDistricts());
  return fetch(baseUrl + "district/" + province)
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((districts) => dispatch(addDistricts(districts)))
    .catch((error) => dispatch(districtsFailed(error.message)));
};

export const addDistricts = (districts) => ({
  type: ActionTypes.ADD_DISTRICTS,
  payload: districts,
});

export const districtsFailed = (errmess) => ({
  type: ActionTypes.DISTRICTS_FAILED,
  payload: errmess,
});
export const loadingDistricts = (errmess) => ({
  type: ActionTypes.DISTRICTS_LOADING,
});

export const fetchSectors = (district) => (dispatch) => {
  dispatch(loadingSectors());
  return fetch(baseUrl + "sector/" + district)
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((sectors) => dispatch(addSectors(sectors)))
    .catch((error) => dispatch(sectorsFailed(error.message)));
};

export const addSectors = (sectors) => ({
  type: ActionTypes.ADD_SECTORS,
  payload: sectors,
});

export const sectorsFailed = (errmess) => ({
  type: ActionTypes.SECTORS_FAILED,
  payload: errmess,
});

export const loadingSectors = (errmess) => ({
  type: ActionTypes.SECTORS_LOADING,
});

export const fetchCells = (sector) => (dispatch) => {
  dispatch(loadingCells());
  return fetch(baseUrl + "cell/" + sector)
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((cells) => dispatch(addCells(cells)))
    .catch((error) => dispatch(cellsFailed(error.message)));
};

export const addCells = (cells) => ({
  type: ActionTypes.ADD_CELLS,
  payload: cells,
});

export const cellsFailed = (errmess) => ({
  type: ActionTypes.CELLS_FAILED,
  payload: errmess,
});

export const loadingCells = () => ({
  type: ActionTypes.CELLS_LOADING,
});

export const fetchVillages = (cell) => (dispatch) => {
  dispatch(loadingVillage());
  return fetch(baseUrl + "village/" + cell)
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      }
    )
    .then((response) => response.json())
    .then((villages) => dispatch(addVillages(villages)))
    .catch((error) => dispatch(villagesFailed(error.message)));
};

export const addVillages = (villages) => ({
  type: ActionTypes.ADD_VILLAGES,
  payload: villages,
});

export const villagesFailed = (errmess) => ({
  type: ActionTypes.VILLAGES_FAILED,
  payload: errmess,
});
export const loadingVillage = () => ({
  type: ActionTypes.VILLAGES_LOADING,
});
