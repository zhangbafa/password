import crypto from 'crypto'

let masterPassword = ''
// 生成随机的加密密钥和初始化向量（IV）
const generateRandomKeyAndIV = (password) => {
    const sha256Hash = crypto.createHash('sha256');
    const len = password.length > 10 ? 10:password.length
    for (let i = 0; i < len; i++) {
      sha256Hash.update(password, 'utf-8');
    }
    const hashedData = sha256Hash.digest('hex');
    const securitykey = hashedData.substring(31, 31 + 32);
    const securityiv = hashedData.substring(hashedData.length - 16 - 16, hashedData.length - 16);
    const key = Buffer.from(securitykey);
    const iv = Buffer.from(securityiv);
    return { key, iv };
};

// 加密数据
const encrypt = (data, key, iv) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(data, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// 解密数据
const decrypt = (encryptedData, key, iv) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};


const setMasterPassword = (newPassword) => {
  masterPassword = newPassword
}
// 示例用法
// const plaintext = 'Hello, world!';
// const { key, iv } = generateRandomKeyAndIV();

// const encryptedData = encrypt(plaintext, key, iv);
// console.log('Encrypted:', encryptedData);

// const decryptedData = decrypt(encryptedData, key, iv);
// console.log('Decrypted:', decryptedData);

export { generateRandomKeyAndIV, encrypt, decrypt,masterPassword,setMasterPassword };

