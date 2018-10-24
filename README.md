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
- 获得组件：移动`src/components/vue-quill-editor.vue`到您的组件文件夹并注册这个组件
- 使用组件：按照例子[Quill-Editor-Test](./src/views/quill-editor-test.vue)中的方式使用该组件

### vue-input-dialog

一种根据传入参数定制显示的Dialog。其参数控制如下：

```js
dialogOptions:{
  title: "修改操作",  // title of dialog
  width: "50%",  // width of dialog
  visible: true,  // control visble of dialog
  submitLoading: false,
  labelPosition: "top",  // control all items label position
  labelWidth: "100px",  // width of all items
  // -1(missing func), 0(invalid data), 1+(image upload error)
  errorHander: this.dialogErrorHander,  // invoke when some error happened
  items:[
    {
      id: "1",  // identification
      label: "Name",  // label of this item
      type: "input",  // "input"||"html", means an input block or just display some information
      html:{
        slot:"<span></span>"
      },
      input:{
        // element valid type: 'text', 'textarea', <other valid type>
        // other valid type: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types
        type: 'text', // "select"||"richText"||"img"||<element valid type>,
        data: "", // save value for single col
        class: "",  // class for content
        placeholder: "Input..",
        disabled: false,
        require: true,
        regText: "",  // for validate the text inputed
        // selective use
        select:{  // valid when type is select
          options:[
            {
              text: "Test1",
              value: "1"
            },
            {
              text: "Test2",
              value: "2"
            }
          ],
          multiple: true, // valid when type is select
        },
        richText:{ // valid when type is richText
          options:{

          },
          fileOptions:{

          }
        },
        img:{ // valid when type is img
          maxSize: 50,  // 'M'
          label: "点击选择图片",
          extensions: ["png", "jpg"],
          saveToServerHander: this.imgSaveToServerHander
        },
        // two cols
        isTwoCols:true,  // just have text and richText type
        twoCols:{  // valid when isTwoCols is true
          data1: "",
          data2: "",
          placeholder1: "",
          placeholder2: "",
          require1: true,
          require2: true,
          regText1:null,
          regText2:null
        }
      }
    }
  ],
  ensureCallback: this.ensureCallback,
  cancelCallback: this.cancelCallback,
}
```

使用方式：

- 安装依赖：`npm i element-ui -S`, `vue-quill-editor`
- 导入Element-ui:

```js
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
```

- 使用插件: 使用方式请查看[vue-input-dialog](./src/views/input-dialog-test.vue)