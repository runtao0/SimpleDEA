
class csApi {
  constructor(options) {
     this.baseUrl = 'https://dea.staging.credsimple.com';
     this.path = '/v1/clients_providers/';
     this.token = '3ad6aef59ee542ec881c5bc6593ba9c3';
     this.id = 20;
  }

  getData(callback) {
    const requestUrl = this.baseUrl + this.path + this.id + '?token=' + this.token;
    const request = new XMLHttpRequest();
    request.open('get', requestUrl, true);
    request.onload = function(e) {
      var response = request.response;
      response = JSON.parse(response);
      callback(response);
    };
    request.onerror = function(e) {
      callback(request.response, e);
    };
    request.send();
  };

};
// api.getData()

const simpleDEArequest = {
  baseUrl: 'https://dea.staging.credsimple.com',
  path: '/v1/clients_providers/',
  token: '3ad6aef59ee542ec881c5bc6593ba9c3',
  id: 20,
}


class csAPI {
  constructor({ baseUrl, path, token, id }, method = "GET", data = {}) {
    this.method = method;
    this.url = baseUrl + path + id + '?token=' + token;
    this.data = data;

    this._requestPromise = this._requestPromise.bind(this);
  }

  getData(success, error) {
    return this._requestPromise().then(success, error);
  }

  _requestPromise () {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open(this.method, this.url);

      request.onload = event => {
        if (request.status >= 200 && request.status < 300) {
          let response = request.response;
          response = JSON.parse(response);
          return resolve(response);
        } else {
          reject({
            status: request.status,
            statusText: request.statusText
          });
        }
      };

      request.onerror = function () {
        reject({
          status: request.status,
          statusText: request.statusText
        });
      };

      if (Object.keys(this.data) === 0) {
        request.send();
      } else {
        request.send(JSON.stringify(this.data));
      }
    });
  };
}


// const _requestPromise = ({ method, url, data }) => {
//   return new Promise((resolve, reject) => {
//     const request = new XMLHttpRequest();
//     request.open(method, url);
//
//     request.onload = event => {
//       if (request.status >= 200 && request.status < 300) {
//         const response = request.response;
//         response = JSON.parse(response);
//         return resolve(response);
//       } else {
//         reject({
//           status: request.status,
//           statusText: request.statusText
//         });
//       }
//     };
//
//     request.onerror = function () {
//       reject({
//         status: request.status,
//         statusText: request.statusText
//       });
//     };
//
//     request.send(JSON.stringify(data));
//   });
// };

// const _extend = function (base, ...objs) {
//   objs.forEach(obj => {
//     Object.keys(obj).forEach(key => {
//       base[key] = obj[key];
//     });
//   });
//   return base;
// };
