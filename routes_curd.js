const getDB = require("./db");
const router = require("express").Router();
var ObjectId = require('mongodb').ObjectId;
const cloudinary = require("cloudinary").v2;
const fs = require('fs');
var path = require('path');

const url = process.env.MONGO_URL

const save2cloudinary = async ({ source, folder, filename }) => {

  if (source.indexOf("res.cloudinary.com") > -1 || !fs.existsSync(source)) {
    // already cloud path
    return null;
  }

  // console.log('start save2cloudinary', source, folder, filename);

  const upload = () => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        source,
        {
          folder: folder,
          public_id: filename,
          use_filename: filename ? false : true,
        },
        (error, result) => {
          fs.unlink(source, (err) => {
            if (err) throw err;
            // console.log("file " + source + " is deleted")
          })
          // console.log('end save2cloudinary', result, error);
          // console.log('inside loop', result, error)
          return resolve({ result, error });
        }
      );
    });
  };

  let res = await upload();

  console.log('final save2cloudinary', res);

  return { url: res?.result?.url, err: res?.error };
}

router.post("/add", async (req, res) => {
  console.log('add', req.body)
  if (req.body && req.body.title) {
    const db = await getDB();
    const trips = await db.collection("posts");

    let result = await trips.insertOne({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    }).catch(err => {
      console.log(err);
      res.status(500).json({ err: err })
    });

    console.log('insertOne', result);

    if (result?.acknowledged) {
      console.log(['result', result?.insertedId, result?.insertedId?.toString()]);

      let id = result?.insertedId?.toString();

      if (id) {
        let filename = id;
        console.log('save2cloudinary', {
          source: path.join(__dirname, req.body.image),
          folder: process.env.CLOUDINARY_DIR,
          filename: filename,
        });
        let upRes = await save2cloudinary(
          {
            source: path.join(__dirname, req.body.image),
            folder: process.env.CLOUDINARY_DIR,
            filename: filename,
          }
        );

        console.log(upRes);

        if (upRes?.url) {
          filename = upRes.url;

          console.log('updateOne', { _id: ObjectId(id) },
            {
              $set: {
                image: filename
              }
            }, upRes);

          await trips.updateOne(
            { _id: ObjectId(id) },
            {
              $set: {
                image: filename
              }
            }
          ).catch(err => {
            console.error(err);
            res.status(500).json({ err: err })
          });
        }

        res.status(200).json({ ok: true })

      } else {
        res.status(500).json({ message: "data insert into database fail (without return id)" })
      }

    } else {
      res.status(500).json({ message: "data insert into database fail" })
    }

  } else {
    res.status(500).json({ message: "no data" })
  }
})

router.delete("/del/:id", async (req, res) => {

  console.log('delete', req?.params?.id);

  let id = req?.params?.id;

  if (id === 'undefined') {
    id = null;
  }
  if (id) {

    console.log('delete', { _id: ObjectId(id) });

    const db = await getDB();
    const trips = await db.collection("posts");

    let result = await trips.deleteOne({ _id: ObjectId(id) })
      .catch(err => {
        console.error(err)
        res.status(500).json({ err: err })
      });

    if (result?.acknowledged) {
      result = await cloudinary.uploader.destroy(
        process.env.CLOUDINARY_DIR + '/' + id
      ).catch(e => {
        console.log(e);
      });
      res.status(200).json({ ok: true })
    } else {
      res.status(500).json({ err: err })
    }

  } else {
    res.status(500).json({ message: "no data" })
  }
})

router.put("/update/:id", async (req, res) => {

  console.log("put /update/:id", req.body);

  if (req.body && req.params.id) {

    console.log({ _id: ObjectId(req.params.id) });

    delete req.body._id;

    const db = await getDB();
    const trips = await db.collection("posts");

    const upRes = await save2cloudinary(
      {
        source: path.join(__dirname, req.body.image),
        folder: process.env.CLOUDINARY_DIR,
        filename: req.params.id + path.extname(req.body.image)
      }
    );

    if (upRes?.url) {
      req.body.image = upRes.url;
    }

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
        //console.log(result)
        res.status(200).json({ ok: true })
      })
  } else {
    res.status(500).json({ message: "no data" })
  }
})

router.get("/list", async (req, res) => {
  console.log(req.query)

  const db = await getDB();
  const trips = await db.collection("posts");

  if (trips) {

    let query = {};
    if (req?.query?.tag) query["tags.value"] = req.query.tag;
    if (req?.query?.search) {
      query["$or"] = [];
      query["$or"].push({ "title": eval(`/${req.query.search}/i`) });
      query["$or"].push({ "description.blocks.data.text": eval(`/${req.query.search}/i`) });
    }

    let limit = 10;
    let shift = 0;
    let page = req?.query?.page || 1;
    if (page) {
      shift = (parseInt(req.query.page) - 1) * limit
    }

    let out = trips.find(query).count();

    let response = {
      range: limit,
      total: await out,
      page,
    };

    response.totalPage = Math.ceil(response.total / limit);

    trips.find(query).sort({ updatedAt: -1 }).limit(limit).skip(shift).toArray((err, items) => {
      if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
      }
      // console.error(JSON.stringify(items))
      response.data = items;
      res.status(200).json(response)
    });

  } else {
    console.error("Database not ready")
    res.status(500).json({ err: "Database not ready" })
  }
})

router.get("/post/:id", async (req, res) => {

  if (!req.params.id) return res.status(200).json({ err: "missing post id" });
  if (!ObjectId.isValid(req.params.id)) return res.status(200).json({ err: "post id does not valid" });

  const db = await getDB();
  const trips = await db.collection("posts");

  if (trips) {
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

  const db = await getDB();
  const trips = await db.collection("posts");

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