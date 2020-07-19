import styles from '../AutoComplete.scss';

let id = 0;

export const renderAutoCompleteTemplate = label => {
  id++;
  return `
    <div class="${styles['auto-complete']} fade-in">
    <label for="auto-complete-${id}">${label}</label>
    <input id="auto-complete-${id}" autofocus class="input focusable" />
    <div class="dropdown fade-in">
      <div class="dropdown-menu">
        <ul class="dropdown-content results"></ul>
      </div>
    </div>
    <div class="messages fade-in"></div>
    </div>
  `;
};

export const renderDropdownList = (
  items,
  wrapper,
  renderOption,
  optionSelectCallback = null,
) => {
  for (let item of items) {
    const option = document.createElement('li');
    option.classList.add('dropdown-item');
    option.innerHTML = renderOption(item);

    if (optionSelectCallback) {
      option.addEventListener('click', () => {
        optionSelectCallback(item);
      });
    }

    wrapper.appendChild(option);
  }
};

export const renderLoader = (el, loader) => {
  el.innerHTML = `<img src="${loader}" />`;
};

export const renderNoResults = el => {
  el.textContent = 'No results...';
};

export const clearList = el => {
  el.innerHTML = '';
};

export const clearMessages = el => {
  el.innerHTML = '';
};
