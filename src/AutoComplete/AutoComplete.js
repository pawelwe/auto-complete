import { debounce, handleInputFocusTransfer } from './utils';
import loader from './loader.svg';
import styles from './AutoComplete.scss';

export const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  fetchData,
  minLength,
  renderLabel = () => {
    return 'Search';
  },
}) => {
  root.innerHTML = `
    <div class="${styles['auto-complete']} fade-in">
    <label>${renderLabel()}</label>
    <input autofocus class="input focusable" />
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
  let isDropdownOpenable = false;

  const onInput = async event => {
    const {
      target: { value },
    } = event;
    const isEntryMinLengthNotReached = value.length < minLength;

    closeDropdown();
    clearList();
    clearMessages();

    if (isEntryMinLengthNotReached) {
      return;
    }

    renderLoader();

    try {
      items = await fetchData(value);
    } catch (e) {
      messages.textContent = e;
      error = e;
    }

    if (error) return;

    const noResults = items.length === 0;

    if (noResults) {
      messages.textContent = 'No results...';
      return;
    }

    isDropdownOpenable = value.length > 0;

    clearMessages();
    renderDropdownList();
    openDropdown(isDropdownOpenable);
  };

  const renderDropdownList = () => {
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
  };

  const openDropdown = shouldOpen => {
    if (shouldOpen) {
      dropdown.classList.add('is-active');
    }
  };

  const closeDropdown = () => {
    dropdown.classList.remove('is-active');
  };

  const renderLoader = () => {
    messages.innerHTML = `<img src="${loader}" />`;
  };

  const clearList = () => {
    resultsWrapper.innerHTML = '';
  };

  const clearMessages = () => {
    messages.innerHTML = '';
  };

  input.addEventListener('input', debounce(onInput, 500));

  input.addEventListener('focus', () => openDropdown(isDropdownOpenable));

  document.addEventListener('keydown', handleInputFocusTransfer);

  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      closeDropdown();
    }
  });
};
