# git基本操作指南
## 安装git 
自行谷歌

安装完成后需要设置用户名和邮箱，以下加了--global参数表示你这台机器上所有的Git仓库都会使用这个配置，当然也可以对某个仓库指定不同的用户名和Email地址。
```shell
 git config --global user.name "Your Name"
 git config --global user.email "email@example.com"
```
## 配置SSH
不管是 gitlab 还是 github 都可以通过 ssh 的协议对远程仓库进行操作。这时需要配置本地的 ssh key，运行
```shell
 ssh-keygen -t rsa -b 4096 -C "you_email@example.com"

 -t 选择算法：rsa/dsa/ecdsa
 -f 指定文件名，也可在后续enter file in which to save the key环节输入文件名
 -b 位数
```
之后就会在 ~/.ssh 目录下生成一对免密的 ssh key 公钥(id_rsa.pub)和私钥(id_rsa)，运行
```shell
cat ~/.ssh/id_rsa.pub
```
会输出公钥的内容，复制这些内容，然后添加到 gitlab或者github 设置里面
 

### 管理多个SSH key
可在.ssh目录下新建一个config文件配置一下，就能解决gitlab与github的ssh key的冲突。  
以上述方式生成两个不同名的ssh key：（比如id_rsa_github  id_rsa_gitlab）  
在 ~/.ssh 目录下新建一个config文件
```shell
touch config
```
打开该文件，并添加以下内容
```shell
open config
```
```shell
Host *.github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_rsa_github

Host code.byted.org （gitlab.com）
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_rsa_gitlab
```
然后
```shell
ssh-add -K ~/.ssh/id_rsa_gitlab
ssh-add -K ~/.ssh/id_rsa_github
```
如果不 work 的话，可能是 ssh-agent 没有正常启动，尝试运行下面的指令
```shell
eval "$(ssh-agent -s)"
```
http://xuyuan923.github.io/2014/11/04/github-gitlab-ssh/

## 开发流程
前面大概说一下开发环境的搭建，后面将开发环境单独整理成一个文档：
* 编辑器
  - vscode(相关插件的一个补充介绍，补充如何用settings sync同步配置)  
  - webstorm

* 浏览器插件（学习使用如何开发调试查看性能）
* 环境
  - git(分布式管理，协同开发)
  - nodejs(后端)
  - npm(包管理库) 
  - nrm(源管理库)

## 开发流程中git使用
拉取代码  
```shell
git clone mastercode
```
在存放项目代码的目录下执行
```shell
git checkout 要开发的分支//切换到要开发的分支
git checkout -b 自己开发的分支  //新建一个本地分支 一般以正在开发的分支名+“-自己的名字命名”
等价于git branch branchname + git checkout branchname
```
安装依赖
```shell
npm install
或者 npm i
```
运行项目  
1. sangfor:  
npm build //打包及生成依赖的第三方库文件  
进行调试，访问 https://localhost:8090/ui     
npm dev   
用代理进行本地测试：
https://200.200.120.232:8090/ui/_login.html?remote=https://10.122.118.20#/index  
本地ip:  cmd->ipconfig  200.200.120.232  
本地端口：  代码里设置的  
远程ip: mgr提供的  https://10.122.118.20:8080  
2. bytedance  
npm start

### 提交代码
查看工作区和暂存区状态
```shell
git status 
```
如果git status告诉你有文件被修改过，用git diff可以查看修改内容

将工作区的文件提交到暂存区
```shell
git add 
```
 - git add [file1] [file2]  添加指定文件到暂存区（能追踪到新的指定文件）
 - git add dir/     添加指定目录(整个文件夹)到暂存区
 - git add *.html   添加某个文件类型到暂存区
 - git add ./*  提交新文件(new)和被修改(modified)文件，不包括被删除(deleted)文件
 - git add -u  提交被修改(modified)和被删除(deleted)文件，不包括新文件(new)
 - git add -A  提交所有变化  
 注：Git 2.0版本中  git add . 等价于 git add -A


 将暂存区的文件提交到本地仓库并添加提交说明
```shell
git commit -m "本次提交的说明" 
```
撤销操作
```shell
git reset  撤销到（回滚）某次提交,作用的是文件或commit，改变历史，只对本地分支有效，对远程分支无效
git revert   放弃某次提交，作用的是commit，之前的提交仍会保留在git log中，而此次撤销会做为一次新的提交。
```
已经修改了文件（新建文件没法追踪），还未进行git add：
 - git checkout .   (所有文件) 
 - git checkout [filename]  （单个文件）
 注：modified是根据内容判断的，不是文件名

 已git add, 还未git commit
 - git reset [filename]   回到add前(撤销暂存区最近的一次提交，但工作区的内容不变)
 - git reset
 等价于
 - git reset HEAD [filename] 
 - git reset HEAD

 - git reset --hard  重置暂存区和工作区，回退到最近一次提交的版本内容
 - git reset --hard HEAD^  重置暂存区和工作区，回退到最近一次提交的上一个版本

 已git commit, 还未git push
 - git reset --hard 恢复的分支名

 已git push
 - git reset --hard HEAD^   git push -f


 将当前的分支指针指向为指定commit（该提交之后的提交都会被移除）,同时重置暂存区，但工作区不变
 - git reset <commit>
 将当前的分支指针指向为指定commit（该提交之后的提交都会被移除）,但保持暂存区和工作区不变
 - git reset --soft <commit>
 将当前的分支指针指向为指定commit（该提交之后的提交都会被移除）,同时重置暂存区和工作区
 - git reset --hard <commit>

###  代码提交规范
进行本地测试后，没问题要保存代码打包给后端/测试去试
- sfx build
然后将code\packages\eps_webui\manager_www目录里的dist打包压缩发给后端/测试

功能完成后，先查看改动文件，筛选一遍不必要的改动，然后本地分支提交改动
- git status  查看此次改动的文件
- git add 改动的文件 
- git commit -m "22 34" // 提交改动的文件
- 不要一次性提交多个文件，分多次提交代码：mock数据、常量表、改动的模块，这样便于别人审核你的代码

提交后，可能开发分支在我们开发的过程中有了新的变化，我们需要同步这些新变化，所以需先切换回开发分支，pull一下，确保你的代码已经更新到最新
- git checkout 开发分支 
- git pull
等价于 git fetch origin branchname git merge origin/branchname


再切回到个人分支，合并代码，如有冲突需要解决
- git checkout 个人分支 
- git merge --ff 开发分支  （esc  :wq）

推送分支到远程个人分支
- git push origin 本地分支名：远程分支名（git push origin branchname）

个人分支 提交合并请求（） ——> 开发分支 // 前端同事审核
1. 详细填写改动原因、可能影响的模块，本地测试、联调测试情况
2. 再次检查改动的文件，确保无误后提交
3. 将合并请求网站发给审核人便于审核人检查，合并后及时通知后端、测试代码已合入



### 删除分支
删除本地分支
git branch -d 分支名

删除远程分支
- git push origin --delete 分支名


## 其他命令
初始化一个git仓库
```shell
git init
```
查看本地命令历史
```shell
git reflog 
```
显示的是一个HEAD指向发生改变的时间列表：（checkout）切换分支、（commit）提交、（reset）撤销提交时，HEAD指向会改变  

查看提交历史
```shell
git log  
```
byte dancer:
Master:   
个人开发分支feature  bugfix，开发无误后会删除feature
当完成一个阶段性任务后，需要发版，这个版本会基于master切一个release分支，同时这个版本会交给测试测，在测的过程中发现问题，基于release分支改动，最终没问题，发布，改动也会合入master,同时这个release分支保留
当上线后，如果发现问题，会在release分支上进行修改，为hotfix，改动完的版本会代替原来的release，改动也会合入master

 
 
 