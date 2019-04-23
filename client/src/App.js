import React, { useState, useEffect } from "react";
//import styles from "./App.module.scss";
import NetworkName from "./utils/NetworkName";
import { zeppelinSolidityHotLoaderOptions } from "../config/webpack";

//Drizzle based utils
const getWeb3 = require("@drizzle-utils/get-web3");

//Contract
const Contract = require("../../contracts/MetaNFT.sol");

//AutoAppReload
const autoRelodOnNetworkChange = false;

function App() {
  const initialState = {
    web3: null,
    accounts: null,
    provider: null,
    networkId: null,
    networkName: null,
    autoRefresh: false,
    appReady: false,
    contract: Contract,
    instance: null
  };

  const [state, setAppState] = useState(initialState);

  useEffect(() => {
    const loadWeb3 = async () => {
      const web3 = await getWeb3();
      const provider = web3.currentProvider;
      const networkId = await web3.eth.net.getId();
      const networkName = NetworkName(networkId);
      const accounts = await web3.eth.getAccounts();

      //prevent auto reloads on network changes
      window.ethereum.autoRefreshOnNetworkChange = autoRelodOnNetworkChange;

      const deployedNetwork = Contract.networks[networkId];
      const instance = new web3.eth.Contract(
        Contract.abi,
        deployedNetwork && deployedNetwork.address
      );

      setAppState({
        ...state,
        web3,
        provider,
        networkId,
        accounts,
        networkName,
        appReady: true,
        instance
      });
    };

    //console.log(state);

    try {
      loadWeb3();
    } catch (error) {
      console.log(error);
    }
  }, [state.networkId, state.appReady]);

  useEffect(() => {
    const watchForChanges = async () => {
      let accounts = await state.web3.eth.getAccounts();
      let networkId = await state.web3.eth.net.getId();

      if (accounts[0] !== state.accounts[0] || networkId !== state.networkId) {
        setAppState({ ...state, appReady: false });
      }
    };

    if (state.web3) {
      let id = setInterval(watchForChanges, 1000);
      return function cleanup() {
        clearInterval(id);
      };
    }
  });

  return <div> Hello.</div>;
}

export default App;
