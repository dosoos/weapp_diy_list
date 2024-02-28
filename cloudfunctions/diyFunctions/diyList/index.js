const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  console.log(event)
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  if (event.category == 'mydiys') {
      // 我的攒机列表
      return await db.collection('diy').aggregate().match({
        user: wxContext.OPENID
      })
      .lookup({
        from: 'profile',
        localField: 'user',
        foreignField: 'user',
        as: 'profiles',
      }).sort({
        createTime: -1
      }).end();
  }
  if (event.hasOwnProperty('search')) {
    // 搜索攒机器列表
    return await db.collection('diy').aggregate().match({
      title: db.RegExp({
        regexp: event.search,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      }),
    }).lookup({
      from: 'profile',
      localField: 'user',
      foreignField: 'user',
      as: 'profiles',
    }).end();
  }
  // 默认攒机器列表
  return await db.collection('diy').aggregate()
  .lookup({
    from: 'profile',
    localField: 'user',
    foreignField: 'user',
    as: 'profiles',
  }).sort({
    updateTime: -1
  }).end();
};
