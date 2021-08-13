import { render } from '@testing-library/vue';

import App from '../src/component/App.vue';
import routes from '../src/route.js';

describe('router', () => {
  it('no login redirect to login page', async () => {
    const { debug, getByTestId } = render(App, {routes});
    debug(getByTestId('list-entry'));
  });
});