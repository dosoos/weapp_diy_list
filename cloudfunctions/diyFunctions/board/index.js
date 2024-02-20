const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  // 用户资料
  const users = await db.collection('profile').where({
    user: wxContext.OPENID
  }).count();
  var userinfo = {}
  if (users.total > 0) {
    const profiles = await db.collection('profile').where({
      user: wxContext.OPENID
    }).limit(1) // 限制返回数量为 10 条
    .get()
    userinfo['avatar'] = profiles.data[0].avatar
    userinfo['nickname'] = profiles.data[0].nickname
  }
  return {
    success: true,
    data: {
      collect_count: await db.collection('collect').where({user: wxContext.OPENID}).count(),
      like_count: await db.collection('like').where({user: wxContext.OPENID}).count(),
      myself_count: await db.collection('diy').where({user: wxContext.OPENID}).count(),
      ...userinfo
    }
  }; 
};
