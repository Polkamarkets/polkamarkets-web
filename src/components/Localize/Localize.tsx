import { useEffect } from 'react';

function Localize() {
  useEffect(() => {
    function removeWatermark() {
      const watermarkElement = document.querySelector('#localize-powered-by');

      if (watermarkElement) {
        watermarkElement.remove();
      }
    }

    const langObserver = new MutationObserver(() => {
      setTimeout(removeWatermark, 4);
    });

    langObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });

    removeWatermark();

    return () => {
      langObserver.disconnect();
    };
  }, []);

  return null;
}

export default Localize;
