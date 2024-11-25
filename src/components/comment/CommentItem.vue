<template>
    <div class="comment-item">
        <el-avatar :size="40" :src="comment.user.avatar" class="user-avatar" />
        <div class="comment-content">
            <div class="comment-header">
                <div class="user-info">
                    <span class="username">{{ comment.user.name }}</span>
                    <template v-if="isReply && comment.replyTo">
                        <span class="reply-text">回复</span>
                        <span class="reply-to">@{{ comment.replyTo.name }}</span>
                    </template>
                    <el-tag size="small" class="location-tag" type="primary">
                        <el-icon>
                            <Location />
                        </el-icon>
                        中国
                    </el-tag>
                    <span class="time">
                        <el-icon>
                            <Clock />
                        </el-icon>
                        {{ formatDate(comment.createTime) }}
                    </span>
                </div>
                <el-button type="text" size="small" @click="$emit('like', comment)" class="like-btn">
                    <span :class="['heart-icon', { 'is-liked': comment.liked }]">
                        {{ comment.liked ? '❤️' : '🤍' }}
                    </span>
                    {{ comment.likes }}
                </el-button>
            </div>

            <div class="comment-text" v-html="formatContent(comment.content)"></div>

            <div class="comment-footer">
                <div class="actions">
                    <el-button type="text" size="small" @click="$emit('reply', comment)" class="action-btn">
                        <el-icon>
                            <ChatLineRound />
                        </el-icon>
                        回复
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ChatLineRound } from '@element-plus/icons-vue'
import CommentDialog from './CommentDialog.vue'
import dayjs from 'dayjs'

defineProps({
    comment: {
        type: Object,
        required: true
    },
    isReply: {
        type: Boolean,
        default: false
    }
})

defineEmits(['reply', 'like'])

// 格式化日期
const formatDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化评论内容，支持表情显示
const formatContent = (content) => {
    if (!content) return ''
    // 将换行符转换为 <br>
    return content.replace(/\n/g, '<br>')
}
</script>

<style lang="scss" scoped>
.comment-item {
    padding: 16px 0;
    display: flex;
    gap: 16px;

    &:hover {
        background-color: var(--el-fill-color-light);
        transition: background-color 0.3s ease;
    }

    .user-avatar {
        flex-shrink: 0;
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &:hover {
            transform: rotate(360deg);
        }
    }

    .comment-content {
        flex: 1;
        min-width: 0;

        .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .user-info {
                display: flex;
                align-items: center;
                gap: 8px;

                .username {
                    font-size: 16px;
                    font-weight: bold;
                    color: var(--el-color-primary);

                    &:hover {
                        color: var(--el-color-primary-light-3);
                    }
                }

                .reply-text {
                    color: var(--el-text-color-secondary);
                    font-size: 14px;
                }

                .reply-to {
                    color: var(--el-color-primary);
                    font-weight: 500;
                    cursor: pointer;

                    &:hover {
                        color: var(--el-color-primary-light-3);
                    }
                }

                .location-tag {
                    margin-left: 8px;
                    font-size: 12px;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 0 8px;
                    height: 22px;
                    border: none;
                    background: var(--el-fill-color-light);
                    color: var(--el-text-color-secondary);

                    .el-icon {
                        font-size: 12px;
                    }

                    &:hover {
                        background: var(--el-fill-color);
                    }
                }

                .time {
                    color: var(--el-text-color-secondary);
                    font-size: 12px;
                    opacity: 0.8;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    margin-left: 8px;
                }
            }

            .like-btn {
                padding: 4px 8px;
                height: auto;
                color: var(--el-text-color-secondary);
                transition: all 0.3s;
                display: inline-flex;
                align-items: center;
                gap: 4px;

                &:hover {
                    color: #ff6b6b;
                    background: rgba(255, 107, 107, 0.1);
                    border-radius: 4px;
                }

                .heart-icon {
                    font-size: 14px;
                    transition: transform 0.3s;

                    &.is-liked {
                        color: #ff6b6b;
                        animation: heartBeat 0.3s ease-in-out;
                    }

                    &:hover {
                        transform: scale(1.2);
                    }
                }
            }
        }

        .comment-text {
            font-size: 14px;
            line-height: 1.8;
            color: var(--el-text-color-regular);
            margin: 8px 0;
            word-break: break-all;
            white-space: pre-wrap;
            padding: 0 4px;
        }

        .comment-footer {
            .actions {
                display: flex;
                gap: 16px;

                .action-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 8px;
                    height: auto;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                    transition: all 0.3s;

                    .el-icon {
                        font-size: 14px;
                    }

                    &:hover {
                        color: var(--el-color-primary);
                        background: var(--el-color-primary-light-9);
                        border-radius: 4px;
                    }
                }
            }
        }
    }
}

@keyframes heartBeat {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.3);
    }

    100% {
        transform: scale(1);
    }
}
</style>