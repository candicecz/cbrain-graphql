const { gql } = require("apollo-server");
const FormData = require("form-data");
const fetchCbrain = require("../cbrain-api");
const fs = require("fs");
const mkdirp = require("mkdirp");
const shortid = require("shortid");
const R = require("ramda");

const {
  paginateResults,
  sortResults,
  snakeKey,
  camelKey
} = require("../utils");

const route = "userfiles";

const typeDefs = gql`
  extend type Query {
    getUserfileById(id: ID!): Userfile
    getUserfiles(
      cursor: Int
      limit: Int
      sortBy: UserfileSort
      orderBy: Order
    ): UserfileFeed!
    getUserfileContent(id: ID!): String
    getUserfilesByGroupId(
      id: ID!
      cursor: Int
      limit: Int
      sortBy: UserfileSort
      orderBy: Order
    ): UserfileFeed!
  }

  extend type Mutation {
    singleUpload(input: UserfileInput): Response
  }

  type Userfile {
    id: ID
    name: String
    size: Int
    userId: ID
    parentId: ID
    type: String
    groupId: ID
    dataProviderId: ID
    groupWritable: String
    numFiles: Int
    hidden: String
    immutable: String
    archived: String
    description: String
  }

  type UserfileFeed {
    cursor: Int!
    hasMore: Boolean!
    userfiles: [Userfile]!
  }

  enum ExtractMode {
    collection
    multiple
  }

  input UserfileInput {
    file: Upload!
    dataProviderId: ID
    groupId: ID
    extract: Boolean
    fileType: String
    extractMode: ExtractMode
  }

  enum UserfileSort {
    id
    name
    size
    userId
    parentId
    type
    groupId
    dataProviderId
    groupWritable
    numFiles
    hidden
    immutable
    archived
    description
  }
`;

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
    getUserfiles: async (_, { cursor, limit, sortBy, orderBy }, context) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(userfiles => userfiles.map(userfile => camelKey(userfile)));
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results }),
        route
      });
    },
    getUserfileById: (_, { id }, context) => {
      return fetchCbrain(context, `${route}/${id}`)
        .then(data => data.json())
        .then(userfile => camelKey(userfile));
    },
    getUserfilesByGroupId: async (
      _,
      { id, cursor, limit, sortBy, orderBy },
      context
    ) => {
      const results = await fetchCbrain(context, route)
        .then(data => data.json())
        .then(userfiles => userfiles.map(userfile => camelKey(userfile)));
      const filteredResultsById = R.filter(
        result => R.propEq("groupId", JSON.parse(id))(result),
        results
      );
      return paginateResults({
        cursor,
        limit,
        results: sortResults({ sortBy, orderBy, results: filteredResultsById }),
        route
      });
    },
    getUserfileContent: (_, { id }, context) => {
      // Note: Might need adjustments to work
      return fetchCbrain(context, `${route}/${id}/content`).then(data => data);
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

      await fetchCbrain(context, "userfiles", {
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
    }
  }
};

module.exports = { typeDefs, resolvers };
