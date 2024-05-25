// 负责日记存储
const fs = require('fs');
const path = require('path');
// const formatDate = require('../common/util').formatDate

// 账单存储路径
const basePath = process.env.BEANCOUNT_BASE_PATH;

const initBeancountFile = (fileName) => {
    const dir = getBeancountDir(fileName);
    const realFileName = getBeancountFile(fileName);
    const content = `; generate by AIMAN jackyqi\n`;
    fs.writeFileSync(path.join(basePath, dir, realFileName), content);
}

// 检查日记文件是否存在
const checkBeancountFileExist = (fileName) => {
    const dir = getBeancountDir(fileName);
    const realFileName = getBeancountFile(fileName);
    return fs.existsSync(path.join(basePath, dir, realFileName));
}

// 创建日记文件
const createBeancountFile = (fileName, content) => {
    const dir = getBeancountDir(fileName);
    const realFileName = getBeancountFile(fileName);
    try {
        initBeancountFile(fileName);
        fs.appendFileSync(path.join(basePath, dir, realFileName), `\n${content}`);
        // 判断文件是否创建成功
        if (!checkBeancountFileExist(fileName)) {
            throw new Error('Create beancount file failed');
        }
        return realFileName;
    } catch (e) {
        console.log('createBeancountFile error:', e);
        return false;
    }
}

// 向日记文件追加内容
const appendBeancountFile = (fileName, content) => {
    const dir = getBeancountDir(fileName);
    const realFileName = getBeancountFile(fileName);
    fs.appendFileSync(path.join(basePath, dir, realFileName), `\n\n${content}`);
    // 判断文件是否追加成功
    if (!checkBeancountFileExist(fileName)) {
        throw new Error('Append beancount file failed');
    }
    return realFileName;
}

// 根据YYYY-MM-DD格式获取日记文件所在目录
const getBeancountDir = (date) => {
    // 如果date格式不对，报错
    if (!/^\d{4}-\d{2}-\d{2}\.md$/.test(date)) {
        throw new Error('Invalid date format');
    }
    // beancount是按年存储的
    return date.substring(0, 4);
}

const getBeancountFile = (date) => {
    // 如果date格式不对，报错
    if (!/^\d{4}-\d{2}-\d{2}\.md$/.test(date)) {
        throw new Error('Invalid date format');
    }
    // beancount是按年存储的
    return date.substring(5, 7) + '_aiman'+'.bean';
}

module.exports = {
    checkBeancountFileExist,
    createBeancountFile,
    appendBeancountFile,
    getBeancountFile,
}