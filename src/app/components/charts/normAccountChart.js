import dynamic from 'next/dynamic'
import { parseBase64Yield, parseTimestamp, timestampsToDates, toHex } from '@/helpers/dataParsing';
import { normalize, stroopsToUnit } from '@/helpers/dataManipulation';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export const NormAccountChart = (props) => {
    // Extract timestamps and yields from data
    const balanceTimestamps = props.balanceData.map(entry => parseTimestamp(entry.timestamp))
    let balanceDates = timestampsToDates(balanceTimestamps, false)
    let balances = props.balanceData.map(entry => stroopsToUnit(parseInt(toHex(entry.balance), 16)), 4)

    balances.unshift(0);
    balanceDates.unshift(new Date(balanceTimestamps[0] - 10000000))

    const yieldTimestamps = props.yieldData.map(entry => parseTimestamp(entry.timestamp))
    let yieldDates = timestampsToDates(yieldTimestamps)
    let yields = props.yieldData.map(entry => parseFloat(stroopsToUnit(parseBase64Yield(entry.yield, 16), 3)))

    yields.unshift(0);
    yieldDates.unshift(new Date(balanceTimestamps[0] - 10000000))

    if (balanceTimestamps[balanceTimestamps.length - 1] < yieldTimestamps[yieldTimestamps.length - 1]) {
        balances.push(balances[balances.length - 1])
        balanceDates.push(yieldTimestamps[yieldTimestamps.length - 1])
    }

    if (balanceTimestamps[balanceTimestamps.length - 1] > yieldTimestamps[yieldTimestamps.length - 1]) {
        yields.push(balances[yields.length - 1])
        yieldDates.push(balanceTimestamps[balanceTimestamps.length - 1])
    }

    // Calculate accumulated yield over time
    const accumulatedYields = [0];
    let accumulatedYield = 0;
    for (let i = 0; i < yields.length; i++) {
        accumulatedYield += yields[i];
        accumulatedYields.push(accumulatedYield);
    }

    //console.log("yield:", yieldDates, accumulatedYields)
    const normalizedSupply = normalize(balances)
    const normalizedYield = normalize(accumulatedYields)

    // Create trace for accumulated yield

    const trace1 = {
        type: "scatter",
        mode: "lines",
        name: 'Normalized Supply Evolution',
        x: balanceDates,
        y: normalizedSupply,
        line: { color: 'primary' }
    };

    const trace2 = {
        type: "scatter",
        mode: "lines",
        name: 'Normalized yield',
        x: yieldDates,
        y: normalizedYield,
        line: { color: '#17BECF' }
    };

    // Define data array
    const _data = [trace1, trace2];

    // Define layout options
    const layout = {
        title: '',
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
            rangeselector: {
                buttons: [
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
                    { step: 'all' }
                ]
            }
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