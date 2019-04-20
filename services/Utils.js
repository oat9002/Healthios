import axios from 'axios';
import * as config from '../static/appConfig.json';

/**
 * @param {string} name service name.
 * @param {Error} error object
 */
export function sendLogMessage(name, error) {
  axios.post(config.logServerIp + '/logs/healthiosWeb', {
    createdTime: new Date().toLocaleTimeString(),
    services_name: name,
    message: `${ error.message } \n ${ error.stack }`
  })
    .catch(() => {

    });
}

export function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  let byteCharacters = atob(b64Data);
  let byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);

    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  let blob = new Blob(byteArrays, {type: contentType});
  return blob;
}