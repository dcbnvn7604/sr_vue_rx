import { from, of, merge } from 'rxjs';
import { filter, map, switchMap, tap, shareReplay } from 'rxjs/operators';

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
    const token = of(this.token);
    const noToken = token.pipe(
      filter(x => !x),
      map(x => new UnauthenticatedException())
    );
    const fetchListEntry = token.pipe(
      filter(x => !!x),
      switchMap(x => from(fetch(`${this.host}/api/entry/`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }))),
      switchMap(response => {
        switch (response.status) {
          case 200:
            return from(response.json());
          default:
            throw new UnsupportException();
        }
      })
    );
    return merge(noToken, fetchListEntry).pipe(
      shareReplay(1)
    );
  }
}

const api = new API();

export default api;