const { axios, moment, svgCaptcha } = require('./npm_modules');

function AxiosConfig(config){
  return axios(config);
}

function AxiosWithDB(config, callback){
  const apiAddress = 'http://localhost:8000';
  config.url = apiAddress + config.url;
  return axios(config).then(callback);
}

function convertTimeToKorean(time){
  return moment(time).format('YYYY년 MM월 DD일')
}


svgCaptcha.options.charPreset = '0123456789';
function createSvgCaptcha(){
  return svgCaptcha.create({
    width: 125,
    size: 6,
    color: true,
    noise: 1,
    background: '#666'
  })
}

exports.AxiosConfig         = AxiosConfig;
exports.AxiosWithDB         = AxiosWithDB;
exports.convertTimeToKorean = convertTimeToKorean;
exports.createSvgCaptcha    = createSvgCaptcha;