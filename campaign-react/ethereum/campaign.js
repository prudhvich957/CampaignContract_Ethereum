import web3 from './web3';
import Campaign from '../../solidity/build/contracts/Campaign.json';

export default (address) => {
    return new web3.eth.Contract(Campaign.abi, address);
}