const models = require('../../models');
const { getFields } = require('../../utils/controllers');

async function getClapOfPost(args, context, info) {
  try {
    const { filter, limit = 10 } = args;
    const claps = await models.Clap.find(filter, getFields(info, 'clap')).limit(limit).lean();

    return {
      isSuccess: true,
      claps,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

async function getClap(args, info) {
  try {
    const { _id } = args;
    const clap = await models.Clap.findById(_id, getFields(info, 'clap')).lean();

    return {
      isSuccess: !!clap,
      clap,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
}

module.exports = {
  getClapOfPost,
  getClap,
};
