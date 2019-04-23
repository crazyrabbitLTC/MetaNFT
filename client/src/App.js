import React, { useState, useEffect } from "react";
//import styles from "./App.module.scss";
import NetworkName from "./utils/NetworkName";
import { zeppelinSolidityHotLoaderOptions } from "../config/webpack";

//Drizzle based utils
const getWeb3 = require("@drizzle-utils/get-web3");

//Contract
const ERC721 = require("../../contracts/MetaNFT.sol");

function App() {
  const initialState = {
    web3: null,
    accounts: null,
    provider: null,
    networkId: null,
    networkName: null,
    autoRefresh: false,
    appReady: false,
    contract: ERC721,
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

      const deployedNetwork = ERC721.networks[networkId];
      const instance = new web3.eth.Contract(
        ERC721.abi,
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

    console.log(state);

    loadWeb3();
  }, [state.networkId, state.appReady]);

  //not sure if I need to actually return the subscription cleanup here...
  useEffect(() => {
    const subscribeToNetworkChange = async () => {
      if (!state.autoRefresh) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        window.ethereum.on("networkChanged", networkId => {
          setAppState({ ...state, networkId, appReady: false });
        });
      }
    };

    if (window.ethereum) subscribeToNetworkChange();
  });

  useEffect(() => {
    const subscribeToAccountsChange = async () => {
      if (!state.autoRefresh) {
        window.ethereum.autoRefreshOnNetworkChange = false;
        window.ethereum.on("accountsChanged", accounts => {
          setAppState({ ...state, accounts, appReady: false });
        });
      }
    };

    if (window.ethereum) subscribeToAccountsChange();
  });

  return <div> Hello.</div>;
}

export default App;
