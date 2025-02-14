/**
 *  读取所有md文件数据
 */
const fs = require('node:fs') // 文件模块
const path = require('node:path') // 路径模块
const chalk = require('chalk')
// 命令行打印美化
const log = console.log

function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir)
  files.forEach((item, index) => {
    const filePath = path.join(dir, item)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory() && item !== '.vuepress' && item !== '@pages') {
      readFileList(path.join(dir, item), filesList) // 递归读取文件
    }
    else {
      if (path.basename(dir) !== 'docs') { // 过滤docs目录级下的文件
        const filename = path.basename(filePath)
        const fileNameArr = filename.split('.')
        const firstDotIndex = filename.indexOf('.')
        const lastDotIndex = filename.lastIndexOf('.')

        let name = null; let type = null
        if (fileNameArr.length === 2) { // 没有序号的文件
          name = fileNameArr[0]
          type = fileNameArr[1]
        }
        else if (fileNameArr.length >= 3) { // 有序号的文件(或文件名中间有'.')
          name = filename.substring(firstDotIndex + 1, lastDotIndex)
          type = filename.substring(lastDotIndex + 1)
        }

        if (type === 'md') { // 过滤非md文件
          filesList.push({
            name,
            filePath,
          })
        }
      }
    }
  })
  return filesList
}

module.exports = readFileList
