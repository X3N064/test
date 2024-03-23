const Alpaca = require("@alpacahq/alpaca-trade-api");
const alpaca = new Alpaca({
  keyId: 'PK6IG268O1BXTDZU1DLL',
  secretKey: '5X1tE9521pzGFubxADbZcDW0oSlaUW2YcGUoS7hb',
  paper: true,
})

function checkTradingStatus() {
  alpaca.getAccount().then((account) => {
    // Check if our account is restricted from trading.
    if (account.trading_blocked) {
      console.log("Account is currently restricted from trading.");
    }

    // Check how much money we can use to open new positions.
    console.log(`$${account.buying_power} is available as buying power.`);
  });
}

function calculateBalanceChange() {
  alpaca.getAccount().then((account) => {
    // Calculate the difference between current balance and balance at the last market close.
    const balanceChange = account.equity - account.last_equity;

    console.log("Today's portfolio balance change:", balanceChange);
  });
}


function submitOrder(symbol, qty, side, type, price) {
  if (type === "limit") {
    alpaca.createOrder({
      symbol: symbol,
      qty: qty,
      side: side,
      type: "limit",
      time_in_force: "opg",
      limit_price: price
    });
  } else {
    alpaca.createOrder({
      symbol: symbol,
      qty: qty,
      side: side,
      type: type,
      time_in_force: "day"
    });
  }
}

function getClosedOrdersForSymbol(symbol) {
  alpaca.getOrders({
    status: "closed",
    limit: 100,
    nested: true // show nested multi-leg orders
  }).then((closedOrders) => {
    // Get only the closed orders for a particular stock
    const closedSymbolOrders = closedOrders.filter(
      (order) => order.symbol === symbol
    );
    console.log(closedSymbolOrders);
  });
}

