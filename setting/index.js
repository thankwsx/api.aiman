const express = require('express')
const router = express.Router()
const { exec } = require('child_process')

router.get('/', (req, res) => {
    res.send('Setting API');
})

router.get('/async', async (req, res) => {
    exec(`${process.env.SHELL_PATH}/async.sh`, (err, stdout, stderr) => {
        if (err) {
            console.error(err)
            res.json({
                code: 1,
                msg: 'error'
            })
        } else {
            res.json({
                code: 0,
                msg: 'ok'
            })
        }
    })
})
