import { partition } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { UnauthenticatedException } from '../api.js';

export default {
  methods: {
    apiException(api) {
      const share = api.pipe(
        shareReplay(1)
      );
      const [exception, normal] = partition(share, (value, _) => value instanceof UnauthenticatedException)
      exception.subscribe(x => {
        this.$router.push({ path: '/login' });
      });
      return normal
    }
  }
};