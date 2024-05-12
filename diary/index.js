const express = require('express')
const router = express.Router()
const DiaryModel = require('./diary.model').DiaryModel

router.get('/', (req, res) => {
    res.send('Diary API');
})

// 创建日记
router.post('/create', (req, res) => {
    // 获取服务器时间
    const date = new Date();
    const fileName = formatDate(date) + '.md';
    const diaryModel = new DiaryModel();
    diaryModel.createDiary({
        fileName: fileName,
        content: req.body.content,
    });
    res.json({
        code: 0,
        msg: 'ok'
    })

})

const formatDate = (date, withTime = false) => {
    // 不足两位补0
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    if (withTime) {
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const sec = date.getSeconds().toString().padStart(2, '0');
    }
    return `${date.getFullYear()}-${month}-${day}${withTime ? ' ' + hour + ':' + minute + ':' + sec : ''}`
}

module.exports = router