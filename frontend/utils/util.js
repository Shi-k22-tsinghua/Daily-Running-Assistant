//const serverURL = "http://localhost:8000"; //for local testing
//const serverURL = "http://124.221.96.133:8000"; //for deployment testing
//const serverURL = "http://dra.xulincaigou.online:8000";
const serverURL = "https://dra.xulincaigou.online";

function getAPI(prefix, suffix) {
    // Ensure the prefix ends with a slash and the suffix doesn't start with one
    if (!prefix.endsWith('/')) {
        prefix += '/';
    }
    if (suffix.startsWith('/')) {
        suffix = suffix.substring(1);
    }

    return prefix + suffix;
}

// 返回当前日期时间
// yyyy/mm/dd xx:dd:dd
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

// 返回当前日期
const formatDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${[year, month, day].map(formatNumber).join('/')}`
}

// 格式化时间为'YYYY-MM-DD HH:mm:ss'
function formatDateWithInput (date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // 由于是24小时制，所以这里不需要额外处理
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

//弧度
function toRadians(d) {
    return d * Math.PI / 180
}
//利用两点的经度，纬度计算两点距离
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6378137 //赤道半径
    let dis = 0
    let deltaLat = toRadians(lat1) - toRadians(lat2)
    let deltaLng = toRadians(lng1) - toRadians(lng2)
    let radLat1 = toRadians(lat1);
    let radLat2 = toRadians(lat2);
    dis = 2 * R * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)))
    return dis
}

module.exports = {
    serverURL,
    getAPI,
    formatTime,
    formatDate,
    getDistance,
    formatDateWithInput
}