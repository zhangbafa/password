const sql = [
    {
        tablename:'passwords',
        sql:`
        CREATE TABLE passwords (
        id            INTEGER       PRIMARY KEY AUTOINCREMENT,
        platform      VARCHAR (20)  NOT NULL,
        account       VARCHAR (100) NOT NULL,
        hash_password TEXT          NOT NULL,
        createdat     DATETIME      NOT NULL
                                    DEFAULT (CURRENT_TIMESTAMP),
        deletedat     DATETIME,
        collect       INTEGER       DEFAULT (0) 
        );`,
    },
    {
        tablename:'categories',
        sql:`
        CREATE TABLE categories (
            id      INTEGER      PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50) NOT NULL,
            enabled BOOLEAN DEFAULT false
        );`
    }
]

export default sql


// 修改表结构
// try {
//     // 开始事务
//     db.transaction(() => {
//         // 创建临时表保存原始数据
//         db.prepare('CREATE TABLE categories_backup AS SELECT * FROM categories').run();
//         // 删除原始表
//         db.prepare('DROP TABLE categories').run();
//         // 创建新表
//         db.prepare(`
//             CREATE TABLE categories (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 name VARCHAR(50) NOT NULL,
//                 enabled BOOLEAN DEFAULT false
//             )
//         `).run();
//         // 将数据从临时表迁移到新表
//         db.prepare('INSERT INTO categories SELECT * FROM categories_backup').run();
//         // 删除临时表
//         db.prepare('DROP TABLE categories_backup').run();
//     })();

// } catch (error) {
//     // 处理事务中的错误
//     console.error('Transaction failed:', error);
// }