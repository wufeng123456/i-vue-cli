/**
 * 引入一大堆包
 */
const download = require('download-git-repo')  //用于下载远程仓库至本地 支持GitHub、GitLab、Bitbucket
const program = require('commander') //命令行处理工具
const exists = require('fs').existsSync  //node自带的fs模块下的existsSync方法，用于检测路径是否存在。（会阻塞）
const path = require('path') //node自带的path模块，用于拼接路径
const ora = require('ora') //用于命令行上的加载效果
const home = require('user-home')  //用于获取用户的根目录
const inquirer = require('inquirer') //用于命令行与开发者交互
const rm = require('rimraf').sync // 相当于UNIX的“rm -rf”命令
const logger = require('../lib/logger')

function init () {

  /**
   * 定义一大堆变量
   */
  let template = program.args[0]  //模板名称
  const hasSlash = template.indexOf('/') > -1
  const rawName = program.args[1]  //项目构建目录名
  const inPlace = !rawName || rawName === '.'  // 没写或者“.”，表示当前目录下构建项目
  const name = inPlace ? path.relative('../', process.cwd()) : rawName  //如果在当前目录下构建项目,当前目录名为项目构建目录名，否则是当前目录下的子目录【rawName】为项目构建目录名
  const to = path.resolve(rawName || '.') //项目构建目录的绝对路径
  const clone = program.clone || false  //是否采用clone模式，提供给“download-git-repo”的参数
  const tmp = path.join(home, '.vue-templates', template.replace(/[\/:]/g, '-'))  //远程模板下载到本地的路径
  const generate = require('../lib/generate')  //自定义工具-用于基于模板构建项目
   /**
    * 判断是否输入项目名  是 - 直接执行run函数  否- 询问开发者是否在当前目录下生成项目，开发者回答“是” 也执行run函数 否则不执行run函数
    */

  if (inPlace || exists(to)) {
    inquirer.prompt([{
      type: 'confirm',
      message: inPlace
        ? 'Generate project in current directory?'
        : 'Target directory exists. Continue?',
      name: 'ok'
    }]).then(answers => {
      if (answers.ok) {
        run()
      }
    }).catch(logger.fatal)
  } else {
    run()
  }
   
   /**
   * 定义主函数 run
   */
  function run () {
    if (!hasSlash) {  //官方模板还是第三方模板
      // use official templates
      // 从这句话以及download-git-repo的用法，我们得知了vue的官方的模板库的地址：https://github.com/vuejs-templates
      const officialTemplate = 'vuejs-templates/' + template
      if (template.indexOf('#') !== -1) {  //模板名是否带"#"
        downloadAndGenerate(officialTemplate) //下载模板
      } else {
        if (template.indexOf('-2.0') !== -1) { //是都带"-2.0"
            //发出警告
          warnings.v2SuffixTemplatesDeprecated(template, inPlace ? '' : name)
          return
        }

        // warnings.v2BranchIsNowDefault(template, inPlace ? '' : name)
        downloadAndGenerate(officialTemplate)//下载模板
      }
    } else {
      downloadAndGenerate(template)//下载模板
    }
  }
   
   /**
    * 定义下载模板并生产项目的函数 downloadAndGenerate
    */
  function downloadAndGenerate (template) {
    const spinner = ora('downloading template')  
    spinner.start()//显示加载状态
    // Remove if local template exists
    console.log(tmp)
    if (exists(tmp)) rm(tmp)  //当前模板库是否存在该模板，存在就删除
     //下载模板  template-模板名    tmp- 模板路径   clone-是否采用git clone模板   err-错误短信
      
    download(template, tmp, { clone }, err => {
      spinner.stop() //隐藏加载状态
      //如果有错误，打印错误日志
      if (err) console.log(`Failed to download repo ' + ${template} + ': ' + ${err.message.trim()}`)
      //渲染模板
      generate(name, tmp, to, err => {
        if (err) console.log(err)
        console.log()
        logger.success('Generated "%s".', name)
        console.log(`Generated "%s".${name}`)
      })
      console.log(tmp)
      console.log('download success')
    })
  }
}

module.exports = init