// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;



contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign (uint minimum) public {
       Campaign newCampaign =  new Campaign(minimum, msg.sender);
       deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns () public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}


contract Campaign {

    struct Request{
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    uint public requestsCount;
    //Request[] public requests;


    uint numRequests;
    mapping (uint => Request) public requests;

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string calldata description, uint value, address payable recipient) public restricted {

        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;

        requestsCount++;
    }

    function approveRequest(uint index) public {

        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;

    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address)  {
        return(
            minimumContribution,
            address(this).balance,
            requestsCount,
            approversCount,
            manager
        );
    }
    
    function getRequestsCount() public view returns(uint) {
        return requestsCount;
    }


    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

}