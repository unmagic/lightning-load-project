// pages/second/second.js
import CommonPage from "../CommonPage";

let app = getApp();
class SecondPage extends CommonPage {
    constructor(...args) {
        super(...args);
        super.$init({
            arr: []
        });
    }

    $onNavigator(query) {
        console.log('闪电️加载时接收到的参数', query,Date.now()-app.globalData.timestamp);
        this.$put('second-data', this.initData.bind(this), query);
    };

    initData = function (query, resolve, reject) {
        console.log('普通加载更新界面1', Date.now()-app.globalData.timestamp);
        setTimeout(() => {
            console.log('普通加载更新界面2', Date.now()-app.globalData.timestamp);
            if (typeof query.count === "string") {
                query.count = parseInt(query.count);
            }
            this.data.arr.splice(0, this.data.arr.length);
            for (let i = 0; i < query.count; i++) {
                this.data.arr.push({id: i, name: `第${i}个`, age: parseInt(Math.random() * 20 + i)})
            }
            this.$setData(this.data);
            console.log('普通加载更新界面', Date.now()-app.globalData.timestamp);
            this.$resolve(this.data);//或者 resolve(this.data);
        }, 300);
    };

    onReady() {
        console.log('第二个页面渲染完', Date.now()-app.globalData.timestamp);
    }
    onLoad(options) {
        super.onLoad(options);
        console.log('-------此时刚刚执行第二个页面的onLoad方法--------',options);
        console.log('第二个页面加载初', Date.now()-app.globalData.timestamp);
        const lightningData = this.$take('second-data');
        if (lightningData) {
            lightningData.then((data) => {
                this.$setData(data);
                console.log('闪电加载更新界面', Date.now()-app.globalData.timestamp);
            });
            return;
        }
        this.initData(options);
    }
}

Page(new SecondPage({clazzName: 'SecondPage'}));