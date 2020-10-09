let mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

let personSchema = mongoose.Schema({
  Tag: { type: String },
  ImageURL: { type: String },
  VideoURL: { type: String },
  Timestamp: { type: Number },
  CreationDate: { type: Date, default: Date.now },
  Location: {
    Lat: { type: Number },
    Long: { type: Number },
  },
  BoundingBox: {
    Width: { type: Number },
    Height: { type: Number },
    Left: { type: Number },
    Top: { type: Number },
  },
  AgeRange: {
    Low: { type: Number },
    High: { type: Number },
  },
  Smile: {
    Value: { type: Boolean },
    Confidence: { type: Number },
  },
  Eyeglasses: {
    Value: { type: Boolean },
    Confidence: { type: Number },
  },
  Sunglasses: {
    Value: { type: Boolean },
    Confidence: { type: Number },
  },
  Gender: {
    Value: { type: String },
    Confidence: { type: Number },
  },
  Beard: {
    Value: { type: Boolean },
    Confidence: { type: Number },
  },
  Mustache: {
    Value: { type: Boolean },
    Confidence: { type: Number },
  },
  EyesOpen: {
    Value: { type: Boolean },
    Confidence: { type: Number },
  },
  MouthOpen: {
    Value: { type: Boolean },
    Confidence: { type: Number },
  },
  Emotions: [
    {
      Type: { type: String },
      Confidence: { type: Number },
    },
  ],
  Landmarks: [
    {
      Type: { type: String },
      X: { type: Number },
      Y: { type: Number },
    },
  ],
  Pose: {
    Roll: { type: Number },
    Yaw: { type: Number },
    Pitch: { type: Number },
  },
  Quality: {
    Brightness: { type: Number },
    Sharpness: { type: Number },
  },
  Confidence: { type: Number },
});

let Person = (module.exports = mongoose.model("Person", personSchema));
