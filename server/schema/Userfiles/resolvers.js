const { gql } = require("apollo-server");
const FormData = require("form-data");
const fetchCbrain = require("../../cbrain-api");
const fs = require("fs");
const mkdirp = require("mkdirp");
const shortid = require("shortid");
const R = require("ramda");
const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey,
  formatBytes
} = require("../../utils");
const changeCase = require("change-case");

const route = "userfiles";

const UPLOAD_DIR = "./uploads";

// Ensure upload directory exists.
mkdirp.sync(UPLOAD_DIR);

// Temporarily store file in upload directory.
const storeFS = ({ stream, filename }) => {
  const id = shortid.generate();
  const path = `${UPLOAD_DIR}/${id}-${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on("error", error => {
        if (stream.truncated)
          // Delete the truncated file.
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on("error", error => reject(error))
      .on("finish", () => resolve({ id, path }))
  );
};

const deleteTmpUpload = path => {
  fs.unlink(
    path,
    err => err && console.log("Failed to delete temporary file", err)
  );
};

const processUpload = async upload => {
  const { createReadStream, filename, mimetype } = await upload;
  if (!createReadStream) {
    return;
  }
  const stream = createReadStream();
  const { id, path } = await storeFS({ stream, filename });
  return { tmpPath: path, filename };
};

const transformUserfiles = async (userfile, context) => {
  if (context.loaders === undefined) {
    return camelKey(userfile);
  }
  const { user_id, group_id, data_provider_id, ...rest } = await userfile;
  const user = await context.loaders.user.load(user_id);
  const group = await context.loaders.group.load(group_id);
  const dataProvider = await context.loaders.dataProvider.load(
    data_provider_id
  );
  const { size } = userfile;

  return camelKey({
    ...userfile,
    size: formatBytes(+size),
    user,
    group,
    dataProvider
  });
};

const resolvers = {
  Query: {
    getUserfiles: async (
      _,
      { cursor = 1, limit = 100, sortBy, orderBy },
      context
    ) => {
      const data = await fetchCbrain(
        context,
        `userfiles?page=${cursor}&per_page=${limit}`
      )
        .then(data => data.json())
        .then(userfiles =>
          userfiles.map(async userfile => transformUserfiles(userfile, context))
        );
      const results = await Promise.all(data);

      return {
        hasMore: false,
        cursor: cursor + 1,
        [`${changeCase.camelCase(route)}`]:
          sortResults({ sortBy, orderBy, results }) || []
      };
    },
    getUserfileById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(async userfile => transformUserfiles(userfile, context));
    },
    getUserfilesByGroupId: async (
      _,
      { id, cursor = 1, limit = 100, sortBy, orderBy },
      context
    ) => {
      const data = await fetchCbrain(
        context,
        `userfiles?page=${cursor}&per_page=${limit}`
      )
        .then(data => data.json())
        .then(userfiles => {
          return userfiles.map(async userfile =>
            transformUserfiles(userfile, context)
          );
        });
      const results = await Promise.all(data);

      return {
        hasMore: false,
        cursor: cursor + 1,
        [`${changeCase.camelCase(route)}`]:
          sortResults({
            sortBy,
            orderBy,
            results: R.filter(r => {
              if (r.groupId || (r.group && r.group.id)) {
                return (+r.groupId || r.group.id) === +id;
              }
            }, results)
          }) || []
      };
    },
    getUserfileContent: (_, { id }, context) => {
      // Note: Might need adjustments to work
      return fetchCbrain(context, `${route}/${id}/content`).then(data => data);
    },
    userfilesTableHeaders: () => {
      return [
        { header: "name", accessor: "name" },
        { header: "type", accessor: "type" },
        { header: "creator", accessor: "userId" },
        { header: "group", accessor: "groupId" },
        { header: "read/write", accessor: "groupWritable" },
        { header: "size", accessor: "size" },
        { header: "data provider", accessor: "dataProviderId" }
      ];
    }
  },
  Mutation: {
    singleUpload: async (_, { input }, context) => {
      const { tmpPath, filename } = await processUpload(input.file);
      const stream = fs.createReadStream(tmpPath);

      const formData = new FormData();
      formData.append("upload_file", stream, { filename });
      formData.append("data_provider_id", input.dataProviderId);
      formData.append("userfile[group_id]", input.groupId);
      if (input.fileType) {
        formData.append("file_type", input.fileType);
      }
      if (input.extract) {
        formData.append("_do_extract", input.extract);
      }
      if (input.extractMode) {
        formData.append("_up_ex_mode", input.extractMode);
      }

      await fetchCbrain(context, route, {
        method: "POST",
        body: formData
      })
        .then(data => {
          deleteTmpUpload(tmpPath);
          return {
            status: data.status,
            success: data.status === 200 || data.status === 201
          };
        })
        .catch(err => {
          deleteTmpUpload(tmpPath);
          return;
        });
    },
    updateUserfile: async (_, { id, input }, context) => {
      return fetchCbrain(
        context,
        `${route}/${id}`,
        { method: "PUT" },
        { userfile: snakeKey({ ...input }) }
      ).then(res => {
        return {
          status: res.status,
          success: res.status === 200,
          message: res.statusText
        };
      });
    },
    deleteUserfiles: async (_, { ids }, context) => {
      await fetchCbrain(
        context,
        `${route}/delete_files`,
        {
          method: "DELETE"
        },
        {
          file_ids: ids
        }
      ).then(data => {
        return {
          status: data.status,
          success: data.status === 200 || data.status === 201
        };
      });
    }
  }
};

module.exports = { resolvers };
