const diyCreate = require('./diy/index');
const diyDelete = require('./diyDelete/index');
const diyList = require('./diyList/index');
const diyDetail = require('./diyDetail/index');
const diyCollect = require('./collect/index');
const diyCollectList = require('./collectList/index');
const diyCollectDelete = require('./collectDelete/index');
const diyLike = require('./like/index');
const diyLikeList = require('./likeList/index');
const diyLikeDelete = require('./likeDelete/index');
const diyBoard = require('./board/index');
const genImage = require('./genImage/index');
const profile = require('./profile/index');
const banner = require('./banner/index');


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'diyCreate':
      return await diyCreate.main(event, context);
    case 'diyDelete':
      return await diyDelete.main(event, context);
    case 'diyList':
      return await diyList.main(event, context);
    case 'diyDetail':
      return await diyDetail.main(event, context);
    case 'diyCollect':
      return await diyCollect.main(event, context);
    case 'diyCollectList':
      return await diyCollectList.main(event, context);
    case 'diyCollectDelete':
      return await diyCollectDelete.main(event, context);
    case 'diyLike':
      return await diyLike.main(event, context);
    case 'diyLikeList':
      return await diyLikeList.main(event, context);
    case 'diyLikeDelete':
      return await diyLikeDelete.main(event, context);
    case 'diyBoard':
      return await diyBoard.main(event, context);
    case 'genImage':
      return await genImage.main(event, context);
    case 'profile':
      return await profile.main(event, context);
    case 'banner':
      return await banner.main(event, context);
  }
};
