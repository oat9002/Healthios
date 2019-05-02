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
    message: `${error.message} \n ${error.stack}`
  })
    .catch(() => {

    });
}

export function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else
    byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}