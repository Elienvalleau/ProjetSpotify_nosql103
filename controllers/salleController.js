const express = require('express');
const router = express.Router();
const pug = require('pug');

router.get('/', (req, res) => {
  const tplIndexPath = './views/salle.pug';
  const renderIndex = pug.compileFile(tplIndexPath);
  const html = renderIndex({
    title: 'Salle'
  });
  res.writeHead(200, { 'Content-Type': 'text/html' } );
  res.write(html);
  res.end();
});

module.exports = router;