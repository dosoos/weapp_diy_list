const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = await cloud.getWXContext();
  const collects = await db.collection('collect').where({ user: wxContext.OPENID }).get();
  return await db.collection('diy').where({
    _id: db.command.in(collects.data.map(item => item.diy))
  }).get();
};
