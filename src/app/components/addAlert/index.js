import React, { useState } from "react";

import CustomSelect from "./customSelect";
import CheckMode from "./checkMode";

import { observer } from "mobx-react";
import { useStore } from "../../store";

import { v4 as uuidv4 } from "uuid";

import "./styles.scss";

export default observer(() => {
  const store = useStore();
  const [mail, setMail] = useState("");
  const [selectedFiat, selectFiat] = useState("");
  const [selectedCrypto, selectCrypto] = useState("");
  const initialCheckData = {
    type: "absolute",
    timeframe: "",
    threshold: ""
  };
  const [checkData, setCheckData] = useState({ ...initialCheckData });
  const submitForm = async e => {
    e.preventDefault();
    if (!selectedCrypto || !selectedFiat || !mail || !checkData.threshold) {
      window.alert(
        "Merci de compléter tous les champs nécessaires pour ajouter une alerte !"
      );
      return;
    }
    const alert = {
      ...checkData,
      crypto: selectedCrypto,
      fiat: selectedFiat,
      mail,
      lastRate: store.Assets.getRateForAsset(selectedCrypto, selectedFiat),
      id: uuidv4()
    };
    await store.Alerts.pushAlert(alert);
    setMail("");
    selectFiat("");
    selectCrypto("");
    setCheckData({ ...initialCheckData });
  };
  return (
    <div>
      <form onSubmit={submitForm}>
        <div className="inputContainer">
          <input
            placeholder="Votre adresse mail"
            value={mail}
            onChange={e => setMail(e.target.value)}
            className="mailInput"
            type="email"
          />
          <CustomSelect
            placeholder="Fiat"
            selectedFiat={selectedFiat}
            onChange={selectFiat}
            value={selectedFiat}
            getOptions="getFiats"
            className="select fiatSelect"
          ></CustomSelect>
          <CustomSelect
            placeholder="Crypto"
            selectedFiat={selectedFiat}
            onChange={selectCrypto}
            value={selectedCrypto}
            getOptions="getCryptos"
            className="select cryptoSelect"
          ></CustomSelect>
        </div>
        <CheckMode
          checkData={checkData}
          setCheckData={setCheckData}
        ></CheckMode>
        <input
          type="submit"
          value="Ajouter une alerte"
          className="submitForm"
        />
      </form>
    </div>
  );
});
