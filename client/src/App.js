import React, { useState, useEffect } from "react";
import getWeb3, { getGanacheWeb3 } from "./utils/getWeb3";
import Web3Info from "./components/Web3Info/index.js";
import { Loader } from 'rimble-ui';
import { zeppelinSolidityHotLoaderOptions } from '../config/webpack';

import styles from './App.module.scss';

function App() {
  
  const initialState = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    token: null,
    route: window.location.pathname.replace("/",""),
    pollInterval: null,
    ganacheProvider: null,
  };

  const [state, setState] = useState(initialState);


  const getGanacheAddresses = async () => {
    if (!state.ganacheProvider) {
      state.ganacheProvider = getGanacheWeb3();
    }
    if (state.ganacheProvider) {
      return await state.ganacheProvider.eth.getAccounts();
    }
    return [];
  }

  useEffect(() => {

    const loadProviderData = async() => {

      const isProd = process.env.NODE_ENV === 'production';
      const web3 = await getWeb3();
      const ganacheAccounts = await getGanacheAddresses();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      let ERC721 = {};
      const networkId = await web3.eth.net.getId();
      const isMetaMask = web3.currentProvider.isMetaMask;
      let balance = accounts.length > 0 ? await web3.eth.getBalance(accounts[0]): web3.utils.toWei('0');
      balance = web3.utils.fromWei(balance, 'ether');
      ERC721 = require("../../contracts/MetaNFT.sol");
      setState({ web3, ganacheAccounts, accounts, balance, networkId, isMetaMask });
    }

    try {
      loadProviderData();
    } catch (error) {
      console.log(error)
    }

    if(state.pollInterval){
      return clearInterval(state.pollInterval)
    }

  },[])

  const renderLoading = () =>  {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  const renderLoaded = () =>  {
    return (
      <div className={styles.App}>
        <h1>Good to Go!</h1>
        <p>Zepkit has created your app.</p>
        <h2>See your web3 info below:</h2>
        <Web3Info {...this.state} />
      </div>
    );
  }

  return (
    <div>
      <p>You clicked times</p>
      <p>Currently using React {React.version}</p> : null
    </div>
  );

}

export default App;

