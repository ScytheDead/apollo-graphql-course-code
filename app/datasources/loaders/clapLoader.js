const DataLoader = require('dataloader');
const { Clap } = require('../models');

const clapLoader = new DataLoader(async (clapLoaders) => {
  const [{ getFields }] = clapLoaders;
  const clapIds = clapLoaders.map(clapLoader => clapLoader.clapId);
  const claps = await Clap.find({ _id: { $in: clapIds } }, getFields).lean();
  return clapIds.map(clapId => claps.find(clap => clap._id.toString() === clapId.toString()));
});

module.exports = {
  clapLoader,
};
