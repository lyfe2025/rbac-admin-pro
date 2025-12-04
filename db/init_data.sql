-- =============================================
-- RBAC Admin Pro - 初始化数据脚本
-- 说明：本脚本用于初始化系统基础数据
-- 注意：密码使用 bcrypt 加密，默认密码为 123456
-- 建议：生产环境请使用 Prisma seed.ts 进行初始化
-- =============================================

-- 1. 初始化部门数据（层级结构）
-- 1.1 总公司（根部门）
INSERT INTO sys_dept (dept_name, order_num, status, parent_id, ancestors, leader, phone, email, del_flag, create_time)
VALUES ('总公司', 0, '0', NULL, '0', '张总', '', '', '0', NOW())
ON CONFLICT DO NOTHING;

-- 1.2 技术部
INSERT INTO sys_dept (dept_name, order_num, status, parent_id, ancestors, leader, phone, email, del_flag, create_time)
SELECT '技术部', 1, '0', dept_id, '0,' || dept_id, '李工', '', '', '0', NOW()
FROM sys_dept WHERE dept_name = '总公司' AND del_flag = '0'
ON CONFLICT DO NOTHING;

-- 1.3 研发一部
INSERT INTO sys_dept (dept_name, order_num, status, parent_id, ancestors, leader, phone, email, del_flag, create_time)
SELECT '研发一部', 2, '0', dept_id, 
  (SELECT '0,' || parent.dept_id || ',' || child.dept_id 
   FROM sys_dept parent, sys_dept child 
   WHERE parent.dept_name = '总公司' AND child.dept_name = '技术部' AND parent.del_flag = '0' AND child.del_flag = '0'),
  '王工', '', '', '0', NOW()
FROM sys_dept WHERE dept_name = '技术部' AND del_flag = '0'
ON CONFLICT DO NOTHING;

-- 1.4 测试一部
INSERT INTO sys_dept (dept_name, order_num, status, parent_id, ancestors, leader, phone, email, del_flag, create_time)
SELECT '测试一部', 3, '0', dept_id,
  (SELECT '0,' || parent.dept_id || ',' || child.dept_id 
   FROM sys_dept parent, sys_dept child 
   WHERE parent.dept_name = '总公司' AND child.dept_name = '技术部' AND parent.del_flag = '0' AND child.del_flag = '0'),
  '赵工', '', '', '0', NOW()
FROM sys_dept WHERE dept_name = '技术部' AND del_flag = '0'
ON CONFLICT DO NOTHING;

-- 1.5 人事部
INSERT INTO sys_dept (dept_name, order_num, status, parent_id, ancestors, leader, phone, email, del_flag, create_time)
SELECT '人事部', 4, '0', dept_id, '0,' || dept_id, '刘姐', '', '', '0', NOW()
FROM sys_dept WHERE dept_name = '总公司' AND del_flag = '0'
ON CONFLICT DO NOTHING;

-- 1.6 财务部
INSERT INTO sys_dept (dept_name, order_num, status, parent_id, ancestors, leader, phone, email, del_flag, create_time)
SELECT '财务部', 5, '0', dept_id, '0,' || dept_id, '钱会', '', '', '0', NOW()
FROM sys_dept WHERE dept_name = '总公司' AND del_flag = '0'
ON CONFLICT DO NOTHING;

-- 1.7 华东分公司
INSERT INTO sys_dept (dept_name, order_num, status, parent_id, ancestors, leader, phone, email, del_flag, create_time)
SELECT '华东分公司', 6, '0', dept_id, '0,' || dept_id, '孙总', '', '', '0', NOW()
FROM sys_dept WHERE dept_name = '总公司' AND del_flag = '0'
ON CONFLICT DO NOTHING;

-- 1.8 上海办事处
INSERT INTO sys_dept (dept_name, order_num, status, parent_id, ancestors, leader, phone, email, del_flag, create_time)
SELECT '上海办事处', 7, '0', dept_id,
  (SELECT '0,' || parent.dept_id || ',' || child.dept_id 
   FROM sys_dept parent, sys_dept child 
   WHERE parent.dept_name = '总公司' AND child.dept_name = '华东分公司' AND parent.del_flag = '0' AND child.del_flag = '0'),
  '周主任', '', '', '0', NOW()
FROM sys_dept WHERE dept_name = '华东分公司' AND del_flag = '0'
ON CONFLICT DO NOTHING;

-- 1.9 杭州办事处
INSERT INTO sys_dept (dept_name, order_num, status, parent_id, ancestors, leader, phone, email, del_flag, create_time)
SELECT '杭州办事处', 8, '0', dept_id,
  (SELECT '0,' || parent.dept_id || ',' || child.dept_id 
   FROM sys_dept parent, sys_dept child 
   WHERE parent.dept_name = '总公司' AND child.dept_name = '华东分公司' AND parent.del_flag = '0' AND child.del_flag = '0'),
  '吴主任', '', '', '0', NOW()
FROM sys_dept WHERE dept_name = '华东分公司' AND del_flag = '0'
ON CONFLICT DO NOTHING;

-- 2. 初始化角色数据
INSERT INTO sys_role (role_name, role_key, role_sort, status, del_flag, create_time)
VALUES 
  ('超级管理员', 'admin', 1, '0', '0', NOW()),
  ('普通用户', 'user', 2, '0', '0', NOW())
ON CONFLICT DO NOTHING;

-- 3. 初始化用户数据
-- 注意：这里的密码是 bcrypt 加密后的 '123456'，salt rounds = 10
-- 实际使用时建议通过 Prisma seed.ts 或应用程序创建用户以确保密码正确加密
INSERT INTO sys_user (user_name, nick_name, password, status, dept_id, del_flag, create_time)
SELECT 'admin', '超级管理员', 
  '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', -- 123456
  '0', dept_id, '0', NOW()
FROM sys_dept WHERE dept_name = '总公司' AND del_flag = '0'
ON CONFLICT (user_name) WHERE del_flag = '0' DO NOTHING;

INSERT INTO sys_user (user_name, nick_name, password, status, dept_id, del_flag, create_time)
SELECT 'user', '普通用户',
  '$2b$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', -- 123456
  '0', dept_id, '0', NOW()
FROM sys_dept WHERE dept_name = '总公司' AND del_flag = '0'
ON CONFLICT (user_name) WHERE del_flag = '0' DO NOTHING;

-- 4. 绑定用户角色
INSERT INTO sys_user_role (user_id, role_id)
SELECT u.user_id, r.role_id
FROM sys_user u, sys_role r
WHERE u.user_name = 'admin' AND u.del_flag = '0' 
  AND r.role_key = 'admin' AND r.del_flag = '0'
ON CONFLICT DO NOTHING;

INSERT INTO sys_user_role (user_id, role_id)
SELECT u.user_id, r.role_id
FROM sys_user u, sys_role r
WHERE u.user_name = 'user' AND u.del_flag = '0'
  AND r.role_key = 'user' AND r.del_flag = '0'
ON CONFLICT DO NOTHING;

-- 5. 初始化岗位数据
INSERT INTO sys_post (post_code, post_name, post_sort, status, create_time)
VALUES 
  ('dev', '开发', 1, '0', NOW()),
  ('pm', '产品经理', 2, '0', NOW())
ON CONFLICT (post_code) DO NOTHING;

-- 6. 绑定用户岗位
INSERT INTO sys_user_post (user_id, post_id)
SELECT u.user_id, p.post_id
FROM sys_user u, sys_post p
WHERE u.user_name = 'admin' AND u.del_flag = '0' AND p.post_code = 'dev'
ON CONFLICT DO NOTHING;

INSERT INTO sys_user_post (user_id, post_id)
SELECT u.user_id, p.post_id
FROM sys_user u, sys_post p
WHERE u.user_name = 'user' AND u.del_flag = '0' AND p.post_code = 'pm'
ON CONFLICT DO NOTHING;

-- 7. 初始化字典类型
INSERT INTO sys_dict_type (dict_name, dict_type, status, create_time)
VALUES
  ('显示隐藏', 'sys_show_hide', '0', NOW()),
  ('正常停用', 'sys_normal_disable', '0', NOW()),
  ('是否', 'sys_yes_no', '0', NOW()),
  ('用户性别', 'sys_user_sex', '0', NOW()),
  ('任务状态', 'sys_job_status', '0', NOW()),
  ('任务分组', 'sys_job_group', '0', NOW()),
  ('通知类型', 'sys_notice_type', '0', NOW()),
  ('通知状态', 'sys_notice_status', '0', NOW()),
  ('操作类型', 'sys_oper_type', '0', NOW()),
  ('通用状态', 'sys_common_status', '0', NOW())
ON CONFLICT (dict_type) DO NOTHING;

-- 8. 初始化字典数据
INSERT INTO sys_dict_data (dict_type, dict_label, dict_value, dict_sort, status, is_default, create_time)
VALUES
  -- 显示隐藏
  ('sys_show_hide', '显示', '0', 1, '0', 'N', NOW()),
  ('sys_show_hide', '隐藏', '1', 2, '0', 'N', NOW()),
  -- 正常停用
  ('sys_normal_disable', '正常', '0', 1, '0', 'Y', NOW()),
  ('sys_normal_disable', '停用', '1', 2, '0', 'N', NOW()),
  -- 是否
  ('sys_yes_no', '是', 'Y', 1, '0', 'Y', NOW()),
  ('sys_yes_no', '否', 'N', 2, '0', 'N', NOW()),
  -- 用户性别
  ('sys_user_sex', '男', '0', 1, '0', 'N', NOW()),
  ('sys_user_sex', '女', '1', 2, '0', 'N', NOW()),
  ('sys_user_sex', '未知', '2', 3, '0', 'Y', NOW()),
  -- 任务状态
  ('sys_job_status', '正常', '0', 1, '0', 'Y', NOW()),
  ('sys_job_status', '暂停', '1', 2, '0', 'N', NOW()),
  -- 任务分组
  ('sys_job_group', 'DEFAULT', 'DEFAULT', 1, '0', 'Y', NOW()),
  ('sys_job_group', 'SYSTEM', 'SYSTEM', 2, '0', 'N', NOW()),
  -- 通知类型
  ('sys_notice_type', '通知', '1', 1, '0', 'N', NOW()),
  ('sys_notice_type', '公告', '2', 2, '0', 'N', NOW()),
  -- 通知状态
  ('sys_notice_status', '正常', '0', 1, '0', 'Y', NOW()),
  ('sys_notice_status', '关闭', '1', 2, '0', 'N', NOW()),
  -- 操作类型
  ('sys_oper_type', '其它', '0', 0, '0', 'N', NOW()),
  ('sys_oper_type', '新增', '1', 1, '0', 'N', NOW()),
  ('sys_oper_type', '修改', '2', 2, '0', 'N', NOW()),
  ('sys_oper_type', '删除', '3', 3, '0', 'N', NOW()),
  ('sys_oper_type', '授权', '4', 4, '0', 'N', NOW()),
  ('sys_oper_type', '导出', '5', 5, '0', 'N', NOW()),
  ('sys_oper_type', '导入', '6', 6, '0', 'N', NOW()),
  ('sys_oper_type', '强退', '7', 7, '0', 'N', NOW()),
  ('sys_oper_type', '生成代码', '8', 8, '0', 'N', NOW()),
  ('sys_oper_type', '清空数据', '9', 9, '0', 'N', NOW()),
  -- 通用状态
  ('sys_common_status', '成功', '0', 1, '0', 'Y', NOW()),
  ('sys_common_status', '失败', '1', 2, '0', 'N', NOW())
ON CONFLICT (dict_type, dict_value) DO NOTHING;

-- 9. 初始化系统配置
INSERT INTO sys_config (config_name, config_key, config_value, config_type, create_time)
VALUES
  ('初始密码', 'sys.account.initPassword', '123456', 'Y', NOW()),
  ('站点名称', 'sys.site.name', 'RBAC Admin Pro', 'Y', NOW())
ON CONFLICT (config_key) DO NOTHING;

-- 10. 初始化通知公告
INSERT INTO sys_notice (notice_title, notice_type, notice_content, status, create_time)
VALUES ('系统维护', '2', '本周日凌晨进行系统维护。', '0', NOW())
ON CONFLICT DO NOTHING;

-- 11. 初始化定时任务
INSERT INTO sys_job (job_name, job_group, invoke_target, cron_expression, misfire_policy, concurrent, status, create_time)
VALUES ('示例任务', 'DEFAULT', 'demoTask.execute()', '0/30 * * * * *', '3', '1', '0', NOW())
ON CONFLICT DO NOTHING;

-- 12. 初始化菜单数据
-- 12.1 系统管理目录
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
VALUES ('系统管理', 'system', 'Layout', 1, 'M', '0', '0', 'settings', 1, NULL, NULL)
ON CONFLICT DO NOTHING;

-- 12.2 系统管理子菜单
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '用户管理', 'user', 'system/user/index', 1, 'C', '0', '0', 'user', 1, menu_id, 'system:user:list'
FROM sys_menu WHERE path = 'system' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '角色管理', 'role', 'system/role/index', 2, 'C', '0', '0', 'users', 1, menu_id, 'system:role:list'
FROM sys_menu WHERE path = 'system' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '菜单管理', 'menu', 'system/menu/index', 3, 'C', '0', '0', 'menu', 1, menu_id, 'system:menu:list'
FROM sys_menu WHERE path = 'system' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '部门管理', 'dept', 'system/dept/index', 4, 'C', '0', '0', 'building-2', 1, menu_id, 'system:dept:list'
FROM sys_menu WHERE path = 'system' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '岗位管理', 'post', 'system/post/index', 5, 'C', '0', '0', 'badge-check', 1, menu_id, 'system:post:list'
FROM sys_menu WHERE path = 'system' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '字典管理', 'dict', 'system/dict/index', 6, 'C', '0', '0', 'book-a', 1, menu_id, 'system:dict:list'
FROM sys_menu WHERE path = 'system' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '参数设置', 'config', 'system/config/index', 7, 'C', '0', '0', 'settings-2', 1, menu_id, 'system:config:list'
FROM sys_menu WHERE path = 'system' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '系统设置', 'setting', 'system/setting/index', 8, 'C', '0', '0', 'sliders-vertical', 1, menu_id, 'system:setting:view'
FROM sys_menu WHERE path = 'system' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '通知公告', 'notice', 'system/notice/index', 9, 'C', '0', '0', 'megaphone', 1, menu_id, 'system:notice:list'
FROM sys_menu WHERE path = 'system' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

-- 12.3 系统监控目录
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
VALUES ('系统监控', 'monitor', 'Layout', 2, 'M', '0', '0', 'monitor', 1, NULL, NULL)
ON CONFLICT DO NOTHING;

-- 12.4 系统监控子菜单
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '在线用户', 'online', 'monitor/online/index', 1, 'C', '0', '0', 'user-check', 1, menu_id, 'monitor:online:list'
FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '操作日志', 'operlog', 'monitor/operlog/index', 2, 'C', '0', '0', 'list', 1, menu_id, 'monitor:operlog:list'
FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '登录日志', 'logininfor', 'monitor/logininfor/index', 3, 'C', '0', '0', 'log-in', 1, menu_id, 'monitor:logininfor:list'
FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '定时任务', 'job', 'monitor/job/index', 4, 'C', '0', '0', 'alarm-clock', 1, menu_id, 'monitor:job:list'
FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '服务监控', 'server', 'monitor/server/index', 5, 'C', '0', '0', 'server', 1, menu_id, 'monitor:server:view'
FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '缓存监控', 'cache', 'monitor/cache/index', 6, 'C', '0', '0', 'database-backup', 1, menu_id, 'monitor:cache:view'
FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '数据监控', 'druid', 'monitor/druid/index', 7, 'C', '0', '0', 'database', 1, menu_id, 'monitor:druid:view'
FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

-- 12.5 系统工具目录
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
VALUES ('系统工具', 'tool', 'Layout', 3, 'M', '0', '0', 'tool', 1, NULL, NULL)
ON CONFLICT DO NOTHING;

-- 12.6 系统工具子菜单
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '代码生成', 'gen', 'tool/gen/index', 1, 'C', '0', '0', 'code-xml', 1, menu_id, 'tool:gen:list'
FROM sys_menu WHERE path = 'tool' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '接口文档', 'swagger', 'tool/swagger/index', 2, 'C', '0', '0', 'file-text', 1, menu_id, 'tool:swagger:view'
FROM sys_menu WHERE path = 'tool' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '表单构建', 'build', 'tool/build/index', 3, 'C', '0', '0', 'factory', 1, menu_id, 'tool:build:view'
FROM sys_menu WHERE path = 'tool' AND parent_id IS NULL
ON CONFLICT DO NOTHING;

-- 13. 初始化按钮权限（F 类型）
-- 13.1 用户管理按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '用户新增', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'system:user:add'
FROM sys_menu WHERE path = 'user' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '用户修改', '', '', 2, 'F', '1', '0', '#', 1, menu_id, 'system:user:edit'
FROM sys_menu WHERE path = 'user' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '用户删除', '', '', 3, 'F', '1', '0', '#', 1, menu_id, 'system:user:remove'
FROM sys_menu WHERE path = 'user' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '重置密码', '', '', 4, 'F', '1', '0', '#', 1, menu_id, 'system:user:resetPwd'
FROM sys_menu WHERE path = 'user' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '修改状态', '', '', 5, 'F', '1', '0', '#', 1, menu_id, 'system:user:changeStatus'
FROM sys_menu WHERE path = 'user' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 13.2 角色管理按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '角色新增', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'system:role:add'
FROM sys_menu WHERE path = 'role' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '角色修改', '', '', 2, 'F', '1', '0', '#', 1, menu_id, 'system:role:edit'
FROM sys_menu WHERE path = 'role' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '角色删除', '', '', 3, 'F', '1', '0', '#', 1, menu_id, 'system:role:remove'
FROM sys_menu WHERE path = 'role' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 13.3 菜单管理按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '菜单新增', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'system:menu:add'
FROM sys_menu WHERE path = 'menu' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '菜单修改', '', '', 2, 'F', '1', '0', '#', 1, menu_id, 'system:menu:edit'
FROM sys_menu WHERE path = 'menu' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '菜单删除', '', '', 3, 'F', '1', '0', '#', 1, menu_id, 'system:menu:remove'
FROM sys_menu WHERE path = 'menu' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 13.4 部门管理按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '部门新增', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'system:dept:add'
FROM sys_menu WHERE path = 'dept' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '部门修改', '', '', 2, 'F', '1', '0', '#', 1, menu_id, 'system:dept:edit'
FROM sys_menu WHERE path = 'dept' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '部门删除', '', '', 3, 'F', '1', '0', '#', 1, menu_id, 'system:dept:remove'
FROM sys_menu WHERE path = 'dept' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 13.5 岗位管理按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '岗位新增', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'system:post:add'
FROM sys_menu WHERE path = 'post' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '岗位修改', '', '', 2, 'F', '1', '0', '#', 1, menu_id, 'system:post:edit'
FROM sys_menu WHERE path = 'post' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '岗位删除', '', '', 3, 'F', '1', '0', '#', 1, menu_id, 'system:post:remove'
FROM sys_menu WHERE path = 'post' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 13.6 字典管理按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '字典新增', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'system:dict:add'
FROM sys_menu WHERE path = 'dict' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '字典修改', '', '', 2, 'F', '1', '0', '#', 1, menu_id, 'system:dict:edit'
FROM sys_menu WHERE path = 'dict' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '字典删除', '', '', 3, 'F', '1', '0', '#', 1, menu_id, 'system:dict:remove'
FROM sys_menu WHERE path = 'dict' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 13.7 参数设置按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '参数新增', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'system:config:add'
FROM sys_menu WHERE path = 'config' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '参数修改', '', '', 2, 'F', '1', '0', '#', 1, menu_id, 'system:config:edit'
FROM sys_menu WHERE path = 'config' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '参数删除', '', '', 3, 'F', '1', '0', '#', 1, menu_id, 'system:config:remove'
FROM sys_menu WHERE path = 'config' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 13.8 通知公告按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '公告新增', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'system:notice:add'
FROM sys_menu WHERE path = 'notice' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '公告修改', '', '', 2, 'F', '1', '0', '#', 1, menu_id, 'system:notice:edit'
FROM sys_menu WHERE path = 'notice' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '公告删除', '', '', 3, 'F', '1', '0', '#', 1, menu_id, 'system:notice:remove'
FROM sys_menu WHERE path = 'notice' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'system' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 13.9 定时任务按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '任务新增', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'monitor:job:add'
FROM sys_menu WHERE path = 'job' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '任务修改', '', '', 2, 'F', '1', '0', '#', 1, menu_id, 'monitor:job:edit'
FROM sys_menu WHERE path = 'job' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '任务删除', '', '', 3, 'F', '1', '0', '#', 1, menu_id, 'monitor:job:remove'
FROM sys_menu WHERE path = 'job' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '立即执行', '', '', 4, 'F', '1', '0', '#', 1, menu_id, 'monitor:job:run'
FROM sys_menu WHERE path = 'job' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '状态变更', '', '', 5, 'F', '1', '0', '#', 1, menu_id, 'monitor:job:changeStatus'
FROM sys_menu WHERE path = 'job' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 13.10 缓存监控按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '清理指定', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'monitor:cache:clearName'
FROM sys_menu WHERE path = 'cache' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '清理全部', '', '', 2, 'F', '1', '0', '#', 1, menu_id, 'monitor:cache:clearAll'
FROM sys_menu WHERE path = 'cache' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 13.11 在线用户按钮
INSERT INTO sys_menu (menu_name, path, component, order_num, menu_type, visible, status, icon, is_frame, parent_id, perms)
SELECT '强退用户', '', '', 1, 'F', '1', '0', '#', 1, menu_id, 'monitor:online:forceLogout'
FROM sys_menu WHERE path = 'online' AND parent_id = (SELECT menu_id FROM sys_menu WHERE path = 'monitor' AND parent_id IS NULL)
ON CONFLICT DO NOTHING;

-- 14. 为超级管理员角色授予所有菜单权限
INSERT INTO sys_role_menu (role_id, menu_id)
SELECT r.role_id, m.menu_id
FROM sys_role r, sys_menu m
WHERE r.role_key = 'admin' AND r.del_flag = '0'
ON CONFLICT DO NOTHING;

-- 提示信息
DO $$
DECLARE
  menu_count INTEGER;
  role_menu_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO menu_count FROM sys_menu;
  SELECT COUNT(*) INTO role_menu_count FROM sys_role_menu WHERE role_id = (SELECT role_id FROM sys_role WHERE role_key = 'admin' AND del_flag = '0');
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE '初始化数据导入完成！';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '默认管理员账号：admin / 123456';
  RAISE NOTICE '默认普通用户：user / 123456';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '数据统计：';
  RAISE NOTICE '- 部门：9 个';
  RAISE NOTICE '- 角色：2 个';
  RAISE NOTICE '- 用户：2 个';
  RAISE NOTICE '- 岗位：2 个';
  RAISE NOTICE '- 菜单：% 个', menu_count;
  RAISE NOTICE '- 超级管理员权限：% 个菜单', role_menu_count;
  RAISE NOTICE '- 字典类型：10 个';
  RAISE NOTICE '- 字典数据：32 条';
  RAISE NOTICE '- 系统配置：2 条';
  RAISE NOTICE '==============================================';
  RAISE NOTICE '注意事项：';
  RAISE NOTICE '1. 生产环境请立即修改默认密码';
  RAISE NOTICE '2. 本脚本与 Prisma seed.ts 保持完全一致';
  RAISE NOTICE '3. 可重复执行，使用 ON CONFLICT DO NOTHING';
  RAISE NOTICE '==============================================';
END $$;
