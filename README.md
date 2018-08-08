# lightning-load-project

#### 集成方式 <font color=red>看不效果览图的话，请看博客</font> https://blog.csdn.net/sinat_27612147/article/details/80802725

#### 了解原理请看 https://blog.csdn.net/sinat_27612147/article/details/80798452

# 小程序性能优化之预加载方案 集成篇

## 前言
之前看到一篇文章，《微信小程序之提高应用速度小技巧》，是讲如何实现小程序在触发页面跳转前就请求协议，利用跳转页面的短短200~300ms的时间，获取到数据并渲染到页面上，实现数据在小程序页面中预加载。这种技术，可以缩短用户的等待时间，极大的提升用户的使用体验。但是那篇文章中只是讲述了技术原理，并没有实际教大家如何编写，那么今天我来具体的讲下这个技术实现方式。

## 框架优缺点
### 优点：
 - 预加载下一个页面的数据，提高了页面的加载速度，轻量级的协议（200~300ms左右就能接收到数据）能轻松让小程序页面打开后数据瞬间加载，几乎不出现空页面。
 - 让同种业务的代码保持在一个类中，不会破坏项目结构。
 - 代码量非常少，对原本业务影响非常少。
 - 实现预加载后想删掉预加载？只需在实现的类中删除一个字符串即可。

### 缺点：

 - 代码侵入高，需要按情况替换`setData`为`$setData`
 - 需要开发者非常清楚各情况下的上下文是什么。
 - 协议非常耗时，达到400ms以上的，使用这种优化方式就不明显了。

当然，还是先给大家看下具体的效果。

## 最终效果
这里展示的是一条协议总时间是300ms的加载效果。这里是用setTime()来模拟的。一个是今天要介绍的预加载方式（跳转前就开始请求协议）和普通加载方式（跳转后才开始请求协议），<font color=red>可以看到，普通加载方式，在跳转页面成功后，页面会先空，后有数据；而预加载方式一进到页面就有数据。</font>这里主要是用Android手机来测试的（型号是魅族pro6），<font color=red>点击按钮时是有点击态的，但是颜色太浅，淡蓝色，不容易看出来。这个点击态在预加载方案中的地位是非常重要的！！</font>
![预加载方式](https://img-blog.csdn.net/20180625120254540?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzI3NjEyMTQ3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
![普通加载方式](https://img-blog.csdn.net/20180625120222391?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3NpbmF0XzI3NjEyMTQ3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

## 如何集成
重要声明：我的小程序是遵循ES6标准写的，里面用了`class` `extends`及解构赋值等，如果看不懂的话，请学习下ES6！！如果你的项目是用的ES5，那就仔细阅读后续文章，体会预加载技术的核心思想，如果核心思想理解了，分分钟写五六十个出来，对吧 ~ ~
### 首先，你要有个基类`CommonPage`
小程序中的每一个`Page`类都继承该基类，这样的话才方便统一管理。
比如下面的`IndexPage`页面
```
// pages/index/index.js
import CommonPage from "../CommonPage";
class IndexPage extends CommonPage {
    constructor(...args) {
        super(...args);
        this.data = {
            testStr: 'this is the firstPage'
        }
    }

    onLoad(options) {
    }
}

Page(new IndexPage());
```
`IndexPage`是第一个页面，不需要预加载，`SecondPage`是第二个页面，我们来模拟下`SecondPage`的预加载方式。
接下来看到的`this.$route() this.$put() this.$take() this.$resolve() this.$reject()`等带`$`符号的都是基类中实现的方法。
#### 1. 给`IndexPage`页面添加跳转按钮。

```
<!--index.wxml-->
<view class="container">
    <view bindtap="toSecondPage" hover-class="press-style" class="normal-style" hover-stay-time="100"> 闪电加载第二个页面</view>
    <view>300毫秒 闪电加载方式</view>
</view>
```
注意：这里添加的`class="normal-style" hover-stay-time="100"`是非常重要的，如果不添加点击态，会很影响体验。
#### 2. 给`IndexPage`页面添加预加载专用跳转方式。

```
 toSecondPage = function () {
        // this.$route是预加载的页面跳转方式，以wx.navigateTo方式跳转。这个方法是在CommonPage中实现的。
        this.$route({path: '../second/second', query: {count: 10, title: '这是第二个页面'}, clazzName: 'SecondPage'});
		
		// 这是小程序原生的普通加载方式
        // wx.navigateTo({
        //     url: '../second/second?count=10&title=这是第二个页面'
        // })
    }
```

`this.$route({path, query, clazzName});`这个方法的参数含义是：

 - path：页面路径，支持绝对路径和相对路径。
 - query：需要传递的参数。这是一个`object`类型的。
 - clazzName：需要跳转的页面的类名。这个介绍`SecondPage`时再说。

其实你可能会问，既然有path了，为什么还要clazzName？这个问题会在介绍技术原理时详细说，那是下一篇的事儿了。

到这里，如果你也是用ES6的规范来实现类的，可以看到，在`IndexPage`中，你只需将跳转方式修改为`this.$route({path, query, clazzName});`即可。

#### 3. 给`SecondPage`页面添加预加载专用的初始化方法。

```
// pages/second/second.js
import CommonPage from "../CommonPage";
class SecondPage extends CommonPage {
    constructor(...args) {
	    //super(...args)一定要写，他会将clazzName与下面的data进行合并。
        super(...args);
        //这个$init(obj)中注入的obj就是页面初始时的data
        super.$init({
            arr: []
        });
    }

    $onNavigator(query) {
	    //这里的query是从this.$route中传递来的query
        console.log('闪电️加载时接收到的参数', query);
        this.$put('second-data', this.initData.bind(this), query);
    };
	
    initData = function (query, resolve, reject) {
	    //这里的query是在this.$put()中传递过来的
	    //resolve在协议成功时回调
	    //reject在协议失败时回调
	    //模拟网络请求
        setTimeout(() => {
            if (typeof query.count === "string") {
                query.count = parseInt(query.count);
            }
            this.data.arr.splice(0, this.data.arr.length);
            for (let i = 0; i < query.count; i++) {
                this.data.arr.push({id: i, name: `第${i}个`, age: parseInt(Math.random() * 20 + i)})
            }
            this.$setData(this.data);
            this.$resolve(this.data);//或者 resolve(this.data);只有调用了resolve或者reject方法，才能在this.$take()的then()方法中获取到值。
        }, 300);
    };

    onLoad(options) {
        const lightningData = this.$take('second-data');
        if (lightningData) {
            lightningData.then((data) => {
	            //成功回调，resolve(data)调用时触发 data就是resolve传递的参数
                this.$setData(data);
            },(data, error)=>{
	            //失败回调，reject(data, error)调用时触发，data和error是reject传递的参数。
            });
            return;
        }
        this.initData(options);
    }
}
//这里注入的clazzName: 'SecondPage'，与this.$route({path, query, clazzName});中的clazzName名称与其一致即可
Page(new SecondPage({clazzName: 'SecondPage'}));
```
大概是这么几步：

 1. 这个类需要在`new`时，将`clazzName`注入，`this.$route({path, query, clazzName});`中的`clazzName`名称与其一致即可。
 2. 需要在`SecondPage`中注入新的生命周期函数，也就是预加载方法。在执行`this.$route`时，你在`this.$route`中传递的`clazzName`是什么，这个框架就会自动去找匹配一致的类，调用该类的`$onNavigator`方法。
 3. 在`$onNavigator`中调用`this.$put(key,fun,query)`参数分别是键、异步请求方法、异步请求方法的参数。
 4. 在异步请求方法将`this.setData`替换为`this.$setData()`，使用`this.$resolve(data)`或者`this.$reject(data,error)`来回调成功或失败。
 5. 在`onLoad`中使用`this.$take(key).then(success,fail)`来获取异步结果，分别对应了`resolve`和`reject`回调。如果你没有使用预加载，或者预加载失败，那么`this.$take(key)`方法返回空，由此可以判断是否使用了预加载进入页面！

这么做的话，实现了在跳转前先把下一个页面的协议发出去，而且还让同种业务的代码保持在一个类中，不会破坏项目结构!

在实现了预加载后，如果不想用预加载了，只需要删掉`new SecondPage()`时注入的`clazzName`即可！

`CommonPage`中的相关代码，在这篇中我就不讲了。想了解原理的话，请看下一篇文章[小程序性能优化之预加载方案 进阶篇](https://blog.csdn.net/sinat_27612147/article/details/80798452)

GitHub源码地址：
[小程序预加载技术源码](https://github.com/unmagic/lightning-load-project)


感谢这篇文章提供的思想：
[微信小程序之提高应用速度小技巧](http://wetest.qq.com/lab/view/294.html?from=content_qcloud)


## 更新日志：
2018-07-30
修复调用`$init()`时，会出现错误问题

2018-06-26
初次提交
