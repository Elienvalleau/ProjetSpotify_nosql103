const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/spotyroom', function () {
  console.log('mongodb connected')
});
module.exports = mongoose;

exports.connect = function() {
  mongoose.connect('mongodb://localhost/spotyroom', function () {
    console.log('mongodb connected')
  });
};