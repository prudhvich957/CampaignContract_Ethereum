import web3 from "./web3";
import CampaignFactory from '../../solidity/build/contracts/CampaignFactory.json';

const campaignFactoryAddress = '0x148ecf2E68140fCd7Cb52A42efb41ca3a4086DAf';

const instance = new web3.eth.Contract(CampaignFactory.abi, campaignFactoryAddress )

export default instance;