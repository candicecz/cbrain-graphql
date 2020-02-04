const DataLoader = require("dataloader");
const { relativeURL } = require("./resolvers");
const R = require("ramda");

const batchGetNestedFields = async (userfiles, context) => {
  return userfiles.map(async userfile => {
    const group = context.loaders.group.load(userfile.groupId);
    const dataProvider = context.loaders.dataProvider.load(
      userfile.dataProviderId
    );
    const user = context.loaders.user.load(userfile.userId);
    return { ...userfile, group, dataProvider, user };
  });
};

const batchGetUserfilesByGroupIds = async (ids, context) => {
  const data = await context.query(`${relativeURL}`);
  return ids.map(async id => {
    return R.filter(R.propEq("groupId", +id), await data);
  });
};

const loaders = context => ({
  userfilesByGroupId: new DataLoader(groupIds =>
    batchGetUserfilesByGroupIds(groupIds, context)
  ),
  nestedUserfile: new DataLoader(userfiles =>
    batchGetNestedFields(userfiles, context)
  )
});

module.exports = { loaders };
