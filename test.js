function convert(str) {
    const lat = parseFloat(str);
    const deg = Math.floor(lat / 100);
    const min = (lat - deg * 100).toFixed(5);
    return(deg+min/60).toFixed(5);
}

const lat = '3002.84912';
const long = '3111.73376 ';

console.log(`${convert(lat)}, ${convert(long)}`)
