import { debounce, handleInputFocusTransfer } from './utils';
import loader from './loader.svg';
import styles from './AutoComplete.scss';

export const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  fetchData,
  minLength,
  renderLabel = 'Search',
}) => {
  root.innerHTML = `
    <div class="${styles['auto-complete']} fade-in">
    <label>${renderLabel()}</label>
    <input class="input focusable" />
    <div class="dropdown fade-in">
      <div class="dropdown-menu">
        <ul class="dropdown-content results"></ul>
      </div>
    </div>
    <div class="messages fade-in"></div>
    </div>
  `;

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');
  const messages = root.querySelector('.messages');
  let error = null;
  let items = [];

  const onInput = async event => {
    const {
      target: { value },
    } = event;

    closeDropdown();
    clearList();
    clearMessages();

    if (value.length < minLength) {
      return;
    }

    messages.innerHTML = `<img src="${loader}" />`;

    items = await fetchData(value).catch(err => {
      messages.textContent = err;
      error = err;
    });

    if (error) return;

    if (items.length === 0) {
      messages.textContent = 'No results...';
      return;
    }

    clearMessages();

    for (let item of items) {
      const option = document.createElement('li');
      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(item);

      if (onOptionSelect) {
        option.addEventListener('click', () => {
          onOptionSelect(item);
        });
      }

      resultsWrapper.appendChild(option);
    }

    openDropdown();
  };

  const clearList = () => {
    resultsWrapper.innerHTML = '';
  };

  const openDropdown = () => {
    const showContent = input.value.length > 0 && items.length > 0;

    if (showContent) {
      dropdown.classList.add('is-active');
    }
  };

  const closeDropdown = () => {
    dropdown.classList.remove('is-active');
  };

  const clearMessages = () => {
    messages.textContent = '';
  };

  input.addEventListener('input', debounce(onInput, 500));

  input.addEventListener('focus', openDropdown);

  document.addEventListener('keydown', handleInputFocusTransfer);

  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      closeDropdown();
    }
  });
};
