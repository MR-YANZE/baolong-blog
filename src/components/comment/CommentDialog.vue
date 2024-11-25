<template>
    <el-dialog v-model="dialogVisible" :title="replyTo ? `回复 @${replyTo.user.name}` : '发表评论'" width="500px"
        :close-on-click-modal="false">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="0">
            <!-- 用户信息输入区域 -->
            <div class="user-info-inputs">
                <el-input v-model="form.nickname" placeholder="请输入昵称"
                    :class="{ 'is-error': showError && !form.nickname.trim() }">
                    <template #prepend>昵称</template>
                </el-input>
                <el-input v-model="form.email" placeholder="请输入邮箱"
                    :class="{ 'is-error': showError && !isValidEmail(form.email) }">
                    <template #prepend>邮箱</template>
                </el-input>
                <el-input v-model="form.website" placeholder="请输入网址（选填）">
                    <template #prepend>网址</template>
                </el-input>
            </div>

            <!-- 评论内容输入 -->
            <div class="comment-input-wrapper">
                <el-input v-model="form.content" type="textarea" :rows="4" placeholder="写下你的评论..."
                    :autosize="{ minRows: 4, maxRows: 8 }" ref="textareaRef" />
                <div class="emoji-trigger">
                    <el-button type="text" @click.stop="showEmoji = !showEmoji" :class="{ active: showEmoji }">
                        <svg viewBox="0 0 24 24" width="20" height="20" class="emoji-icon">
                            <path fill="currentColor"
                                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-1.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM8.5 11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-3.5 5.5c-2.5 0-4.5-1.5-4.5-3h9c0 1.5-2 3-4.5 3z" />
                        </svg>
                    </el-button>
                    <div class="emoji-panel" v-if="showEmoji" @click.stop>
                        <div class="emoji-list">
                            <span v-for="emoji in emojiList" :key="emoji" @click="insertEmoji(emoji)"
                                class="emoji-item">
                                {{ emoji }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="submitting">
                    发表评论
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
    visible: Boolean,
    replyTo: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['update:visible', 'submit'])

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const formRef = ref(null)
const submitting = ref(false)
const textareaRef = ref(null)
const showEmoji = ref(false)

// 尝试从本地存储获取用户信息
const savedUserInfo = JSON.parse(localStorage.getItem('commentUserInfo') || '{}')

const form = ref({
    nickname: '',
    email: '',
    website: '',
    content: ''
})

const rules = {
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入评论内容', trigger: 'blur' },
        { min: 2, max: 500, message: '长度在 2 到 500 个字符', trigger: 'blur' }
    ]
}

// 表情列表
const emojiList = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘',
    '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤',
    '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭',
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❤️‍🔥', '❤️‍🩹', '💖', '💗', '💓'
]

const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        submitting.value = true

        // 构建评论数据
        const commentData = {
            ...form.value,
            replyTo: props.replyTo
        }

        emit('submit', commentData)
        handleCancel()
    } catch (error) {
        // 表单验证失败
    } finally {
        submitting.value = false
    }
}

const handleCancel = () => {
    // 重置表单
    form.value = {
        nickname: '',
        email: '',
        website: '',
        content: ''
    }

    // 关闭表情面板
    showEmoji.value = false

    // 关闭弹窗
    dialogVisible.value = false
}

// 监听弹窗关闭事件，确保内容被清空
watch(dialogVisible, (newVal) => {
    if (!newVal) {
        handleCancel()
    }
})

// 插入表情
const insertEmoji = (emoji) => {
    if (!form.value.content) {
        form.value.content = ''
    }
    const textarea = textareaRef.value?.$el.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = form.value.content

    form.value.content = text.substring(0, start) + emoji + text.substring(end)

    // 设置光标位置
    setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + emoji.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
    })

    // 立即关闭表情面板
    showEmoji.value = false
}

// 处理点击外部关闭表情面板
const handleClickOutside = (event) => {
    const emojiTrigger = document.querySelector('.emoji-trigger')
    if (emojiTrigger && !emojiTrigger.contains(event.target)) {
        showEmoji.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.user-info-inputs {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;

    :deep(.el-input) {
        .el-input__wrapper {
            box-shadow: none !important;
            background: var(--el-fill-color-light);
        }

        .el-input-group__prepend {
            background: var(--el-fill-color);
            border: none;
            box-shadow: none;
            color: var(--el-text-color-regular);
            padding: 0 12px;
        }

        &.is-error {
            .el-input__wrapper {
                box-shadow: 0 0 0 1px var(--el-color-danger) inset !important;
            }
        }

        input {
            outline: none !important;
            border: none !important;
            -webkit-appearance: none;

            &:focus {
                outline: none !important;
                border: none !important;
                box-shadow: none !important;
            }
        }
    }
}

.comment-input-wrapper {
    position: relative;

    :deep(.el-textarea) {
        .el-textarea__inner {
            background: var(--el-fill-color-light);
            box-shadow: none !important;
            border: none;
            border-radius: 8px;
            padding: 16px;
            font-size: 14px;
            transition: all 0.3s;
            resize: none;
            min-height: 100px;
            outline: none !important;

            &:focus {
                background: var(--el-bg-color);
                box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
            }

            &::placeholder {
                color: var(--el-text-color-secondary);
            }
        }
    }

    .emoji-trigger {
        position: absolute;
        right: 8px;
        bottom: 8px;
        z-index: 1;

        .el-button {
            padding: 6px;
            height: auto;
            border: none;
            line-height: 1;

            .emoji-icon {
                color: var(--el-text-color-secondary);
                transition: all 0.3s;
            }

            &:hover .emoji-icon {
                color: var(--el-color-primary);
                transform: scale(1.1);
            }

            &.active .emoji-icon {
                color: var(--el-color-primary);
            }
        }

        .emoji-panel {
            position: absolute;
            bottom: 100%;
            right: 0;
            background: var(--el-bg-color);
            border: 1px solid var(--el-border-color-lighter);
            border-radius: 8px;
            padding: 8px;
            margin-bottom: 8px;
            box-shadow: var(--el-box-shadow-light);
            z-index: 1000;

            .emoji-list {
                display: grid;
                grid-template-columns: repeat(10, 1fr);
                gap: 4px;
                width: 400px;
                height: 200px;
                overflow-y: auto;
                padding: 4px;

                &::-webkit-scrollbar {
                    width: 4px;
                }

                &::-webkit-scrollbar-thumb {
                    background: var(--el-border-color-lighter);
                    border-radius: 2px;
                }

                .emoji-item {
                    cursor: pointer;
                    padding: 4px;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;

                    &:hover {
                        background: var(--el-color-primary-light-9);
                        border-radius: 4px;
                        transform: scale(1.2);
                    }
                }
            }

            &::before {
                content: '';
                position: absolute;
                bottom: -6px;
                right: 12px;
                width: 12px;
                height: 12px;
                background: var(--el-bg-color);
                border-right: 1px solid var(--el-border-color-lighter);
                border-bottom: 1px solid var(--el-border-color-lighter);
                transform: rotate(45deg);
            }
        }
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .el-button {
        padding: 8px 24px;
        font-size: 14px;

        &.el-button--primary {
            background: var(--el-color-primary);
            border: none;

            &:hover {
                background: var(--el-color-primary-light-3);
            }

            &:disabled {
                background: var(--el-color-primary-light-5);
                color: white;
                cursor: not-allowed;
            }
        }
    }
}

:deep(.el-dialog) {
    border-radius: 8px;
    overflow: hidden;

    .el-dialog__header {
        margin: 0;
        padding: 20px;
        border-bottom: 1px solid var(--el-border-color-lighter);

        .el-dialog__title {
            font-size: 16px;
            font-weight: 500;
            color: var(--el-text-color-primary);
        }

        .el-dialog__close {
            color: var(--el-text-color-secondary);
            font-size: 18px;

            &:hover {
                color: var(--el-color-primary);
                transform: rotate(90deg);
                transition: all 0.3s;
            }
        }
    }

    .el-dialog__body {
        padding: 20px;
    }

    .el-dialog__footer {
        margin: 0;
        padding: 20px;
        border-top: 1px solid var(--el-border-color-lighter);
    }
}

// 移动端适配
@media screen and (max-width: 768px) {
    :deep(.el-dialog) {
        width: 90% !important;
        margin: 0 auto;
    }

    .emoji-trigger {
        .emoji-panel {
            .emoji-list {
                width: 300px;
                height: 160px;
            }
        }
    }
}
</style>
