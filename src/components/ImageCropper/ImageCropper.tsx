/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { useState, useCallback, useMemo } from 'react';
import Cropper from 'react-easy-crop';

import Slider from 'rc-slider';

import { useTheme } from 'hooks';

import { Button } from '../Button';
import { Theme, themes } from '../StepSlider';
import Text from '../Text';
import cropImage from './cropImage';

type ImageCropperProps = {
  image: File;
  onCrop: (croppedImage) => void;
  onCancel: () => void;
};

function ImageCroppper({ image, onCrop, onCancel }: ImageCropperProps) {
  const { theme } = useTheme();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const currentTheme: Theme = themes[theme];
  const imageURL = useMemo(
    () => (image ? URL.createObjectURL(image) : ''),
    [image]
  );

  const onCropComplete = useCallback((_croppedArea, _croppedAreaPixels) => {
    setCroppedAreaPixels(_croppedAreaPixels);
  }, []);

  const getCroppedImage = useCallback(async () => {
    const croppedImage = await cropImage(image, croppedAreaPixels);
    onCrop(croppedImage);
  }, [image, croppedAreaPixels, onCrop]);

  return (
    <div className="pm-c-image-cropper">
      <div className="pm-c-image-cropper__wrapper">
        <Cropper
          image={imageURL}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="pm-c-image-cropper__zoom-slider">
        <Text as="span" scale="body" fontWeight="semibold">
          -
        </Text>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.01}
          onChange={value => setZoom(value as number)}
          trackStyle={{
            backgroundColor: currentTheme.trackBackgroundColor
          }}
          railStyle={{ backgroundColor: currentTheme.railBackgroundColor }}
          dotStyle={{
            height: 10,
            width: 10,
            marginBottom: -1,
            backgroundColor: currentTheme.dotBackgroundColor,
            borderColor: currentTheme.dotBorderColor,
            borderWidth: 2
          }}
          activeDotStyle={{
            height: 10,
            width: 10,
            backgroundColor: currentTheme.activeDotBackgroundColor
          }}
          handleStyle={{
            height: 14,
            width: 14,
            backgroundColor: currentTheme.handleBackgroundColor,
            borderColor: currentTheme.handleBorderColor,
            borderWidth: 3,
            boxShadow: 'none'
          }}
        />
        <Text as="span" scale="body" fontWeight="semibold">
          +
        </Text>
      </div>
      <div className="pm-c-image-cropper__actions">
        <Button variant="ghost" color="default" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button color="primary" size="sm" onClick={getCroppedImage}>
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default ImageCroppper;
