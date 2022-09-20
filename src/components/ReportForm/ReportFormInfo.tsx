import { Alert } from '../Alert';
import Link from '../Link';

function ReportFormInfo() {
  return (
    <Alert
      variant="information"
      description={
        <>
          {`Earn POLK by reporting the correct outcome. `}
          <Link
            title="Learn more"
            href="https://help.polkamarkets.com/en/articles/5610525-how-market-resolution-works"
            aria-label="Learn more"
            target="_blank"
            rel="noreferrer"
            variant="information"
          />
        </>
      }
    />
  );
}

export default ReportFormInfo;
