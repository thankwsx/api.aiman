// 负责日记存储
const fs = require('fs');
const path = require('path');

// 日记存储路径
// const basePath = '/root/git/diary';
const basePath = process.env.DIARY_BASE_PATH;

// 检查日记文件是否存在
const checkDiaryFileExist = (fileName) => {
    const dir = getDiaryDir(fileName);
    return fs.existsSync(path.join(basePath, dir, fileName));
}

// 创建日记文件
const createDiaryFile = (fileName, content) => {
    const dir = getDiaryDir(fileName);
    fs.writeFileSync(path.join(basePath, dir, fileName), content);
    // 判断文件是否创建成功
    if (!checkDiaryFileExist(fileName)) {
        throw new Error('Create diary file failed');
    }
    return fileName;
}

// 向日记文件追加内容
const appendDiaryFile = (fileName, content) => {
    const dir = getDiaryDir(fileName);
    fs.appendFileSync(path.join(basePath, dir, fileName), `\n${content}`);
    // 判断文件是否追加成功
    if (!checkDiaryFileExist(fileName)) {
        throw new Error('Append diary file failed');
    }
    return fileName;
}

// 根据YYYY-MM-DD格式获取日记文件所在目录
const getDiaryDir = (date) => {
    // 如果date格式不对，报错
    if (!/^\d{4}-\d{2}-\d{2}\.md$/.test(date)) {
        throw new Error('Invalid date format');
    }
    return date.substring(0, 4) + date.substring(5, 7);
}

module.exports = {
    checkDiaryFileExist,
    createDiaryFile,
    appendDiaryFile,
}