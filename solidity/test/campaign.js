const Campaign = artifacts.require("Campaign");
const CampaignFactory = artifacts.require("CampaignFactory");

contract("campaign", function ( accounts ) {

  let factory;
  let campaign;

  beforeEach("initial instance creation",  async () => {
    factory = await CampaignFactory.new();

    await factory.createCampaign(100,{
      from: accounts[0],
      gas: '1000000'
    });

    const allCampaigns = await factory.getDeployedCampaigns.call();
    campaign = await Campaign.at(allCampaigns[0]);
    return assert.isTrue(true);
  });
  it("should assert true", async function () {
    await CampaignFactory.deployed();
    return assert.isTrue(true);
  });

  it("deploys a campaign and factory", async () => {
    //console.log(factory)
    assert.ok(factory.address)
    assert.ok(campaign.address)
  });

  it("marks caller as manager", async () => {
    const manager = await campaign.manager.call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.contribute({
      value: '200',
      from: accounts[1]
    });
    //console.log(campaign)
    const isContributor = await campaign.approvers.call(accounts[1]);
    assert.isTrue(isContributor);
  })

  it("requires a minimum contribution", async () => {
    try {
      await campaign.contribute({
        value: '5',
        from: accounts[1]
      });
      assert(false);
    } catch (error) {
      assert(error)
    }
  })


  it("allows a manager to make a payment request", async () => {
    await campaign.createRequest('Buy batteries', '100', accounts[1], {
      from: accounts[0],
      gas: '1000000'
    });

    const request = await campaign.requests.call(0);
    console.log(request)

    assert.equal('Buy batteries', request.description);
  })

  it("processes requests", async () => {
    await campaign.contribute( {
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.createRequest('Buy monitors', web3.utils.toWei('5', 'ether'), accounts[1], {
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.approveRequest(0, {
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.finalizeRequest(0, {
      from: accounts[0],
      gas: '1000000'
    });


    let balance = await web3.eth.getBalance(accounts[1])
    balance = web3.utils.fromWei(balance, 'ether');

    balance = parseFloat(balance);
    console.log(balance)
    assert(balance > 104)
  })


});
