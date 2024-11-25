<template>
    <div class="share-buttons">
        <el-popover placement="top" :width="200" trigger="hover" v-model:visible="qrcodeVisible">
            <template #reference>
                <el-button class="share-btn wechat" circle>
                    <el-icon>
                        <ChatRound />
                    </el-icon>
                </el-button>
            </template>
            <div class="qrcode-container">
                <vue-qrcode :value="url" :options="{ width: 180 }" />
                <div class="qrcode-tip">微信扫码分享</div>
            </div>
        </el-popover>

        <el-button class="share-btn weibo" circle @click="shareToWeibo">
            <el-icon>
                <Share />
            </el-icon>
        </el-button>

        <el-popover placement="top" :width="200" trigger="click" v-model:visible="linkCopied">
            <template #reference>
                <el-button class="share-btn link" circle @click="copyLink">
                    <el-icon>
                        <Link />
                    </el-icon>
                </el-button>
            </template>
            <div class="copy-tip">
                链接已复制到剪贴板
            </div>
        </el-popover>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChatRound, Share, Link } from '@element-plus/icons-vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { ElMessage } from 'element-plus'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: ''
    }
})

const qrcodeVisible = ref(false)
const linkCopied = ref(false)

// 分享到微博
const shareToWeibo = () => {
    const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(props.url)}&title=${encodeURIComponent(props.title)}&pic=&appkey=`
    window.open(weiboUrl, '_blank')
}

// 复制链接
const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(props.url)
        linkCopied.value = true
        setTimeout(() => {
            linkCopied.value = false
        }, 2000)
        ElMessage.success('链接已复制')
    } catch (err) {
        ElMessage.error('复制失败，请手动复制')
    }
}
</script>

<style lang="scss" scoped>
.share-buttons {
    display: flex;
    gap: 12px;

    .share-btn {
        color: #fff;

        &.wechat {
            --el-button-bg-color: #07c160;
            --el-button-border-color: #07c160;
            --el-button-hover-bg-color: #06ae56;
            --el-button-hover-border-color: #06ae56;
            --el-button-hover-color: #fff;
            --el-button-active-color: #fff;
        }

        &.weibo {
            --el-button-bg-color: #e6162d;
            --el-button-border-color: #e6162d;
            --el-button-hover-bg-color: #cf1429;
            --el-button-hover-border-color: #cf1429;
            --el-button-hover-color: #fff;
            --el-button-active-color: #fff;
        }

        &.link {
            --el-button-bg-color: #909399;
            --el-button-border-color: #909399;
            --el-button-hover-bg-color: #82848a;
            --el-button-hover-border-color: #82848a;
            --el-button-hover-color: #fff;
            --el-button-active-color: #fff;
        }
    }
}

.qrcode-container {
    text-align: center;

    .qrcode-tip {
        margin-top: 8px;
        color: var(--text-secondary);
        font-size: 14px;
    }
}

.copy-tip {
    text-align: center;
    color: var(--el-color-success);
}
</style>