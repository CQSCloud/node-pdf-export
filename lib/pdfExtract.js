const Promise = require('bluebird');

const childProcess = Promise.promisifyAll(require('child_process'));

const _runPdfExtracts = function(files) {
  const _runPdfExtract = (file) => {
    let cmdString;
    if (process.platform === 'win32') {
      cmdString = `java -cp "${this.iTextPDF};${this.binPath}" pdfExtract < "${file}"`;
    } else {
      cmdString = `java -cp ${this.iTextPDF}:${this.binPath} pdfExtract < ${file}`;
    }
    return childProcess.execAsync(cmdString)
      .then((data) => {
        return { file: file, data: data };
      })
      .catch((err) => {
        return { file: file, error: err };
      });
  };

  if (!files) {
    return Promise.resolve([]);
  }

  if (Object.prototype.toString.call(files) === '[object Array]') {
    return Promise
      .map(files, _runPdfExtract);
  }

  return Promise
    .map([files], _runPdfExtract);
};

module.exports = { run: _runPdfExtracts };
