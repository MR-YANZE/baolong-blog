<template>
  <div class="friends-page">
    <div class="page-header">
      <h1 class="title">友情链接</h1>
      <p class="description" @click="showApplyDialog = true">欢迎与我交换友链 ꉂ(ˊᗜˋ) 点击提交你的博客</p>
    </div>

    <!-- 友链列表 -->
    <div class="friends-container">
      <el-row :gutter="20">
        <el-col v-for="friend in friendsList"
                :key="friend.id"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6">
          <div class="friend-card" @click="visitFriend(friend.link)">
            <div class="avatar">
              <img :src="friend.avatar" :alt="friend.name">
            </div>
            <div class="info">
              <h3 class="name">{{ friend.name }}</h3>
              <p class="desc">{{ friend.description }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 申请友链对话框 -->
    <el-dialog
      v-model="showApplyDialog"
      title="申请友链"
      width="600px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="apply-dialog-content">
        <!-- 我的友链信息 -->
        <div class="my-info">
          <h3>我的友链信息</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="名称">暴龙Baolong</el-descriptions-item>
            <el-descriptions-item label="介绍">分享技术与生活的点点滴滴</el-descriptions-item>
            <el-descriptions-item label="头像">https://your-avatar-url.com</el-descriptions-item>
            <el-descriptions-item label="链接">https://your-blog-url.com</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 申请要求 -->
        <div class="requirements">
          <h3>申请要求</h3>
          <el-alert
            title="申请前请确保："
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <ol class="requirements-list">
                <li>网站内容健康向上，无不良内容</li>
                <li>网站能够正常访问，加载速度正常</li>
                <li>网站已经添加本站友链</li>
                <li>网站已经建立一定时间，有原创内容</li>
              </ol>
            </template>
          </el-alert>
        </div>

        <!-- 申请表单 -->
        <div class="apply-form">
          <h3>申请表单</h3>
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="80px"
            status-icon
          >
            <el-form-item label="博客名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入您的博客名称" />
            </el-form-item>

            <el-form-item label="博客链接" prop="link">
              <el-input v-model="formData.link" placeholder="请输入您的博客链接" />
            </el-form-item>

            <el-form-item label="博客描述" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="2"
                placeholder="简单介绍一下您的博客"
              />
            </el-form-item>

            <el-form-item label="头像链接" prop="avatar">
              <el-input v-model="formData.avatar" placeholder="请输入您的头像链接" />
            </el-form-item>

            <el-form-item label="联系方式" prop="contact">
              <el-input v-model="formData.contact" placeholder="QQ/微信/邮箱，方便联系" />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交申请</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 友链数据
const friendsList = ref([
  {
    id: 1,
    name: '张洪Heo',
    description: '分享设计与科技生活',
    avatar: 'https://blog.zhheo.com/img/avatar.png',
    link: 'https://blog.zhheo.com/'
  },
  // 添加更多友链...
])

// 控制对话框显示
const showApplyDialog = ref(false)

// 表单相关
const formRef = ref(null)
const formData = ref({
  name: '',
  link: '',
  description: '',
  avatar: '',
  contact: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入博客名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  link: [
    { required: true, message: '请输入博客链接', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入博客描述', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  avatar: [
    { required: true, message: '请输入头像链接', trigger: 'blur' },
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入联系方式', trigger: 'blur' }
  ]
}

// 访问友链
const visitFriend = (link) => {
  window.open(link, '_blank')
}

// 处理取消
const handleCancel = () => {
  showApplyDialog.value = false
  formRef.value?.resetFields()
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid, fields) => {
    if (valid) {
      // TODO: 这里添加提交到后端的逻辑
      ElMessage.success('申请提交成功！我会尽快审核')
      showApplyDialog.value = false
      formRef.value.resetFields()
    } else {
      ElMessage.error('请检查表单信息是否填写正确')
    }
  })
}
</script>

<style lang="scss" scoped>
.friends-page {
  max-width: 1200px;
  margin: 0 auto;

  .page-header {
    text-align: center;
    margin-bottom: 40px;

    .title {
      font-size: 2em;
      color: var(--el-text-color-primary);
      margin-bottom: 10px;
    }

    .description {
      color: var(--el-text-color-secondary);
      margin-bottom: 20px;
      cursor: pointer;
    }
  }

  .friends-container {
    margin-bottom: 40px;

    .friend-card {
      background: var(--el-bg-color);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid var(--el-border-color);
      display: flex;
      align-items: center;
      gap: 15px;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .info {
        flex: 1;

        .name {
          margin: 0 0 5px;
          font-size: 1.1em;
          color: var(--el-text-color-primary);
        }

        .desc {
          margin: 0;
          font-size: 0.9em;
          color: var(--el-text-color-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}

.apply-dialog-content {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;

  h3 {
    margin: 0 0 15px;
    color: var(--el-text-color-primary);
    font-size: 16px;
  }

  .my-info {
    margin-bottom: 30px;
  }

  .requirements {
    margin-bottom: 30px;

    .requirements-list {
      margin: 10px 0 0;
      padding-left: 20px;

      li {
        margin-bottom: 8px;
        color: var(--el-text-color-regular);

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .apply-form {
    margin-bottom: 20px;
  }
}

// 自定义滚动条样式
.apply-dialog-content {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--el-border-color);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
}

// 响应式调整
@media screen and (max-width: 768px) {
  .friends-page {
    padding: 15px;
  }

  :deep(.el-dialog) {
    width: 90% !important;
    margin: 0 auto;
  }
}
</style>