import { CSSProperties, ReactNode, createElement } from 'react';

import classNames from 'classnames';

type TextType =
  | 'p'
  | 'span'
  | 'br'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'strong'
  | 'em'
  | 'blockquote'
  | 'q'
  | 'hr'
  | 'code'
  | 'pre'
  | 'mark'
  | 'ins'
  | 'del'
  | 'sup'
  | 'sub'
  | 'small'
  | 'label'
  | 'i'
  | 'b';

type TextFontSize =
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'body-1'
  | 'body-2'
  | 'body-3'
  | 'body-4';

type TextFontWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

type TextColor =
  | '1'
  | '2'
  | '3'
  | 'inverse'
  | 'warning'
  | 'violets-are-blue'
  | 'maximum-blue-green';

type TextTransform = 'uppercase';

type TextProps = {
  as?: TextType;
  fontSize?: TextFontSize;
  fontWeight?: TextFontWeight;
  color?: TextColor;
  transform?: TextTransform;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

function Text({
  as = 'p',
  fontSize = 'heading-1',
  fontWeight = 'regular',
  color,
  transform,
  className,
  style,
  children
}: TextProps) {
  return createElement(
    as,
    {
      className: classNames(
        className,
        `text-${fontSize}`,
        `font-${fontWeight}`,
        color && `text-${color}`,
        transform
      ),
      style
    },
    children
  );
}

export default Text;
