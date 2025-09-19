import { promises as fs } from 'fs'
import { execSync } from 'child_process'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Worker } from 'worker_threads'

// 获取当前脚本所在目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 项目路径配置
const PROJECT_ROOT = __dirname
const SRC_DIR = path.join(PROJECT_ROOT, 'src')
const COMPONENTS_DIR = path.join(SRC_DIR, 'components')
const TEST_COMPONENT_PATH = path.join(COMPONENTS_DIR, 'TestComponent.vue')
const BACKUP_PATH = path.join(PROJECT_ROOT, 'TestComponent.vue.backup')
const DIST_DIR = path.join(PROJECT_ROOT, 'dist')

const runBuildTimes = 5

// 计算文件hash值
async function calculateFileHash(filePath) {
  try {
    const content = await fs.readFile(filePath)
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 8)
  } catch (error) {
    return null
  }
}

// 递归获取目录下所有文件
async function getAllFiles(dir, fileList = []) {
  const files = await fs.readdir(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = await fs.stat(filePath)

    if (stat.isDirectory()) {
      await getAllFiles(filePath, fileList)
    } else {
      fileList.push(filePath)
    }
  }

  return fileList
}

// 分析dist目录内容（仅JS文件）
async function analyzeDistContent(distPath) {
  // console.log(`\n📁 分析目录: ${distPath}`)

  if (!await fs.access(distPath).then(() => true).catch(() => false)) {
    // console.log(`❌ ${distPath} 目录不存在`)
    return {}
  }

  const files = await getAllFiles(distPath)
  const analysis = {}

  for (const file of files) {
    const relativePath = path.relative(distPath, file)
    // 只处理 JS 文件
    if (relativePath.endsWith('.js')) {
      const hash = await calculateFileHash(file)
      const stats = await fs.stat(file)

      analysis[relativePath] = {
        hash,
        size: stats.size,
        fullPath: file
      }
    }
  }

  // const jsFileCount = Object.keys(analysis).length
  // console.log(`📊 找到 ${jsFileCount} 个JS文件`)

  return analysis
}

// 修改TestComponent.vue内容
async function modifyTestComponent() {
  console.log(`\n✏️  修改 TestComponent.vue 内容...`)
  console.log(`📁 组件路径: ${TEST_COMPONENT_PATH}`)

  const newContent = `<template>
  <div class="test-component enhanced">
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <div class="stats">
      <span>点击次数: {{ clickCount }}</span>
      <span>最后更新: {{ lastUpdate }}</span>
    </div>
    <div class="button-group">
      <button @click="updateContent" class="primary">更新内容</button>
      <button @click="resetContent" class="secondary">重置内容</button>
      <button @click="addRandomContent" class="accent">添加随机内容</button>
    </div>
    <div class="content-history" v-if="history.length > 0">
      <h3>历史记录:</h3>
      <ul>
        <li v-for="(item, index) in history" :key="index">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestComponent',
  data() {
    return {
      title: '增强测试组件 v2.0',
      content: '这是修改后的初始内容',
      clickCount: 0,
      lastUpdate: '',
      history: []
    }
  },
  methods: {
    updateContent() {
      this.clickCount++
      this.lastUpdate = new Date().toLocaleTimeString()
      this.content = \`内容已更新 #\${this.clickCount} - \${this.lastUpdate}\`
      this.history.push(\`更新 #\${this.clickCount}: \${this.lastUpdate}\`)
    },
    resetContent() {
      this.content = '这是修改后的初始内容'
      this.clickCount = 0
      this.lastUpdate = ''
      this.history = []
    },
    addRandomContent() {
      const randomTexts = [
        '随机内容A: 测试数据变化',
        '随机内容B: 动态更新验证', 
        '随机内容C: Hash值变化测试',
        '随机内容D: 构建差异检测'
      ]
      this.content = randomTexts[Math.floor(Math.random() * randomTexts.length)]
      this.lastUpdate = new Date().toLocaleTimeString()
    }
  }
}
</script>

<style scoped>
.test-component {
  padding: 25px;
  border: 2px solid #007bff;
  border-radius: 12px;
  margin: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.enhanced {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

h2 {
  color: #007bff;
  margin-bottom: 15px;
  font-size: 1.5em;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

p {
  color: #495057;
  margin-bottom: 20px;
  font-size: 1.1em;
  line-height: 1.5;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  font-size: 0.9em;
  color: #6c757d;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

button {
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.primary {
  background-color: #007bff;
  color: white;
}

.primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.secondary {
  background-color: #6c757d;
  color: white;
}

.secondary:hover {
  background-color: #545b62;
  transform: translateY(-2px);
}

.accent {
  background-color: #28a745;
  color: white;
}

.accent:hover {
  background-color: #1e7e34;
  transform: translateY(-2px);
}

.content-history {
  border-top: 1px solid #dee2e6;
  padding-top: 15px;
}

.content-history h3 {
  color: #495057;
  font-size: 1.1em;
  margin-bottom: 10px;
}

.content-history ul {
  list-style: none;
  padding: 0;
}

.content-history li {
  background: #fff;
  padding: 8px 12px;
  margin-bottom: 5px;
  border-radius: 4px;
  border-left: 3px solid #007bff;
  font-size: 0.9em;
}
</style>`

  await fs.writeFile(TEST_COMPONENT_PATH, newContent, 'utf8')
  console.log(`✅ TestComponent.vue 内容已修改`)
}

// Worker构建脚本内容
const workerScript = `
const { parentPort, workerData } = require('worker_threads');
const { execSync } = require('child_process');
const path = require('path');

const { buildId, buildDir, projectRoot } = workerData;

try {
  // 创建临时构建目录（使用绝对路径）
  const fullBuildDir = path.join(projectRoot, buildDir);
  execSync(\`mkdir -p \${fullBuildDir}\`, { stdio: 'pipe' });
  
  // 执行构建（在项目根目录下）
  execSync('npm run build', { 
    stdio: 'pipe',
    cwd: projectRoot
  });
  
  // 复制构建结果到临时目录（使用绝对路径）
  const distDir = path.join(projectRoot, 'dist');
  execSync(\`cp -r \${distDir}/* \${fullBuildDir}/\`, { stdio: 'pipe' });
  
  parentPort.postMessage({ 
    success: true, 
    buildId, 
    buildDir,
    message: \`构建 \${buildId} 完成\`
  });
} catch (error) {
  parentPort.postMessage({ 
    success: false, 
    buildId, 
    buildDir,
    error: error.message 
  });
}
`;

// 并行构建测试（使用Worker进程）
async function runParallelBuilds(buildCount = 3) {
  console.log(`\n🔄 开始 ${buildCount} 次Worker并行构建...`)
  console.log(`⚡ 使用真正的并行Worker进程，测试高负载下构建一致性`)

  // 创建临时目录统一管理所有临时文件
  const tempDir = path.join(PROJECT_ROOT, 'temp-test-files');
  await fs.mkdir(tempDir, { recursive: true });
  console.log(`📁 创建临时目录: ${tempDir}`);

  // 创建临时worker脚本文件
  const workerScriptPath = path.join(tempDir, 'build-worker.js');
  await fs.writeFile(workerScriptPath, workerScript, 'utf8');

  const workerPromises = [];

  for (let i = 1; i <= buildCount; i++) {
    const buildDir = path.join(tempDir, `build-${i}`);

    const workerPromise = new Promise((resolve, reject) => {
      console.log(`🏗️  启动Worker构建 ${i}/${buildCount}...`);

      const worker = new Worker(workerScriptPath, {
        workerData: {
          buildId: i,
          buildDir: path.relative(PROJECT_ROOT, buildDir),
          projectRoot: PROJECT_ROOT
        }
      });

      worker.on('message', (result) => {
        if (result.success) {
          console.log(`✅ ${result.message}`);
          resolve({ buildId: result.buildId, buildDir: result.buildDir });
        } else {
          console.log(`❌ 构建 ${result.buildId} 失败: ${result.error}`);
          reject(new Error(result.error));
        }
        worker.terminate();
      });

      worker.on('error', (error) => {
        console.log(`❌ Worker ${i} 错误:`, error.message);
        reject(error);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker ${i} 异常退出，代码: ${code}`));
        }
      });
    });

    workerPromises.push(workerPromise);
  }

  try {
    const results = await Promise.all(workerPromises);
    console.log(`🎉 所有 ${buildCount} 次Worker构建完成!`);

    return { results, tempDir };
  } catch (error) {
    console.log(`❌ Worker并行构建过程中出现错误:`, error.message);

    return { results: [], tempDir };
  }
}

// 对比构建结果（包含修改前后对比）
async function compareBuildsWithModified(originalDist, modifiedDist, buildResults) {
  console.log(`\n📊 开始详细对比构建结果...`)
  console.log(`🔍 项目根目录: ${PROJECT_ROOT}`)
  console.log(`📁 构建目录: ${DIST_DIR}`)

  // 分析所有构建结果
  const buildAnalyses = []

  console.log(`\n🔄 分析 ${buildResults.length} 个并行构建结果`)
  for (const result of buildResults) {
    const analysis = await analyzeDistContent(result.buildDir)
    buildAnalyses.push({ ...result, analysis })
  }

  // 对比原始dist和修改后dist的差异（表格格式）
  console.log(`\n🔍 ===== JS文件构建对比详细分析表格 =====`)
  console.log(`📋 本表格展示修改前后JS文件的详细变化情况，包括文件哈希值、大小变化等关键信息`)
  let diffCount = 0
  let totalFiles = 0
  let addedFiles = 0
  let deletedFiles = 0
  let modifiedFiles = 0
  let totalSizeChange = 0

  const allFiles = new Set([
    ...Object.keys(originalDist),
    ...Object.keys(modifiedDist)
  ])

  // 表格头部
  console.log('┌─────────────────────────────────────────┬──────────┬─────────────┬─────────────┬──────────────┬─────────────┐')
  console.log('│ JS文件名                                │ 状态     │ 原始Hash    │ 修改Hash    │ 大小变化     │ 结果        │')
  console.log('├─────────────────────────────────────────┼──────────┼─────────────┼─────────────┼──────────────┼─────────────┤')

  for (const file of Array.from(allFiles).sort()) {
    totalFiles++
    const originalHash = originalDist[file]?.hash || 'N/A'
    const modifiedHash = modifiedDist[file]?.hash || 'N/A'
    const originalSize = originalDist[file]?.size || 0
    const modifiedSize = modifiedDist[file]?.size || 0

    let status, displayOriginalHash, displayModifiedHash, sizeChange, result

    if (originalHash !== modifiedHash) {
      diffCount++
      const sizeDiff = modifiedSize - originalSize
      totalSizeChange += sizeDiff
      const sizeChangeValue = sizeDiff > 0 ? `+${sizeDiff}B` : `${sizeDiff}B`

      if (originalHash === 'N/A') {
        addedFiles++
        status = '新增'
        displayOriginalHash = '-'
        displayModifiedHash = modifiedHash.substring(0, 8)
        sizeChange = `+${modifiedSize}B`
        result = '✅ 正常'
      } else if (modifiedHash === 'N/A') {
        deletedFiles++
        status = '删除'
        displayOriginalHash = originalHash.substring(0, 8)
        displayModifiedHash = '-'
        sizeChange = `-${originalSize}B`
        result = '⚠️  移除'
      } else {
        modifiedFiles++
        status = '修改'
        displayOriginalHash = originalHash.substring(0, 8)
        displayModifiedHash = modifiedHash.substring(0, 8)
        sizeChange = sizeChangeValue
        result = '🔄 变化'
      }
    } else {
      status = '不变'
      displayOriginalHash = originalHash.substring(0, 8)
      displayModifiedHash = modifiedHash.substring(0, 8)
      sizeChange = '0B'
      result = '✅ 一致'
    }

    // 格式化文件名（截断过长的文件名）
    const fileName = file.length > 35 ? file.substring(0, 32) + '...' : file

    console.log(`│ ${fileName.padEnd(39)} │ ${status.padEnd(8)} │ ${displayOriginalHash.padEnd(11)} │ ${displayModifiedHash.padEnd(11)} │ ${sizeChange.padEnd(12)} │ ${result.padEnd(11)} │`)
  }

  console.log('└─────────────────────────────────────────┴──────────┴─────────────┴─────────────┴──────────────┴─────────────┘')

  const diffRate = totalFiles > 0 ? (diffCount / totalFiles * 100).toFixed(2) : 0
  const sizeChangeStr = totalSizeChange > 0 ? `+${totalSizeChange}` : `${totalSizeChange}`

  // 统计表格
  console.log(`\n📊 ===== JS文件统计汇总表 =====`)
  console.log('┌─────────────────┬──────────┬─────────────┐')
  console.log('│ 统计项目        │ 数量     │ 百分比      │')
  console.log('├─────────────────┼──────────┼─────────────┤')
  console.log(`│ 总JS文件数      │ ${totalFiles.toString().padEnd(8)} │ 100.00%     │`)
  console.log(`│ 发生变化        │ ${diffCount.toString().padEnd(8)} │ ${diffRate.padEnd(7)}%   │`)
  console.log(`│ 新增文件        │ ${addedFiles.toString().padEnd(8)} │ ${(addedFiles / totalFiles * 100).toFixed(2).padEnd(7)}%   │`)
  console.log(`│ 修改文件        │ ${modifiedFiles.toString().padEnd(8)} │ ${(modifiedFiles / totalFiles * 100).toFixed(2).padEnd(7)}%   │`)
  console.log(`│ 删除文件        │ ${deletedFiles.toString().padEnd(8)} │ ${(deletedFiles / totalFiles * 100).toFixed(2).padEnd(7)}%   │`)
  console.log(`│ 无变化文件      │ ${(totalFiles - diffCount).toString().padEnd(8)} │ ${((totalFiles - diffCount) / totalFiles * 100).toFixed(2).padEnd(7)}%   │`)
  console.log(`│ 总大小变化      │ ${(sizeChangeStr + 'B').padEnd(8)} │ -           │`)
  console.log('└─────────────────┴──────────┴─────────────┘')

  // 验证并行构建结果与修改后dist的一致性（表格格式）
  console.log(`\n🔄 ===== 并行构建一致性验证详细表格 =====`)
  console.log(`📋 本表格验证修改后构建与并行构建结果的一致性，确保构建过程的确定性`)
  if (buildAnalyses.length > 0) {
    const firstBuild = buildAnalyses[0]
    let consistentCount = 0
    let totalComparisons = 0
    let inconsistentFiles = []

    console.log(`\n📋 修改后构建 vs 并行构建 #${firstBuild.buildId} 详细对比分析:`)

    // 表格头部
    console.log('┌─────────────────────────────────────────┬─────────────┬─────────────┬──────────────┬─────────────┐')
    console.log('│ JS文件名                                │ 修改后Hash  │ 并行Hash    │ 大小对比     │ 一致性      │')
    console.log('├─────────────────────────────────────────┼─────────────┼─────────────┼──────────────┼─────────────┤')

    for (const file of Object.keys(modifiedDist).sort()) {
      totalComparisons++
      const modifiedHash = modifiedDist[file]?.hash
      const buildHash = firstBuild.analysis[file]?.hash
      const modifiedSize = modifiedDist[file]?.size || 0
      const buildSize = firstBuild.analysis[file]?.size || 0

      const fileName = file.length > 35 ? file.substring(0, 32) + '...' : file
      const modHashDisplay = modifiedHash ? modifiedHash.substring(0, 8) : 'N/A'
      const buildHashDisplay = buildHash ? buildHash.substring(0, 8) : 'N/A'
      const sizeComparison = `${modifiedSize}B vs ${buildSize}B`

      if (modifiedHash === buildHash && modifiedSize === buildSize) {
        consistentCount++
        console.log(`│ ${fileName.padEnd(39)} │ ${modHashDisplay.padEnd(11)} │ ${buildHashDisplay.padEnd(11)} │ ${sizeComparison.padEnd(12)} │ ✅ 一致     │`)
      } else {
        inconsistentFiles.push({
          file,
          modifiedHash,
          buildHash,
          modifiedSize,
          buildSize
        })
        console.log(`│ ${fileName.padEnd(39)} │ ${modHashDisplay.padEnd(11)} │ ${buildHashDisplay.padEnd(11)} │ ${sizeComparison.padEnd(12)} │ ❌ 不一致   │`)
      }
    }

    console.log('└─────────────────────────────────────────┴─────────────┴─────────────┴──────────────┴─────────────┘')

    const consistencyRate = totalComparisons > 0 ? (consistentCount / totalComparisons * 100).toFixed(2) : 0

    // 一致性统计表格
    console.log(`\n📊 ===== 一致性统计表 =====`)
    console.log('┌─────────────────┬──────────┬─────────────┐')
    console.log('│ 统计项目        │ 数量     │ 百分比      │')
    console.log('├─────────────────┼──────────┼─────────────┤')
    console.log(`│ 总对比文件      │ ${totalComparisons.toString().padEnd(8)} │ 100.00%     │`)
    console.log(`│ 一致文件        │ ${consistentCount.toString().padEnd(8)} │ ${consistencyRate.padEnd(7)}%   │`)
    console.log(`│ 不一致文件      │ ${inconsistentFiles.length.toString().padEnd(8)} │ ${(100 - parseFloat(consistencyRate)).toFixed(2).padEnd(7)}%   │`)
    console.log('└─────────────────┴──────────┴─────────────┘')

    if (inconsistentFiles.length > 0) {
      console.log(`\n⚠️  不一致文件详情:`)
      inconsistentFiles.forEach(item => {
        console.log(`   🔍 ${item.file}: 可能存在构建不确定性`)
      })
    }
  } else {
    console.log(`   ⚠️  没有并行构建结果可供对比`)
  }

  // 简化输出 - 仅显示JS文件对比结果
  console.log(`\n✅ JS文件构建对比测试完成`)

  // 临时构建目录将在主函数中统一清理
}

// 备份和恢复TestComponent
async function backupTestComponent() {
  console.log(`📁 备份路径: ${BACKUP_PATH}`)

  try {
    const content = await fs.readFile(TEST_COMPONENT_PATH, 'utf8')
    await fs.writeFile(BACKUP_PATH, content, 'utf8')
    console.log('✅ TestComponent.vue 已备份')
    return content
  } catch (error) {
    console.log('❌ 备份TestComponent.vue失败:', error.message)
    return null
  }
}

async function restoreTestComponent() {
  try {
    const content = await fs.readFile(BACKUP_PATH, 'utf8')
    await fs.writeFile(TEST_COMPONENT_PATH, content, 'utf8')
    await fs.unlink(BACKUP_PATH)
  } catch (error) {
    console.log('❌ 恢复TestComponent.vue失败:', error.message)
  }
}

// 主函数
async function main() {
  console.log('🚀 ===== Vue CLI 构建一致性完整测试 =====')
  console.log(`⏰ 测试开始时间: ${new Date().toLocaleString()}`)
  console.log(`🔧 Node.js版本: ${process.version}`)
  console.log(`🏠 项目根目录: ${PROJECT_ROOT}`)
  console.log(`📁 源码目录: ${SRC_DIR}`)
  console.log(`🧩 组件目录: ${COMPONENTS_DIR}`)
  console.log(`🎯 测试组件: ${path.basename(TEST_COMPONENT_PATH)}`)
  console.log(`💾 操作系统: ${process.platform} ${process.arch}`)
  console.log(`🔄 进程ID: ${process.pid}`)

  try {
    // 步骤1: 备份TestComponent并执行初始构建
    console.log('\n📋 步骤1: 备份TestComponent并执行初始构建')
    await backupTestComponent()
    execSync('npm run build', { stdio: 'inherit' })
    const originalDist = await analyzeDistContent('dist')

    // 步骤2: 修改TestComponent.vue内容并重新构建
    console.log('\n📋 步骤2: 修改TestComponent.vue内容并重新构建')
    await modifyTestComponent()
    execSync('npm run build', { stdio: 'inherit' })
    const modifiedDist = await analyzeDistContent('dist')

    // 步骤3: 执行并行构建验证一致性
    console.log('\n📋 步骤3: 执行并行构建验证一致性')
    const { results: buildResults, tempDir } = await runParallelBuilds(runBuildTimes)

    // 步骤4: 对比结果
    console.log('\n📋 步骤4: 对比构建结果')
    await compareBuildsWithModified(originalDist, modifiedDist, buildResults)

    // 步骤5: 清理所有临时文件
    console.log('\n📋 步骤5: 清理临时文件')
    try {
      await fs.rm(tempDir, { recursive: true, force: true })
      console.log(`✅ 已清理临时目录: ${tempDir}`)
    } catch (error) {
      console.log(`⚠️  清理临时目录失败: ${error.message}`)
    }

    // 步骤6: 恢复原始TestComponent
    await restoreTestComponent()

    console.log('\n🎉 完整测试流程完成!')
    console.log('\n🎉 测试完成！')

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message)
    process.exit(1)
  }
}

// 运行测试
main().catch(console.error)