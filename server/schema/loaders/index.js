const DataLoader = require("dataloader");
const { resolvers: Users } = require("../users");
const { resolvers: Groups } = require("../groups");
const { resolvers: DataProviders } = require("../dataProviders");
const { resolvers: Userfiles } = require("../userfiles");
const { resolvers: Tasks } = require("../tasks");
const { resolvers: Bourreaux } = require("../bourreaux");

const createLoaders = context => {
  return {
    user: new DataLoader(ids => getUsers(ids, context)),
    group: new DataLoader(ids => getGroups(ids, context)),
    dataProvider: new DataLoader(ids => getDataProviders(ids, context)),
    bourreau: new DataLoader(ids => getBourreaux(ids, context)),
    userfilesByGroupIds: new DataLoader(ids =>
      getUserfilesByGroupIds(ids, context)
    ),
    tasksByGroupIds: new DataLoader(ids => getTasksByGroupIds(ids, context))
  };
};

const getBourreaux = async (ids, context) => {
  try {
    return ids.map(id => {
      return Bourreaux.Query.getBourreauById(
        null,
        { id: id.toString() },
        context
      );
    });
  } catch (err) {
    throw err;
  }
};

const getUsers = async (ids, context) => {
  try {
    return ids.map(id => {
      return Users.Query.getUserById(null, { id: id.toString() }, context);
    });
  } catch (err) {
    throw err;
  }
};

const getGroups = async (ids, context) => {
  try {
    return ids.map(async id => {
      return Groups.Query.getGroupById(null, { id: id.toString() }, context);
    });
  } catch (err) {
    throw err;
  }
};

const getDataProviders = async (ids, context) => {
  try {
    return ids.map(async id => {
      return DataProviders.Query.getDataProviderById(
        null,
        { id: id.toString() },
        context
      );
    });
  } catch (err) {
    throw err;
  }
};

const getUserfilesByGroupIds = async (ids, context) => {
  try {
    return ids.map(id => {
      return Userfiles.Query.getUserfilesByGroupId(
        null,
        { id: id.toString() },
        context
      );
    });
  } catch (err) {
    throw err;
  }
};

const getTasksByGroupIds = async (ids, context) => {
  try {
    return ids.map(id => {
      return Tasks.Query.getTasksByGroupId(
        null,
        { id: id.toString() },
        context
      );
    });
  } catch (err) {
    throw err;
  }
};

exports.createLoaders = createLoaders;
