export const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export const handleInputFocusTransfer = (e, focusClass = '.focusable') => {
  const focusableInputElements = document.querySelectorAll(focusClass);

  //Creating an array from the node list
  const focusable = [...focusableInputElements];

  //get the index of current item
  const index = focusable.indexOf(document.activeElement);

  // Create a variable to store the index of next item to be focussed
  let nextIndex = 0;

  if (e.keyCode === 38) {
    // up arrow
    e.preventDefault();
    nextIndex = index > 0 ? index - 1 : 0;
    focusableInputElements[nextIndex].focus();
  } else if (e.keyCode === 40) {
    // down arrow
    e.preventDefault();
    nextIndex = index + 1 < focusable.length ? index + 1 : index;
    focusableInputElements[nextIndex].focus();
  }
};
