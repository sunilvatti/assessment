import React from 'react';
import { Provider, createClient, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { Grid, makeStyles, Theme } from '@material-ui/core';
import SelectMetric from '../../components/SelectMetric';
import Graphs from '../../components/Graphs';
import MetricCardsSection from '../../components/MetricCardsSection';

const subscriptionClient = new SubscriptionClient(
    `ws://react.eogresources.com/graphql`,
    {
        reconnect: true,
    }
)

export const client = createClient({
    url: `https://react.eogresources.com/graphql`,
    exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
            forwardSubscription: (operation) => subscriptionClient.request(operation)
        })
    ]
})

export default () => {
    return <Provider value={client}>
        <Metrics />
    </Provider>
}

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        padding: theme.spacing(2)
    }
}))

const Metrics = () => {
    const classes = useStyles();
    return <Grid container item xs={12} spacing={4} className={classes.container}>
        <Grid item container spacing={2} direction='row-reverse'>
            <Grid item xs={12} md={6} lg={5}>
                <SelectMetric />
            </Grid>
            <Grid item lg={7} md={6} xs={12}>
                <Grid container spacing={2}>
                    <MetricCardsSection />
                </Grid>
            </Grid>
        </Grid>
        <Grid item container xs={12} justify='center' alignItems='center'>
            <Graphs />
        </Grid>
    </Grid>
}