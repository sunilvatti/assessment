import { takeEvery, put, fork, select } from 'redux-saga/effects'
import { actions } from './reducer';
import { SelectPayload, IMetric } from './types'
import { PayloadAction } from 'redux-starter-kit';
import { client } from './Metrics';
import { OperationResult } from 'urql';
import { getMetrics, getLatestValue } from './selectors';
import { getTimeAt } from '../../utils';

const DURATION_IN_MINUTES = 30;

interface QueryResult {
    getMeasurements: IMetric[]
}

interface QueryArgs {
    metricName: string;
    after: number
}

function* transformData({ payload: { metric, at, value } }: PayloadAction<IMetric>) {
    const data: { [at: string]: IMetric } = yield select(getMetrics);
    const previousValue: { [metric: string]: number } = yield select(getLatestValue)
    const hrs = new Date(at).getHours() % 12 || 12;
    const mins = new Date(at).getMinutes()
    const timeAt = `${("0" + hrs).slice(-2)}:${("0" + mins).slice(-2)}`
    const metrics = {
        ...data,
        [at]: {
            ...data[at],
            [metric]: value,
            at: timeAt,
        },
    };
    const latestValue = {
        ...previousValue,
        [metric]: value
    }
    yield put(actions.metricDataReceived({ metrics, latestValue }))
}

function* mergeData(list?: IMetric[]) {
    let metrics: { [at: string]: IMetric } = yield select(getMetrics);
    list?.map(item => {
        const { metric, at, value } = item;
        const hrs = new Date(at).getHours() % 12 || 12;
        const mins = new Date(at).getMinutes()
        const timeAt = `${("0" + hrs).slice(-2)}:${("0" + mins).slice(-2)}`
        metrics = {
            ...metrics,
            [at]: {
                ...metrics[at],
                [metric]: value,
                at: timeAt,
            },
        }
    })
    yield put(actions.multipleMetricsDataReceived({ metrics }))
}

function* fetchPastData({ payload }: PayloadAction<SelectPayload>) {
    const { newMetric } = payload;
    const { data }: OperationResult<QueryResult> = yield client.query<QueryResult, QueryArgs>(`
    query($metricName: String!, $after: Timestamp) {
        getMeasurements(input: { metricName: $metricName, after: $after }) {
            at
            metric
            value
            unit
        }
    }`, {
        metricName: newMetric,
        after: getTimeAt(DURATION_IN_MINUTES)
    }).toPromise();
    yield fork(mergeData, data?.getMeasurements)
}

export default function* watcher() {
    yield takeEvery(actions.newMetricValueFetched.type, transformData);
    yield takeEvery(actions.metricsSelected.type, fetchPastData);
}