import { render, fireEvent } from '@testing-library/vue';

import App from '../src/component/App.vue';
import routes from '../src/route.js';
import api from '../src/api.js';

describe('router', () => {
  it('no login redirect to login page', async () => {
    const { debug, findByTestId } = render(App, {routes});
    await findByTestId('login');
  });

  it('login success redirect to page `list entry`', async () => {
    let mockFetch = jest.fn();
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({'token': 'token1'})
    });
    global.fetch = mockFetch;

    const { getByTestId, findByTestId } = render(App, {routes});

    await findByTestId('login');
    await fireEvent.update(getByTestId('usernameInput', 'username1'));
    await fireEvent.update(getByTestId('passwordInput', 'password1'));
    await fireEvent.click(getByTestId('loginButton'));

    await findByTestId('listentry');
    expect(() => {
      getByTestId('login');
    }).toThrow();
  });

  it('to page `detail entry`', async () => {
    api.setToken('token1');
    let mockFetch = jest.fn();
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve([{id: 1, title: 'title 1'}]),
    });
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: () => Promise.resolve({id: 1, title: 'title 1', content: 'content 1'}),
    });
    global.fetch = mockFetch;

    const { getByTestId, findByTestId, findByText } = render(App, {routes});

    await findByTestId('linkDetailEntry1');
    await fireEvent.click(getByTestId('linkDetailEntry1'));
    await findByTestId('detailentry');
    await findByText('content 1');
  });
});