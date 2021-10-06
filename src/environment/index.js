// @flow
const env = {
  version: process.env.VERSION,
  baseApiUrl: process.env.REACT_APP_ENDPOINT || '/api',
  culqiPublicKey: 'pk_test_2aa21f46024eda7a',
};

if (process.env.REACT_APP_ENV === 'production') {
  env.culqiPublicKey = 'pk_live_HYAPvy1j3wqTSobX';
}

module.exports = env;
