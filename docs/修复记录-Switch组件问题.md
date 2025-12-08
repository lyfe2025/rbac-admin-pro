# Switch 组件问题修复

## 问题描述
系统设置页面中的验证码开关（以及其他 Switch 开关）在保存后无法正确更新状态。

## 根本原因
1. **数据类型不匹配**：Switch 组件需要布尔值（`true`/`false`），但后端存储的是字符串（`'true'`/`'false'`）
2. **绑定方式不当**：使用 `:model-value` 和 `@update:model-value` 的方式在响应式更新时存在问题

## 解决方案
使用 Vue 3 的计算属性（computed）来处理布尔值和字符串之间的双向转换：

```typescript
const captchaEnabled = computed({
  get: () => form['sys.account.captchaEnabled'] === 'true',
  set: (val: boolean) => {
    form['sys.account.captchaEnabled'] = val ? 'true' : 'false'
  }
})
```

然后在模板中使用 `v-model:checked` 绑定：

```vue
<Switch v-model:checked="captchaEnabled" />
```

## 修复的开关
- ✅ 登录验证码开关 (`sys.account.captchaEnabled`)
- ✅ 两步验证开关 (`sys.account.twoFactorEnabled`)
- ✅ 用户注册开关 (`sys.account.registerEnabled`)
- ✅ 邮件服务开关 (`sys.mail.enabled`)
- ✅ 日志记录开关 (`sys.log.enabled`)
- ✅ 自动备份开关 (`sys.backup.enabled`)

## 参考文档
- [shadcn-vue Switch 组件文档](https://www.shadcn-vue.com/docs/components/switch)
- [Vue 3 Computed 文档](https://vuejs.org/guide/essentials/computed.html)

## 测试建议
1. 打开系统设置页面
2. 切换任意开关
3. 点击"保存设置"按钮
4. 刷新页面，确认开关状态正确保持
