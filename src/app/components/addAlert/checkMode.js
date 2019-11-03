import React from "react";
import PropTypes from "prop-types";

const CheckMode = ({ checkData, setCheckData }) => {
  return (
    <div className="checkContainer">
      <div>
        <input
          type="radio"
          name="checkMode"
          id="absolute"
          value="absolute"
          onChange={e => setCheckData({ ...checkData, type: e.target.value })}
          checked={checkData.type === "absolute"}
        />
        <label htmlFor="absolute">Seuil</label>
        <input
          type="radio"
          name="checkMode"
          id="timeframe"
          value="timeframe"
          onChange={e => setCheckData({ ...checkData, type: e.target.value })}
          checked={checkData.type === "timeframe"}
        />
        <label htmlFor="timeframe">Variation sur une période donnée</label>
      </div>
      <div className="checkInputContainer">
        {checkData.type === "absolute" ? (
          <input
            type="text"
            placeholder="Seuil avant alerte (minimum ou maximum)"
            onChange={e =>
              setCheckData({ ...checkData, threshold: e.target.value })
            }
            value={checkData.threshold}
            className="thresholdInput"
          ></input>
        ) : null}
        {checkData.type === "timeframe" ? (
          <>
            <input
              type="text"
              placeholder="Pourcentage de variation"
              onChange={e =>
                setCheckData({ ...checkData, threshold: e.target.value })
              }
              value={checkData.threshold}
              className="thresholdInput"
            ></input>
            <input
              type="text"
              placeholder="Fenêtre de vérification, ex: 5d 7.7h"
              onChange={e =>
                setCheckData({ ...checkData, timeframe: e.target.value })
              }
              value={checkData.timeframe}
              className="timeframeInput"
            ></input>
          </>
        ) : null}
      </div>
    </div>
  );
};

CheckMode.propTypes = {
  checkData: PropTypes.object.isRequired,
  setCheckData: PropTypes.func.isRequired
};

export default CheckMode;
