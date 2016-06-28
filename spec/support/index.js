const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const Promise = require('bluebird');
const sinonChai = require('sinon-chai');

require('sinon-as-promised')(Promise);

chai.use(chaiAsPromised);
chai.use(sinonChai);

global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
