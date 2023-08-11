import { useEffect } from 'react';

type LocalizeProps = {
  watermark?: boolean;
};

function Localize({ watermark = true }: LocalizeProps) {
  useEffect(() => {
    function removeWatermarkElement() {
      const watermarkElement = document.querySelector('#localize-powered-by');

      if (watermarkElement) {
        watermarkElement.remove();
      }
    }

    if (!watermark) {
      removeWatermarkElement();
    }
  }, [watermark]);

  return null;
}

export default Localize;
