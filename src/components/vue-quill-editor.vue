<template>
  <div class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script>

  // Import dependency
  require('quill/dist/quill.snow.css')
  require('quill/dist/quill.core.css')
  if (!window.Quill) {window.Quill = require('quill/dist/quill.js')}
  
  /*
  Rewrite link blot
  Example see: https://quilljs.com/guides/cloning-medium-with-parchment/#dividers
  */
  var Link = Quill.import('formats/link');
  class FileBlot extends Link {
    static create(value) {
      let node = undefined
      if (value&&!value.href){  // an 'a' link
        node = super.create(value);
      }
      else{  // an 'downloadable' link
        node = super.create(value.href);
        node.setAttribute('download', true);
        node.innerText = value.innerText;
      }
      return node;
    }
  }
  FileBlot.blotName = 'link';
  FileBlot.tagName = 'A';
  Quill.register(FileBlot);
  
  // coponent define
  export default {
    name: 'quill-editor',
    data: function() {
      return {
        _content: '',
        defaultModules: {
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
        },
        defaultFileOptions :{
          extensions: ['png', 'jpg', 'jpeg', 'bmp', 'txt', 'pdf', 'pptx'],
          maxFileSize: 50
        }
      }
    },
    props: {
      content: String,
      disabled: Boolean,
      placeholder:{
        type:String,
        default: "Type some text..."
      },
      options: {
        type: Object,
        required: false,
        default: function() {
          return {}
        }
      }
    },
    mounted: function() {
      this.initialize()
    },
    beforeDestroy: function() {
      this.quill = null
    },
    methods: {
      initialize: function() {
        let vm = this
        if (this.$el) {

          // When pasting some text, only some formats can be inherited
          // This set will influence some toolbar's function.
          if(this.options.file&&this.options.file.whitelist.enable){
              let whitelist = this.options.file.whitelist.list;
              var Font = Quill.import('formats/font');
              var Color = Quill.import('formats/color');
              var Size = Quill.import('formats/size');
              var Bg = Quill.import('formats/background');
              var Align = Quill.import('formats/align');
              Font.whitelist = whitelist.font||[];
              Color.whitelist = whitelist.color||[];
              Size.whitelist=whitelist.size||[];
              Bg.whitelist=whitelist.bg||[];
              Align.whitelist=whitelist.align||[];
              Quill.register(Font, true);
              Quill.register(Color, true);
              Quill.register(Size, true);
              Quill.register(Bg, true);
              Quill.register(Align, true);
          }

          // Change image icon, merge image upload and file upload
          if(this.options.file&&this.options.file.imageIcon){
            var icons = Quill.import('ui/icons');
            icons['image'] = this.options.file.imageIcon;
          }
            
          // options and instance
          var self = this
          self.options.theme = self.options.theme || 'snow'
          self.options.boundary = self.options.boundary || document.body
          self.options.modules = self.options.modules || self.defaultModules
          self.options.modules.toolbar = self.options.modules.toolbar !== undefined
                                          ? self.options.modules.toolbar
                                          : self.defaultModules.toolbar
          self.options.placeholder = self.placeholder||self.options.placeholder
          self.options.readOnly = self.options.readOnly !== undefined ? self.options.readOnly : false
          self.quill = new Quill(self.$refs.editor, self.options)

          // set editor content
          if (self.content) {
            self.quill.pasteHTML(self.content)
          }

          // mark model as touched if editor lost focus
          self.quill.on('selection-change', (range) => {
            if (!range) {
              self.$emit('blur', self.quill)
            } else {
              self.$emit('focus', self.quill)
            }
          })

          // update model if text changes
          self.quill.on('text-change', (delta, oldDelta, source) => {
            var html = self.$refs.editor.children[0].innerHTML
            var text = self.quill.getText()
            if (html === '<p><br></p>') html = ''
            self._content = html
            self.$emit('input', self._content)
            self.$emit('change', {
              editor: self.quill,
              html: html,
              text: text
            })
          })

          // upload image or file
          self.quill.getModule('toolbar').addHandler('image', () => {
            vm.selectLocalFile(self.quill);
          });

          // disabled
          if (this.disabled) {
            this.quill.enable(false)
          };

          // emit ready
          self.$emit('ready', self.quill)
        }
      },
      saveToServer(file,editor) {
        let vm = this
        if(vm.options.file){
          vm.options.file.uploadFileCallback(file, function(url){
            vm.insertToEditor(url, file, editor);
          })
        }
        else{
          vm.options.file.invalidUploadCallback("Error: Need have a uploadFileCallback hander.")
        }
      },
      selectLocalFile(editor) {
        let vm = this
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.click();
        let maxFileSize;
        let fileExtensions
        if(vm.options.file){
          fileExtensions = vm.options.file.extensions  // valid extensions
          maxFileSize = vm.options.file.maxFileSize  // Unit is 'M'
        }
        else{
          fileExtensions = vm.defaultFileOptions.extensions
          maxFileSize = vm.defaultFileOptions.maxFileSize
        }
        input.onchange = () => {

          // just use one file upload
          const file = input.files[0];  

          // test file type
          var patt_str = "("+fileExtensions.join("|")+")";
          var patt=new RegExp(patt_str, "i");

          // console.log(patt_str, patt, file.type);
          if(!patt.test(file.type)){
            let wrongMsg = "Error: File type is not in the extensions params.";
            if(vm.options.file) vm.options.file.invalidUploadCallback(wrongMsg)
            else console.log(wrongMsg)
            return
          }

          // test file size
          if(file.size/1024/1024 > maxFileSize){
            let wrongMsg = "Error: File size exceed maxFileSize params.";
            if(vm.options.file) vm.options.file.invalidUploadCallback(wrongMsg)
            else console.log(wrongMsg)
            return
          }

          vm.saveToServer(file, editor);
        };
      },
      insertToEditor(url, file, editor) {
        const range = editor.getSelection();
        if(/^image/.test(file.type)){  // push image url to rich editor
          editor.insertEmbed(range.index, "image", url);
        }
        else{  // insert file as a downloadable link
          editor.insertEmbed(range.index, 'link', {href:url, innerText:file.name}, "api")
        }
      }
    },
    watch: {
      content: function(newVal, oldVal) {
        if (this.quill) {
          if (!!newVal && newVal !== this._content) {
            this._content = newVal
            this.quill.pasteHTML(newVal)
          } else if(!newVal) {
            this.quill.setText('')
          }
        }
      },
      disabled: function(newVal, oldVal) {
        if (this.quill) {
          this.quill.enable(!newVal)
        }
      }
    }
  }
</script>

<style>
  .quill-editor img {
    max-width: 100%;
  }
</style>
