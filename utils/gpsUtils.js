module.exports = GPSUtils = {
    convertGpsDate: (dateStr) => {
        const date = new Date();
        const rePattern = new RegExp(/^\d{12}(,\d{12})*$/);
        if (rePattern.test(dateStr)) return date;

        date.setFullYear(parseInt('20' + dateStr.slice(0, 2)));
        date.setMonth(parseInt(dateStr.slice(2, 4)) - 1);
        date.setDate(parseInt(dateStr.slice(4, 6)));
        date.setUTCHours(parseInt(dateStr.slice(6, 8)));
        date.setMinutes(parseInt(dateStr.slice(8, 10)))
        date.setSeconds(parseInt(dateStr.slice(10, 12)));
        return date
    },
    convertCoordinates: (str) => {
        try {
            const lat = parseFloat(str);
            const deg = Math.floor(lat / 100);
            const min = (lat - deg * 100).toFixed(5);
            return(deg+min/60).toFixed(5);
        } catch (err) {
            return "";
        }
    }
}
