<template>
    <div class="comment-section">
        <el-card class="comment-card">
            <template #header>
                <div class="card-header">
                    <span>评论 ({{ totalComments }})</span>
                </div>
            </template>

            <!-- 评论输入框 -->
            <div class="comment-editor">
                <el-avatar :size="40" :src="currentUser.avatar" class="user-avatar" />
                <div class="editor-wrapper">
                    <!-- 用户信息输入区域 -->
                    <div class="user-info-inputs" v-if="showUserInfo">
                        <div class="input-row">
                            <el-input v-model="userInfo.nickname" placeholder="必填"
                                :class="{ 'is-error': showError && !userInfo.nickname.trim() }">
                                <template #prepend>昵称</template>
                            </el-input>
                            <el-input v-model="userInfo.email" placeholder="必填"
                                :class="{ 'is-error': showError && !isValidEmail(userInfo.email) }">
                                <template #prepend>邮箱</template>
                            </el-input>
                            <el-input v-model="userInfo.website" placeholder="请输入网址（选填）">
                                <template #prepend>网址</template>
                            </el-input>
                        </div>
                    </div>

                    <!-- 评论内容输入 -->
                    <div class="comment-input-wrapper">
                        <el-input v-model="commentContent" type="textarea" :rows="3" placeholder="✍️ 发一条友善的评论"
                            :disabled="!isLoggedIn" resize="none" ref="textareaRef" @focus="showUserInfo = true" />
                        <!-- 表情 -->
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
                    <div class="editor-footer">
                        <el-button type="primary" :disabled="!canSubmit" @click="handleSubmit" class="submit-btn" round>
                            发表评论
                        </el-button>
                    </div>
                </div>
            </div>

            <!-- 评论列表 -->
            <div class="comment-list" v-if="comments.length > 0">
                <div v-for="comment in comments" :key="comment.id" class="comment-thread">
                    <comment-item :comment="comment" @reply="handleReply" @like="handleLike" />
                    <div v-if="comment.replies && comment.replies.length > 0" class="reply-list">
                        <comment-item v-for="reply in comment.replies" :key="reply.id" :comment="reply" :is-reply="true"
                            @reply="handleReply" @like="handleLike" />
                    </div>
                </div>
            </div>

            <!-- 空状态 -->
            <el-empty v-else description="暂无评论" />

            <!-- 加载更多评论 -->
            <div v-if="hasMore" class="load-more">
                <el-button :loading="loading" @click="loadMore" class="load-more-btn" text>
                    加载更多评论
                </el-button>
            </div>
        </el-card>
    </div>

    <!-- 回复弹框 -->
    <comment-dialog v-model:visible="dialogVisible" :reply-to="comment" @submit="handleReplySubmit" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Close } from '@element-plus/icons-vue'
import CommentItem from './CommentItem.vue'
import CommentDialog from './CommentDialog.vue'

const showUserInfo = ref(false)
const showError = ref(false)
const userInfo = ref({
    nickname: '',
    email: '',
    website: ''
})

// 验证邮箱
const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

// 判断是否可以提交
const canSubmit = computed(() => {
    return commentContent.value.trim() &&
        userInfo.value.nickname.trim() &&
        isValidEmail(userInfo.value.email)
})


// 处理提交
const handleSubmit = async () => {
    showError.value = true
    if (!canSubmit.value) return

    // 提交评论
    await submitComment()

    // 重置状态
    showError.value = false
    showUserInfo.value = false

    // 清空表单
    userInfo.value = {
        nickname: '',
        email: '',
        website: ''
    }
    commentContent.value = ''
}

// 提交评论方法
const submitComment = async () => {
    const newComment = {
        id: Date.now(),
        content: commentContent.value,
        createTime: new Date().toLocaleString(),
        user: {
            ...currentUser,
            name: userInfo.value.nickname,
            email: userInfo.value.email,
            website: userInfo.value.website
        },
        likes: 0,
        liked: false,
        replies: []
    }

    comments.value.unshift(newComment)
    commentContent.value = ''
}

// 模拟当前用户数据
const currentUser = {
    id: 1,
    name: '游客',
    avatar: 'https://picsum.photos/200'
}

// 模拟登录状态
const isLoggedIn = ref(true)

// 评论相关数据
const commentContent = ref('')
const comments = ref([
    {
        id: 1,
        content: '这是一条测试评论这是一条测试评论这是一条测试评论这是一条测试评论这是一条测试评论',
        createTime: '2024-01-15 12:00:00',
        user: {
            id: 2,
            name: '张三',
            avatar: 'https://picsum.photos/200'
        },
        likes: 5,
        liked: false,
        replies: [
            {
                id: 2,
                content: '回复测试评论回复测试评论回复测试评论回复测试评论',
                createTime: '2024-01-15 12:30:00',
                user: {
                    id: 3,
                    name: '李四',
                    avatar: 'https://picsum.photos/200'
                },
                replyTo: {
                    id: 2,
                    name: '张三'
                },
                likes: 2,
                liked: false
            }
        ],
        hasMore: true
    }
])

const loading = ref(false)
const hasMore = ref(true)
const totalComments = computed(() => {
    let total = comments.value.length
    comments.value.forEach(comment => {
        total += comment.replies?.length || 0
    })
    return total
})

// 处理点赞
const handleLike = (comment) => {
    comment.liked = !comment.liked
    comment.likes += comment.liked ? 1 : -1
}

// 加载更多评论
const loadMore = async () => {
    if (loading.value) return

    loading.value = true
    // 模拟加载更多评论
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 模拟没有更多评论
    hasMore.value = false
    loading.value = false
}

// 加载更多回复
const loadMoreReplies = async (commentId) => {
    const comment = comments.value.find(c => c.id === commentId)
    if (!comment) return

    // 模拟加载更多回复
    const newReplies = [
        {
            id: Date.now(),
            content: '加载的更多回复内容加载的更多回复内容',
            createTime: new Date().toLocaleString(),
            user: {
                id: 4,
                name: '王五',
                avatar: 'https://picsum.photos/200'
            },
            replyTo: {
                id: comment.user.id,
                name: comment.user.name
            },
            likes: 0,
            liked: false
        }
    ]

    comment.replies.push(...newReplies)
    comment.hasMore = false
}

// 处理登录
const handleLogin = () => {
    console.log('Handle login')
    // TODO: 实现登录功能
}

// 回复相关
const dialogVisible = ref(false)
const replyTo = ref(null)
const isMainComment = ref(false) // 新增：标记是否为主评论
// 处理评论按钮点击
const handleComment = () => {
    isMainComment.value = true
    replyTo.value = null
    dialogVisible.value = true
}
// 处理回复按钮点击
const handleReply = (comment) => {
    isMainComment.value = false
    replyTo.value = comment
    dialogVisible.value = true
}
// 处理评论/回复提交
const handleReplySubmit = (data) => {
    const newComment = {
        id: Date.now(),
        content: data.content,
        createTime: new Date().toISOString(),
        user: {
            id: Date.now(),
            name: data.nickname,
            avatar: 'https://picsum.photos/200',
            email: data.email,
            website: data.website
        },
        likes: 0,
        liked: false,
        replies: []
    }

    if (isMainComment.value) {
        // 添加主评论
        comments.value.unshift(newComment)
    } else {
        // 添加回复
        // 首先找到主评论
        const mainComment = comments.value.find(comment => {
            // 检查是否是主评论本身或者是主评论的回复
            return comment.id === replyTo.value.id ||
                comment.replies?.some(reply => reply.id === replyTo.value.id)
        })

        if (mainComment) {
            if (!mainComment.replies) {
                mainComment.replies = []
            }
            // 设置回复对象
            newComment.replyTo = {
                id: replyTo.value.user.id,
                name: replyTo.value.user.name
            }
            // 添加到主评论的回复列表中
            mainComment.replies.push(newComment)
        }
    }

    // 保存用户信息到本地存储
    localStorage.setItem('commentUserInfo', JSON.stringify({
        nickname: data.nickname,
        email: data.email,
        website: data.website
    }))

    // 关闭弹框并重置状态
    dialogVisible.value = false
    replyTo.value = null
    isMainComment.value = false
}

const showEmoji = ref(false)
const textareaRef = ref(null)

// 表情列表
const emojiList = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘',
    '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤',
    '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭',
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❤️‍🔥', '❤️‍🩹', '💖', '💗', '💓'
]
// 插入表情
const insertEmoji = (emoji) => {
    if (!commentContent.value) {
        commentContent.value = ''
    }
    const textarea = textareaRef.value?.$el.querySelector('textarea')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = commentContent.value

    commentContent.value = text.substring(0, start) + emoji + text.substring(end)

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
.comment-section {
    .comment-card {
        border-radius: 8px;
        margin-bottom: 24px;
        box-shadow: var(--el-box-shadow-light);

        :deep(.el-card__header) {
            padding: 16px 20px;
            border-bottom: 1px solid var(--el-border-color-lighter);

            .card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 16px;
                font-weight: 500;
                color: var(--el-text-color-primary);
            }
        }

        :deep(.el-card__body) {
            padding: 20px 0;
        }
    }

    .comment-editor {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        padding: 0 20px;

        .user-avatar {
            flex-shrink: 0;
            border: 2px solid transparent;
            transition: all 0.3s ease;

            &:hover {
                transform: rotate(360deg);
            }
        }

        .editor-wrapper {
            flex: 1;

            .user-info-inputs {
                margin-bottom: 12px;

                .input-row {
                    display: flex;
                    gap: 12px;

                    :deep(.el-input) {
                        flex: 1;

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

            .editor-footer {
                display: flex;
                justify-content: flex-end;
                margin-top: 12px;

                .submit-btn {
                    padding: 8px 24px;
                    font-size: 14px;
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
    }

    .comment-list {
        padding: 0 20px;

        .comment-thread {
            &:not(:last-child) {
                border-bottom: 1px solid var(--el-border-color-lighter);
                margin-bottom: 20px;
                padding-bottom: 20px;
            }
        }

        .reply-list {
            position: relative;
            margin: 8px 0 8px 56px;
            padding: 12px 0 0 24px;
            border-left: 2px solid var(--el-border-color-lighter);

            :deep(.comment-item) {
                padding: 12px 0;

                &:last-child {
                    padding-bottom: 0;
                }

                &:first-child {
                    padding-top: 0;
                }
            }
        }
    }

    .load-more {
        text-align: center;
        margin-top: 20px;

        .load-more-btn {
            color: var(--el-text-color-secondary);
            font-size: 14px;

            &:hover {
                color: var(--el-color-primary);
            }
        }
    }
}
</style>
