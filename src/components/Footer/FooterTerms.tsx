import Link from '../Link';
import Text from '../Text';

function FooterTerms() {
  return (
    <div className="pm-l-footer__terms">
      <Text
        as="p"
        scale="caption"
        fontWeight="medium"
        className="pm-l-footer__terms-text-secondary"
        style={{
          textAlign: 'center',
          whiteSpace: 'pre-line'
        }}
      >
        <>
          {`Polkamarkets Services and POLK Token (POLK) `}
          <Link
            title="are not available in Excluded Jurisdictions."
            scale="caption"
            fontWeight="medium"
            className="pm-l-footer__terms-text-primary"
            style={{
              textDecoration: 'none'
            }}
            href="https://www.polkamarkets.com/legal/terms-conditions"
            target="_blank"
          />
          {` By accessing and using the interface you agree with our `}
          <Link
            title="Terms & Conditions"
            scale="caption"
            fontWeight="medium"
            href="https://www.polkamarkets.com/legal/terms-conditions"
            target="_blank"
          />
        </>
      </Text>
    </div>
  );
}

export default FooterTerms;
