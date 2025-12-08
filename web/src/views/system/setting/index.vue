<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast/use-toast'
import ImageUpload from '@/components/common/ImageUpload.vue'
import { listConfig, updateConfig, addConfig, type SysConfig } from '@/api/system/config'
import { testMail } from '@/api/system/mail'
import {
  Save,
  RefreshCw,
  Shield,
  KeyRound,
  Globe,
  Mail,
  HardDrive,
  FileText,
  Clock,
  Send,
  Database,
} from 'lucide-vue-next'

const { toast } = useToast()

const loading = ref(false)
const submitLoading = ref(false)
const testMailLoading = ref(false)
const configList = ref<SysConfig[]>([])

const form = reactive({
  // 网站设置
  'sys.app.name': '',
  'sys.app.description': '',
  'sys.app.copyright': '',
  'sys.app.icp': '',
  'sys.app.email': '',
  'sys.app.logo': '',
  'sys.app.favicon': '',
  // 安全设置
  'sys.account.captchaEnabled': 'false',
  'sys.account.twoFactorEnabled': 'false',

  // 登录限制
  'sys.login.maxRetry': '5',
  'sys.login.lockTime': '10',
  // 会话设置
  'sys.session.timeout': '30',
  // 邮件设置
  'sys.mail.enabled': 'false',
  'sys.mail.host': '',
  'sys.mail.port': '465',
  'sys.mail.username': '',
  'sys.mail.password': '',
  'sys.mail.from': '',
  'sys.mail.ssl': 'true',
  // 存储设置
  'sys.storage.type': 'local',
  'sys.storage.local.path': './uploads',
  'sys.storage.oss.endpoint': '',
  'sys.storage.oss.bucket': '',
  'sys.storage.oss.accessKey': '',
  'sys.storage.oss.secretKey': '',
  // 日志设置
  'sys.log.enabled': 'true',
  'sys.log.retentionDays': '30',
  'sys.log.level': 'info',
  // 备份设置
  'sys.backup.enabled': 'false',
  'sys.backup.cron': 'daily',
  'sys.backup.retention': '7',
})

const configMap = ref<Record<string, SysConfig>>({})

async function getData() {
  loading.value = true
  try {
    const prefixes = [
      'sys.app.',
      'sys.account.',
      'sys.login.',
      'sys.session.',
      'sys.mail.',
      'sys.storage.',
      'sys.log.',
      'sys.backup.',
    ]
    const results = await Promise.all(prefixes.map((p) => listConfig({ configKey: p })))
    configList.value = results.flatMap((r) => r.rows)
    // 重置 configMap
    configMap.value = {}
    configList.value.forEach((item: SysConfig) => {
      // 确保 configValue 是字符串
      const value = String(item.configValue ?? '')
      configMap.value[item.configKey] = { ...item, configValue: value }
      if (item.configKey in form) {
        ;(form as any)[item.configKey] = value
      }
    })
  } finally {
    loading.value = false
  }
}


async function handleSubmit() {
  submitLoading.value = true

  try {
    const updates: Promise<any>[] = []
    for (const [key, value] of Object.entries(form)) {
      const originalConfig = configMap.value[key]
      if (originalConfig) {
        // 配置已存在，检查是否有变化（都转为字符串比较）
        const originalValue = String(originalConfig.configValue ?? '')
        const newValue = String(value ?? '')
        if (originalValue !== newValue) {
          updates.push(updateConfig({ ...originalConfig, configValue: newValue }))
        }
      } else {
        // 配置不存在，创建新配置
        updates.push(
          addConfig({
            configName: getConfigName(key),
            configKey: key,
            configValue: value,
            configType: 'Y',
            remark: getConfigRemark(key),
          }),
        )
      }
    }

    if (updates.length === 0) {
      toast({ title: '无需保存', description: '配置未发生变化' })
      return
    }

    const results = await Promise.allSettled(updates)
    const failed = results.filter((r) => r.status === 'rejected')
    if (failed.length > 0) {
      console.error('部分配置保存失败:', failed)
      toast({
        title: '部分保存失败',
        description: `${updates.length - failed.length}/${updates.length} 项保存成功`,
        variant: 'destructive',
      })
    } else {
      toast({ title: '保存成功', description: '系统设置已更新' })
    }
    await getData()
  } catch (error) {
    console.error('保存失败:', error)
    toast({ title: '保存失败', description: '请稍后重试', variant: 'destructive' })
  } finally {
    submitLoading.value = false
  }
}

async function handleTestMail() {
  // 先保存当前配置
  await handleSubmit()
  
  testMailLoading.value = true
  try {
    const res = await testMail() as unknown as { data: { success: boolean; message: string } }
    const result = res.data
    if (result.success) {
      toast({ title: '发送成功', description: result.message || '测试邮件已发送，请检查收件箱' })
    } else {
      toast({ title: '发送失败', description: result.message || '请检查邮件配置', variant: 'destructive' })
    }
  } catch (error: any) {
    toast({ title: '发送失败', description: error?.message || '请检查邮件配置', variant: 'destructive' })
  } finally {
    testMailLoading.value = false
  }
}

function getConfigName(key: string): string {
  const names: Record<string, string> = {
    'sys.app.name': '网站名称',
    'sys.app.description': '网站描述',
    'sys.app.copyright': '版权信息',
    'sys.app.icp': 'ICP备案号',
    'sys.app.email': '联系邮箱',
    'sys.app.logo': '网站Logo',
    'sys.app.favicon': '网站图标',
    'sys.account.captchaEnabled': '验证码开关',
    'sys.account.twoFactorEnabled': '两步验证开关',

    'sys.login.maxRetry': '登录失败次数',
    'sys.login.lockTime': '账户锁定时长',
    'sys.session.timeout': '会话超时时间',
    'sys.mail.enabled': '邮件服务开关',
    'sys.mail.host': 'SMTP服务器',
    'sys.mail.port': 'SMTP端口',
    'sys.mail.username': '邮箱账号',
    'sys.mail.password': '邮箱密码',
    'sys.mail.from': '发件人地址',
    'sys.mail.ssl': 'SSL/TLS开关',
    'sys.storage.type': '存储类型',
    'sys.storage.local.path': '本地存储路径',
    'sys.storage.oss.endpoint': 'OSS端点',
    'sys.storage.oss.bucket': 'OSS存储桶',
    'sys.storage.oss.accessKey': 'OSS AccessKey',
    'sys.storage.oss.secretKey': 'OSS SecretKey',
    'sys.log.enabled': '日志记录开关',
    'sys.log.retentionDays': '日志保留天数',
    'sys.log.level': '日志级别',
    'sys.backup.enabled': '自动备份开关',
    'sys.backup.cron': '备份周期',
    'sys.backup.retention': '备份保留份数',
  }
  return names[key] || key
}

function getConfigRemark(key: string): string {
  const remarks: Record<string, string> = {

    'sys.login.maxRetry': '连续登录失败次数达到后锁定账户',
    'sys.login.lockTime': '账户锁定时长（分钟）',
    'sys.session.timeout': 'Token有效期（分钟）',
    'sys.mail.ssl': '是否启用SSL/TLS加密连接',
    'sys.backup.cron': '自动备份周期',
    'sys.backup.retention': '保留最近N份备份文件',
  }
  return remarks[key] || ''
}

function handleReset() {
  getData()
  toast({ title: '已重置', description: '表单已恢复为当前配置' })
}

// 为每个 Switch 创建计算属性，处理字符串和布尔值的转换
const captchaEnabled = computed({
  get: () => form['sys.account.captchaEnabled'] === 'true',
  set: (val: boolean) => {
    form['sys.account.captchaEnabled'] = val ? 'true' : 'false'
  }
})

const twoFactorEnabled = computed({
  get: () => form['sys.account.twoFactorEnabled'] === 'true',
  set: (val: boolean) => {
    form['sys.account.twoFactorEnabled'] = val ? 'true' : 'false'
  }
})



const mailEnabled = computed({
  get: () => form['sys.mail.enabled'] === 'true',
  set: (val: boolean) => {
    form['sys.mail.enabled'] = val ? 'true' : 'false'
  }
})

const logEnabled = computed({
  get: () => form['sys.log.enabled'] === 'true',
  set: (val: boolean) => {
    form['sys.log.enabled'] = val ? 'true' : 'false'
  }
})

const backupEnabled = computed({
  get: () => form['sys.backup.enabled'] === 'true',
  set: (val: boolean) => {
    form['sys.backup.enabled'] = val ? 'true' : 'false'
  }
})

onMounted(() => {
  getData()
})
</script>


<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">系统设置</h2>
        <p class="text-muted-foreground">管理系统的各项配置参数</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="handleReset" :disabled="submitLoading">
          <RefreshCw class="mr-2 h-4 w-4" />重置
        </Button>
        <Button @click="handleSubmit" :disabled="submitLoading">
          <Save class="mr-2 h-4 w-4" />保存设置
        </Button>
      </div>
    </div>

    <Tabs default-value="site" class="space-y-4">
      <TabsList>
        <TabsTrigger value="site"><Globe class="h-4 w-4 mr-2" />网站设置</TabsTrigger>
        <TabsTrigger value="security"><Shield class="h-4 w-4 mr-2" />安全设置</TabsTrigger>
        <TabsTrigger value="mail"><Mail class="h-4 w-4 mr-2" />邮件设置</TabsTrigger>
        <TabsTrigger value="storage"><HardDrive class="h-4 w-4 mr-2" />存储设置</TabsTrigger>
        <TabsTrigger value="log"><FileText class="h-4 w-4 mr-2" />日志备份</TabsTrigger>
      </TabsList>

      <!-- 网站设置 -->
      <TabsContent value="site" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>配置网站的公开展示信息</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label>网站名称</Label>
                <Input v-model="form['sys.app.name']" placeholder="请输入网站名称" />
              </div>
              <div class="grid gap-2">
                <Label>联系邮箱</Label>
                <Input v-model="form['sys.app.email']" placeholder="support@example.com" />
              </div>
            </div>
            <div class="grid gap-2">
              <Label>网站描述</Label>
              <Textarea v-model="form['sys.app.description']" placeholder="请输入网站描述" rows="2" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label>网站 Logo</Label>
                <ImageUpload v-model="form['sys.app.logo']" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" />
                <p class="text-xs text-muted-foreground">建议尺寸：200x50px，支持 PNG/JPG/SVG</p>
              </div>
              <div class="grid gap-2">
                <Label>网站 Favicon</Label>
                <ImageUpload v-model="form['sys.app.favicon']" accept=".ico,.png,image/png,image/x-icon" />
                <p class="text-xs text-muted-foreground">建议尺寸：32x32px，支持 ICO/PNG</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>页脚信息</CardTitle>
            <CardDescription>配置网站底部的版权和备案信息</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-2">
              <Label>版权信息</Label>
              <Input v-model="form['sys.app.copyright']" placeholder="© 2025 RBAC Admin. All rights reserved." />
            </div>
            <div class="grid gap-2">
              <Label>ICP 备案号</Label>
              <Input v-model="form['sys.app.icp']" placeholder="例如：京ICP备12345678号" />
            </div>
          </CardContent>
        </Card>

      </TabsContent>


      <!-- 安全设置 -->
      <TabsContent value="security" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>登录安全</CardTitle>
            <CardDescription>配置用户登录相关的安全选项</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-base flex items-center gap-2"><KeyRound class="h-4 w-4" />登录验证码</Label>
                <p class="text-sm text-muted-foreground">开启后，用户登录时需要输入图形验证码</p>
              </div>
              <Switch v-model:checked="captchaEnabled" />
            </div>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-base flex items-center gap-2"><Shield class="h-4 w-4" />两步验证</Label>
                <p class="text-sm text-muted-foreground">开启后，用户可以绑定手机或邮箱进行二次验证</p>
              </div>
              <Switch v-model:checked="twoFactorEnabled" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2"><Clock class="h-5 w-5" />登录限制与会话</CardTitle>
            <CardDescription>配置登录失败锁定和会话超时</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="grid gap-2">
                <Label>失败锁定次数</Label>
                <Input v-model="form['sys.login.maxRetry']" type="number" min="1" max="10" />
                <p class="text-xs text-muted-foreground">连续失败N次后锁定</p>
              </div>
              <div class="grid gap-2">
                <Label>锁定时长（分钟）</Label>
                <Input v-model="form['sys.login.lockTime']" type="number" min="1" />
              </div>
              <div class="grid gap-2">
                <Label>会话超时（分钟）</Label>
                <Input v-model="form['sys.session.timeout']" type="number" min="5" />
                <p class="text-xs text-muted-foreground">Token 有效期</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>


      <!-- 邮件设置 -->
      <TabsContent value="mail" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>SMTP 配置</CardTitle>
            <CardDescription>配置邮件发送服务，用于发送验证码、通知等邮件</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between pb-4 border-b">
              <div class="space-y-0.5">
                <Label class="text-base">启用邮件服务</Label>
                <p class="text-sm text-muted-foreground">开启后系统可发送邮件通知</p>
              </div>
              <Switch v-model:checked="mailEnabled" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="grid gap-2">
                <Label>SMTP 服务器</Label>
                <Input v-model="form['sys.mail.host']" placeholder="smtp.qq.com" />
              </div>
              <div class="grid gap-2">
                <Label>SMTP 端口</Label>
                <Input v-model="form['sys.mail.port']" placeholder="465" />
              </div>
              <div class="grid gap-2">
                <Label>SSL/TLS</Label>
                <Select v-model="form['sys.mail.ssl']">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">启用 SSL</SelectItem>
                    <SelectItem value="false">不启用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label>邮箱账号</Label>
                <Input v-model="form['sys.mail.username']" placeholder="登录邮箱账号" />
                <p class="text-xs text-muted-foreground">用于登录 SMTP 服务器的认证账号</p>
              </div>
              <div class="grid gap-2">
                <Label>邮箱密码/授权码</Label>
                <Input v-model="form['sys.mail.password']" type="password" placeholder="邮箱密码或授权码" />
                <p class="text-xs text-muted-foreground">QQ/163 等邮箱需使用授权码，非登录密码</p>
              </div>
            </div>

            <div class="grid gap-2">
              <Label>发件人地址</Label>
              <Input v-model="form['sys.mail.from']" placeholder="noreply@example.com" />
              <p class="text-xs text-muted-foreground">收件人看到的发件人，QQ 邮箱需与账号一致</p>
            </div>

            <div class="pt-4 border-t">
              <Button variant="outline" @click="handleTestMail" :disabled="testMailLoading">
                <Send class="mr-2 h-4 w-4" />测试发送
              </Button>
              <p class="text-xs text-muted-foreground mt-2">发送测试邮件到发件人地址，验证配置是否正确</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- 存储设置 -->
      <TabsContent value="storage" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>文件存储</CardTitle>
            <CardDescription>配置系统文件的存储方式</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-2">
              <Label>存储类型</Label>
              <Select v-model="form['sys.storage.type']">
                <SelectTrigger><SelectValue placeholder="选择存储类型" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">本地存储</SelectItem>
                  <SelectItem value="s3">AWS S3</SelectItem>
                  <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                  <SelectItem value="oss">阿里云 OSS</SelectItem>
                  <SelectItem value="cos">腾讯云 COS</SelectItem>
                  <SelectItem value="r2">Cloudflare R2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div v-if="form['sys.storage.type'] === 'local'" class="grid gap-2">
              <Label>存储路径</Label>
              <Input v-model="form['sys.storage.local.path']" placeholder="./uploads" />
              <p class="text-xs text-muted-foreground">文件存储的本地目录路径</p>
            </div>

            <div v-else class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label>服务端点 (Endpoint)</Label>
                  <Input
                    v-model="form['sys.storage.oss.endpoint']"
                    :placeholder="form['sys.storage.type'] === 's3' ? 's3.us-east-1.amazonaws.com' : form['sys.storage.type'] === 'gcs' ? 'storage.googleapis.com' : form['sys.storage.type'] === 'oss' ? 'oss-cn-hangzhou.aliyuncs.com' : form['sys.storage.type'] === 'cos' ? 'cos.ap-guangzhou.myqcloud.com' : 'xxxx.r2.cloudflarestorage.com'"
                  />
                </div>
                <div class="grid gap-2">
                  <Label>存储桶 (Bucket)</Label>
                  <Input v-model="form['sys.storage.oss.bucket']" placeholder="my-bucket" />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label>{{ form['sys.storage.type'] === 'r2' ? 'Access Key ID' : 'AccessKey ID' }}</Label>
                  <Input v-model="form['sys.storage.oss.accessKey']" placeholder="LTAI5t..." />
                </div>
                <div class="grid gap-2">
                  <Label>{{ form['sys.storage.type'] === 'r2' ? 'Secret Access Key' : 'AccessKey Secret' }}</Label>
                  <Input v-model="form['sys.storage.oss.secretKey']" type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>


      <!-- 日志备份 -->
      <TabsContent value="log" class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>日志配置</CardTitle>
            <CardDescription>配置系统操作日志的记录方式</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between pb-4 border-b">
              <div class="space-y-0.5">
                <Label class="text-base">启用日志记录</Label>
                <p class="text-sm text-muted-foreground">开启后系统会记录用户的操作日志</p>
              </div>
              <Switch v-model:checked="logEnabled" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label>日志保留天数</Label>
                <Input v-model="form['sys.log.retentionDays']" type="number" placeholder="30" />
                <p class="text-xs text-muted-foreground">超过保留天数的日志将被自动清理</p>
              </div>
              <div class="grid gap-2">
                <Label>日志级别</Label>
                <Select v-model="form['sys.log.level']">
                  <SelectTrigger><SelectValue placeholder="选择日志级别" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug - 调试</SelectItem>
                    <SelectItem value="info">Info - 信息</SelectItem>
                    <SelectItem value="warn">Warn - 警告</SelectItem>
                    <SelectItem value="error">Error - 错误</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2"><Database class="h-5 w-5" />数据备份</CardTitle>
            <CardDescription>配置系统数据的自动备份</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between pb-4 border-b">
              <div class="space-y-0.5">
                <Label class="text-base">启用自动备份</Label>
                <p class="text-sm text-muted-foreground">开启后系统会定期自动备份数据库</p>
              </div>
              <Switch v-model:checked="backupEnabled" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label>备份周期</Label>
                <Select v-model="form['sys.backup.cron']">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">每小时</SelectItem>
                    <SelectItem value="daily">每天</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="monthly">每月</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="grid gap-2">
                <Label>保留份数</Label>
                <Input v-model="form['sys.backup.retention']" type="number" min="1" />
                <p class="text-xs text-muted-foreground">保留最近N份备份文件</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
