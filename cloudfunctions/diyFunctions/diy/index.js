const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();

  try {
    if (event.data.hasOwnProperty('_id')) {
      // 更新配置单
      await db.collection('diy').where({
        _id: event.data._id
      }).update({
        data: {
          updateTime: new Date(),
          ...event.data
        }
      });
      return {
        success: true,
        _id: event.data._id
      };
    } else {
      // 添加配置单
      const result = await db.collection('diy').add({
        data: {
          user: wxContext.OPENID,
          updateTime: new Date(),
          ...event.data
        }
      });

      // 生成配置分享二维码
      const fileid = await genQRCode(result._id)
      await db.collection('diy').where({
        _id: result._id
      }).update({
        data: {
          qrImage: fileid
        }
      });

      return {
        success: true,
        _id: result._id
      };
    }
    return {
      success: true
    };
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: false,
      message: e
    };
  }
};


async function genQRCode(diyid) {
  // 获取小程序二维码的buffer
  const resp = await cloud.openapi.wxacode.get({
    path: 'pages/detail/detail?id=' + diyid
  });
  const { buffer } = resp;
  // 将图片上传云存储空间
  const upload = await cloud.uploadFile({
    cloudPath: 'qrcode_' + diyid + '_' + parseInt(Math.random() * 10**10) + '.png',
    fileContent: buffer
  });
  return upload.fileID;
}