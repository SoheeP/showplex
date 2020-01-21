const axios = require('axios');

function AxiosConfig(config){
  return axios(config);
}

exports.AxiosConfig = AxiosConfig;