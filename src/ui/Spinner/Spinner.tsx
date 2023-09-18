import classNames from 'classnames';

import spinnerClasses from './Spinner.module.scss';

type SpinnerProps = {
  $size?: 'md';
};

export default function Spinner({ $size }: SpinnerProps) {
  return (
    <div
      className={classNames(spinnerClasses.root, {
        [spinnerClasses.size]: $size,
        [spinnerClasses.sizeMd]: $size === 'md'
      })}
    >
      <span className={`spinner--primary ${spinnerClasses.element}`} />
    </div>
  );
}
