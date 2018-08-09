# lightning-load-project

# 小程序性能优化之页面预加载框架

## 介绍
之前看到一篇文章，《微信小程序之提高应用速度小技巧》，是讲如何实现小程序在触发页面跳转前就请求协议，利用跳转页面的短短200~300ms的时间，获取到数据并渲染到新页面上，实现数据在小程序页面中预加载。这种技术，可以缩短用户的等待时间，极大的提升用户的使用体验。但是那篇文章中只是讲述了技术原理，并没有实际教大家如何编写，所以我编写了这个页面预加载框架。

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

## 使用该技术的项目
![HiPee优孕](https://github.com/unmagic/.gif/blob/master/lightning-load/qr/HiPee优孕.jpg)

## LINK

[集成方式文档](https://blog.csdn.net/sinat_27612147/article/details/78456363)

[技术原理文档](https://blog.csdn.net/sinat_27612147/article/details/78456363)

[LICENSE](https://github.com/unmagic/lightning-load-project/blob/master/LICENSE)

感谢这篇文章提供的思想：
[微信小程序之提高应用速度小技巧](http://wetest.qq.com/lab/view/294.html?from=content_qcloud)
