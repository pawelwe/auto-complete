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
  label = 'Search',
}) => {
  root.innerHTML = renderAutoCompleteTemplate(label);

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

    input.removeEventListener('focus', handleInputFocus);

    if (isEntryMinLengthNotReached) {
      return;
    }

    renderLoader(messages, loader);

    try {
      items = await fetchData(value);
      error = null;
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

    const isOpenable = value.length > 0 && !noResults;

    if (isOpenable) {
      openDropdown(dropdown);
    }

    input.addEventListener('focus', handleInputFocus);
  };

  const handleInputFocus = () => {
    const isOpenable = input.value.length > 0 && items.length > 0;
    if (isOpenable) {
      openDropdown(dropdown);
    }
  };

  input.addEventListener('input', debounce(onInput, 500));

  document.addEventListener('keydown', handleInputFocusTransfer);

  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      closeDropdown(dropdown);
    }
  });
};
