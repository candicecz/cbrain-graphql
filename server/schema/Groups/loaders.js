const DataLoader = require("dataloader");
const { resolvers } = require("./resolvers");
const fetchCbrain = require("../../cbrain-api");

const route = "groups";

const deleteGroups = async (ids, context) => {
  try {
    const data = ids.map(async id => {
      return fetchCbrain(context, `${route}/${id}`, { method: "DELETE" }).then(
        res => {
          return {
            status: res.status,
            success: res.status === 200,
            message:
              res.status === 200
                ? `Deleted project id: ${id} successfully`
                : `Error deleting project id:${id} successfully`
          };
        }
      );
    });
    const results = await Promise.all(data);
    return results;
  } catch (err) {
    throw err;
  }
};

const getGroups = async (ids, context) => {
  try {
    return ids.map(async id => {
      return resolvers.Query.getGroupById(null, { id: id.toString() }, context);
    });
  } catch (err) {
    throw err;
  }
};

const loaders = context => ({
  deleteGroup: new DataLoader(ids => deleteGroups(ids, context)),
  group: new DataLoader(ids => getGroups(ids, context))
});

module.exports = { loaders };
