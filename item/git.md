###git
 git config --global user.name "Your Name"
 git config --global user.email "email@example.com"
 
 初始化一个git仓库 git init


 git reflog  查看本地命令历史
 显示的是一个HEAD指向发生改变的时间列表：（checkout）切换分支、（commit）提交、（reset）撤销提交时，HEAD指向会改变


 git log  查看提交历史
 
 git status 查看工作区和暂存区状态
 如果git status告诉你有文件被修改过，用git diff可以查看修改内容
 
 git add    将工作区的文件提交到暂存区
 - git add [file1] [file2]  添加指定文件到暂存区（能追踪到新的指定文件）
 - git add dir/     添加指定目录(整个文件夹)到暂存区
 - git add *.html   添加某个文件类型到暂存区
 - git add ./*  提交新文件(new)和被修改(modified)文件，不包括被删除(deleted)文件
 - git add -u  提交被修改(modified)和被删除(deleted)文件，不包括新文件(new)
 - git add -A  提交所有变化  
 注：Git 2.0版本中  git add . 等价于 git add -A

 git commit -m "本次提交的说明"   将暂存区的文件提交到本地仓库并添加提交说明

 撤销操作
 git reset  撤销到某次提交,作用的是文件或commit
 git revert   撤销某次提交，作用的是commit

 checkout 撤销工作区的文件
 reset    撤销工作区/暂存区的文件


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


#### 开发
1.安装sfx

2.拉取代码（登陆公司的gitlab，账号密码和bbs是相同的，然后添加sshkey，方法后面补充）  
拉取步骤：  
- 在本地创建一个文件夹存代码，然后在那个文件夹右键点击git bash here
- git clone mastercode  

3.安装项目代码，在该目录下执行
- git checkout 要开发的分支//切换到要开发的分支
- git checkout -b 自己开发的分支  //新建一个本地分支 一般以正在开发的分支名+“-自己的名字命名”
等价于git branch branchname + git checkout branchname
- yarn install //安装依赖
- sfx build //打包及生成依赖的第三方库文件

4.进行调试，访问 https://localhost:8090/ui   
- sfx dev
用代理进行本地测试：
https://200.200.120.232:8090/ui/_login.html?remote=https://10.122.118.20#/index
本地ip:  cmd->ipconfig  200.200.120.232
本地端口：  代码里设置的
远程ip: mgr提供的  https://10.122.118.20:8080


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
