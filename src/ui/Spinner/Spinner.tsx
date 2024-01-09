import classNames from 'classnames';

import spinnerClasses from './Spinner.module.scss';

type SpinnerProps = {
  $size?: 'md';
  className?: string;
};

export default function Spinner({ $size, className }: SpinnerProps) {
  return (
    <div
      className={classNames(
        spinnerClasses.root,
        {
          [spinnerClasses.size]: $size,
          [spinnerClasses.sizeMd]: $size === 'md'
        },
        className
      )}
    >
      <span className={`spinner--primary ${spinnerClasses.element}`} />
    </div>
  );
}
