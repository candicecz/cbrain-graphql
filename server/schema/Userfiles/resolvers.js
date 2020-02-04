const FormData = require("form-data");
const fs = require("fs");
const mkdirp = require("mkdirp");
const shortid = require("shortid");
const { sort } = require("../../utils");

const relativeURL = "userfiles";

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

const resolvers = {
  Query: {
    userfile: async (_, { id }, context) => {
      const userfile = await context.query(`${relativeURL}/${id}`);
      const data = await context.loaders.nestedUserfile.load(userfile);
      return data;
    },
    userfiles: async (
      _,
      { cursor, limit, sortBy, orderBy, groupId },
      context
    ) => {
      let userfiles;
      if (groupId) {
        userfiles = await context.loaders.userfilesByGroupId.load(+groupId);
      } else {
        userfiles = await context.query(
          `${relativeURL}?page=${cursor}&per_page=${limit}`
        );
      }
      const data = await context.loaders.nestedUserfile.loadMany(userfiles);

      return { feed: sort({ data, sortBy, orderBy }) };
    },

    userfileContent: async (_, { id }, context) => {
      // Note: Might need adjustments to work
      return await context.query(`${relativeURL}/${id}/content`);
    },
    userfileTableHeaders: () => {
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
    // [TO DO]: Leave for last so you can test in ui
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

      const data = await context.query(relativeURL, {
        method: "POST",
        body: formData
      });
      deleteTmpUpload(tmpPath);
      return data;
    },
    updateUserfile: async (_, { id, input }, context) => {
      const query_string = qs.stringify(
        { userfile: humps.decamelizeKeys(input) },
        { encode: false }
      );
      return await context.query(`${relativeURL}/${id}?${query_string}`, {
        method: "PUT"
      });
    },
    deleteUserfiles: async (_, { ids }, context) => {
      const query_string = qs.stringify(
        { file_ids: ids },
        { encode: false, indices: false, arrayFormat: "brackets" }
      );
      return await context.query(
        `${relativeURL}/delete_files?${query_string}`,
        { method: "DELETE" }
      );
    }
  }
};

module.exports = { resolvers, relativeURL };
