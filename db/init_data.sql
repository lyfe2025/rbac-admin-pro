-- 插入超级管理员
INSERT INTO sys_user (user_id, user_name, nick_name, password, status, create_time) 
VALUES (gen_random_uuid(), 'admin', '超级管理员', '123456', '0', NOW());

-- 插入测试部门
INSERT INTO sys_dept (dept_id, dept_name, order_num, status, create_time)
VALUES (gen_random_uuid(), '总公司', 0, '0', NOW());

-- 插入测试角色
INSERT INTO sys_role (role_id, role_name, role_key, role_sort, status, create_time)
VALUES (gen_random_uuid(), '超级管理员', 'admin', 1, '0', NOW());
