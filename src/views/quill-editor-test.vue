<template>
  <div>
    <quill-editor 
      :options="options" 
      :fileOptions="fileOptions"
      :content="content" 
      :disabled="disabled" 
      :placeholder="placeholder">
    </quill-editor>
  </div>
</template>

<script>
export default {
  name: 'Quill-Editor-Test',
  data(){
    return {
      content: "Hello world!",
      placeholder: "Input some text...",
      disabled: false,
      options:{
        modules:{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 },{ 'header': 3 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        }
      },
      fileOptions:{
        errorHander: this._errorHander,
        imageIcon: "<i class=''>File</i>",  // replace the image icon
        maxFileSize: 50, // unit is 'M'
        extensions: ['png', 'jpg', 'jpeg', 'bmp', 'txt', 'pdf', 'pptx'],  // include image and file
        invalidUploadCallback: this.invalidUploadCallback,  // invoke when some error happened
        uploadFileCallback: this.uploadFileCallback,  // upload file to a server, callback a url
        whitelist:{  // just property value in the whitelist will be reserved
          enable:true,
          list:{
            font:['bold',"italic","underline"],
            color:[],
            size:[],
            bg:[],
            align:[]
          }
        }
      }
    }
  },
  methods:{
    _errorHander(wrongCode, wrongMsg){
        alert("Error: "+wrongMsg);
    },
    uploadFileCallback(file, callback){
      // upload file to server, need you add
      // callback
      let url="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540293184581&di=8412eac97e60eb633d156900cfbd1dac&imgtype=0&src=http%3A%2F%2Fwww.znsfagri.com%2Fuploadfile%2Feditor%2Fimage%2F20170626%2F20170626151136_11631.jpg";  // fake url
      callback(url);
    }
  }
}
</script>
