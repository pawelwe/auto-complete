export const openDropdown = (el, shouldOpen) => {
  if (shouldOpen) {
    el.classList.add('is-active');
  }
};

export const closeDropdown = el => {
  el.classList.remove('is-active');
};
