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

    input.removeEventListener('focus', handleDropdownFocus);

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

    const isOpenable = value.length > 0 && !noResults;

    clearMessages(messages);
    renderDropdownList(items, resultsWrapper, renderOption);
    openDropdown(dropdown, isOpenable);

    input.addEventListener('focus', handleDropdownFocus);
  };

  const handleDropdownFocus = () => {
    const isOpenable = input.value.length > 0 && items.length > 0;
    openDropdown(dropdown, isOpenable);
  };

  input.addEventListener('input', debounce(onInput, 500));

  document.addEventListener('keydown', handleInputFocusTransfer);

  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      closeDropdown(dropdown);
    }
  });
};
