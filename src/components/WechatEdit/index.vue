<template>
    <div class="editor-viewer">
        <div class="content-viewer">
            <div class="content-list">
                <div v-for="(content, index) in contentList" class="editor-item"
                    :key="index" :tabindex="index" @mouseover="handleMouseIn(index, content)"
                    @mouseout="handleMouseOut(index, content)">
                    <div class="textarea" contenteditable="true" v-if="content.type === 'text'" >
                        {{content.value}}
                    </div>
                    <!-- <textarea v-if="content.type === 'text'" v-model="content.value"></textarea> -->
                    <img v-if="content.type === 'image'" :src="content.value">
                    <div class="add-module" v-if="content.type === 'empty'">
                        <el-button @click="change2Text(index)">A</el-button>
                        <el-upload :data="{index: index}"
                            class="el-button"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="false"
                            :on-success="handleUploadSuccess" 
                            :before-upload="beforeImageUpload" titlr="只能上传jpg/png文件，且不超过2M">
                            <i class="el-icon-picture" ></i>
                        </el-upload>
                        <el-button @click="delOne(index)" icon="el-icon-delete"></el-button>
                    </div>
                    <div class="editor-item-ops" v-if="content.type !== 'empty' " v-show="content.visible">
                        <el-button icon="el-icon-plus" circle @click="beginAdd(index)"></el-button>
                        <el-button icon="el-icon-arrow-down" v-if="contentList.length > 1 && index !== contentList.length - 1" 
                            circle @click="moveDown(index)"></el-button>
                        <el-button icon="el-icon-arrow-up" circle  v-if="contentList.length > 1 && index !== 0"
                            @click="moveUp(index)"></el-button>
                        <el-button icon="el-icon-delete" circle @click="delOne(index, true)"></el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="editor-btn-viewer">
            <el-button class="editor-btn" icon="el-icon-circle-check-outline"
                @click="finishEdit"> 完成编辑</el-button>
            <el-button class="editor-btn" icon="el-icon-circle-plus-outline" @click="addAtLast"> 添加模块</el-button>
        </div>
        
    </div>
</template>
 
<script>
import {Upload} from 'element-ui'
export default {
    data () {
        return {
            contentList: []
        }
    },
    props: ['contents'],
    components: {
        ElUpload: Upload
    },
    methods: {
        spliceContent (start, count, added) {
            if (typeof added !== 'undefined') {
                return this.contentList.splice(start, count, added)
            } else {
                return this.contentList.splice(start, count)
            }
        },
        addAtLast () {
            this.contentList.push({type: 'empty', value: '', visible: false})
        },
        beginAdd (index) {
            this.spliceContent(index+1, 0, {type: 'empty', value: '', visible: false}) 
        },
        moveDown (index) {
            let cur = this.spliceContent(index, 1)
            this.spliceContent(index + 1, 0, cur[0])
        },
        moveUp (index) {
            let cur = this.spliceContent(index, 1)
            this.spliceContent(index - 1, 0, cur[0])
        },
        delOne (index, delImage = false) {
            this.spliceContent(index, 1)
            if (delImage) {
                // todo: 需要删除内容服务器上的图片文件
            }
        },
        change2Text (index) {
            this.spliceContent(index, 1, {type: 'text', value: '', visible: false})
        },
        change2Image (index) {
            this.spliceContent(index, 1, {type: 'image', value: '', visible: false})
        },
        handleUploadSuccess(res, file) {
            // res 需要返回附加data：index
            let imageUrl = URL.createObjectURL(file.raw);
            this.spliceContent(res.index, 1, {type: 'image', value: imageUrl, visible: false})
        },
        beforeImageUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            console.info(file)
            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleMouseIn (index) {
            let item = this.contentList[index];
            item.visible = true;
            this.spliceContent(index, 1, item);
        },
        handleMouseOut (index) {
            let item = this.contentList[index];
            item.visible = false;
            this.spliceContent(index, 1, item);
        },
        finishEdit () {
 
        }
    },
    mounted () {
        this.contentList = this.contents.map(el => {
            el.visible = false;
            return el;
        });
    }
}
</script>
<style scoped>
.editor-viewer {
    width: 600px;
    height: 600px;
    border: 1px solid #ddd;
    position: relative;
}
.content-viewer {
    width: 100%;
    height: 552px;
    overflow-y: scroll;
    overflow-x: hidden;
}
.editor-btn-viewer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
}
.el-button {
    background-color: #eee;
}
.editor-btn{
    width: 50%;
    padding: 15px;
    outline: none;
    border: 1px solid #ddd;
    border-radius: 0;
    margin: 0;
    font-size: 16px;
}
.el-button:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
}
.content-list {
    padding: 5px;
}
.editor-item +.editor-item{
    margin-top: 5px;
}
.editor-item {  
    position: relative;
}
div.editor-item:hover{
    box-shadow: 0 0 10px #ccc;
 
}
.editor-item>.textarea, 
 .editor-item>img{
    width: 100%;
    height: auto;
    border: 1px solid #ccc;
    min-height: 200px;
    text-align: left;
}
.editor-item>img{
    width: 571px;
}
.editor-item>textarea{
    resize: none;
}
.editor-item-ops {
    height: 50px;
    position: absolute;
    right: 6px;
    bottom: 0;
    z-index:100;
}
.editor-item-ops > .editor-btn {
    background-color: #666;
}
.add-module {
    border: 1px dashed #ccc;
    min-height: 100px;
    width: 100%;
    line-height: 100px;
}
</style>