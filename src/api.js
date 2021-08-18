import { from, of, merge } from 'rxjs';
import { filter, map, concatMap, tap, shareReplay } from 'rxjs/operators';

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
    return merge(noToken, fetchListEntry).pipe(
      shareReplay(1)
    );
  }

  detailEntry(id) {
    const token = of(this.token);
    const noToken = token.pipe(
      filter(x => !x),
      map(x => new UnauthenticatedException())
    );
    const fetchDetailEntry = token.pipe(
      filter(x => !!x),
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
    return merge(noToken, fetchDetailEntry);
  }

  editEntry(entry) {
    const token = of(this.token);
    const noToken = token.pipe(
      filter(x => !x),
      map(x => new UnauthenticatedException())
    );
    const fetchEditEntry = token.pipe(
      filter(x => !!x),
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
    return merge(noToken, fetchEditEntry);
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
}

const api = new API();

export default api;