const { axios, moment } = require('./npm_modules');

function AxiosConfig(config){
  return axios(config);
}

function convertTimeToKorean(time){
  return moment(time).format('YYYY년 MM월 DD일')
}

exports.AxiosConfig = AxiosConfig;
exports.convertTimeToKorean = convertTimeToKorean;