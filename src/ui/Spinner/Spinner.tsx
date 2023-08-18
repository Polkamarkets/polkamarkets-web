import spinnerClasses from './Spinner.module.scss';

export default function Spinner() {
  return (
    <div className={spinnerClasses.root}>
      <span className={`spinner--primary ${spinnerClasses.element}`} />
    </div>
  );
}
