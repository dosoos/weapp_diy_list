const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  const requestData = {}
  if ('avatar' in event) {
    requestData['avatar'] = event.avatar
  }
  if ('nickname' in event) {
    requestData['nickname'] = event.nickname
  }
  const users = await db.collection('profile').where({
    user: wxContext.OPENID
  }).count();
  if (users.total > 0) {
    // 更新个人资料
    await db.collection('profile').where({
      user: wxContext.OPENID
    }).update({
      data: requestData
    });
  } else {
    // 添加个人资料
    await db.collection('profile').add({
      data: {
        user: wxContext.OPENID,
        ...requestData
      }
    });
  }
  const profiles = await db.collection('profile').where({
    user: wxContext.OPENID
  }).limit(1).get()
  return {
    success: true,
    data: {
      avatar: profiles.data[0].avatar,
      nickname: profiles.data[0].nickname,
    }
  }; 
};
