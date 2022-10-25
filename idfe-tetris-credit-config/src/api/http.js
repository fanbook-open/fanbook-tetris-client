import axios from "axios";
import { CONFIG, getBigIntJSONStingify } from '@/utils'

import JSONBigInt from 'json-bigint';
axios.defaults.headers['Content-type'] = 'application/json';
axios.defaults.transformResponse = [
  (data) => {
    const newData = JSONBigInt.parse(data);
    return newData;
  }
]

const host = CONFIG.api_host;
const url = host;

const http = (type, name, params = {}, bigInt = []) => {
  return new Promise((resolve, reject) => {
    if (type.toLocaleLowerCase() === 'post') {
      axios.post(
        `${url}/${name}`,
        bigInt.length ? getBigIntJSONStingify(params, bigInt) : params
      ).then(res => {
        if (res.status == 200 && res.data.code == 200) {
          resolve(res.data.data);
        } else {
          reject(res.data)
        }
      });
    } else {
      axios.get(`${url}/${name}`, params).then(res => {
        // console.log(res)
        if (res.status == 200 && res.data.code == 200) {
          resolve(res.data.data);
        } else {
          reject(res.data)
          console.log(res);
        }
      });
    }
  })
};

export default http;
