const mongobd = require("mongodb");

const MongoClient = mongobd.MongoClient;

let database;
async function connect() {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("blog");
}
function getDB() {
  if (!database) {
    throw { massage: "Database connection not established!" };
  }
  return database;
}

module.exports = {
  connectTodatabase: connect,
  getDb: getDB,
};
