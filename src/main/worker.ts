import { parentPort,workerData } from 'worker_threads'
// import sql from './lib/sql'
const Database = require('better-sqlite3')
import {
  generateRandomKeyAndIV,
  masterPassword,
  encrypt,
  decrypt
} from './crypt'

const dbPath = workerData.db
const db = new Database(dbPath, {})
/**
 * 检查表是否存在,如果表不存在，则创建表
 */

// sql.map(item=>{
//   const isTableExist = db.prepare(`
//   SELECT COUNT(*) as count
//   FROM sqlite_master
//   WHERE type='table' AND name=?
// `).get(item.tablename).count > 0;
//   if (!isTableExist) {
//     db.exec(item.sql);
//     console.log(`建表:${item.tablename}`)
//   }
// })




if (parentPort === null) {
  throw Error('')
}
try {
  parentPort.on('message', (msg):void => {
    if (parentPort === null) {
      throw Error('')
    }
    const page = msg.current ?? 1
    const pageSize = msg.pageSize
    const offset = (page - 1) * pageSize
    const inrecycle = msg.meta ?? 'home'
    switch (msg.type) {
      case 'one':
        const one = db.prepare('SELECT * FROM passwords where id = ?').get(msg.id)
        parentPort.postMessage(one)
        break
      case 'list':
        // console.log('list')
        const keyword = msg.keyword
        const compiledQuery = generateQuery(keyword, false, inrecycle)
        const statement = db.prepare(compiledQuery)
        const row = statement.all(
          keyword ? `%${keyword}%` : `%%`,
          keyword ? `%${keyword}%` : `%%`,
          offset,
          pageSize
        )

        const compiledQuery2 = generateQuery(keyword, true, inrecycle)
        // console.log(compiledQuery2)
        const statement2 = db.prepare(compiledQuery2)
        const rowcount = statement2.get(
          keyword ? `%${keyword}%` : '%%',
          keyword ? `%${keyword}%` : '%%'
        )
        // console.log(`count:${JSON.stringify(rowcount)}`)
        // console.log(rowcount.count)
        let total = 0
        if (rowcount && rowcount?.count) {
          total = rowcount.count
        }
        parentPort.postMessage({ list: row, total: total })
        break
      case 'create':
        const stmt = db.prepare(
          'INSERT INTO passwords (platform, account,hash_password) VALUES (?,?,?)'
        )
        const result = stmt.run(msg.platform, msg.account, msg.password)
        parentPort.postMessage(result)
        break
      case 'update':
        const updateRows = db
          .prepare(`UPDATE passwords SET platform=?,account=?,hash_password = ? WHERE id = ?`)
          .run(msg.platform, msg.account, msg.password, msg.id)
        parentPort.postMessage(updateRows)
        break
      case 'collect':
        const collectRow = db
          .prepare(`UPDATE passwords SET collect=? WHERE id = ?`)
          .run(msg.data.collect, msg.data.id)
        parentPort.postMessage(collectRow)
        break
      case 'delete':
        const currentDateTime = getCurrentDateTime()
        const transaction = db.transaction(() => {
          for (const data of msg.data) {
            db.prepare('UPDATE passwords SET deletedat = ? WHERE id = ?').run(currentDateTime, data)
          }
        })

        try {
          // 执行事务
          transaction()
          console.log('Batch update successful')
          parentPort.postMessage({ code: 200, message: '修改成功' })
        } catch (error) {
          console.error('Batch update failed:', error)
          parentPort.postMessage({ code: 500, message: '修改成功' })
        }

        break
      case 'permanentlyDelete':
        const recordsToDelete = msg.data
        const deleteRows = db
          .prepare(
            'DELETE FROM passwords WHERE id IN (' + recordsToDelete.map(() => '?').join(',') + ')'
          )
          .run(...recordsToDelete)
        parentPort.postMessage(deleteRows)
        break
      case 'restore':
        const restoreRow = db
          .prepare(`UPDATE passwords SET deletedat=NULL WHERE id = ?`)
          .run(msg.id)
        parentPort.postMessage(restoreRow)
        break
      case 'updateMasterPassword':
      case 'categoriesList':{
        const ddds = db.prepare('SELECT * FROM categories').all()
        parentPort.postMessage(ddds)
        break
      }
      
      case 'categoriesCreate':{
        const stmt = db.prepare(
          'INSERT INTO categories (name,enabled) VALUES (?,?)'
        )
        const result = stmt.run(msg.name, msg.enabled)
        parentPort.postMessage(result)
        break
      }
      case 'categoriesUpdate':{
        const updateRow = db
          .prepare(`UPDATE categories SET name=?,enabled=? WHERE id = ?`)
          .run(msg.name,msg.enabled,msg.id)
        parentPort.postMessage(updateRow)
        break
      }
      case 'categoriesDelete':{
        const deleteRows = db.prepare(
            'DELETE FROM categories WHERE id =?'
          ).run(msg.id)
        parentPort.postMessage(deleteRows)
        break
      }
      default:
      break
    }
  })
} catch (error) {
  parentPort.postMessage(error)
}

function updateMasterPasswords(parentPort,msg):any {
  const allData = db.prepare('select hash_password,id from passwords').all()
  if(allData.length>0){
    // 查询原密码是否正确
   try{
    const {key,iv} = generateRandomKeyAndIV(msg.password)
    decrypt(allData[0].hash_password,key,iv)
   }catch(error){
    parentPort.postMessage({ code: 5000, message: '原密码错误，无法正确解密密码' })
    return false
   }
  }else{
    parentPort.postMessage({ code: 200, message: '修改成功' })
  }

  try {
    const updateAll = db.prepare('UPDATE passwords SET hash_password = @hash_password WHERE id = @id')
    const updateMany = db.transaction((allData) => {
      for (const pwd of allData) updateAll.run(pwd);
    });

    const resultData = allData.map((item)=>{
      const {key,iv} = generateRandomKeyAndIV(msg.password)
      const origin_password = decrypt(item.hash_password,key,iv)
      const newKeyIv = generateRandomKeyAndIV(msg.newpassword)
      const new_hash_password= encrypt(origin_password,newKeyIv.key,newKeyIv.iv)
      return {hash_password:new_hash_password,id:item.id}
    })
    updateMany(resultData);
    console.log('Batch update successful：'+masterPassword)
    parentPort.postMessage({ code: 200, message: '修改成功' })
  } catch (error) {
    console.error('Batch update failed:', error)
    parentPort.postMessage({ code: 500, message: '修改失败' })
  }
}

function getCurrentDateTime() {
  const currentDate = new Date()

  const year = currentDate.getFullYear()
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
  const day = currentDate.getDate().toString().padStart(2, '0')
  const hours = currentDate.getHours().toString().padStart(2, '0')
  const minutes = currentDate.getMinutes().toString().padStart(2, '0')
  const seconds = currentDate.getSeconds().toString().padStart(2, '0')

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  return formattedDateTime
}

function generateQuery(keyword = '', count = false, inrecycle = '') {
  let isnotnull = ''
  console.log(keyword)
  if (inrecycle == 'recycle') {
    isnotnull = 'NOT'
  }
  let fields = '*'
  if(count){
    fields = 'count(*) as count '
  }
  let query = `
    SELECT ${fields}
    FROM passwords
    WHERE deletedat IS ${isnotnull} NULL`

  if (inrecycle == 'collect') {
    query += ` AND collect=1`
  }

  query += ` AND (platform LIKE ? OR account LIKE ?)`

  if (!count) {
    query += `
    ORDER BY id DESC
    LIMIT ?, ?`
  }

  return query
}
