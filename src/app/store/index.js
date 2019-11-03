import { observable, action, runInAction, computed } from "mobx";
import { computedFn } from "mobx-utils";
import { createContext, useContext } from "react";
// import { getFormattedRate } from "../utils";

async function fetchRoute(route) {
  const url = `http://localhost:3000/${route}`;
  const response = await fetch(url);
  return await response.json();
}
async function pushRoute(route, data) {
  const url = `http://localhost:3000/${route}`;
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
  return await response;
}
async function deleteRoute(route, id) {
  const url = `http://localhost:3000/${route}/${id}`;
  const response = await fetch(url, {
    method: "DELETE"
  });
  return await response;
}

class Assets {
  @observable list = [];
  @observable rateMap = new Map();
  @observable fetchingData = null;

  @action("Get latest currencies from back-end")
  fetchAssets = async () => {
    // this.fetchingData = true;
    let assets = await fetchRoute("list-currencies");
    runInAction("Update assets after fetching them", () => {
      this.list = assets;
      this.list.forEach(elm => {
        // Generate a pretty label for selects
        elm.label = `${elm.asset_id}${
          typeof elm.name !== "undefined" ? ` (${elm.name})` : ""
        }`;
        // Generate a Map object to speedup price search
        this.rateMap.set(elm.asset_id, elm.price_usd);
      });
      this.fetchingData = false;
    });
  };

  @computed
  get getCryptos() {
    return this.list.filter(
      elm => elm.type_is_crypto === 1 && typeof elm.price_usd !== "undefined"
    );
  }

  @computed
  get getFiats() {
    return this.list.filter(
      elm => elm.type_is_crypto === 0 && typeof elm.price_usd !== "undefined"
    );
  }

  getRateForAsset = computedFn(
    (crypto, fiat) => {
      const cryptoRate = this.rateMap.get(crypto);
      const fiatRate = this.rateMap.get(fiat);
      return !isNaN(cryptoRate) && !isNaN(fiatRate)
        ? cryptoRate / fiatRate
        : "Taux inconnu";
    },
    { keepAlive: true }
  );
}

class Alerts {
  @observable list = [];
  @observable fetchingData = false;
  @observable sendingAlert = false;

  @action("Get alerts from back-end")
  fetchAlerts = async () => {
    this.fetchingData = true;
    let alerts = await fetchRoute("checks/get");
    runInAction("Update alerts after fetching them", () => {
      this.list = alerts;
      this.fetchingData = false;
    });
  };

  @action("Push new alert")
  pushAlert = async data => {
    this.sendingAlert = true;
    await pushRoute("checks/add", data);
    runInAction("Add alert to local list", () => {
      this.list.push(data);
      this.sendingAlert = false;
    });
  };

  @action("Delete an alert")
  deleteAlert = async id => {
    await deleteRoute("checks/remove", id);
    runInAction("Remove alert from local list", () => {
      this.list.splice(this.list.findIndex(elm => elm.id === id), 1);
    });
  };

  //   @computed
  //   get alertList(assets) {
  // this.list.map(elm => {
  //   elm.formattedRate = getFormattedRate(elm.);
  // });
  //   }
}

export const storeContext = createContext({
  Assets: new Assets(),
  Alerts: new Alerts()
});

export const useStore = () => useContext(storeContext);
