const router = require("express").Router();
const mongo = require("mongodb").MongoClient
var ObjectId = require('mongodb').ObjectId;

let db, trips, expenses

const url = process.env.MONGO_URL

mongo.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db("blog")
    trips = db.collection("posts")
  }
)

router.post("/add", async (req, res) => {
  console.log('add', req.body)
  if (req.body && req.body.title) {
    trips.insertOne({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    }, (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
      }
      console.log(result)
      res.status(200).json({ ok: true })
    })
  } else {
    res.status(500).json({ message: "no data" })
  }
})

router.delete("/del/:id", async (req, res) => {

  console.log('delete', req?.params?.id);

  if (req.params && req.params.id) {

    console.log({ _id: ObjectId(req.params.id) });

    trips.deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
      }
      console.log(result)
      res.status(200).json({ ok: true })
    })
  } else {
    res.status(500).json({ message: "no data" })
  }
})

router.put("/update/:id", async (req, res) => {

  console.log("put /update/:id", req.body);

  if (req.body && req.params.id) {

    console.log({ _id: ObjectId(req.params.id) });

    delete req.body._id;

    trips.updateOne(
      { _id: ObjectId(req.params.id) },
      {
        $set: {
          ...req.body,
          updatedAt: new Date()
        }
      },
      (err, result) => {
        if (err) {
          console.error(err)
          res.status(500).json({ err: err })
          return
        }
        console.log(result)
        res.status(200).json({ ok: true })
      })
  } else {
    res.status(500).json({ message: "no data" })
  }
})

router.get("/list", async (req, res) => {
  console.log(req.query.tag)
  if (trips) {
    let search = {};
    if (req?.query?.tag) search['tags.value'] = req.query.tag;
    console.log(search);

    trips.find(search).toArray((err, items) => {
      if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
      }
      console.error(JSON.stringify(items))
      res.status(200).json({ "data": items })
    })
  } else {
    console.error("Database not ready")
    res.status(500).json({ err: "Database not ready" })
  }
})

router.get("/post/:id", async (req, res) => {

  if (trips && req.params.id && ObjectId.isValid(req.params.id)) {
    trips.findOne({ _id: ObjectId(req.params.id) }, (err, item) => {
      if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
      }
      res.status(200).json({ "post": item })
    })
  } else {
    console.error("Database not ready")
    res.status(500).json({ err: "Database not ready" })
  }
});

router.get("/tags", async (req, res) => {
  console.error("/tags")
  if (trips) {
    const tags = trips
      .aggregate([
        { "$unwind": { path: "$tags" } },
        { "$project": { _id: "tags", "tags.value": 1 } },
        {
          "$group": {
            "_id": null,
            "tags": { "$addToSet": "$tags.value" }
          }
        }
      ], {});
    for await (const item of tags) {
      // if (err) {
      //   console.error(err)
      //   res.status(500).json({ err: err })
      //   return
      // }
      console.error(item)
      res.status(200).json({ "tags": item.tags })
    };
  } else {
    console.error("Database not ready")
    res.status(500).json({ err: "Database not ready" })
  }
});

module.exports = router;