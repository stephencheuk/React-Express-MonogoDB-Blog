const MongoClient = require("mongodb").MongoClient

const url = process.env.MONGO_URL
let cachedDB = null;

const getDB = async () => {
  if (cachedDB) {
    console.log("DB already connected");
    return Promise.resolve(cachedDB);
  } else {
    return MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then((client) => {
        let db = client.db("blog");
        console.log("New DB connected");
        cachedDB = db;
        return cachedDB;
      })
      .catch((error) => {
        console.log("Mongo connect fail", error);
      })
  }
}

module.exports = getDB;