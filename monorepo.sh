#!/usr/bin/env bash

set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
WEB_DIR="$ROOT/web"
SERVER_DIR="$ROOT/server-nestjs"
PID_DIR="$ROOT/.run"

mkdir -p "$PID_DIR"

ESC="$(printf '\033')"
BOLD="${ESC}[1m"
RESET="${ESC}[0m"
FG_GREEN="${ESC}[32m"
FG_RED="${ESC}[31m"
FG_YELLOW="${ESC}[33m"
FG_BLUE="${ESC}[34m"
FG_CYAN="${ESC}[36m"

# 允许通过环境变量覆盖端口（运行命令时可用 WEB_PORT=xxxx / SERVER_PORT=xxxx）
OVERRIDE_WEB_PORT="${WEB_PORT:-}"
OVERRIDE_SERVER_PORT="${SERVER_PORT:-}"

if [ -n "$NO_COLOR" ] || [ ! -t 1 ]; then
  BOLD=""; RESET=""; FG_GREEN=""; FG_RED=""; FG_YELLOW=""; FG_BLUE=""; FG_CYAN=""
fi

get_cols() {
  local c
  c=$(tput cols 2>/dev/null || echo 80)
  echo "$c"
}

repeat_char() {
  local ch="$1"; local n="$2"
  local out=""
  while [ ${#out} -lt "$n" ]; do out="$out$ch"; done
  echo "$out"
}

center_line() {
  local text="$1"; local cols
  cols=$(get_cols)
  local len=${#text}
  local pad=$(( (cols - len) / 2 ))
  [ "$pad" -lt 0 ] && pad=0
  printf "%*s%s\n" "$pad" "" "$text"
}

hr() {
  local cols
  cols=$(get_cols)
  printf "%s\n" "$(repeat_char '─' "$cols")"
}

kv_line() {
  local label="$1"; local value="$2"
  printf "  %-8s: %s\n" "$label" "$value"
}

is_port_in_use() {
  lsof -ti ":$1" >/dev/null 2>&1
}

# 从 env 文件读取变量值（忽略注释与空格，去除引号）
read_env_var_from_file() {
  local file="$1"
  local var="$2"
  [ -f "$file" ] || return 1
  local line
  line=$(grep -E "^${var}[[:space:]]*=" "$file" | tail -n 1 || true)
  [ -n "$line" ] || return 1
  local val
  val=$(echo "$line" | sed -E "s/^${var}[[:space:]]*=[[:space:]]*//" | tr -d '"' | tr -d "'")
  [ -n "$val" ] || return 1
  echo "$val"
  return 0
}

# 获取前端端口：按优先级读取 .env.development.local -> .env.development -> .env.local -> .env
get_web_port() {
  if [ -n "$OVERRIDE_WEB_PORT" ]; then echo "$OVERRIDE_WEB_PORT"; return 0; fi
  local files=(
    "$WEB_DIR/.env.development.local"
    "$WEB_DIR/.env.development"
    "$WEB_DIR/.env.local"
    "$WEB_DIR/.env"
  )
  local val
  for f in "${files[@]}"; do
    val=$(read_env_var_from_file "$f" "VITE_PORT" || true)
    if [ -n "$val" ]; then echo "$val"; return 0; fi
  done
  echo 5173
}

get_web_port_info() {
  if [ -n "$OVERRIDE_WEB_PORT" ]; then echo "$OVERRIDE_WEB_PORT|ENV"; return 0; fi
  local files=(
    "$WEB_DIR/.env.development.local"
    "$WEB_DIR/.env.development"
    "$WEB_DIR/.env.local"
    "$WEB_DIR/.env"
  )
  local val
  for f in "${files[@]}"; do
    val=$(read_env_var_from_file "$f" "VITE_PORT" || true)
    if [ -n "$val" ]; then echo "$val|$f"; return 0; fi
  done
  echo "5173|default"
}

# 获取后端端口：读取 server-nestjs/.env.local -> .env 的 PORT，默认 3000
get_server_port() {
  if [ -n "$OVERRIDE_SERVER_PORT" ]; then echo "$OVERRIDE_SERVER_PORT"; return 0; fi
  local files=(
    "$SERVER_DIR/.env.local"
    "$SERVER_DIR/.env"
  )
  local val
  for f in "${files[@]}"; do
    val=$(read_env_var_from_file "$f" "PORT" || true)
    if [ -n "$val" ]; then echo "$val"; return 0; fi
  done
  echo 3000
}

get_server_port_info() {
  if [ -n "$OVERRIDE_SERVER_PORT" ]; then echo "$OVERRIDE_SERVER_PORT|ENV"; return 0; fi
  local files=(
    "$SERVER_DIR/.env.local"
    "$SERVER_DIR/.env"
  )
  local val
  for f in "${files[@]}"; do
    val=$(read_env_var_from_file "$f" "PORT" || true)
    if [ -n "$val" ]; then echo "$val|$f"; return 0; fi
  done
  echo "3000|default"
}

log_mtime() {
  local file="$1"
  if [ -f "$file" ]; then
    stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file"
  else
    echo "-"
  fi
}

pid_uptime_raw() {
  local pid="$1"
  if [ -n "$pid" ] && is_running "$pid"; then
    ps -p "$pid" -o etime= 2>/dev/null | tr -d ' '
  else
    echo "-"
  fi
}

fmt_uptime() {
  local etime="$1"
  if [ -z "$etime" ] || [ "$etime" = "-" ]; then echo "-"; return 0; fi
  local days=0 hh=0 mm=0 ss=0 rest
  if [[ "$etime" == *-* ]]; then
    days=${etime%%-*}
    rest=${etime#*-}
  else
    rest="$etime"
  fi
  hh=${rest%%:*}
  rest=${rest#*:}
  mm=${rest%%:*}
  ss=${rest#*:}
  local total_hours=$((days*24+hh))
  echo "${total_hours} 小时 ${mm} 分钟"
}

shorten_source() {
  local src="$1"
  if [ "$src" = "ENV" ] || [ "$src" = "default" ]; then echo "$src"; return 0; fi
  local base parent
  base=$(basename "$src")
  parent=$(basename "$(dirname "$src")")
  echo "${parent}/${base}"
}

status_badge() {
  case "$1" in
    运行中)
      printf "${FG_GREEN}● 运行中${RESET}"
      ;;
    未运行)
      printf "${FG_RED}○ 未运行${RESET}"
      ;;
    *)
      printf "%s" "$1"
      ;;
  esac
}

wait_for_port() {
  local port="$1"
  local name="$2"
  local i=0
  local sp='|/-\\'
  while ! is_port_in_use "$port" && [ $i -lt 60 ]; do
    printf "\r${FG_YELLOW}%s 启动中... %c${RESET}" "$name" "${sp:i%4:1}"
    sleep 0.2
    i=$((i+1))
  done
  if is_port_in_use "$port"; then
    printf "\r${FG_GREEN}%s 启动成功${RESET}\n" "$name"
  else
    printf "\r${FG_RED}%s 启动超时${RESET}\n" "$name"
  fi
}

kill_by_port() {
  local port="$1"
  local pids
  pids="$(lsof -ti ":$port" || true)"
  if [ -n "$pids" ]; then
    echo "$pids" | xargs -r kill -TERM || true
    sleep 1
    pids="$(lsof -ti ":$port" || true)"
    if [ -n "$pids" ]; then
      echo "$pids" | xargs -r kill -KILL || true
    fi
  fi
}

read_pid() {
  [ -f "$PID_DIR/$1" ] && cat "$PID_DIR/$1" || echo ""
}

write_pid() {
  echo "$2" > "$PID_DIR/$1"
}

remove_pid() {
  rm -f "$PID_DIR/$1" || true
}

is_running() {
  local pid="$1"
  [ -n "$pid" ] && kill -0 "$pid" >/dev/null 2>&1
}

start_web() {
  local WEB_PORT
  WEB_PORT="$(get_web_port)"
  if is_port_in_use "$WEB_PORT"; then kill_by_port "$WEB_PORT"; fi
  (cd "$WEB_DIR" && nohup npm run dev >"$PID_DIR/web-dev.log" 2>&1 & echo $! > "$PID_DIR/web-dev.pid")
  wait_for_port "$WEB_PORT" "前端"
}

start_server() {
  local SERVER_PORT
  SERVER_PORT="$(get_server_port)"
  if is_port_in_use "$SERVER_PORT"; then kill_by_port "$SERVER_PORT"; fi
  (cd "$SERVER_DIR" && nohup npm run start:dev >"$PID_DIR/server-dev.log" 2>&1 & echo $! > "$PID_DIR/server-dev.pid")
  wait_for_port "$SERVER_PORT" "后端"
}

stop_web() {
  local pid WEB_PORT
  WEB_PORT="$(get_web_port)"
  pid="$(read_pid web-dev.pid)"
  if is_running "$pid"; then kill -TERM "$pid" || true; sleep 1; kill -KILL "$pid" || true; fi
  remove_pid web-dev.pid
  kill_by_port "$WEB_PORT"
  printf "${FG_BLUE}前端已停止${RESET}\n"
}

stop_server() {
  local pid SERVER_PORT
  SERVER_PORT="$(get_server_port)"
  pid="$(read_pid server-dev.pid)"
  if is_running "$pid"; then kill -TERM "$pid" || true; sleep 1; kill -KILL "$pid" || true; fi
  remove_pid server-dev.pid
  kill_by_port "$SERVER_PORT"
  printf "${FG_BLUE}后端已停止${RESET}\n"
}

restart_web() { stop_web; start_web; }
restart_server() { stop_server; start_server; }

start_all() { start_server; start_web; }
stop_all() { stop_web; stop_server; }
restart_all() { stop_all; start_all; }

status_all() {
  local wpid spid WEB_PORT SERVER_PORT
  WEB_PORT="$(get_web_port)"
  SERVER_PORT="$(get_server_port)"
  wpid="$(read_pid web-dev.pid)"
  spid="$(read_pid server-dev.pid)"
  local wstatus sstatus
  if is_running "$wpid" || is_port_in_use "$WEB_PORT"; then wstatus="运行中"; else wstatus="未运行"; fi
  if is_running "$spid" || is_port_in_use "$SERVER_PORT"; then sstatus="运行中"; else sstatus="未运行"; fi
  if [ "$wstatus" = "运行中" ]; then
    printf "${FG_GREEN}前端状态：%s${RESET} (pid: %s, port: %s)\n" "$wstatus" "${wpid:-'-'}" "$WEB_PORT"
  else
    printf "${FG_RED}前端状态：%s${RESET} (pid: %s, port: %s)\n" "$wstatus" "${wpid:-'-'}" "$WEB_PORT"
  fi
  if [ "$sstatus" = "运行中" ]; then
    printf "${FG_GREEN}后端状态：%s${RESET} (pid: %s, port: %s)\n" "$sstatus" "${spid:-'-'}" "$SERVER_PORT"
  else
    printf "${FG_RED}后端状态：%s${RESET} (pid: %s, port: %s)\n" "$sstatus" "${spid:-'-'}" "$SERVER_PORT"
  fi
}

# 跟随日志输出，模拟前台运行效果（Ctrl+C 退出日志跟随，服务仍在运行）
attach_logs() {
  local target="$1"
  set +e
  case "$target" in
    web)
      if [ -f "$PID_DIR/web-dev.log" ]; then
        echo "— 正在跟随前端日志 (Ctrl+C 退出) —"
        tail -f "$PID_DIR/web-dev.log"
      else
        echo "未找到前端日志文件：$PID_DIR/web-dev.log"
      fi
      ;;
    server)
      if [ -f "$PID_DIR/server-dev.log" ]; then
        echo "— 正在跟随后端日志 (Ctrl+C 退出) —"
        tail -f "$PID_DIR/server-dev.log"
      else
        echo "未找到后端日志文件：$PID_DIR/server-dev.log"
      fi
      ;;
    all)
      local files=()
      [ -f "$PID_DIR/web-dev.log" ] && files+=("$PID_DIR/web-dev.log")
      [ -f "$PID_DIR/server-dev.log" ] && files+=("$PID_DIR/server-dev.log")
      if [ ${#files[@]} -gt 0 ]; then
        echo "— 正在跟随前后端日志 (Ctrl+C 退出) —"
        tail -f "${files[@]}"
      else
        echo "未找到任何日志文件"
      fi
      ;;
  esac
  set -e
  echo "已退出日志跟随，服务仍在运行"
}

type_check() { (cd "$WEB_DIR" && npm run type-check); }
validate_server() { (cd "$SERVER_DIR" && npm run validate); }
migrate_dev() { (cd "$SERVER_DIR" && npx prisma migrate dev); }
studio() { (cd "$SERVER_DIR" && npx prisma studio); }
smoke_tests() {
  (cd "$SERVER_DIR" && bash test-login.sh)
  (cd "$SERVER_DIR" && bash test-getinfo.sh)
  (cd "$SERVER_DIR" && bash test-getrouters.sh)
  (cd "$SERVER_DIR" && bash test-user.sh)
  (cd "$SERVER_DIR" && bash test-role.sh)
  (cd "$SERVER_DIR" && bash test-dept.sh)
  (cd "$SERVER_DIR" && bash test-menu.sh)
}

print_menu() {
  local WEB_PORT SERVER_PORT wpid spid wstatus sstatus
  local WEB_INFO SERVER_INFO WEB_SRC SERVER_SRC WEB_LOG SERVER_LOG WEB_UP SERVER_UP
  WEB_INFO="$(get_web_port_info)"; SERVER_INFO="$(get_server_port_info)"
  WEB_PORT="${WEB_INFO%|*}"; WEB_SRC="${WEB_INFO#*|}"
  SERVER_PORT="${SERVER_INFO%|*}"; SERVER_SRC="${SERVER_INFO#*|}"
  wpid="$(read_pid web-dev.pid)"; spid="$(read_pid server-dev.pid)"
  if is_running "$wpid" || is_port_in_use "$WEB_PORT"; then wstatus="运行中"; else wstatus="未运行"; fi
  if is_running "$spid" || is_port_in_use "$SERVER_PORT"; then sstatus="运行中"; else sstatus="未运行"; fi
  WEB_LOG_PATH="$PID_DIR/web-dev.log"; SERVER_LOG_PATH="$PID_DIR/server-dev.log"
  WEB_UP="$(fmt_uptime "$(pid_uptime_raw "$wpid")")"; SERVER_UP="$(fmt_uptime "$(pid_uptime_raw "$spid")")"
  center_line "${BOLD}${FG_CYAN}RBAC Admin 控制台${RESET}"
  hr
  printf -- "${FG_CYAN}[前端]${RESET}\n"
  kv_line "状态" "$(status_badge "$wstatus")"
  kv_line "PID" "${wpid:-'-'}"
  kv_line "端口" "$WEB_PORT (source: $(shorten_source "$WEB_SRC"))"
  kv_line "Uptime" "$WEB_UP"
  kv_line "Log" "$(shorten_source "$WEB_LOG_PATH") (更新时间: $(log_mtime "$WEB_LOG_PATH"))"
  hr
  printf -- "${FG_CYAN}[后端]${RESET}\n"
  kv_line "状态" "$(status_badge "$sstatus")"
  kv_line "PID" "${spid:-'-'}"
  kv_line "端口" "$SERVER_PORT (source: $(shorten_source "$SERVER_SRC"))"
  kv_line "Uptime" "$SERVER_UP"
  kv_line "Log" "$(shorten_source "$SERVER_LOG_PATH") (更新时间: $(log_mtime "$SERVER_LOG_PATH"))"
  hr
  printf -- "${FG_CYAN}1${RESET}. 一键启动 前端+后端\n"
  printf -- "${FG_CYAN}2${RESET}. 一键停止 前端+后端\n"
  printf -- "${FG_CYAN}3${RESET}. 一键重启 前端+后端\n"
  printf -- "${FG_CYAN}4${RESET}. 同步数据库迁移\n"
  printf -- "${FG_CYAN}5${RESET}. 打开 Prisma Studio\n"
  printf -- "${FG_CYAN}6${RESET}. 前端类型检查\n"
  printf -- "${FG_CYAN}7${RESET}. 后端代码校验\n"
  printf -- "${FG_CYAN}8${RESET}. 后端快速 API 冒烟测试\n"
  printf -- "${FG_CYAN}0${RESET}. 退出\n"
}

run_by_id() {
  case "$1" in
    1) start_all; attach_logs all ;;
    2) stop_all ;;
    3) restart_all; attach_logs all ;;
    4) migrate_dev ;;
    5) studio ;;
    6) type_check ;;
    7) validate_server ;;
    8) smoke_tests ;;
    0) exit 0 ;;
    *) echo "无效的选项" ;;
  esac
}

interactive() {
  print_menu
  while true; do
    read -rp "请输入数字选择：" num
    run_by_id "$num"
    [ "$num" = "0" ] && break
    print_menu
  done
}

main() {
  if [ "$1" = "--list" ]; then
    print_menu
    exit 0
  fi
  if [ "$1" = "--action" ] && [ -n "$2" ]; then
    run_by_id "$2"
    exit 0
  fi
  interactive
}

main "$@"
