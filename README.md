## 一款基于VUE的图片预览插件

![预览图片](https://raw.githubusercontent.com/kailong321200875/my-image/master/Video_2019-11-17_172546.gif)

### 大多数图片预览都是基于子元素为img标签来实现，感觉有点太死板了。所以自己就搞了一个在JS中调用图片预览，只需要传入对应的参数就能实现图片预览，不在关注与HTML长什么样子。

## 导入

> npm install vue-preview-pictures

## 全局引入

在 main.js 中引入

```
  import PreviewPic from 'vue-preview-pictures'
  Vue.prototype.$PreviewPic = PreviewPic
  
  可以直接挂在到VUE的原型上，作为全局使用
```

## 局部引入

```
  import PreviewPic from 'vue-preview-pictures'
  
  也可以单独在VUE文件中使用
```

## 使用方式

```
this.$PreviewPic({
  zIndex: 2000, // 组件的zIndex值 默认为2000
  index: 2, // 展示第几张图片 默认为0
  list: list, // 需要展示图片list
  onClose: (i) => { // 关闭时的回调
    console.log(i)
  },
  onSelect: (i) => { // 点击某张图片的回调
    console.log(i)
  }
})
```

## 全局方法

另外还提供一个全局方法来关闭组件
```
this.$PreviewPic.close(() => {
  console.log('我是全局关闭方法')
})
```

## 更新日志

### 0.1.2

*2019-11-17*

- 优化打开组件时不显示滚动条

==============================================

### 0.1.1

*2019-11-17*

- 完成基础版提交
