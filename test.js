const latitude = '2958.27003';
const longitude = '03115.52756';

convert_coordinates = (str) => {
    if (str === "") {
        return "";
    }
    try {
        const lat = parseFloat(str);
        const deg = Math.floor(lat / 100);
        const min = Math.floor(lat - deg * 100);
        const sec = (lat-(deg*100 + min)).toFixed(5);
        return ((deg + min / 60 + sec / 3600).toFixed(6)).toString();
    } catch (err) {
        return "";
    }
};

console.log(convert_coordinates(longitude), convert_coordinates(latitude))