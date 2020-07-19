import axios from 'axios';
import { createAutoComplete } from './AutoComplete/AutoComplete';
import { compareValues } from './utils';
import './styles/index.scss';

createAutoComplete({
  label: `
        Search <a href="//github.com" target="_blank">GitHub</a> for users and repos
    `,
  renderOption(item) {
    const { title, htmlUrl, image } = item;

    return `
        <a class="focusable" href="${htmlUrl}" target="_blank">
          <img src="${image}" alt="${title}" />
          ${title}
        </a>
    `;
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

    const users = userItems.map(({ login, html_url, avatar_url }) => {
      return {
        title: login,
        htmlUrl: html_url,
        image: avatar_url,
      };
    });

    const repos = reposItems.map(
      ({ html_url, name, owner: { avatar_url: owner_avatar_url } }) => {
        return {
          title: name,
          htmlUrl: html_url,
          image: owner_avatar_url,
        };
      },
    );

    const combinedResults = [...users, ...repos];

    return combinedResults.sort(compareValues('title'));
  },
  minLength: 3,
  root: document.querySelector('#autocomplete'),
});
