import store from "modules/store";
import { setupWatch } from "./web3Provider";
import { refreshRates } from "modules/reducers/rates";

let isWatchSetup = false;

export default () => {
    const rates = store.getState().contracts.latest.rates;
    const ratesData = store.getState().rates;

    if (rates && !ratesData.isLoading && !ratesData.isLoaded) {
        console.debug("ratesProvider - first time. Dispatching refreshRates()");
        store.dispatch(refreshRates());
        setupListeners();
    }

    if (!isWatchSetup) {
        isWatchSetup = true;
        setupWatch("contracts.latest.rates", onRatesContractChange);
    }
    return;
};

const setupListeners = () => {
    const rates = store.getState().contracts.latest.rates.ethersInstance;
    rates.onratechanged = onRateChange;
};

const onRatesContractChange = (newVal, oldVal, objectPath) => {
    console.debug("ratesProvider - new rates contract. Dispatching refreshRates()");
    store.dispatch(refreshRates());
    setupListeners();
};

// RateChanged(bytes32 symbol, uint newRate);
const onRateChange = (symbol, newRate) => {
    console.debug("ratesProvider.onRateChange(): RateChange event. Dispatching refreshRates()");
    store.dispatch(refreshRates());
};
