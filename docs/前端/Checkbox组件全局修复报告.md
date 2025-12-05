# Checkbox 组件全局修复报告

> **完成时间:** 2025-12-05  
> **任务:** 确保所有 Checkbox 使用正确的事件绑定

---

## 🔍 问题排查

### 搜索范围
- `web/src/views/` - 所有视图文件
- `web/src/components/` - 所有组件文件

### 搜索关键词
1. `Checkbox.*:checked` - 查找使用 `:checked` 的地方
2. `Checkbox.*@update:checked` - 查找使用 `@update:checked` 的地方

---

## ✅ 修复的文件

### 1. 用户表单组件
**文件:** `web/src/components/business/UserForm.vue`

**修复内容:**
- 岗位选择 Checkbox
- 角色选择 Checkbox

```vue
<!-- 修复前 -->
<Checkbox
  :checked="formData.postIds?.includes(post.postId)"
  @update:checked="(checked: boolean) => togglePost(post.postId, checked)"
/>

<!-- 修复后 -->
<Checkbox
  :model-value="formData.postIds?.includes(post.postId)"
  @update:model-value="(val) => togglePost(post.postId, !!val)"
/>
```

### 2. 角色管理页面
**文件:** `web/src/views/system/role/index.vue`

**修复内容:**
- 菜单树组件中的 Checkbox (MenuTreeItem)
- 父子联动开关 Checkbox

```vue
<!-- 修复前 - 菜单树 -->
<Checkbox :checked="isChecked" @update:checked="toggle" />

<!-- 修复后 - 菜单树 -->
<Checkbox :model-value="isChecked" @update:model-value="toggle" />

<!-- 修复前 - 父子联动 -->
<Checkbox 
  id="checkStrictly" 
  :checked="form.menuCheckStrictly" 
  @update:checked="(val: boolean) => form.menuCheckStrictly = val" 
/>

<!-- 修复后 - 父子联动 -->
<Checkbox 
  id="checkStrictly" 
  :model-value="form.menuCheckStrictly" 
  @update:model-value="(val) => form.menuCheckStrictly = !!val" 
/>
```

### 3. 代码生成工具
**文件:** `web/src/views/tool/build/utils/code-generator.ts`

**修复内容:**
- 生成的 Checkbox 代码模板

```typescript
// 修复前
componentCode = `
  <Checkbox :checked="componentField.value" @update:checked="componentField.onChange" />
`

// 修复后
componentCode = `
  <Checkbox :model-value="componentField.value" @update:model-value="componentField.onChange" />
`
```

---

## 📊 修复统计

| 文件 | 修复数量 | 类型 |
|------|---------|------|
| UserForm.vue | 2 | 岗位选择、角色选择 |
| role/index.vue | 2 | 菜单树、父子联动开关 |
| code-generator.ts | 1 | 代码生成模板 |
| **总计** | **5** | - |

---

## 🎯 Checkbox 正确用法规范

### 基本用法

根据 [reka-ui 官方文档](https://reka-ui.com/docs/components/checkbox):

#### 1. 受控组件 (Controlled)

```vue
<script setup>
import { ref } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'

const checked = ref(false)
</script>

<template>
  <Checkbox 
    :model-value="checked"
    @update:model-value="(val) => checked = !!val"
  />
</template>
```

#### 2. 非受控组件 (Uncontrolled)

```vue
<template>
  <Checkbox :default-value="true" />
</template>
```

#### 3. v-model 简写

```vue
<script setup>
import { ref } from 'vue'

const checked = ref(false)
</script>

<template>
  <Checkbox v-model="checked" />
</template>
```

### 属性和事件对照表

| 用途 | ❌ 错误 | ✅ 正确 |
|------|---------|---------|
| 绑定值 | `:checked` | `:model-value` 或 `v-model` |
| 更新事件 | `@update:checked` | `@update:model-value` |
| 默认值 | `:default-checked` | `:default-value` |

### 类型处理

```typescript
// Checkbox 的 modelValue 类型
type CheckboxValue = boolean | 'indeterminate'

// 在事件处理中转换为 boolean
@update:model-value="(val) => handleChange(!!val)"
```

---

## 🔧 常见场景

### 场景1: 列表多选

```vue
<script setup>
const selectedIds = ref<string[]>([])

function toggleItem(id: string, checked: boolean) {
  if (checked) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value = selectedIds.value.filter(i => i !== id)
  }
}
</script>

<template>
  <div v-for="item in items" :key="item.id">
    <Checkbox
      :model-value="selectedIds.includes(item.id)"
      @update:model-value="(val) => toggleItem(item.id, !!val)"
    />
    {{ item.name }}
  </div>
</template>
```

### 场景2: 全选/取消全选

```vue
<script setup>
const selectAll = ref(false)
const selectedRows = ref<string[]>([])

watch(selectAll, (newVal) => {
  if (newVal) {
    selectedRows.value = allRows.value.map(r => r.id)
  } else {
    selectedRows.value = []
  }
})
</script>

<template>
  <!-- 全选 -->
  <Checkbox v-model="selectAll" />
  
  <!-- 单选 -->
  <Checkbox
    v-for="row in allRows"
    :key="row.id"
    :model-value="selectedRows.includes(row.id)"
    @update:model-value="() => toggleRow(row.id)"
  />
</template>
```

### 场景3: 树形结构

```vue
<script setup>
const checkedIds = ref<string[]>([])

function isChecked(nodeId: string) {
  return checkedIds.value.includes(nodeId)
}

function toggle(nodeId: string) {
  const index = checkedIds.value.indexOf(nodeId)
  if (index > -1) {
    checkedIds.value.splice(index, 1)
  } else {
    checkedIds.value.push(nodeId)
  }
}
</script>

<template>
  <TreeNode
    v-for="node in treeData"
    :key="node.id"
  >
    <Checkbox
      :model-value="isChecked(node.id)"
      @update:model-value="() => toggle(node.id)"
    />
    {{ node.name }}
  </TreeNode>
</template>
```

---

## ✅ 验证清单

### 功能验证
- [x] 用户表单 - 岗位全选功能正常
- [x] 用户表单 - 岗位单选功能正常
- [x] 用户表单 - 角色全选功能正常
- [x] 用户表单 - 角色单选功能正常
- [x] 角色管理 - 菜单树选择正常
- [x] 角色管理 - 父子联动开关正常
- [x] 代码生成器 - 生成的代码正确

### 代码质量
- [x] TypeScript 类型检查通过
- [x] 无 ESLint 错误
- [x] 无运行时错误

---

## 📝 开发规范

### 1. 使用 Checkbox 前必读

在使用 Checkbox 组件前,请确认:

1. ✅ 使用 `:model-value` 而不是 `:checked`
2. ✅ 使用 `@update:model-value` 而不是 `@update:checked`
3. ✅ 处理 `indeterminate` 状态,使用 `!!val` 转换
4. ✅ 优先使用 `v-model` 简化代码

### 2. Code Review 检查点

在代码审查时,检查:

- [ ] 是否使用了 `:checked` 属性?
- [ ] 是否使用了 `@update:checked` 事件?
- [ ] 类型转换是否正确?
- [ ] 是否可以简化为 `v-model`?

### 3. 迁移指南

如果发现旧代码使用了错误的绑定:

```vue
<!-- 步骤1: 找到错误用法 -->
<Checkbox :checked="value" @update:checked="handler" />

<!-- 步骤2: 替换属性名 -->
<Checkbox :model-value="value" @update:model-value="handler" />

<!-- 步骤3: 添加类型转换(如果需要) -->
<Checkbox 
  :model-value="value" 
  @update:model-value="(val) => handler(!!val)" 
/>

<!-- 步骤4: 简化为 v-model(如果可能) -->
<Checkbox v-model="value" />
```

---

## 🎓 参考资料

### 官方文档
- [Reka UI - Checkbox](https://reka-ui.com/docs/components/checkbox)
- [shadcn-vue - Checkbox](https://www.shadcn-vue.com/docs/components/checkbox)

### 相关文档
- [用户管理优化完成](/docs/前端/用户管理优化完成.md)
- [全局日期格式化和表单修复](/docs/前端/全局日期格式化和表单修复.md)

---

## 🚀 后续建议

### 1. 建立组件使用规范
- [ ] 创建组件使用文档
- [ ] 添加常见场景示例
- [ ] 建立最佳实践指南

### 2. 代码质量保障
- [ ] 添加 ESLint 规则检测错误用法
- [ ] 添加单元测试
- [ ] 建立 CI/CD 检查

### 3. 开发者培训
- [ ] 组织技术分享会
- [ ] 更新开发文档
- [ ] 建立问题反馈机制

---

**修复完成时间:** 2025-12-05  
**修复者:** 开发团队  
**TypeScript 检查:** ✅ 通过  
**影响范围:** 3 个文件,5 处修复
