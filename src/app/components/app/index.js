import React, { useEffect } from "react";
import AddAlert from "../addAlert";
import Checks from "../checks";

import { observer } from "mobx-react";
import { useStore } from "../../store";

export default observer(() => {
  const store = useStore();
  useEffect(() => {
    store.Alerts.fetchAlerts();
    setInterval(store.Alerts.fetchAlerts, 60 * 1000);
    store.Assets.fetchAssets();
    setInterval(store.Assets.fetchAssets, 60 * 1000);
  }, []);
  return (
    <div>
      <AddAlert></AddAlert>
      {store.Assets.fetchingData === false && <Checks></Checks>}
    </div>
  );
});
