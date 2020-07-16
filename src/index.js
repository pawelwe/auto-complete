import axios from 'axios';
import { createAutoComplete } from './AutoComplete/AutoComplete';
import { compareValues } from './utils';
import './styles/index.scss';

createAutoComplete({
  renderLabel() {
    return `
        Search <a href="//github.com" target="_blank">GitHub</a> for users and repos
    `;
  },
  renderOption(item) {
    const isUserItem = item.login;
    const isRepoItem = item.name;

    if (isUserItem) {
      return `
        <a class="focusable" href="${item.html_url}" target="_blank">
          <img src="${item.avatar_url}" />
          ${item.login}
        </a>
    `;
    } else if (isRepoItem) {
      return `
      <a class="focusable" href="${item.html_url}" target="_blank">
        <img src="${item.owner.avatar_url}" />
        ${item.name}
      </a>
      `;
    }
  },
  async fetchData(searchTerm) {
    const usersResponse = axios.get('https://api.github.com/search/users', {
      params: {
        q: searchTerm,
        size: 50,
      },
    });

    const reposResponse = axios.get(
      'https://api.github.com/search/repositories',
      {
        params: {
          q: searchTerm,
          size: 50,
        },
      },
    );

    const [
      {
        data: { items: userItems },
      },
      {
        data: { items: reposItems },
      },
    ] = await Promise.all([usersResponse, reposResponse]);

    return [
      ...userItems.sort(compareValues('login')),
      ...reposItems.sort(compareValues('name')),
    ];
  },
  minLength: 3,
  root: document.querySelector('#autocomplete'),
});
