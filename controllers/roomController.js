const express = require('express');
const Rooms = require("../models/rooms");
const router = express.Router();
const pug = require('pug');
const db = require('../db');

db.connect();

var metal = new Rooms({roomId: "fefefesda", roomName: "Metal MDR"})

metal.save()

console.log("===============")
Rooms.find(function (err, rooms) {
    if (err) return console.error(err);
    console.log(rooms);
  })
console.log("===============")

router.get('/', (req, res) => {
  const tplIndexPath = './views/main.pug';
  const renderIndex = pug.compileFile(tplIndexPath);
  const html = renderIndex({
    title: 'Liste des Salles'
  });
  res.writeHead(200, { 'Content-Type': 'text/html' } );
  res.write(html);
  Rooms.find(function (err, rooms) {
    if (err) return console.error(err);
    console.log(rooms);
    res.send(rooms);
  })
  res.end();
});

module.exports = router;