const express = require('express');
const Rooms = require("../models/rooms");
const router = express.Router();
const db = require('../db');
const pug = require("pug");

db.connect();

router.get('/', (req, res) => {
  Rooms.find({},function (err, rooms) {
    if (err) return console.error(err);
    res.render('main', {
      rooms
    });
  })
});


router.get('/addRoom', (req, res) => {
  const tplIndexPath = './views/addRoom.pug';
  const renderIndex = pug.compileFile(tplIndexPath);
  const html = renderIndex({
    title: 'Ajout d\'une nouvelle salle'
  });
  res.writeHead(200, { 'Content-Type': 'text/html' } );
  res.write(html);
  res.end();
});


router.post('/', (req, res, next) => {
  const data = {
    roomId: (Rooms.findOne({size: 'small'}, {'created_at' : 1}))+1,
    roomName: req.body.roomName
  };

  Rooms.create(data, function (err, small) {
    if (err) return handleError(err);
    res.redirect('/main')
  });
});

module.exports = router;