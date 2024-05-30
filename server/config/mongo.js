const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
// console.log(uri, '<<<<<<');
const client = new MongoClient(uri);

async function connect() {
  try {
    client.db("Socmed"); //nama database
  } catch (error) {
    await client.close();
  }
}

async function getDB() {
    return client.db('Socmed') //nama database
}

module.exports = {connect, getDB}