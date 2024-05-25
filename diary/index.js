const express = require('express')
const router = express.Router()
const DiaryModel = require('./diary.model').DiaryModel
const formatDate = require('../common/util').formatDate

router.get('/', (req, res) => {
    res.send('Diary API');
})

// 创建日记
router.post('/create', (req, res) => {
    // 获取服务器时间
    const date = new Date();
    const fileName = formatDate(date) + '.md';
    const diaryModel = new DiaryModel();
    try {
        diaryModel.createDiary({
            fileName: fileName,
            content: req.body.content,
        });
        res.json({
            code: 0,
            msg: 'ok'
        })
    } catch (e) {
        res.json({
            code: 1,
            msg: 'something wrong'
        })

    }

})

module.exports = router