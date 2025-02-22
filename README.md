# Binance-MT4 价格同步服务

这是一个将币安(Binance)实时价格数据同步到 MetaTrader 4 (MT4) 的服务器应用。通过自定义服务器连接方式，无需使用 EA 即可在 MT4 中查看币安的加密货币实时价格。

## 功能特点

- 实时同步币安价格数据到 MT4
- 支持多个交易对 (BTC/USD, ETH/USD, BNB/USD)
- 无需 EA，直接通过服务器连接
- 支持多客户端同时连接
- 自动重连机制
- 可配置的价格点差

## 系统要求

- Node.js 14.0 或更高版本
- MetaTrader 4 客户端
- 稳定的网络连接

## 安装步骤

1. 克隆或下载项目代码
2. 安装依赖：
```bash
npm install
```

## 配置说明

### 环境变量配置
创建 `.env` 文件（基于 `.env.example`）：
```
PORT=3000
```

### 服务器配置
配置文件位置：`src/config/server.js`
- 可修改服务器端口
- 可配置交易对信息
- 可调整点差设置

## 启动服务器

开发环境：
```bash
npm run dev
```

生产环境：
```bash
npm start
```

## MT4 客户端设置

1. 打开 MT4 客户端
2. 进入菜单 "工具" -> "选项" -> "服务器"
3. 点击 "新建" 添加自定义服务器
4. 填写服务器信息：
   - 服务器地址：`localhost:443`（如部署在服务器上，使用对应的IP或域名）
   - 描述：Binance Price Feed

5. 使用新服务器登录：
   - 登录账号：任意
   - 密码：任意

## 项目结构

```
├── src/
│   ├── config/
│   │   ├── binance.js     # 币安配置
│   │   └── server.js      # 服务器配置
│   ├── services/
│   │   ├── binanceService.js    # 币安数据服务
│   │   └── mt4ServerService.js  # MT4服务器服务
│   └── server.js          # 主服务器入口
├── .env.example           # 环境变量示例
└── package.json           # 项目配置
```

## 价格更新机制

1. 通过 WebSocket 连接获取币安实时价格
2. 服务器处理并转换价格数据格式
3. 通过自定义服务器协议推送到 MT4 客户端
4. MT4 客户端实时显示更新的价格

## 常见问题

1. **无法连接到服务器**
   - 检查服务器是否正常运行
   - 确认端口号配置正确
   - 检查防火墙设置

2. **价格不更新**
   - 检查币安 WebSocket 连接状态
   - 查看服务器日志是否有错误信息
   - 确认 MT4 客户端网络连接正常

3. **点差异常**
   - 检查 `mt4ServerService.js` 中的点差计算逻辑
   - 可根据需要调整点差设置

## 注意事项

- 本服务仅提供价格数据展示，不支持交易功能
- 建议在实际使用前充分测试
- 确保服务器具有稳定的网络连接
- 定期检查日志以监控服务运行状态

## 开发者说明

### 添加新交易对

1. 在 `src/config/server.js` 中添加新的交易对配置
2. 在 `src/config/binance.js` 中更新订阅列表
3. 重启服务器生效

### 自定义点差

修改 `src/services/mt4ServerService.js` 中的价格计算逻辑：
```javascript
bid: price,
ask: price + (price * 0.0001) // 调整点差比例
```

## 安全建议

- 在生产环境中使用 HTTPS
- 添加适当的访问控制
- 定期更新依赖包
- 监控服务器资源使用情况

## 技术支持

如遇到问题，请：
1. 查看服务器日志
2. 检查配置文件
3. 确认网络连接状态
4. 查看常见问题解答