import React, { Component } from "react";
import { Button, Card, Grid, ItemMeta } from "semantic-ui-react";
import Layout from "../../components/layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";

import { Link } from '../../routes';

import ContributeForm from "../../components/contributeForm";

class CampaignShow extends Component {
    static async getInitialProps (props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        console.log(summary); 

        return {
            address:  props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        }
    }

    renderCards(){

        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'Manager created this campaign and can create requests to withdraw money',
                style: { overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contrbute atleast this much wei to become an approver'
            },
            {
                header: requestsCount,
                meta: 'No of requests',
                description: 'A request  tries to withdraw money from contract. Requests must be approved by all approvers'
            },
            {
                header: approversCount,
                meta: 'No of approvers',
                description: 'No of people who have already donated to our campaign'
            }, 
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'Balance available for campaign to spend'
            }
        ];

        return <Card.Group items={items} />
    }
    render() {
        return (
            <Layout>
                <h3>Campiagn Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route= {`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>         
                    </Grid.Row>
                </Grid>
            </Layout>
        
        )
    }
}

export default CampaignShow;