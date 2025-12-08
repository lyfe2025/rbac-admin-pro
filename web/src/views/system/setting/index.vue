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
import { getLockedAccounts, unlockAccount, type LockedAccount } from '@/api/system/locked'
import { useAppStore } from '@/stores/modules/app'
import {
  Save,
  RefreshCw,
  Shield,
  KeyRound,
  Globe,
  Mail,
  HardDrive,
  Clock,
  Send,
  Lock,
  Unlock,
} from 'lucide-vue-next'

const { toast } = useToast()
const appStore = useAppStore()

const loading = ref(false)
const submitLoading = ref(false)
const testMailLoading = ref(false)
const configList = ref<SysConfig[]>([])
const lockedAccounts = ref<LockedAccount[]>([])
const lockedLoading = ref(false)

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

  // 安全入口
  'sys.security.loginPath': '/login',
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
})

const configMap = ref<Record<string, SysConfig>>({})

async function getData() {
  loading.value = true
  try {
    const prefixes = [
      'sys.app.',
      'sys.account.',
      'sys.security.',
      'sys.login.',
      'sys.session.',
      'sys.mail.',
      'sys.storage.',
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
      // 刷新网站配置使其立即生效
      await appStore.refreshSiteConfig()
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
    'sys.security.loginPath': '安全登录路径',
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
  }
  return names[key] || key
}

function getConfigRemark(key: string): string {
  const remarks: Record<string, string> = {
    'sys.security.loginPath': '自定义管理后台登录页路径，增强安全性',
    'sys.login.maxRetry': '连续登录失败次数达到后锁定账户',
    'sys.login.lockTime': '账户锁定时长（分钟）',
    'sys.session.timeout': 'Token有效期（分钟）',
    'sys.mail.ssl': '是否启用SSL/TLS加密连接',
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

// 加载被锁定的账户列表
async function loadLockedAccounts() {
  lockedLoading.value = true
  try {
    const res = await getLockedAccounts() as unknown as { data: { rows: LockedAccount[]; total: number } }
    lockedAccounts.value = res.data?.rows || []
  } catch (error) {
    console.error('获取锁定账户失败:', error)
  } finally {
    lockedLoading.value = false
  }
}

// 解锁账户
async function handleUnlock(username: string) {
  try {
    await unlockAccount(username)
    toast({ title: '解锁成功', description: `账户 ${username} 已解锁` })
    await loadLockedAccounts()
  } catch (error) {
    toast({ title: '解锁失败', description: '请稍后重试', variant: 'destructive' })
  }
}

onMounted(() => {
  getData()
  loadLockedAccounts()
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
                <p class="text-xs text-muted-foreground">建议高度 32-40px，正方形或横向均可，支持 PNG/JPG/SVG</p>
              </div>
              <div class="grid gap-2">
                <Label>网站 Favicon</Label>
                <ImageUpload v-model="form['sys.app.favicon']" accept=".ico,.png,image/png,image/x-icon" />
                <p class="text-xs text-muted-foreground">建议尺寸 32x32px 或 16x16px，支持 ICO/PNG</p>
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
            <CardTitle class="flex items-center gap-2"><KeyRound class="h-5 w-5" />安全入口</CardTitle>
            <CardDescription>配置管理后台的登录页访问路径，隐藏默认入口增强安全性</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid gap-2">
              <Label>登录页路径</Label>
              <Input v-model="form['sys.security.loginPath']" placeholder="/login" />
              <p class="text-xs text-muted-foreground">
                自定义登录页访问路径，例如：/admin-login、/secure-entry 等。修改后需要使用新路径访问登录页。
              </p>
            </div>
          </CardContent>
        </Card>

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
                <p class="text-xs text-muted-foreground">无操作超过此时间后自动退出</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Lock class="h-5 w-5" />锁定账户管理
              <Button variant="ghost" size="icon" class="h-6 w-6 ml-auto" @click="loadLockedAccounts" :disabled="lockedLoading">
                <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': lockedLoading }" />
              </Button>
            </CardTitle>
            <CardDescription>查看和解锁因登录失败被锁定的账户</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="lockedLoading" class="text-center py-4 text-muted-foreground">
              加载中...
            </div>
            <div v-else-if="lockedAccounts.length === 0" class="text-center py-4 text-muted-foreground">
              暂无被锁定的账户
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="account in lockedAccounts"
                :key="account.username"
                class="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
              >
                <div class="flex items-center gap-3">
                  <Lock class="h-4 w-4 text-destructive" />
                  <div>
                    <p class="font-medium">{{ account.username }}</p>
                    <p class="text-xs text-muted-foreground">
                      剩余锁定时间：{{ Math.ceil(account.remainingSeconds / 60) }} 分钟
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" @click="handleUnlock(account.username)">
                  <Unlock class="h-4 w-4 mr-1" />解锁
                </Button>
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


    </Tabs>
  </div>
</template>
