const storage = require('./storage');

class BeancountModel {
    constructor() {
        this.diaries = [];
    }

    createBeancount(beancount) {
        // 将http请求参数进行拼接
        beancount.content = this.buildBeancount(beancount.content);
        console.log(beancount.content);
        // return true;
        // 不存在则创建
        if (!storage.checkBeancountFileExist(beancount.fileName)) {
            if (!storage.createBeancountFile(beancount.fileName, beancount.content)) {
                throw new Error('Create beancount file failed');
            }
            return true;
        } else {
            if (!storage.appendBeancountFile(beancount.fileName, beancount.content)) {
                throw new Error('Append beancount file failed');
            }
            return true;
        }
    }

    buildBeancount(beancount) {
        // 自动增加AIMAN标签
        return `${beancount.date} * "${beancount.payee}" "${beancount.desc}" #AIMAN
    ${beancount.account.join(':')} -${Number(beancount.money).toFixed(2)} CNY
    ${beancount.expense.join(':')}`;
    }

    getAccountList() {
        return ['Assets:Alipay:钱包', 'Assets:Unknown', 'Assets:Alipay:余额宝', 'Assets:Wechat:零钱通', 'Assets:Wechat:钱包'];
    }

    getExpenseList() {
        return ['Expenses:Family:Father', 'Expenses:Family:Mother'];
    }
}

module.exports = {
    BeancountModel
}