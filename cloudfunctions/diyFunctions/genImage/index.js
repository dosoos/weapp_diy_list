const cloud = require('wx-server-sdk');
const fs = require('node:fs');
const nodeHtmlToImage = require('node-html-to-image')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 创建集合云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const diyid = event.diyid;

  const diy = await db.collection('diy').doc(diyid).get()
  if ('qrImage' in  diy.data && diy.data.qrImage.length > 0) {
    // 有图片直接返回
    return {
      success: true,
      imageUrl: diy.data.qrImage,
      cache: true
    }
  }
  // 生成配置分享二维码
  const fileid = await genQRCode(diyid)
  await db.collection('diy').where({
    _id: diyid
  }).update({
    data: {
      qrImage: fileid
    }
  });
  return {
    success: true,
    imageUrl: fileid,
    cache: false
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
