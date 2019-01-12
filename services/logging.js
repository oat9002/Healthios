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
