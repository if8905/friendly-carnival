<template>
  <div class="settings-management">
    <!-- 系统设置 -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      <el-form :model="systemSettings" :rules="systemRules" ref="systemFormRef" label-width="120px">
        <el-form-item label="平台名称" prop="platformName">
          <el-input v-model="systemSettings.platformName" placeholder="请输入平台名称" />
        </el-form-item>
        <el-form-item label="平台Logo" prop="platformLogo">
          <el-input v-model="systemSettings.platformLogo" placeholder="请输入Logo图片URL" />
        </el-form-item>
        <el-form-item label="客服电话" prop="servicePhone">
          <el-input v-model="systemSettings.servicePhone" placeholder="请输入客服电话" />
        </el-form-item>
        <el-form-item label="客服邮箱" prop="serviceEmail">
          <el-input v-model="systemSettings.serviceEmail" placeholder="请输入客服邮箱" />
        </el-form-item>
        <el-form-item label="版权信息" prop="copyright">
          <el-input v-model="systemSettings.copyright" placeholder="请输入版权信息" />
        </el-form-item>
        <el-form-item label="备案号" prop="icp">
          <el-input v-model="systemSettings.icp" placeholder="请输入ICP备案号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSystemSettings">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 支付设置 -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>支付设置</span>
        </div>
      </template>
      <el-form :model="paymentSettings" :rules="paymentRules" ref="paymentFormRef" label-width="120px">
        <el-form-item label="支付宝APPID" prop="alipayAppId">
          <el-input v-model="paymentSettings.alipayAppId" placeholder="请输入支付宝APPID" />
        </el-form-item>
        <el-form-item label="支付宝私钥" prop="alipayPrivateKey">
          <el-input v-model="paymentSettings.alipayPrivateKey" type="textarea" rows="4" placeholder="请输入支付宝私钥" />
        </el-form-item>
        <el-form-item label="微信支付APPID" prop="wechatAppId">
          <el-input v-model="paymentSettings.wechatAppId" placeholder="请输入微信支付APPID" />
        </el-form-item>
        <el-form-item label="微信支付商户号" prop="wechatMchId">
          <el-input v-model="paymentSettings.wechatMchId" placeholder="请输入微信支付商户号" />
        </el-form-item>
        <el-form-item label="微信支付密钥" prop="wechatKey">
          <el-input v-model="paymentSettings.wechatKey" type="textarea" rows="4" placeholder="请输入微信支付密钥" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="savePaymentSettings">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 邮件设置 -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>邮件设置</span>
        </div>
      </template>
      <el-form :model="emailSettings" :rules="emailRules" ref="emailFormRef" label-width="120px">
        <el-form-item label="SMTP服务器" prop="smtpServer">
          <el-input v-model="emailSettings.smtpServer" placeholder="请输入SMTP服务器地址" />
        </el-form-item>
        <el-form-item label="SMTP端口" prop="smtpPort">
          <el-input-number v-model="emailSettings.smtpPort" :min="1" :max="65535" />
        </el-form-item>
        <el-form-item label="发件人邮箱" prop="senderEmail">
          <el-input v-model="emailSettings.senderEmail" placeholder="请输入发件人邮箱" />
        </el-form-item>
        <el-form-item label="邮箱密码" prop="emailPassword">
          <el-input v-model="emailSettings.emailPassword" type="password" placeholder="请输入邮箱密码或授权码" />
        </el-form-item>
        <el-form-item label="发件人名称" prop="senderName">
          <el-input v-model="emailSettings.senderName" placeholder="请输入发件人名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveEmailSettings">保存设置</el-button>
          <el-button type="success" @click="testEmail">测试邮件</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 测试邮件对话框 -->
    <el-dialog
      v-model="showTestEmailDialog"
      title="测试邮件"
      width="500px"
    >
      <el-form :model="testEmailForm" :rules="testEmailRules" ref="testEmailFormRef" label-width="100px">
        <el-form-item label="收件人邮箱" prop="recipient">
          <el-input v-model="testEmailForm.recipient" placeholder="请输入收件人邮箱" />
        </el-form-item>
        <el-form-item label="邮件主题" prop="subject">
          <el-input v-model="testEmailForm.subject" placeholder="请输入邮件主题" />
        </el-form-item>
        <el-form-item label="邮件内容" prop="content">
          <el-input type="textarea" v-model="testEmailForm.content" rows="4" placeholder="请输入邮件内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showTestEmailDialog = false">取消</el-button>
          <el-button type="primary" @click="sendTestEmail">发送测试邮件</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 系统设置
const systemFormRef = ref(null)
const systemSettings = reactive({
  platformName: '椰风纸语',
  platformLogo: '/ip-logo.jpg',
  servicePhone: '400-123-4567',
  serviceEmail: 'service@yefengzhiyu.com',
  copyright: '© 2026 椰风纸语 版权所有',
  icp: '琼ICP备12345678号'
})

const systemRules = {
  platformName: [
    { required: true, message: '请输入平台名称', trigger: 'blur' }
  ],
  platformLogo: [
    { required: true, message: '请输入平台Logo', trigger: 'blur' }
  ],
  servicePhone: [
    { required: true, message: '请输入客服电话', trigger: 'blur' }
  ],
  serviceEmail: [
    { required: true, message: '请输入客服邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  copyright: [
    { required: true, message: '请输入版权信息', trigger: 'blur' }
  ],
  icp: [
    { required: true, message: '请输入ICP备案号', trigger: 'blur' }
  ]
}

// 支付设置
const paymentFormRef = ref(null)
const paymentSettings = reactive({
  alipayAppId: '',
  alipayPrivateKey: '',
  wechatAppId: '',
  wechatMchId: '',
  wechatKey: ''
})

const paymentRules = {
  alipayAppId: [
    { required: true, message: '请输入支付宝APPID', trigger: 'blur' }
  ],
  alipayPrivateKey: [
    { required: true, message: '请输入支付宝私钥', trigger: 'blur' }
  ],
  wechatAppId: [
    { required: true, message: '请输入微信支付APPID', trigger: 'blur' }
  ],
  wechatMchId: [
    { required: true, message: '请输入微信支付商户号', trigger: 'blur' }
  ],
  wechatKey: [
    { required: true, message: '请输入微信支付密钥', trigger: 'blur' }
  ]
}

// 邮件设置
const emailFormRef = ref(null)
const emailSettings = reactive({
  smtpServer: 'smtp.qq.com',
  smtpPort: 587,
  senderEmail: '',
  emailPassword: '',
  senderName: '椰风纸语'
})

const emailRules = {
  smtpServer: [
    { required: true, message: '请输入SMTP服务器地址', trigger: 'blur' }
  ],
  smtpPort: [
    { required: true, message: '请输入SMTP端口', trigger: 'blur' }
  ],
  senderEmail: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  emailPassword: [
    { required: true, message: '请输入邮箱密码或授权码', trigger: 'blur' }
  ],
  senderName: [
    { required: true, message: '请输入发件人名称', trigger: 'blur' }
  ]
}

// 测试邮件
const showTestEmailDialog = ref(false)
const testEmailFormRef = ref(null)
const testEmailForm = reactive({
  recipient: '',
  subject: '测试邮件',
  content: '这是一封测试邮件，用于验证邮件设置是否正确。'
})

const testEmailRules = {
  recipient: [
    { required: true, message: '请输入收件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  subject: [
    { required: true, message: '请输入邮件主题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入邮件内容', trigger: 'blur' }
  ]
}

// 保存系统设置
const saveSystemSettings = async () => {
  if (!systemFormRef.value) return
  
  try {
    await systemFormRef.value.validate()
    // 模拟保存
    ElMessage.success('系统设置保存成功')
  } catch (error) {
    console.error('保存系统设置失败:', error)
  }
}

// 保存支付设置
const savePaymentSettings = async () => {
  if (!paymentFormRef.value) return
  
  try {
    await paymentFormRef.value.validate()
    // 模拟保存
    ElMessage.success('支付设置保存成功')
  } catch (error) {
    console.error('保存支付设置失败:', error)
  }
}

// 保存邮件设置
const saveEmailSettings = async () => {
  if (!emailFormRef.value) return
  
  try {
    await emailFormRef.value.validate()
    // 模拟保存
    ElMessage.success('邮件设置保存成功')
  } catch (error) {
    console.error('保存邮件设置失败:', error)
  }
}

// 测试邮件
const testEmail = () => {
  showTestEmailDialog.value = true
}

// 发送测试邮件
const sendTestEmail = async () => {
  if (!testEmailFormRef.value) return
  
  try {
    await testEmailFormRef.value.validate()
    // 模拟发送
    ElMessage.success('测试邮件发送成功')
    showTestEmailDialog.value = false
  } catch (error) {
    console.error('发送测试邮件失败:', error)
  }
}
</script>

<style scoped>
.settings-management {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  text-align: right;
}
</style>
