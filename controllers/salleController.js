const express = require('express');
const router = express.Router();
const pug = require('pug');
const redis = require("redis");
const client = redis.createClient({detect_buffers: true});


router.get('/', (req, res) => {
  const tplIndexPath = './views/room/salle.pug';
  const renderIndex = pug.compileFile(tplIndexPath);

  global.oldmsgs = ["Bienvenue"];
  let time = Math.floor(Date.now() / 1000);
  for (let i = 3600; i>0; i--)
  {
    let oldTime = time - i;
    client.get(oldTime, function (err, reply) {
      if (reply != null){
        global.oldmsgs.push(reply.toString());
      }
    });
  }

  setTimeout(function() {
    const html = renderIndex({
      title: 'Salle',
      name: 'exemple nom de salle',
      oldMsgs: oldmsgs
    });

    res.writeHead(200, { 'Content-Type': 'text/html' } );
    res.write(html);
    res.end();
  }, 1500);

});

module.exports = router;