import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { auth } from "./auth";
import { inspections } from "./inspections";
import { houses } from "./houses";
import { buildingtypes } from "./buildingTypes";
import { foundations } from "./foundation";
import { elevations } from "./elevation";
import { roofs } from "./roof";
import { pavements } from "./pavements";
import { ceilings } from "./ceilings";
import { closers } from "./closers";
import { tenures } from "./tenure";
import { propertytypes } from "./propertyTypes";
import { provinces } from "./province";
import { districts } from "./districts";
import { sectors } from "./sectors";
import { cells } from "./cells";
import { villages } from "./villages";
import { persistStore, persistCombineReducers } from "redux-persist";
import { AsyncStorage } from "@react-native-async-storage/async-storage";

const config = {
  key: "root",
  storage: AsyncStorage,
  debug: true,
};

export const ConfigureStore = () => {
  const store = createStore(
    persistCombineReducers(config, {
      auth,
      inspections,
      houses,
      buildingtypes,
      foundations,
      elevations,
      roofs,
      pavements,
      ceilings,
      closers,
      tenures,
      propertytypes,
      provinces,
      districts,
      sectors,
      cells,
      villages,
    }),
    applyMiddleware(thunk, logger)
  );

  const persistor = persistStore(store);
  return { persistor, store };
};
