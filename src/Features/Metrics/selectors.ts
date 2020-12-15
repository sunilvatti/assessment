import { IState } from "../../store";

export const getSelectedItems = ({ metrics }: IState) => metrics.selected;

export const getMetrics = ({ metrics: { metrics } }: IState) => metrics;

export const getLatestValue = (state: IState) => state.metrics.latestValue;
