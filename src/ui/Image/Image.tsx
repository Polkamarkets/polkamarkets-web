import { forwardRef } from 'react';

import cn from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Skeleton from 'ui/Skeleton';
import useEnhancedRef from 'ui/useEnhancedRef';
import useImage from 'ui/useImage';

import imageClasses from './Image.module.scss';

export type ImageProps = React.PropsWithChildren<
  Pick<
    React.ComponentPropsWithRef<'img'>,
    'src' | 'alt' | 'className' | 'ref'
  > & {
    $size?: 'x2s' | 'xs' | 'sm' | 'md' | 'lg';
    $radius?: 'xs' | 'sm' | 'md' | 'lg';
    fallbackClassName?: string;
  }
>;

function ImageAnimation(
  props: React.PropsWithChildren<{ className?: string }>
) {
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      {...props}
    />
  );
}

const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { alt, className, children, $radius, $size, fallbackClassName, ...props },
  ref
) {
  const [state, { ref: imageRef, ...imageProps }] = useImage();

  return (
    <div
      className={cn(
        imageClasses.root,
        {
          [imageClasses.radiusXs]: $radius === 'xs',
          [imageClasses.radiusSm]: $radius === 'sm',
          [imageClasses.radiusMd]: $radius === 'md',
          [imageClasses.radiusLg]: $radius === 'lg',
          [imageClasses.sizeX2s]: $size === 'x2s',
          [imageClasses.sizeXs]: $size === 'xs',
          [imageClasses.sizeSm]: $size === 'sm',
          [imageClasses.sizeMd]: $size === 'md',
          [imageClasses.sizeLg]: $size === 'lg'
        },
        className
      )}
    >
      <img
        alt={alt}
        ref={useEnhancedRef<HTMLImageElement>(ref, imageRef)}
        className={cn(imageClasses.element, {
          [imageClasses.elementHide]: state !== 'ok',
          [imageClasses.elementProportional]: $size
        })}
        {...imageProps}
        {...props}
      />
      <AnimatePresence>
        {state === 'load' && (
          <ImageAnimation>
            <Skeleton className={imageClasses.skeleton} />
          </ImageAnimation>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state === 'error' && (
          <ImageAnimation
            className={cn(imageClasses.fallback, fallbackClassName)}
          >
            <div className={imageClasses.fallbackElement}>{children}</div>
          </ImageAnimation>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Image;
