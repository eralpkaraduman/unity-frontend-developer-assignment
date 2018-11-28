interface CarouselElements {
  readonly dotButtons: ReadonlyArray<HTMLButtonElement>;
  readonly leftButton: HTMLButtonElement;
  readonly rightButton: HTMLButtonElement;
  readonly scrollableContainer: HTMLElement;
}

interface CarouselState {
  readonly currentIndex: number;
  readonly numberOfItems: number;
}

// tslint:disable-next-line:no-let
let state: CarouselState;
// tslint:disable-next-line:no-let
let carouselElements: CarouselElements;

function calculateTargetIndex(currentIndex: number, difference: number, numberOfItems: number): number {
  const direction = (difference > 0) ? +1 : -1;
  // tslint:disable-next-line:no-let
  let newIndex = currentIndex;
  // tslint:disable-next-line:no-let
  for (let i = 0; i < Math.abs(difference); i++) {
    newIndex = newIndex + direction;
    if (newIndex < 0) {
      newIndex = Math.max(0, numberOfItems - 1);
    }
    if (newIndex >= numberOfItems) {
      newIndex = 0;
    }
  }
  return newIndex;
}

function calculateScrollPosition(index: number, numberOfItems: number, scrollWidth: number): number {
  return (scrollWidth / numberOfItems) * index;
}

function slideToIndex(index: number): void {
  state = {...state,
    currentIndex: index,
  };
  setActiveDotStyle();
  slideToCurrentIndex(true);
}

function handleOnPreviousImageRequested(): void {
  slideToIndex(calculateTargetIndex(state.currentIndex, -1, state.numberOfItems));
}

function handleOnNextImageRequested(): void {
  slideToIndex(calculateTargetIndex(state.currentIndex, +1, state.numberOfItems));
}

function stripIndexFromDotButtonElement(button: HTMLButtonElement): number {
  return Number(button.id.split('carousel-navigation-dot-index-')[1]);
}

function handleOnDotButtonClicked(e: MouseEvent): void {
  const button = e.target as HTMLButtonElement;
  slideToIndex(stripIndexFromDotButtonElement(button));
}

function setActiveDotStyle(): void {
  carouselElements.dotButtons.forEach(button => {
    if (stripIndexFromDotButtonElement(button) === state.currentIndex) {
      button.classList.add('carousel-navigation-dot-active');
    } else {
      button.classList.remove('carousel-navigation-dot-active');
    }
  });
}

function slideToCurrentIndex(animated: boolean): void {
  const targetScrollPosition = calculateScrollPosition(
    state.currentIndex,
    state.numberOfItems,
    carouselElements.scrollableContainer.scrollWidth,
  );
  if (animated) {
    scrollWithAnimation(targetScrollPosition, 300, carouselElements.scrollableContainer);
  } else {
    carouselElements.scrollableContainer.scrollTo({
      left: targetScrollPosition,
      top: carouselElements.scrollableContainer.offsetTop,
    });
  }
}

function registerEventListeners(): void {
  carouselElements.leftButton.addEventListener('click', handleOnPreviousImageRequested);
  carouselElements.rightButton.addEventListener('click', handleOnNextImageRequested);
  carouselElements.dotButtons.forEach((button) => button.addEventListener('click', handleOnDotButtonClicked));
  window.addEventListener('resize', () => slideToCurrentIndex(false));
}

window.document.addEventListener('DOMContentLoaded', () => {
  carouselElements = {
    dotButtons: Array.from(window.document.getElementsByClassName('carousel-navigation-dot')).map(el => el as HTMLButtonElement),
    leftButton: window.document.getElementById('carousel-button-left') as HTMLButtonElement,
    rightButton: window.document.getElementById('carousel-button-right') as HTMLButtonElement,
    scrollableContainer: window.document.getElementById('carousel-container') as HTMLElement,
  };
  state = {
    currentIndex: 0,
    numberOfItems: carouselElements.dotButtons.length,
  };
  setActiveDotStyle();
  registerEventListeners();
  slideToCurrentIndex(false);
});

// Based on: https://gist.github.com/andjosh/6764939
const scrollWithAnimation = (to: number, duration: number, element: HTMLElement) => {
  const start = element.scrollLeft;
  const change = to - start;
  const startDate = +new Date();
  const animateScroll = () => {
    const currentDate = +new Date();
    const currentTime = currentDate - startDate;
    element.scrollLeft = parseInt(String(easeInOutQuad(currentTime, start, change, duration)), 10);
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    }
    else {
      element.scrollLeft = to;
    }
  };
  animateScroll();
};

const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  // tslint:disable-next-line:no-parameter-reassignment
  t /= d / 2;
  if (t < 1) { return c / 2 * t * t + b; }
  // tslint:disable-next-line:no-parameter-reassignment
  t--;
  // tslint:disable-next-line:object-literal-sort-keys
  return -c / 2 * (t * (t - 2) - 1) + b;
};
