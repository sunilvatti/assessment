export interface IMetric {
    metric: string;
    at: string;
    value: number;
    unit: string;
}

export interface MetricsState {
    metrics: {
        [at: string]: IMetric;
    };
    latestValue: {
        [metric: string]: number
    },
    selected: string[];
}

export interface SelectPayload {
    selected: string[];
    newMetric: string;
}

export interface MetricsWithLatest {
    metrics: {
        [at: string]: IMetric;
    };
    latestValue: {
        [metric: string]: number
    }
}

export interface MetricsPayload {
    metrics: {
        [at: string]: IMetric;
    };
}