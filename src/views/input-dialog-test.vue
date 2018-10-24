<template>
  <div>
    <input-dialog :dialogData=dialogOptions>
    </input-dialog>
    <span>Dialog is opened...</span>
  </div>
</template>

<script>
export default {
  name: 'Quill-Editor-Test',
  data(){
    return {
      dialogOptions:{
        title:"修改操作",  // title of dialog
        width: "50%",  // width of dialog
        visible:true,  // control visble of dialog
        submitLoading:false,
        labelPosition:"top",  // control all items label position
        labelWidth:"100px",  // width of all items
        // -1(missing func), 0(invalid data), 1+(image upload error)
        errorHander: this.dialogErrorHander,  // invoke when some error happened
        items:[
          {
            id:"1",  // identification
            label:"Name",  // label of this item
            type: "input",  // "input"||"html", means an input block or just display some information
            html:{
              slot:"<span></span>"
            },
            input:{
              // element valid type: 'text', 'textarea', <other valid type>
              // other valid type: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types
              type: 'text', // "select"||"richText"||"img"||<element valid type>,
              data:"", // save value for single col
              class: "",  // class for content
              placeholder:"Input..", 
              disabled:false,
              require:true,
              regText:"",  // for validate the text inputed

              // selective use
              select:{  // valid when type is select
                options:[
                  {
                    text:"Test1",
                    value:"1"
                  },
                  {
                    text:"Test2",
                    value:"2"
                  }
                ],
                multiple:true, // valid when type is select
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
                extensions:["png", "jpg"],
                saveToServerHander: this.imgSaveToServerHander
              },

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
    }
  },
  methods:{
    dialogErrorHander(wrongCode, wrongMsg){
      alert(wrongMsg)
    },
    imgSaveToServerHander(file, callback){
      // upload file to server, need you add
      // callback
      let url="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540293184581&di=8412eac97e60eb633d156900cfbd1dac&imgtype=0&src=http%3A%2F%2Fwww.znsfagri.com%2Fuploadfile%2Feditor%2Fimage%2F20170626%2F20170626151136_11631.jpg";  // fake url
      callback(url);
    },
    ensureCallback(){

    },
    cancelCallback(){

    }
  }
}
</script>

