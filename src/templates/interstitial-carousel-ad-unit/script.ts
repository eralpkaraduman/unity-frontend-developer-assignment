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
  slideToCurrentIndex();
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

function slideToCurrentIndex(): void {
  const targetScrollPosition = calculateScrollPosition(
    state.currentIndex,
    state.numberOfItems,
    carouselElements.scrollableContainer.scrollWidth,
  );
  carouselElements.scrollableContainer.scrollTo({
    behavior: 'smooth',
    left: targetScrollPosition,
    top: carouselElements.scrollableContainer.offsetTop,
  });
}

function registerEventListeners(): void {
  carouselElements.leftButton.addEventListener('click', handleOnPreviousImageRequested);
  carouselElements.rightButton.addEventListener('click', handleOnNextImageRequested);
  carouselElements.dotButtons.forEach((button) => button.addEventListener('click', handleOnDotButtonClicked));
  window.addEventListener('resize', () => slideToCurrentIndex());
}

// Based on: https://gist.github.com/metasansana/beb3e06d423cfbf518eb565e4829ac28#file-debounce-ts
const debounce = <A>(f: (a: A) => void, delay: number) => {
  // tslint:disable-next-line:no-let
  let timer: (number | null) = null;
  return (a: A) => {
    if (!timer) {
      timer = Number(setTimeout(() => f(a), delay));
    } else {
      clearTimeout(timer);
      timer = Number(setTimeout(() => f(a), delay));
    }
  };
};

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
  slideToCurrentIndex();
});


