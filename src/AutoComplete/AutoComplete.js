import { debounce, handleInputFocusTransfer } from './utils/utils';
import {
  renderAutoCompleteTemplate,
  renderDropdownList,
  renderLoader,
  renderNoResults,
  clearList,
  clearMessages,
} from './rendering/rendering';
import { openDropdown, closeDropdown } from './interactions/interactions';
import loader from './assets/loader.svg';

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
  root.innerHTML = renderAutoCompleteTemplate(renderLabel);

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
    const isEntryMinLengthNotReached = value.length < minLength;

    closeDropdown(dropdown);
    clearList(resultsWrapper);
    clearMessages(messages);

    if (isEntryMinLengthNotReached) {
      return;
    }

    renderLoader(messages, loader);

    try {
      items = await fetchData(value);
    } catch (e) {
      messages.textContent = e;
      error = e;
    }

    if (error) return;

    const noResults = items.length === 0;

    if (noResults) {
      renderNoResults(messages);
      return;
    }

    clearMessages(messages);
    renderDropdownList(items, resultsWrapper, renderOption);
    openDropdown(dropdown, value.length > 0);
  };

  input.addEventListener('input', debounce(onInput, 500));

  input.addEventListener('focus', () =>
    openDropdown(dropdown, input.value.length > 0),
  );

  document.addEventListener('keydown', handleInputFocusTransfer);

  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      closeDropdown(dropdown);
    }
  });
};
