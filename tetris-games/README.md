#tetris-games
=======
# 俄罗斯方块前端工程

## 环境依赖
node

### 安装
```
npm install
```

### 运行
```
npm start
```

浏览自动打开 [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

### 打包编译
```
npm run build
```

在docs文件夹下生成结果。

## 使用技术
react+react-dom+react-redux+redux+redux-immutable+axios



## 项目结构
```
├─ docs    //编译后结果
├─ i18n.json // 多语言
├─ package.json 
├─ server // html模板
├─ src //源码
│  ├─ actions // 动作
│  ├─ components // 组件
│  ├─ containers // 游戏文件
│  ├─ control // 游戏控制
│  ├─ http // 请求，host修改api地址
│  ├─ index.js // 入口
│  ├─ pages // 页面
│  ├─ reducers // 状态
│  ├─ resource   // 静态资源
│  ├─ store // 状态管理
│  └─ unit // 插件
├─ w.config.js // common webpack 配置
├─ webpack.config.js // 开发webpack 配置
└─ webpack.production.config.js // 生产webpack 配置
```

### 发布部署说明

合并develop,自动执行流水线

