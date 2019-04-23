export default function NetworkName(networkId) {
  console.log(`Here and id is ${networkId}`);
          switch (networkId) {
          case 3:
            return 'Ropsten';
          case 4:
            return 'Rinkeby';
          case 1:
            return 'Main';
          case 42:
            return 'Kovan';
            case 100:
            return 'xDai';
          default:
            return 'private';
        }
}