import React from "react";
import * as Table from "reactabular-table";

import { observer } from "mobx-react";
import { useStore } from "../../store";

import { getFormattedRate } from "../../utils";

import "./styles.scss";

export default observer(() => {
  const store = useStore();
  const columns = [
    {
      property: "mail",
      header: {
        label: "Mail d'alerte"
      }
    },
    {
      property: "fiat",
      header: {
        label: "Fiat"
      }
    },
    {
      property: "crypto",
      header: {
        label: "Crypto"
      }
    },
    {
      property: "type",
      header: {
        label: "Mode de vérification"
      },
      cell: {
        formatters: [
          elm => {
            if (elm === "absolute") return "Seuil";
            if (elm === "timeframe") return "Variation sur une période";
          }
        ]
      }
    },
    {
      property: "threshold",
      header: {
        label: "Seuil ou variation"
      },
      cell: {
        formatters: [
          (elm, { rowData }) => {
            if (rowData.type === "timeframe") return elm + " %";
            return getFormattedRate(Number(elm), rowData.fiat);
          }
        ]
      }
    },
    {
      property: "fakeProperty",
      header: {
        label: "Valeur actuelle"
      },
      cell: {
        formatters: [
          (elm, { rowData }) => {
            return getFormattedRate(
              store.Assets.getRateForAsset(rowData.crypto, rowData.fiat),
              rowData.fiat
            );
          }
        ]
      }
    },
    {
      property: "fakeProperty2",
      header: {
        label: "Actions"
      },
      cell: {
        formatters: [
          (elm, { rowData }) => {
            return (
              <button
                className="deleteButton"
                onClick={() => store.Alerts.deleteAlert(rowData.id)}
              >
                Supprimer
              </button>
            );
          }
        ]
      }
    }
  ];
  return (
    <div>
      <Table.Provider
        className="pure-table pure-table-striped"
        columns={columns}
      >
        <Table.Header />

        <Table.Body rows={store.Alerts.list} rowKey="id" />
      </Table.Provider>
    </div>
  );
});
