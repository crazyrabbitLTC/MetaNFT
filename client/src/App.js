import React, { useState, useEffect } from "react";
//import styles from "./App.module.scss";
import NetworkName from "./utils/NetworkName";
//import { zeppelinSolidityHotLoaderOptions } from "../config/webpack";
//Contract
//const MetaNFTContract = require("../../contracts/MetaNFT.sol");
import MetaNFTContract from "./contracts/MetaNFT.json";

//Drizzle based utils
const getWeb3 = require("@drizzle-utils/get-web3");

//console.log(MetaNFTContract);

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
    contract: null, 
    tokenName: "",
    tokenSymbol: "",
    tokenReady: "",
  };

  const initialTokenState = {
    name: "",
    symbol: "",
    tokenReady: ""
  };

  const [state, setAppState] = useState(initialState);
  const [tokenState, setTokenState] = useState(initialTokenState);

  const AppState = React.createContext(state);


  useEffect(() => {
    const loadWeb3 = async () => {
      const web3 = await getWeb3();
      const provider = web3.currentProvider;
      const networkId = await web3.eth.net.getId();
      const networkName = NetworkName(networkId);
      const accounts = await web3.eth.getAccounts();

      //prevent auto reloads on network changes
      window.ethereum.autoRefreshOnNetworkChange = autoRelodOnNetworkChange;
      try {
        window.ethereum.enable();
      } catch (error) {
        console.error(error);
      }

      const deployedNetwork = MetaNFTContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MetaNFTContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      console.log("Instance: ", instance);

      setAppState({
        ...state,
        web3,
        provider,
        networkId,
        accounts,
        networkName,
        appReady: true,
        contract: instance
      });
    };

    console.log(state);

    try {
      loadWeb3();
    } catch (error) {
      console.log(error);
    }
  }, [state.appReady]);

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
  }, [state.appReady]);

  useEffect(() => {
    const getTokenSupply = async () => {
      const { contract } = state;
      console.log("this is the contract", contract);
      let tokenName = await contract.methods.name().call();
      let tokenSymbol = await contract.methods.symbol().call();
      let tokenReady = await contract.methods.isTokenReady().call();
      console.log(tokenReady);
      setAppState({ ...state, tokenName, tokenSymbol, tokenReady });
    };

    if (state.contract) {
      getTokenSupply();
    }
  }, [state.appReady]);

  return (
    <AppState.Consumer>
    
      { value => 
        (<div>
          Your token is called: {state.tokenName} and the Symbol: 
          {state.tokenSymbol}. <br/>
          Ready: {state.tokenReady ? "True" : "False"} 
        </div>)
      }
    </AppState.Consumer>
  );
}

export default App;
