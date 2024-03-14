import { AlertMini } from 'components/Alert';

function TradeFormClosed() {
  return (
    <div className="pm-c-trade-form">
      <div className="pm-c-trade-form__group" style={{ gap: '1.6rem' }}>
        <AlertMini
          variant="warning"
          description="This market is closed. If you have any winnings to claim please check
      your portfolio"
        />
      </div>
      {/* <div className="pm-c-trade-form__group" style={{ gap: '2.4rem' }}>
        <div className="pm-c-trade-form-actions">
          <Link to="/portfolio" style={{ width: 'inherit' }}>
            <Button color="primary" fullwidth>
              Go to Portfolio
            </Button>
          </Link>
        </div>
      </div> */}
    </div>
  );
}

export default TradeFormClosed;
