const ObjectID = require('mongodb').ObjectID;
const express = require("express");
const path = require("path");
const mongo = require("../models/mongo");

const router = new express.Router();

router.get('/history', function(req, res) {

  console.log(req.body);

  //
  // mongo.collection.find({}).sort( {createdAt: -1} ).toArray(function( err, docs) {
  //
  //   res.json(docs);
  //
  // })
  //
});


module.exports = router;
