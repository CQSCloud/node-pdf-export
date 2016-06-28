const path = require('path');

const scope = {
  iTextPDF: path.join(__dirname, 'bin', 'itextpdf-5.5.9.jar')
};

module.exports.pdfExtract = {
  run: function(){
    return require('./lib/pdfExtract').run.apply(scope, arguments);
  }
};
