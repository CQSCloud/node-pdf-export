
const childProcess = require('child_process');
const path = require('path');

const pdfExtract = require('../../index.js').pdfExtract;

describe('pdfExtract', () => {
  const expectedExec = (file) => {
    const binPath = path.join(__dirname, '..', '..', 'bin', 'itextpdf-5.5.9.jar');
    const libPath = path.join(__dirname, '..', '..', 'lib');
    return `java -cp ${binPath}:${libPath} pdfExtract < ${file}`;
  };

  context('when there are no errors', () => {
    beforeEach(() => {
      sinon.stub(childProcess, 'exec').returns();
      childProcess.exec.onCall(0).yields(undefined, 'foo');
      childProcess.exec.onCall(1).yields(undefined, 'bar');
    });

    afterEach(() => {
      childProcess.exec.restore();
    });

    context('run with a null/undefined', () => {
      it('returns an empty array for undefined', () => {
        const promise = pdfExtract.run(undefined)
          .then((results) => {
            expect(childProcess.exec).to.not.be.called;
            expect(results).to.be.an.array;
            expect(results).to.have.length(0);
          });
        return promise;
      });
      it('returns an empty array for null', () => {
        return pdfExtract.run(null)
          .then((results) => {
            expect(childProcess.exec).to.not.be.called;
            expect(results).to.be.an.array;
            expect(results).to.have.length(0);
          });
      });
    });

    context('run with no files', () => {
      it('returns an empty array', () => {
        return pdfExtract.run([])
          .then((results) => {
            expect(childProcess.exec).to.not.be.called;
            expect(results).to.be.an.array;
            expect(results).to.have.length(0);
          });
      });
    });

    context('run with single file', () => {
      it('execs the expected java statement', () => {
        return pdfExtract.run(['a'])
          .then(() => {
            expect(childProcess.exec).to.be.calledOnce;
            expect(childProcess.exec).to.be.calledWith(expectedExec('a'));
          });
      });

      it('returns an array containing an item with data', () => {
        return pdfExtract.run(['a'])
          .then((results) => {
            expect(results).to.be.an.array;
            expect(results).to.have.length(1);
            expect((results[0])).to.deep.equal({ file: 'a', data: 'foo' });
          });
      });
    });

    context('run with multiple files', () => {
      it('execs the expected java statements', () => {
        return pdfExtract.run(['a', 'b'])
          .then(() => {
            expect(childProcess.exec).to.be.calledTwice;
            expect(childProcess.exec).to.be.calledWith(expectedExec('a'));
            expect(childProcess.exec).to.be.calledWith(expectedExec('b'));
          });
      });

      it('returns an array with multiple items', () => {
        return pdfExtract.run(['a', 'b'])
          .then((results) => {
            expect(childProcess.exec).to.be.calledTwice;
            expect(results).to.be.an.array;
            expect(results).to.have.length(2);

            expect((results[0])).to.deep.equal({ file: 'a', data: 'foo' });
            expect((results[1])).to.deep.equal({ file: 'b', data: 'bar' });
          });
      });
    });
  });

  context('run with with some files returning errors', () => {
    beforeEach(() => {
      sinon.stub(childProcess, 'exec');
      childProcess.exec.onCall(0).yields(undefined, 'foo');
      childProcess.exec.onCall(1).yields(new Error('foo'));
    });

    afterEach(() => {
      childProcess.exec.restore();
    });

    it('execs the expected java statements', () => {
      return pdfExtract.run(['a', 'b'])
        .then(() => {
          expect(childProcess.exec).to.be.calledTwice;
          expect(childProcess.exec).to.be.calledWith(expectedExec('a'));
          expect(childProcess.exec).to.be.calledWith(expectedExec('b'));
        });
    });

    it('returns an item with an error', () => {
      return pdfExtract.run(['a', 'b'])
        .then((results) => {
          expect(results).to.be.an.array;
          expect(results).to.have.length(2);

          expect((results[0])).to.not.have.property('error');
          expect((results[1])).to.have.property('error');
        });
    });
  });

  context('run with with all files returning errors', () => {
    beforeEach(() => {
      sinon.stub(childProcess, 'exec');
      childProcess.exec.yields(new Error('foo'));
    });

    afterEach(() => {
      childProcess.exec.restore();
    });

    it('execs the expected java statements', () => {
      return pdfExtract.run(['a', 'b'])
        .then(() => {
          expect(childProcess.exec).to.be.calledTwice;
          expect(childProcess.exec).to.be.calledWith(expectedExec('a'));
          expect(childProcess.exec).to.be.calledWith(expectedExec('b'));
        });
    });

    it('returns an item with an error', () => {
      return pdfExtract.run(['a', 'b'])
        .then((results) => {
          expect(results).to.be.an.array;
          expect(results).to.have.length(2);

          expect((results[0])).to.have.property('error');
          expect((results[1])).to.have.property('error');
        });
    });
  });
});
