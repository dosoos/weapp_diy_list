const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  // 返回数据库查询结果
  const result = await db.collection('diy').doc(event.id).get();
  return {
    success: true,
    data: {
      owner: wxContext.OPENID == result.data.user,
      ...result.data
    }
  }
};
