const express = require("express");
const router = express.Router();
var AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

var rekognition = new AWS.Rekognition();
var s3Bucket = new AWS.S3({ params: { Bucket: "uam-emotions" } });

let Person = require("../models/person");

router.post("/binary", async (req, res) => {
  buf = Buffer.from(
    req.body.imageBinary.replace(/^data:image\/\w+;base64,/, ""),
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
      console.log(`Image uploaded: ${img.Key}`);

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
          data.FaceDetails.forEach((element) => {
            let person = new Person(element);
            person.save();
          });

          return res.json(data); // successful response
        }
      });
    }
  });
});

module.exports = router;
