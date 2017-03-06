// class csAPI represents a generic async call that contains
// the call's method, url, and optional data. getData accepts success and
// error callbacks and currys them into a Promise. This also means that
// then methods can chain onto getData. Specifics of the async call
// is passed in when an instance is created as a JS object with attributes
// baseUrl, path, token, and id.

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

  _requestPromise() {
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
