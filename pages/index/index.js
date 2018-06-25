//index.js
//获取应用实例

import CommonPage from "../CommonPage";

let app = getApp();

class IndexPage extends CommonPage {
    constructor(...args) {
        super(...args);
        this.data = {
            testStr: 'this is test'
        }
    }

    onLoad(options) {


    }

    toSecondPage = function () {
        console.log('-------此时还未执行第二个页面的onLoad方法--------');
        console.log('点击按钮开始跳转', 0);
        app.globalData.timestamp = Date.now();
        this.$route({path: '../second/second', query: {count: 10, title: '这是第二个页面'}, clazzName: 'SecondPage'});

        // wx.navigateTo({
        //     url: '../second/second?count=10&title=这是第二个页面',
        //     success: () => {
        //         console.log('点击按钮跳转成功', Date.now()-app.globalData.timestamp);
        //
        //     }
        // })
    }
}

Page(new IndexPage());
