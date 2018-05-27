const express = require('express');
const Rooms = require("../models/rooms");
const router = express.Router();
const db = require('../db');

db.connect();

router.get('/', (req, res) => {
  Rooms.find({},function (err, rooms) {
    if (err) return console.error(err);
    // console.log(rooms);
    res.render('main', {
      rooms
    });
  })
});

//router.get('/:nomsalle', (req))

module.exports = router;