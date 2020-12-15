import { createSlice, PayloadAction } from 'redux-starter-kit';
import { IMetric, MetricsPayload, MetricsState, MetricsWithLatest, SelectPayload } from './types';

const initialState: MetricsState = {
    selected: [],
    metrics: {},
    latestValue: {},
};

const slice = createSlice({
    initialState,
    name: 'metricsReducer',
    reducers: {
        metricsSelected: (state, action: PayloadAction<SelectPayload>) => {
            const { selected } = action.payload;
            return {
                ...state,
                selected
            }
        },
        metricDataReceived: (state, action: PayloadAction<MetricsWithLatest>) => {
            const { metrics, latestValue } = action.payload;
            return {
                ...state,
                metrics,
                latestValue
            }
        },
        multipleMetricsDataReceived: (state, action: PayloadAction<MetricsPayload>) => {
            const { metrics } = action.payload;
            return {
                ...state,
                metrics,
            };
        },
        newMetricValueFetched: (state, action: PayloadAction<IMetric>) => state
    }
})

export const { reducer, actions } = slice;