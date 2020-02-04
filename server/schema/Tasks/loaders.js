const DataLoader = require("dataloader");
const { relativeURL } = require("./resolvers");
const R = require("ramda");

const batchGetNestedFields = async (tasks, context) => {
  return tasks.map(async task => {
    const group = await context.loaders.group.load(task.groupId);
    const bourreau = await context.loaders.bourreau.load(task.bourreauId);
    const user = await context.loaders.user.load(task.userId);
    return { ...task, group, bourreau, user };
  });
};

const batchGetTasksByGroupIds = async (ids, context) => {
  const data = await context.query(`${relativeURL}`);
  return ids.map(async id => R.filter(R.propEq("groupId", +id), await data));
};

const loaders = context => ({
  tasksByGroupId: new DataLoader(groupIds =>
    batchGetTasksByGroupIds(groupIds, context)
  ),
  nestedTask: new DataLoader(tasks => batchGetNestedFields(tasks, context))
});

module.exports = { loaders };
