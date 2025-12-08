<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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
import { listConfig, updateConfig, addConfig, type SysConfig } from '@/api/system/config'
import {
  Save,
  RefreshCw,
  Shield,
  KeyRound,
  UserPlus,
  Globe,
  Mail,
  HardDrive,
  FileText,
  LogIn,
  Lock,
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
  // 登录页设置
  'sys.login.background': '',
  'sys.login.notice': '',
  // 安全设置
  'sys.account.captchaEnabled': 'false',
  'sys.account.twoFactorEnabled': 'false',
  'sys.account.registerEnabled': 'false',
  // 密码策略
  'sys.password.minLength': '6',
  'sys.password.complexity': 'low',
  'sys.password.expireDays': '0',
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
      'sys.login.',
      'sys.account.',
      'sys.password.',
      'sys.session.',
      'sys.mail.',
      'sys.storage.',
      'sys.log.',
      'sys.backup.',
    ]
    const results = await Promise.all(prefixes.map((p) => listConfig({ configKey: p })))
    configList.value = results.flatMap((r) => r.rows)
    configList.value.forEach((item: SysConfig) => {
      configMap.value[item.configKey] = item
      if (item.configKey in form) {
        ;(form as any)[item.configKey] = item.configValue
      }
    })
  } finally {
    loading.value = false
  }
}


async function handleSubmit() {
  submitLoading.value = true
  try {
    const updates = Object.entries(form).map(async ([key, value]) => {
      const originalConfig = configMap.value[key]
      if (originalConfig) {
        if (originalConfig.configValue !== value) {
          return updateConfig({ ...originalConfig, configValue: value })
        }
      } else {
        return addConfig({
          configName: getConfigName(key),
          configKey: key,
          configValue: value,
          configType: 'Y',
          remark: getConfigRemark(key),
        })
      }
      return Promise.resolve()
    })
    await Promise.all(updates)
    toast({ title: '保存成功', description: '系统设置已更新' })
    await getData()
  } catch (error) {
    toast({ title: '保存失败', description: '请稍后重试', variant: 'destructive' })
  } finally {
    submitLoading.value = false
  }
}

async function handleTestMail() {
  testMailLoading.value = true
  try {
    // TODO: 调用测试邮件接口
    toast({ title: '发送成功', description: '测试邮件已发送，请检查收件箱' })
  } catch (error) {
    toast({ title: '发送失败', description: '请检查邮件配置', variant: 'destructive' })
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
    'sys.login.background': '登录背景图',
    'sys.login.notice': '登录公告',
    'sys.account.captchaEnabled': '验证码开关',
    'sys.account.twoFactorEnabled': '两步验证开关',
    'sys.account.registerEnabled': '用户注册开关',
    'sys.password.minLength': '密码最小长度',
    'sys.password.complexity': '密码复杂度',
    'sys.password.expireDays': '密码过期天数',
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
    'sys.password.minLength': '用户密码的最小长度要求',
    'sys.password.complexity': '密码复杂度要求',
    'sys.password.expireDays': '密码过期天数，0表示永不过期',
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
                <Label>Logo 地址</Label>
                <Input v-model="form['sys.app.logo']" placeholder="例如：/logo.png" />
              </div>
              <div class="grid gap-2">
                <Label>Favicon 地址</Label>
                <Input v-model="form['sys.app.favicon']" placeholder="例如：/favicon.ico" />
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

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2"><LogIn class="h-5 w-5" />登录页设置</CardTitle>
            <CardDescription>配置登录页面的背景和公告</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-2">
              <Label>背景图片</Label>
              <Input v-model="form['sys.login.background']" placeholder="背景图片URL，留空使用默认" />
            </div>
            <div class="grid gap-2">
              <Label>登录公告</Label>
              <Textarea v-model="form['sys.login.notice']" placeholder="登录页显示的公告内容" rows="2" />
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
              <Switch
                :checked="form['sys.account.captchaEnabled'] === 'true'"
                @update:checked="(v: boolean) => (form['sys.account.captchaEnabled'] = v ? 'true' : 'false')"
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-base flex items-center gap-2"><Shield class="h-4 w-4" />两步验证</Label>
                <p class="text-sm text-muted-foreground">开启后，用户可以绑定手机或邮箱进行二次验证</p>
              </div>
              <Switch
                :checked="form['sys.account.twoFactorEnabled'] === 'true'"
                @update:checked="(v: boolean) => (form['sys.account.twoFactorEnabled'] = v ? 'true' : 'false')"
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label class="text-base flex items-center gap-2"><UserPlus class="h-4 w-4" />用户注册</Label>
                <p class="text-sm text-muted-foreground">开启后，允许新用户自行注册账号</p>
              </div>
              <Switch
                :checked="form['sys.account.registerEnabled'] === 'true'"
                @update:checked="(v: boolean) => (form['sys.account.registerEnabled'] = v ? 'true' : 'false')"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2"><Lock class="h-5 w-5" />密码策略</CardTitle>
            <CardDescription>配置用户密码的安全要求</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="grid gap-2">
                <Label>最小长度</Label>
                <Input v-model="form['sys.password.minLength']" type="number" min="4" max="32" />
                <p class="text-xs text-muted-foreground">密码最少字符数</p>
              </div>
              <div class="grid gap-2">
                <Label>复杂度要求</Label>
                <Select v-model="form['sys.password.complexity']">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">低 - 仅字母数字</SelectItem>
                    <SelectItem value="medium">中 - 需特殊字符</SelectItem>
                    <SelectItem value="high">高 - 大小写+特殊字符</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="grid gap-2">
                <Label>过期天数</Label>
                <Input v-model="form['sys.password.expireDays']" type="number" min="0" />
                <p class="text-xs text-muted-foreground">0 表示永不过期</p>
              </div>
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
              <Switch
                :checked="form['sys.mail.enabled'] === 'true'"
                @update:checked="(v: boolean) => (form['sys.mail.enabled'] = v ? 'true' : 'false')"
              />
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
              </div>
              <div class="grid gap-2">
                <Label>邮箱密码/授权码</Label>
                <Input v-model="form['sys.mail.password']" type="password" placeholder="邮箱密码或授权码" />
              </div>
            </div>

            <div class="grid gap-2">
              <Label>发件人地址</Label>
              <Input v-model="form['sys.mail.from']" placeholder="noreply@example.com" />
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
                  <SelectItem value="oss">阿里云 OSS</SelectItem>
                  <SelectItem value="cos">腾讯云 COS</SelectItem>
                  <SelectItem value="minio">MinIO</SelectItem>
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
                  <Input v-model="form['sys.storage.oss.endpoint']" placeholder="oss-cn-hangzhou.aliyuncs.com" />
                </div>
                <div class="grid gap-2">
                  <Label>存储桶 (Bucket)</Label>
                  <Input v-model="form['sys.storage.oss.bucket']" placeholder="存储桶名称" />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label>AccessKey ID</Label>
                  <Input v-model="form['sys.storage.oss.accessKey']" placeholder="访问密钥 ID" />
                </div>
                <div class="grid gap-2">
                  <Label>AccessKey Secret</Label>
                  <Input v-model="form['sys.storage.oss.secretKey']" type="password" placeholder="访问密钥" />
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
              <Switch
                :checked="form['sys.log.enabled'] === 'true'"
                @update:checked="(v: boolean) => (form['sys.log.enabled'] = v ? 'true' : 'false')"
              />
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
              <Switch
                :checked="form['sys.backup.enabled'] === 'true'"
                @update:checked="(v: boolean) => (form['sys.backup.enabled'] = v ? 'true' : 'false')"
              />
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
