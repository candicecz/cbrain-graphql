const DataLoader = require("dataloader");
const { relativeURL } = require("./resolvers");

const batchGetNestedFields = async (groups, context) => {
  return groups.map(async group => {
    const tasks = await context.loaders.tasksByGroupId.load(group.id);
    const userfiles = await context.loaders.userfilesByGroupId.load(group.id);
    return { ...group, userfiles, tasks, users: [] };
  });
};

const batchGetGroups = async (ids, context) => {
  return ids.map(async id => {
    return await context.query(`${relativeURL}/${id}`);
  });
};

const batchDeleteGroups = async (ids, context) =>
  ids.map(
    async id =>
      await context.query(`${relativeURL}/${id}`, { method: "DELETE" })
  );

const loaders = context => ({
  deleteGroup: new DataLoader(ids => batchDeleteGroups(ids, context)),
  group: new DataLoader(ids => batchGetGroups(ids, context)),
  nestedGroup: new DataLoader(groups => batchGetNestedFields(groups, context))
});

module.exports = { loaders };
