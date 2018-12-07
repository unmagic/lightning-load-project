import Navigator from "./Navigator";

export default class CommonPage {
    constructor(...args) {
        if (args.length) {
            const name = args[0].clazzName;
            if (name) {
                this.data = {clazzName: name};
                Navigator.putPage(name, this);
            }
        }
    }

    $init(originData) {
        Object.assign(this.data = this.data ? this.data : {}, originData);
        this.$origin = JSON.parse(JSON.stringify(this.data));
        Object.freeze(this.$origin);
    }

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    };

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    }

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    }

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    }

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        if (this.data.clazzName) {
            let clazz = Navigator.getPage(this.data.clazzName);
            if (!clazz || !clazz.$origin) {
                console.error('请先在页面的constructor方法中注入init(data)，以避免出现不必要的错误');
                return;
            }
            clazz.data = JSON.parse(JSON.stringify(clazz.$origin));
        }
    }

    $setData = function (data) {
        if (this.setData) {
            this.setData(data);
        } else {
            Object.assign(this.data = this.data ? this.data : {}, data);
        }
    };

    $route = function ({path = '', query = {}, clazzName = ''}) {
        let args = '';
        if (Object.keys(query).length) {
            args = '?';
            for (let i in query) {
                if (query.hasOwnProperty(i)) {
                    args += i + '=' + query[i] + '&';
                }
            }
            args = args.substring(0, args.length - 1);
        }
        let clazz = Navigator.getPage(clazzName);
        if (clazz && clazz.$onNavigator) {
            clazz.$onNavigator && clazz.$onNavigator(query);
            setTimeout(() => {
                wx.navigateTo({url: `${path + args}`});
            }, 150);
        } else {
            wx.navigateTo({url: `${path + args}`});
        }


    };

    $put = function (key, fun, args) {
        if (key && fun) {
            CommonPage.prototype._pageValues[`${this.data.clazzName}?${key}`] = CommonPage._$delay(this, fun, args);
        }
    };

    $take = function (key) {
        if (key) {
            const promise = CommonPage.prototype._pageValues[`${this.data.clazzName}?${key}`];
            delete CommonPage.prototype._pageValues[`${this.data.clazzName}?${key}`];
            return promise;
        }
        return null;
    };

    static _$delay(context, cb, args) {
        return new Promise((resolve, reject) => {
            context.resolve = resolve;
            context.reject = reject;
            CommonPage.prototype.currentPageContext = context;
            cb && cb(args, resolve, reject);
        });
    }

    $resolve = function (data) {
        const context = CommonPage.prototype.currentPageContext;
        !!context && !!context.resolve && context.resolve(data);
        CommonPage.prototype.currentPageContext = null;
    };

    $reject = function (data, error) {
        const context = CommonPage.prototype.currentPageContext;
        !!context && !!context.reject && !!context.reject(data, error);
        CommonPage.prototype.currentPageContext = null;
    };


    // /**
    //  * 页面相关事件处理函数--监听用户下拉动作
    //  */
    // onPullDownRefresh () {
    //
    // }
    //
    // /**
    //  * 页面上拉触底事件的处理函数
    //  */
    // onReachBottom () {
    //
    // }
}

CommonPage.prototype._pageValues = {};
CommonPage.prototype.currentPageContext = null;
