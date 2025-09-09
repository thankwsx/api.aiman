const express = require('express')
const router = express.Router()
const BeancountModel = require('./beancount.model').BeancountModel
const formatDate = require('../common/util').formatDate

router.get('/', (req, res) => {
    res.send('Beancount API');
})

// 创建账单
/**
 * @api {post} /beancount/create 创建账单
 * @apiDescription 创建账单
 * @apiName create
 * @apiGroup Beancount
 * @apiParam {String} content 内容
 * @apiSuccess {Number} code 状态码
 * @apiSuccess {String} msg 信息
 * @apiSuccessExample {json} Success-Response:
 * {
 *    code: 0,
 *   msg: 'ok'
 * }
 * @apiSampleRequest /beancount/create
 * @apiVersion 1.0.0
 * @apiErrorExample {json} Error-Response:
 * {
 *   code: 1,
 *  msg: 'something wrong'
 * }
 * @apiError {Number} code 状态码
 * @apiError {String} msg 信息
 * @apiErrorExample {json} Error-Response:
 * {
 *  code: 1,
 * msg: 'something wrong'
 * }
 * @apiParamExample {json} Request-Example:
 * {
 * "account": ["Assets:Wechat", "零钱通"]
 * "date": "2020-01-01",
 * "desc": "-",
 * "expense": ["Expenses:Food", "Work"],
 * "money": "100.00",
 * "payee": "麦当劳",
 * }
 */
router.post('/create', (req, res) => {
    // 获取服务器时间
    const date = new Date();
    const fileName = formatDate(date) + '.md';
    const beancountModel = new BeancountModel();
    try {
        beancountModel.createBeancount({
            fileName: fileName,
            content: req.body,
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

router.get('/account/list', (req, res) => {
    const beancountModel = new BeancountModel();
    const accountList = beancountModel.getAccountList();
    res.json(accountList)
})

router.get('/expenses/list', (req, res) => {
    const beancountModel = new BeancountModel();
    const expenseList = beancountModel.getExpenseList();
    res.json(expenseList)
})

module.exports = router