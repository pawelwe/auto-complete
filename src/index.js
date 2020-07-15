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
    const isUser = item.login;
    const isRepo = item.name;

    if (isUser) {
      return `
        <a tabindex="1" class="focusable" href="${item.html_url}" target="_blank">
          <img src="${item.avatar_url}" />
          ${item.login}
        </a>
    `;
    } else if (isRepo) {
      return `
      <a tabindex="1" class="focusable" href="${item.html_url}" target="_blank">
        <img src="${item.owner.avatar_url}" />
        ${item.name}
      </a>
      `;
    }
  },
  async fetchData(searchTerm) {
    const usersResponse = await axios.get(
      'https://api.github.com/search/users',
      {
        params: {
          q: searchTerm,
          size: 50,
          order: 'desc',
        },
      },
    );

    const reposResponse = await axios.get(
      'https://api.github.com/search/repositories',
      {
        params: {
          q: searchTerm,
          size: 50,
          order: 'desc',
        },
      },
    );

    return [
      ...usersResponse.data.items.sort(compareValues('login')),
      ...reposResponse.data.items.sort(compareValues('name')),
    ];
  },
  minLength: 3,
  root: document.querySelector('#autocomplete'),
});
