<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'
import { listConfig, updateConfig, type SysConfig } from '@/api/system/config'
import { Save, RefreshCw } from 'lucide-vue-next'

const { toast } = useToast()

// State
const loading = ref(false)
const submitLoading = ref(false)
const configList = ref<SysConfig[]>([])

// Form Data
const form = reactive({
  'sys.app.name': '',
  'sys.app.description': '',
  'sys.app.copyright': '',
  'sys.app.icp': '',
  'sys.app.email': ''
})

// Mapping for easy access to config objects
const configMap = ref<Record<string, SysConfig>>({})

// Fetch Data
async function getData() {
  loading.value = true
  try {
    // Fetch all configs and filter for app settings
    const res = await listConfig({ configKey: 'sys.app.' })
    configList.value = res.rows
    
    // Map configs for easy access and fill form
    configList.value.forEach((item: SysConfig) => {
      configMap.value[item.configKey] = item
      if (item.configKey in form) {
        // @ts-ignore
        form[item.configKey as keyof typeof form] = item.configValue
      }
    })
  } finally {
    loading.value = false
  }
}

// Submit
async function handleSubmit() {
  submitLoading.value = true
  try {
    // Update each config item
    const updates = Object.entries(form).map(([key, value]) => {
      const originalConfig = configMap.value[key]
      if (originalConfig && originalConfig.configValue !== value) {
        return updateConfig({
          ...originalConfig,
          configValue: value
        })
      }
      return Promise.resolve()
    })

    await Promise.all(updates)
    toast({ title: "保存成功", description: "系统设置已更新" })
    
    // Refresh data to ensure sync
    await getData()
  } catch (error) {
    toast({ title: "保存失败", description: "请稍后重试", variant: "destructive" })
  } finally {
    submitLoading.value = false
  }
}

function handleReset() {
  getData()
  toast({ title: "已重置", description: "表单已恢复为当前配置" })
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
        <p class="text-muted-foreground">
          设置系统的基本信息，如网站名称、版权、备案号等
        </p>
      </div>
    </div>

    <div class="grid gap-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>网站信息</CardTitle>
          <CardDescription>
            配置网站的公开展示信息。
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-2">
            <Label for="appName">网站名称</Label>
            <Input id="appName" v-model="form['sys.app.name']" placeholder="请输入网站名称" />
            <p class="text-xs text-muted-foreground">
              显示在浏览器标签页和系统顶部的名称。
            </p>
          </div>
          
          <div class="grid gap-2">
            <Label for="appDesc">网站描述</Label>
            <Textarea id="appDesc" v-model="form['sys.app.description']" placeholder="请输入网站描述" rows="3" />
            <p class="text-xs text-muted-foreground">
              用于 SEO 优化的网站描述信息。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>页脚设置</CardTitle>
          <CardDescription>
            配置网站底部的版权和备案信息。
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-2">
            <Label for="copyright">版权信息</Label>
            <Input id="copyright" v-model="form['sys.app.copyright']" placeholder="例如：© 2023 RBAC Admin. All rights reserved." />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="icp">ICP 备案号</Label>
              <Input id="icp" v-model="form['sys.app.icp']" placeholder="例如：京ICP备12345678号" />
            </div>
            <div class="grid gap-2">
              <Label for="email">联系邮箱</Label>
              <Input id="email" v-model="form['sys.app.email']" placeholder="例如：support@example.com" />
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-between border-t px-6 py-4">
           <Button variant="outline" @click="handleReset" :disabled="submitLoading">
            <RefreshCw class="mr-2 h-4 w-4" />
            重置
          </Button>
          <Button @click="handleSubmit" :disabled="submitLoading">
            <Save class="mr-2 h-4 w-4" />
            保存设置
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
