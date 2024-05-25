const formatDate = (date, withTime = false) => {
    // 不足两位补0
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    let hour, minute, sec;
    if (withTime) {
        hour = date.getHours().toString().padStart(2, '0');
        minute = date.getMinutes().toString().padStart(2, '0');
        sec = date.getSeconds().toString().padStart(2, '0');
    }
    return `${date.getFullYear()}-${month}-${day}${withTime ? ' ' + hour + ':' + minute + ':' + sec : ''}`
}

module.exports = {
    formatDate,
}