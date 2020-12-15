import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSubscription, useQuery } from 'urql';
import { Grid, CardContent, Typography, Card, CardHeader } from '@material-ui/core';
import { getSelectedItems, getLatestValue } from '../Features/Metrics/selectors';
import { IMetric } from '../Features/Metrics/types';
import { actions } from '../Features/Metrics/reducer';

interface CardProps {
    metricName: string;
    currentValue: number;
}

interface QueryResult {
    getLastKnownMeasurement: {
        value: number;
    }
}

interface QueryArgs {
    metricName: string
}

const MetricCard: React.FC<CardProps> = ({ metricName, currentValue }) => {
    const [value, setValue] = useState(currentValue);
    const [result] = useQuery<QueryResult, QueryArgs>({
        query: `query ($metricName: String!) {
            getLastKnownMeasurement(metricName:$metricName){
              metric
              value
              at
              unit
            }
          }`,
        variables: {
            metricName
        }
    });
    const { data } = result;
    useEffect(() => {
        setValue(data ? data.getLastKnownMeasurement.value : 0)
    }, [data])
    return <Grid item md={5} xs={6}>
        <Card elevation={2}>
            <CardHeader title={metricName} />
            <CardContent>
                <Typography variant="h4">
                    {currentValue ? currentValue : value}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
}

interface SubscriptionData {
    newMeasurement: IMetric
}

const MetricCardsSection: React.FC = () => {
    const selectedItems = useSelector(getSelectedItems);
    const latestValue = useSelector(getLatestValue);
    const dispatch = useDispatch();
    const [result] = useSubscription<SubscriptionData>({
        query: `
        subscription {
            newMeasurement {
                at
                metric
                value
                unit
            }
        }`,
        pause: !selectedItems.length
    })
    const { data } = result;

    useEffect(() => {
        data && dispatch(actions.newMetricValueFetched(data.newMeasurement))
    }, [data, dispatch])

    return <>
        {
            selectedItems.map((metric) => (
                <MetricCard key={metric}
                    metricName={metric}
                    currentValue={latestValue[metric]}
                />
            ))
        }
    </>
}

export default MetricCardsSection