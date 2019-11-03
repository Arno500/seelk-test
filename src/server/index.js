/* eslint-disable require-atomic-updates */
const Koa = require("koa");
const cors = require("@koa/cors");
const route = require("koa-route");
const bodyParser = require("koa-bodyparser");
const app = new Koa();

const timestring = require("timestring");

const { sendMail } = require("./mail");

const CoinAPI = require("coinapi-io");
let coinapi = new CoinAPI("123AC815-C135-4266-98CE-860082F8A5E9");

// Setuping list of currencies and checks
let listOfCurrencies = [];
coinapi.metadata_list_assets().then(data => (listOfCurrencies = data));
let currenciesToCheck = [];

app.use(cors());
app.use(bodyParser());

// General routes

app.use(
  route.get(
    "/list-currencies",
    ctx => (ctx.body = JSON.stringify(listOfCurrencies))
  )
);

// Checks routes

app.use(
  route.put("/checks/add", ctx => {
    currenciesToCheck.push(ctx.request.body);
    ctx.status = 200;
  })
);
app.use(
  route.get(
    "/checks/get",
    ctx => (ctx.body = JSON.stringify(currenciesToCheck))
  )
);
app.use(
  route.delete("/checks/remove/:id", (ctx, id) => {
    currenciesToCheck.splice(
      currenciesToCheck.findIndex(elm => elm.id == id),
      1
    );
    ctx.status = 200;
  })
);

app.listen(3000);

setInterval(
  () =>
    coinapi.metadata_list_assets().then(data => {
      listOfCurrencies = data;
      checkValues();
    }),
  60 * 1000
);

// All the check logic is here
async function checkValues() {
  currenciesToCheck.forEach(async elm => {
    const cryptoPrice = listOfCurrencies.find(
      asset => asset.asset_id === elm.crypto
    ).price_usd;
    const fiatPrice = listOfCurrencies.find(
      asset => asset.asset_id === elm.fiat
    ).price_usd;
    let rate = cryptoPrice / fiatPrice;
    let oldRateData;
    let basicData = {
      type: elm.type,
      crypto: elm.crypto,
      fiat: elm.fiat,
      value: rate
    };
    let date;
    let percent;
    switch (elm.type) {
      case "timeframe":
        date = new Date(Date.now() - timestring(elm.timeframe, "ms"));
        oldRateData = await coinapi.exchange_rates_get_specific_rate(
          elm.crypto,
          elm.fiat,
          date.toISOString()
        );
        percent = (rate / oldRateData.rate) * 100 - 100;
        elm.threshold = Number(elm.threshold);
        if (percent > elm.threshold) {
          sendMail(elm.mail, {
            ...basicData,
            percent,
            mvmtType: "increase"
          });
        }
        if (percent < -elm.threshold) {
          sendMail(elm.mail, {
            ...basicData,
            percent,
            mvmtType: "decrease"
          });
        }
        break;
      case "absolute":
        elm.threshold = Number(elm.threshold);
        console.log(
          "Threshold: " + elm.threshold,
          "Current rate: " + rate,
          "Old rate: " + elm.lastRate
        );
        if (elm.lastRate < elm.threshold && elm.threshold < rate) {
          sendMail(elm.mail, {
            ...basicData,
            threshold: elm.threshold,
            mvmtType: "increase"
          });
        }
        if (elm.lastRate > elm.threshold && elm.threshold > rate) {
          sendMail(elm.mail, {
            ...basicData,
            threshold: elm.threshold,
            mvmtType: "decrease"
          });
        }
    }
    elm.lastRate = rate;
  });
}

// Object structure for checks :
// {
//     id: uuidv4,
//     type: "timeframe / absolute",
//     crypto: "BTC",
//     fiat: "EUR",
//     timeframe: "????" (for timeframe mode),
//     threshold: "5000 || 4.5" ,
//     mail: "arno.du@orange.fr",
//     lastRate: 0.065324
// }
