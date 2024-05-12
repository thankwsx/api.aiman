const storage = require('./storage');

class DiaryModel {
    constructor() {
        this.diaries = [];
    }

    createDiary(diary) {
        // 不存在则创建
        if (!storage.checkDiaryFileExist(diary.fileName)) {
            if (!storage.createDiaryFile(diary.fileName, diary.content)) {
                throw new Error('Create diary file failed');
            }
            return true;
        } else {
            if (!storage.appendDiaryFile(diary.fileName, diary.content)) {
                throw new Error('Append diary file failed');
            }
            return true;
        }
    }

    getDiaries() {
        return this.diaries;
    }

    getDiaryById(id) {
        return this.diaries.find(diary => diary.id === id);
    }

    updateDiary(id, updatedDiary) {
        const diary = this.getDiaryById(id);

        diary.title = updatedDiary.title;
        diary.description = updatedDiary.description;

        return diary;
    }

    deleteDiary(id) {
    }

    // 检查日记文件是否存在
    checkDiaryFileExist(fileName) {
        return true;
    }
}

module.exports = {
    DiaryModel
}