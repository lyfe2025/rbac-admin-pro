import 'dotenv/config'
import { Client } from 'pg'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error('未找到 DATABASE_URL 环境变量')
    process.exit(1)
  }

  const client = new Client({ connectionString: url })
  await client.connect()

  const tables = [
    'sys_dept',
    'sys_user',
    'sys_post',
    'sys_role',
    'sys_menu',
  ]

  for (const t of tables) {
    const tableCommentRes = await client.query(
      `SELECT obj_description(('public.' || $1)::regclass) AS comment`,
      [t],
    )
    const tableComment = tableCommentRes.rows[0]?.comment || ''
    console.log(`TABLE ${t}: ${tableComment}`)

    const columnRes = await client.query(
      `SELECT a.attname AS column, col_description(c.oid, a.attnum) AS comment
       FROM pg_class c JOIN pg_attribute a ON a.attrelid = c.oid
       WHERE c.relname = $1 AND a.attnum > 0 AND NOT a.attisdropped
       ORDER BY a.attnum`,
      [t],
    )
    for (const row of columnRes.rows) {
      console.log(`  - ${row.column}: ${row.comment ?? ''}`)
    }
  }

  await client.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

