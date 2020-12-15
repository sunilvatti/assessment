import React, { useState, useEffect } from 'react';
import Select, { OptionTypeBase, OptionsType, ValueType, ActionMeta } from 'react-select';
import { useQuery } from 'urql';
import { useDispatch } from 'react-redux';
import { actions } from '../Features/Metrics/reducer';

const query =`
    query {
        getMetrics
    }
`;

interface Option extends OptionTypeBase {
    label: string;
    value: string;
}
type typeValue = boolean;
const MetricSelector: React.FC = () => {
    const [result] = useQuery({
        query
    })
    const dispatch = useDispatch();
    const [options, setOptions] = useState<OptionsType<Option>>([]);
    const { data, error } = result;
    
    const onChange = (selected: ValueType<Option, typeValue>, action: ActionMeta<Option>) => {
        const newMetric = action.option?.value;
        const selectedItems = selected ? selected.map((item: Option) => item.value): [];
        dispatch(actions.metricsSelected({ selected: selectedItems, newMetric: newMetric || '' }));
    };

    useEffect(() => {
        if (error) {
          return;
        }
        if (!data) return;
        const { getMetrics } = data;
        setOptions(getMetrics.map((option: string) => ({ label: option, value: option })))
    }, [dispatch, data, error]);

    return <Select
        name='metricSelect'
        options={options}
        isMulti
        closeMenuOnSelect={false}
        onChange={onChange}
    />
}

export default MetricSelector;