<template>
	<div>
		<el-dialog :title="dialogData.title" :visible.sync="dialogData.visible" :modal-append-to-body="bools.appendToBody" 
		:close-on-click-modal="false" @close="cancel" :width="dialogData.width">
		  <el-form :label-position="dialogData.labelPosition||'top'" :label-width="dialogData.labelPosition||'100px'">
		  	<el-form-item v-for="item in dialogData.items" :label="item.label+':'" :key="item.id" >
					<!-- An input block -->
		  		<div v-if="item.type=='input'">
						<!-- Single cols -->
						<div v-if="!item.input.isTwoCols">
							<!-- Normal input type -->
							<el-input v-if="item.input.type!='select'&&item.input.type!='richText'&&item.input.type!='img'" 
							:type="item.input.type" v-model="item.input.data" :placeholder="item.input.placeholder" 
							:class="item.input.class" :disabled="item.input.disabled"></el-input>
							<!-- Select -->
							<el-select v-if="item.input.type=='select'" v-model="item.input.data" :placeholder="item.input.placeholder" 
							:class="item.input.class" :multiple="item.input.select.multiple" style="width:100%" 
							:disabled="item.input.disabled">
						    <el-option
						      v-for="i in item.input.select.options"
						      :key="i.value"
						      :label="i.text"
						      :value="i.value">
						    </el-option>
					  	</el-select>
							<!-- richText -->
			  			<quill-editor 
								v-if="item.input.type=='richText'"
								v-model="item.input.data"
				  			:ref="item.id"
								:class="item.input.class"
				  			:options="item.input.richText.options"
								:fileOptions="item.input.richText.fileOptions"
				  			:placeholder="item.input.placeholder"
								:disabled="item.input.disabled"
				  			 >
			  			</quill-editor>
							<!-- img -->
							<div v-if="item.input.type=='img'" 
								:class="item.input.class"  
								style="border:1px solid #ccc">
								<img v-if="item.input.data" style="max-width:100%" :src="item.input.data">
								<span @click="handleImgSelect(item)" style="cursor:pointer">{{item.input.img.label||"Click to chose a picture"}}</span>
							</div>
						</div>
						<!-- Two cols -->
						<div v-else>
							<el-row>
								<el-col :span="12">
									<quill-editor 
										v-model="item.input.twoCols.data1"
										:placeholder="item.input.twoCols.placeholder1"
						  			:options="item.input.richText.options"
										:fileOptions="item.input.richText.fileOptions"
										v-if="item.input.type=='richText'">
					  			</quill-editor>
									<el-input v-model="item.input.twoCols.data1" 
									:placeholder="item.input.twoCols.placeholder1" 
									:type="item.input.type"
									v-else
									></el-input>
								</el-col>
								<el-col :span="12">
									<quill-editor 
										v-model="item.input.twoCols.data2"
										:placeholder="item.input.twoCols.placeholder2"
						  			:options="item.input.richText.options"
										:fileOptions="item.input.richText.fileOptions"
										v-if="item.input.type=='richText'">
					  			</quill-editor>
									<el-input v-model="item.input.twoCols.data2" 
									:placeholder="item.input.twoCols.placeholder2" 
									:type="item.input.type"
									v-else></el-input>
								</el-col>
							</el-row>
						</div>
		  		</div>
					<!-- Is html just for display -->
		  		<div v-if="item.type=='html'">
		  			<div v-html="item.html.slot"></div>
		  		</div>
		  	</el-form-item>
		  </el-form>
			<!-- Buttons -->
			<div slot="footer">
				<el-button type="primary" @click="ensure()" :loading="ctrl.submitLoading">确定</el-button>
				<el-button @click="cancel()">取消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		dependencies:["EditQuillOptions"],
		props:{
			dialogData:{
				type:Object,
				required:true
			}
		},
		data(){
			return {
				bools:{
					appendToBody:false
				},
				ctrl:{
					submitLoading:this.dialogData.submitLoading
				}
			}
		},
		methods:{
			ensure:function(){
				let vm=this;
				if(this.dialogData.ensureCallback){
					if(this.testLegal()){
						this.ctrl.submitLoading=true;
					  this.dialogData.ensureCallback(this.dialogData, this.ctrl);
					}
					else{
						vm.ctrl.submitLoading=false;
						vm.handerError(0, "Have invalid data!");
					}
				}
				else{
					vm.handerError(-1, "Need have a ensureCallback function!");
				}
			},
			handerError(code, msg){
				this.dialogData.errorHander(code, msg)
			},
			cancel:function(){
				this.dialogData.visible=false;
				if(this.dialogData.cancelCallback)
					this.dialogData.cancelCallback(this.dialogData);
			},
			testLegal(){
				let items=this.dialogData.items;
				for(let i=0;i<items.length;i++){
					let item=items[i];
					if(item.type=="input"){
						// console.log(item);
						if(item.input.isTwoCols){
							let data1 = item.input.twoCols.data1;
							let data2 = item.input.twoCols.data2;
							let regText1 = item.input.twoCols.regText1;
							let regText2 = item.input.twoCols.regText2;
							// validate require
							if((item.input.twoCols.require1&&!data1)||(item.input.twoCols.require2&&!data2)){
								return false;
							}
							// validate regexp
							if(regText1){
								let reg1 = new RegExp(regText1, "i")
								if(!reg1.test(data1)){
									return false
								}
							}
							if(regText2){
								let reg2 = new RegExp(regText2, "i")
								if(!reg2.test(data2)){
									return false
								}
							}
						}
						else{
							let data = item.input.data;
							let regText = item.input.regText;
							if(item.input.require&&!data){
								return false;
							}
							if(regText){
								let reg = new RegExp(regText, "i")
								if(!reg.test(data)){
									return false
								}
							}
						}
					}
				}
				return true;
			},
			handleImgSelect(item) {
				let vm = this
				let img = item.input.img;
				let maxFileSize = img.maxFileSize || 50
        let fileExtensions = img.extensions || ['png', 'jpg', 'jpeg', 'bmp']
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
				input.click();
        input.onchange = () => {
          // just use one file upload
          const file = input.files[0];  
          // test file type
          var patt_str = "("+fileExtensions.join("|")+")";
          var patt=new RegExp(patt_str, "i");
          let haveWong=false;
					let wrongMsg="";
					let wrongCode=null;
          // console.log(patt_str, patt, file.type);
          if(!patt.test(file.type)) {
            wrongMsg = "File type is not in the extensions params!";
						haveWong=true;
						wrongCode=10;
          }
          // test file size
          if(file.size/1024/1024 > maxFileSize){
            wrongMsg = "File size exceed maxFileSize params!";
						haveWong=true;
						wrongCode=11;
          } 
          // display wrong information
          if(haveWong){
            vm.handerError(wrongCode, wrongMsg)
            return;
          }
					// save to server
					if(img.saveToServerHander){
						img.saveToServerHander(file, function(url){
							item.input.data = url;
						})
					}
					else{
						vm.handerError(-1, "Need have a saveToServerHander to img block!")
					}
        };
			}
		},
		mounted(){
			// console.log(this.dialogData, this.dialogData.errorHander)
			// if(!this.dialogData.errorHander){
			// 	alert("Vue input dialog: Need have a errorHander!")
			// }
		}
	}
</script>

<style>
/* .el-dialog__header{
  text-align:left;
} */
/* .el-dialog__body{
	padding: 20px 20px;
} */
</style>
