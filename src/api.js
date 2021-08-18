import { from, of, merge, partition } from 'rxjs';
import { filter, map, concatMap, tap, mapTo } from 'rxjs/operators';

export class UnauthenticatedException {};
export class UnsupportException {};

class API {
  constructor() {
    return new Proxy(this, {
      get: (api, field, receiver) => {
        if (field != 'setHost' && !this.host) {
          throw Error('No api host');
        }
        return api[field];
      }
    });
  }

  setHost(host) {
    this.host = host;
  }

  setToken(token) {
    this.token = token;
  }

  listEntry() {
    return this._checkToken(hasToken => {
      return hasToken.pipe(
        concatMap(x => from(fetch(`${this.host}/api/entry/`, {
          headers: {
            'Content-Type': 'application/json'
          }
        }))),
        concatMap(response => {
          switch (response.status) {
            case 200:
              return from(response.json());
            default:
              throw new UnsupportException();
          }
        })
      );
    });
  }

  detailEntry(id) {
    return this._checkToken(hasToken => {
      return hasToken.pipe(
        concatMap(x => from(fetch(`${this.host}/api/entry/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        }))),
        concatMap(response => {
          switch (response.status) {
            case 200:
              return from(response.json());
            default:
              throw new UnsupportException();
          }
        })
      );
    });
  }

  editEntry(entry) {
    return this._checkToken(hasToken => {
      return hasToken.pipe(
        concatMap(x => from(fetch(`${this.host}/api/entry/${entry.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({title: entry.title, password: entry.content})
        }))),
        map(response => {
          switch (response.status) {
            case 200:
              return;
            default:
              throw new UnsupportException();
          }
        })
      );
    });
  }

  addEntry(entry) {
    return this._checkToken(hasToken => {
      return hasToken.pipe(
        concatMap(x => from(fetch(`${this.host}/api/entry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({title: entry.title, password: entry.content})
        }))),
        map(response => {
          switch (response.status) {
            case 201:
              return;
            default:
              throw new UnsupportException();
          }
        })
      );
    });
  }

  login(username, password) {
    return from(fetch(`${this.host}/api/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })).pipe(
      concatMap(response => {
        switch (response.status) {
          case 200: 
            return from(response.json())
          default:
            throw new UnsupportException();
        }
      }),
      map(response => response['token']),
      tap(token => this.setToken(token))
    );
  }

  _checkToken(doIfToken) {
    const [ noToken, hasToken ] = partition(of(this.token), x => !x);
    const exception = noToken.pipe(
      mapTo(new UnauthenticatedException())
    );
    return merge(doIfToken(hasToken), exception)
  }
}

const api = new API();

export default api;