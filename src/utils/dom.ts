export const elementIsContained = (element: Element | null, parent: Element): boolean => {
  if (!element) {
    return false;
  } else if (element === parent) {
    return true;
  } else {
    return elementIsContained(element.parentElement, parent);
  }
};
