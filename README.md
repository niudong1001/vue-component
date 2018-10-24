# vue-component

包含一些常用的Vue组件。

## 组件列表

### vue-quill-editor

一种使用quill作为富文本编辑器的Vue组件，但在quill基础上做了一些增强：

1.修改quill中toolbar里面image按钮的作用，使其可以**上传图片**或**上传文件**到指定的服务器，返回对应`url`生成block并填充到相应位置，对于填充方式有两种情况：

- 对于图片：插入`img`标签，其`src`为`url`
- 对于文件：插入`a`标签，其`href`为`url`，`value`为文件名称

2.另外，还增加白名单过滤功能，当开启白名单过滤，只有其中的属性值可以被保留下来，这可以完成格式化粘贴的功能。

使用方式：

- 安装依赖：`npm install --save quill`
- 移动`src/components/vue-quill-editor.vue`到您的组件文件夹并注册这个组件，接着按照例子[Quill-Editor-Test](./src/views/quill-editor-test.vue)中的方式使用。
