import { stroopsToUnit } from '@/helpers/dataManipulation';
import { parseBase64Yield, parseTimestamp, timestampsToDates } from '@/helpers/dataParsing';
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export const AccountYieldChart = (props) => {
    // Extract timestamps and yields from data
    const timestamps = props.data.map(entry => parseTimestamp(entry.timestamp))
    const dates = timestampsToDates(timestamps)
    let yields = props.data.length === 1 ? [parseFloat(stroopsToUnit(parseBase64Yield(props.data[0].yield, 16), 5))] : props.data.map(entry => parseFloat(stroopsToUnit(parseBase64Yield(entry.yield, 16), 3)));
    yields = yields.filter(val => val !== 0);

    // Calculate accumulated yield over time
    const accumulatedYields = [0];
    let accumulatedYield = 0;
    for (let i = 0; i < yields.length; i++) {
      accumulatedYield += yields[i];
      accumulatedYields.push(accumulatedYield);
    }

    // Create trace for accumulated yield
    const trace1 = {
      type: "scatter",
      mode: "lines",
      name: 'Accumulated Yield',
      x: dates,
      y: accumulatedYields,
      line: {color: '#17BECF'}
    };

    // Define data array
    const _data = [trace1];

    // Define layout options
    const layout = {
      autosize: false,
      width: 500,
      height: 400,
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      },
      xaxis: {
        title: '',
        type: 'date',
        rangeselector: {buttons: [
          {
            count: 1,
            label: '1m',
            step: 'month',
            stepmode: 'backward'
          },
          {
            count: 6,
            label: '6m',
            step: 'month',
            stepmode: 'backward'
          },
          {step: 'all'}
        ]}
      },
      yaxis: { title: '' }
    };

    
  return (
    <Plot
      data={_data}
      layout={layout}
    />
  )
};