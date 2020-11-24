const express = require("express");
const router = express.Router();
var AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

var rekognition = new AWS.Rekognition();
var s3Bucket = new AWS.S3({ params: { Bucket: "uam-emotions" } });

let Person = require("../models/person");

router.post("/binary", async (req, res) => {
  try {
    buf = Buffer.from(
      req.body.ImageBinary.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const img = {
      Key: `${uuidv4()}.jpg`,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };

    s3Bucket.putObject(img, function (err, data) {
      if (err) {
        return res.json("Error uploading image").status(500);
      } else {
        //console.log(`Image uploaded: ${img.Key}`);

        var params = {
          Attributes: ["ALL"],
          Image: {
            S3Object: {
              Bucket: "uam-emotions",
              Name: img.Key,
            },
          },
        };

        rekognition.detectFaces(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
            return res.status(500);
          } else {
            if (data.FaceDetails.length > 0) {
              console.log(`${data.FaceDetails.length} people saved on database`)
              data.FaceDetails.forEach((element) => {
                let person = new Person(element);

                person.Tag = req.body.Tag;
                person.ImageURL = img.Key;
                person.VideoURL = req.body.VideoURL;
                person.Timestamp = req.body.Timestamp;

                if (req.query.randomize == "true") {
                  person.Location = {
                    Lat: parseFloat(req.body.Lat) + (Math.random() - 0.5) / 1000,
                    Long: parseFloat(req.body.Long) + (Math.random() - 0.5) / 1000,
                  };
                } else {
                  person.Location = {
                    Lat: parseFloat(req.body.Lat) + (Math.random() - 0.5) / 1000,
                    Long: parseFloat(req.body.Long) + (Math.random() - 0.5) / 1000,
                  };
                }

                person.save();
                return res.json(person); // successful response
              });
            }

          }
        });
      }
    });
  } catch (error) {
    return res.status(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    return res.json(person);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const random = Boolean(req.query.random) || false;
    const skip = page * limit - limit;
    const projection = null;

    let count = await Person.find({}, projection).countDocuments();

    console.log(random)
    
    const options = {
      sort: {
        CreationDate: -1,
      },
      limit,
      skip: random ? Math.random()*count : skip,
    };

    console.log(options.skip)

    let people = await Person.find({}, projection).setOptions(options).exec();

    return await res.json({
      total_count: count,
      total_pages: Math.ceil(count / limit),
      count: people.length,
      page: options.page,
      people,
    });
  } catch (error) {
    console.log(error);
    return res.json(error).status(500).send();
  }
});

module.exports = router;
