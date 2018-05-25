const request = require('request');
const express = require('express');
const router = express.Router();
const pug = require('pug');


router.get('/', (req, res) => {
  const tplIndexPath = './views/room/salle.pug';
  const renderIndex = pug.compileFile(tplIndexPath);
  const html = renderIndex({
    title: 'Salle',
    name: 'exemple nom de salle'
  });

  res.writeHead(200, { 'Content-Type': 'text/html' } );
  res.write(html);
  res.end();
});

console.log("patate")
let url = 'https://api.spotify.com/v1/me/player/play'
let headersData = {Authorization: 'Bearer BQDb1GJTqwnB_Z1EhPkkXR1vL3hAo2FlkDFvhqQwu1EgfH5cRnwMrBGy9CCWzmhzdzk3mQKf3D8iaPqK3gnzfTIYqrVTryCKxAeMdhQS4a5Msyu3f_eI_pOVCyExNUhlY7TBukByCFIF28CTaWNTU-UU'}
let bodyData = { }
let req = {
  method: 'put',
  headers: headersData
}
request(req)

module.exports = router;