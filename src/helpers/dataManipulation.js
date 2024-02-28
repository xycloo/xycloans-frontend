export function stroopsToUnit(num, decPlaces=7) {
    return (num/10000000).toFixed(decPlaces)
}


export function normalize(array) {

    const min = Math.min(...array);
    const max = Math.max(...array);
    
    const range = max - min;
    
    const normalizedArray = array.map(value => (value - min) / range);
    
    return normalizedArray;
}