import {
  ComponentProps,
  ContextType,
  WheelEvent,
  useCallback,
  useContext
} from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';

import { AlertMini } from '../Alert';
import Icon from '../Icon';
import styles from './Carousel.module.scss';

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <button
      type="button"
      className={styles.carouselHeaderArrowsButton}
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
    >
      <Icon name="Chevron" dir="left" />
    </button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <button
      type="button"
      className={styles.carouselHeaderArrowsButton}
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
    >
      <Icon name="Chevron" dir="right" />
    </button>
  );
}

type ScrollVisibilityApiType = ContextType<typeof VisibilityContext>;

type CarouselProps<T> = ComponentProps<typeof ScrollMenu> & {
  data: T[];
  emptyStateDescription: string;
};

function Carousel<T>({
  Header,
  data,
  emptyStateDescription,
  children,
  ...props
}: CarouselProps<T>) {
  const onWheel = useCallback(
    (apiObj: ScrollVisibilityApiType, event: WheelEvent): void => {
      const isTouchpad =
        Math.abs(event.deltaX) !== 0 || Math.abs(event.deltaY) < 15;

      if (isTouchpad) {
        event.stopPropagation();
        return;
      }

      if (event.deltaY < 0) {
        apiObj.scrollNext();
      } else if (event.deltaY > 0) {
        apiObj.scrollPrev();
      }
    },
    []
  );

  if (!data.length)
    return (
      <div>
        <div className={styles.carouselHeader}>{Header}</div>
        <div className="padding-y-5 padding-x-4 width-full border-solid border-1 border-radius-medium">
          <AlertMini
            style={{ border: 'none' }}
            styles="outline"
            variant="information"
            description={emptyStateDescription}
          />
        </div>
      </div>
    );

  return (
    <ScrollMenu
      scrollContainerClassName={styles.carouselScroll}
      itemClassName={styles.carouselItem}
      onWheel={onWheel}
      Header={
        <div className={styles.carouselHeader}>
          {Header}
          <div className={styles.carouselHeaderArrows}>
            <LeftArrow />
            <RightArrow />
          </div>
        </div>
      }
      {...props}
    >
      {children}
    </ScrollMenu>
  );
}

export default Carousel;
