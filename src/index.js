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

    const users = userItems.reduce((acc, { login, html_url, avatar_url }) => {
      let mappedItem = {};

      mappedItem.title = login;
      mappedItem.htmlUrl = html_url;
      mappedItem.image = avatar_url;

      acc.push(mappedItem);

      return acc;
    }, []);

    const repos = reposItems.reduce(
      (acc, { html_url, owner: { avatar_url: owner_avatar_url }, name }) => {
        let mappedItem = {};

        mappedItem.title = name;
        mappedItem.htmlUrl = html_url;
        mappedItem.image = owner_avatar_url;

        acc.push(mappedItem);

        return acc;
      },
      [],
    );

    const combinedResults = [...users, ...repos];

    return combinedResults.sort(compareValues('title'));
  },
  minLength: 3,
  root: document.querySelector('#autocomplete'),
});
