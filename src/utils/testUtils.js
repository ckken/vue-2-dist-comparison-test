// 测试工具函数
export function generateContent(type = 'default') {
  const timestamp = Date.now()
  
  switch (type) {
    case 'version1':
      return `这是版本1的内容 - ${timestamp}`
    case 'version2':
      return `这是版本2的内容 - ${timestamp}`
    case 'static':
      return '这是静态内容，不会改变'
    default:
      return `默认内容 - ${timestamp}`
  }
}

export function calculateHash(content) {
  // 简单的hash函数模拟
  let hash = 0
  if (content.length === 0) return hash
  
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  
  return Math.abs(hash).toString(16)
}

export function createTestFile(content) {
  return {
    content,
    hash: calculateHash(content),
    timestamp: Date.now()
  }
}