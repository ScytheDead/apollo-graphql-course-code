const _ = require('lodash');
const { ObjectId } = require('mongoose').Types;
const models = require('../../models');
const { getFields } = require('../../utils/controllers');

async function getClapOfPost(args, context, info) {
  try {
    const { filter, limit = 10 } = args;
    const conditions = { post: ObjectId(filter.post) };
    if (filter.lastId) {
      conditions._id = { $gt: ObjectId(filter.lastId) };
    }
    const claps = await models.Clap.find(conditions, getFields(info, 'claps')).limit(limit).lean();
    const lastId = claps[claps.length - 1] && claps[claps.length - 1]._id;

    return {
      isSuccess: true,
      lastId,
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
      isSuccess: true,
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
