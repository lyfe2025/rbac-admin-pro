-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "sys_dept" (
    "dept_id" BIGSERIAL NOT NULL,
    "parent_id" BIGINT,
    "ancestors" VARCHAR(500) DEFAULT '',
    "dept_name" VARCHAR(50) NOT NULL,
    "order_num" INTEGER DEFAULT 0,
    "leader" VARCHAR(20),
    "phone" VARCHAR(11),
    "email" VARCHAR(50),
    "status" CHAR(1) DEFAULT '0',
    "del_flag" CHAR(1) DEFAULT '0',
    "create_by" VARCHAR(64) DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) DEFAULT '',
    "update_time" TIMESTAMP(6),

    CONSTRAINT "sys_dept_pkey" PRIMARY KEY ("dept_id")
);

-- CreateTable
CREATE TABLE "sys_user" (
    "user_id" BIGSERIAL NOT NULL,
    "dept_id" BIGINT,
    "user_name" VARCHAR(30) NOT NULL,
    "nick_name" VARCHAR(30) NOT NULL,
    "user_type" VARCHAR(2) DEFAULT '00',
    "email" VARCHAR(50) DEFAULT '',
    "phonenumber" VARCHAR(11) DEFAULT '',
    "sex" CHAR(1) DEFAULT '0',
    "avatar" VARCHAR(100) DEFAULT '',
    "password" VARCHAR(100) DEFAULT '',
    "status" CHAR(1) DEFAULT '0',
    "del_flag" CHAR(1) DEFAULT '0',
    "login_ip" VARCHAR(128) DEFAULT '',
    "login_date" TIMESTAMP(6),
    "create_by" VARCHAR(64) DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) DEFAULT '',
    "update_time" TIMESTAMP(6),
    "remark" VARCHAR(500),

    CONSTRAINT "sys_user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "sys_post" (
    "post_id" BIGSERIAL NOT NULL,
    "post_code" VARCHAR(64) NOT NULL,
    "post_name" VARCHAR(50) NOT NULL,
    "post_sort" INTEGER NOT NULL,
    "status" CHAR(1) NOT NULL,
    "create_by" VARCHAR(64) DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) DEFAULT '',
    "update_time" TIMESTAMP(6),
    "remark" VARCHAR(500),

    CONSTRAINT "sys_post_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "sys_role" (
    "role_id" BIGSERIAL NOT NULL,
    "role_name" VARCHAR(30) NOT NULL,
    "role_key" VARCHAR(100) NOT NULL,
    "role_sort" INTEGER NOT NULL,
    "data_scope" CHAR(1) DEFAULT '1',
    "menu_check_strictly" BOOLEAN DEFAULT true,
    "dept_check_strictly" BOOLEAN DEFAULT true,
    "status" CHAR(1) NOT NULL,
    "del_flag" CHAR(1) DEFAULT '0',
    "create_by" VARCHAR(64) DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) DEFAULT '',
    "update_time" TIMESTAMP(6),
    "remark" VARCHAR(500),

    CONSTRAINT "sys_role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "sys_menu" (
    "menu_id" BIGSERIAL NOT NULL,
    "menu_name" VARCHAR(50) NOT NULL,
    "parent_id" BIGINT,
    "order_num" INTEGER DEFAULT 0,
    "path" VARCHAR(200) DEFAULT '',
    "component" VARCHAR(255),
    "is_frame" INTEGER DEFAULT 1,
    "is_cache" INTEGER DEFAULT 0,
    "menu_type" CHAR(1) DEFAULT '',
    "visible" CHAR(1) DEFAULT '0',
    "status" CHAR(1) DEFAULT '0',
    "perms" VARCHAR(100),
    "icon" VARCHAR(100) DEFAULT '#',
    "create_by" VARCHAR(64) DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) DEFAULT '',
    "update_time" TIMESTAMP(6),
    "remark" VARCHAR(500),

    CONSTRAINT "sys_menu_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "sys_user_role" (
    "user_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,

    CONSTRAINT "sys_user_role_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "sys_role_menu" (
    "role_id" BIGINT NOT NULL,
    "menu_id" BIGINT NOT NULL,

    CONSTRAINT "sys_role_menu_pkey" PRIMARY KEY ("role_id","menu_id")
);

-- CreateTable
CREATE TABLE "sys_role_dept" (
    "role_id" BIGINT NOT NULL,
    "dept_id" BIGINT NOT NULL,

    CONSTRAINT "sys_role_dept_pkey" PRIMARY KEY ("role_id","dept_id")
);

-- CreateTable
CREATE TABLE "sys_user_post" (
    "user_id" BIGINT NOT NULL,
    "post_id" BIGINT NOT NULL,

    CONSTRAINT "sys_user_post_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "sys_oper_log" (
    "oper_id" BIGSERIAL NOT NULL,
    "title" VARCHAR(50) DEFAULT '',
    "business_type" INTEGER DEFAULT 0,
    "method" VARCHAR(100) DEFAULT '',
    "request_method" VARCHAR(10) DEFAULT '',
    "operator_type" INTEGER DEFAULT 0,
    "oper_name" VARCHAR(50) DEFAULT '',
    "dept_name" VARCHAR(50) DEFAULT '',
    "oper_url" VARCHAR(255) DEFAULT '',
    "oper_ip" VARCHAR(128) DEFAULT '',
    "oper_location" VARCHAR(255) DEFAULT '',
    "oper_param" TEXT DEFAULT '',
    "json_result" TEXT DEFAULT '',
    "status" INTEGER DEFAULT 0,
    "error_msg" TEXT DEFAULT '',
    "oper_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_oper_log_pkey" PRIMARY KEY ("oper_id")
);

-- CreateTable
CREATE TABLE "sys_dict_type" (
    "dict_id" BIGSERIAL NOT NULL,
    "dict_name" VARCHAR(100) DEFAULT '',
    "dict_type" VARCHAR(100) DEFAULT '',
    "status" CHAR(1) DEFAULT '0',
    "create_by" VARCHAR(64) DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) DEFAULT '',
    "update_time" TIMESTAMP(6),
    "remark" VARCHAR(500),

    CONSTRAINT "sys_dict_type_pkey" PRIMARY KEY ("dict_id")
);

-- CreateTable
CREATE TABLE "sys_dict_data" (
    "dict_code" BIGSERIAL NOT NULL,
    "dict_sort" INTEGER DEFAULT 0,
    "dict_label" VARCHAR(100) DEFAULT '',
    "dict_value" VARCHAR(100) DEFAULT '',
    "dict_type" VARCHAR(100) DEFAULT '',
    "css_class" VARCHAR(100),
    "list_class" VARCHAR(100),
    "is_default" CHAR(1) DEFAULT 'N',
    "status" CHAR(1) DEFAULT '0',
    "create_by" VARCHAR(64) DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) DEFAULT '',
    "update_time" TIMESTAMP(6),
    "remark" VARCHAR(500),

    CONSTRAINT "sys_dict_data_pkey" PRIMARY KEY ("dict_code")
);

-- CreateTable
CREATE TABLE "sys_config" (
    "config_id" BIGSERIAL NOT NULL,
    "config_name" VARCHAR(100) DEFAULT '',
    "config_key" VARCHAR(100) DEFAULT '',
    "config_value" VARCHAR(500) DEFAULT '',
    "config_type" CHAR(1) DEFAULT 'N',
    "create_by" VARCHAR(64) DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) DEFAULT '',
    "update_time" TIMESTAMP(6),
    "remark" VARCHAR(500),

    CONSTRAINT "sys_config_pkey" PRIMARY KEY ("config_id")
);

-- CreateTable
CREATE TABLE "sys_login_log" (
    "info_id" BIGSERIAL NOT NULL,
    "user_name" VARCHAR(50) DEFAULT '',
    "ipaddr" VARCHAR(128) DEFAULT '',
    "login_location" VARCHAR(255) DEFAULT '',
    "browser" VARCHAR(50) DEFAULT '',
    "os" VARCHAR(50) DEFAULT '',
    "status" CHAR(1) DEFAULT '0',
    "msg" VARCHAR(255) DEFAULT '',
    "login_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_login_log_pkey" PRIMARY KEY ("info_id")
);

-- CreateTable
CREATE TABLE "sys_notice" (
    "notice_id" BIGSERIAL NOT NULL,
    "notice_title" VARCHAR(50) NOT NULL,
    "notice_type" CHAR(1) NOT NULL,
    "notice_content" TEXT,
    "status" CHAR(1) DEFAULT '0',
    "create_by" VARCHAR(64) DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) DEFAULT '',
    "update_time" TIMESTAMP(6),
    "remark" VARCHAR(255),

    CONSTRAINT "sys_notice_pkey" PRIMARY KEY ("notice_id")
);

-- CreateTable
CREATE TABLE "sys_job" (
    "job_id" BIGSERIAL NOT NULL,
    "job_name" VARCHAR(64) DEFAULT '',
    "job_group" VARCHAR(64) DEFAULT 'DEFAULT',
    "invoke_target" VARCHAR(500) NOT NULL,
    "cron_expression" VARCHAR(255) DEFAULT '',
    "misfire_policy" VARCHAR(20) DEFAULT '3',
    "concurrent" CHAR(1) DEFAULT '1',
    "status" CHAR(1) DEFAULT '0',
    "create_by" VARCHAR(64) DEFAULT '',
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_by" VARCHAR(64) DEFAULT '',
    "update_time" TIMESTAMP(6),
    "remark" VARCHAR(500),

    CONSTRAINT "sys_job_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "sys_job_log" (
    "job_log_id" BIGSERIAL NOT NULL,
    "job_name" VARCHAR(64) NOT NULL,
    "job_group" VARCHAR(64) NOT NULL,
    "invoke_target" VARCHAR(500) NOT NULL,
    "job_message" VARCHAR(500),
    "status" CHAR(1) DEFAULT '0',
    "exception_info" TEXT,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_job_log_pkey" PRIMARY KEY ("job_log_id")
);

-- AddForeignKey
ALTER TABLE "sys_dept" ADD CONSTRAINT "sys_dept_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "sys_dept"("dept_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user" ADD CONSTRAINT "sys_user_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "sys_dept"("dept_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_menu" ADD CONSTRAINT "sys_menu_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "sys_menu"("menu_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user_role" ADD CONSTRAINT "sys_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "sys_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user_role" ADD CONSTRAINT "sys_user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "sys_role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_role_menu" ADD CONSTRAINT "sys_role_menu_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "sys_role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_role_menu" ADD CONSTRAINT "sys_role_menu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "sys_menu"("menu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_role_dept" ADD CONSTRAINT "sys_role_dept_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "sys_role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_role_dept" ADD CONSTRAINT "sys_role_dept_dept_id_fkey" FOREIGN KEY ("dept_id") REFERENCES "sys_dept"("dept_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user_post" ADD CONSTRAINT "sys_user_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "sys_user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sys_user_post" ADD CONSTRAINT "sys_user_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "sys_post"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

