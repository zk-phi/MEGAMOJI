export const elementIsContained = (element, parent) => {
  if (!element) {
    return false;
  } else if (element === parent) {
    return true;
  } else {
    return elementIsContained(element.parentElement, parent);
  }
};
