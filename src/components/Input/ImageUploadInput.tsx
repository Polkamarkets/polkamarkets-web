/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ReactNode, useRef, useState } from 'react';

import classNames from 'classnames';
import { useField, useFormikContext } from 'formik';
import * as ipfsService from 'services/Polkamarkets/ipfs';

import ImageCropper from 'components/ImageCropper';
import Modal from 'components/Modal';
import ModalContent from 'components/ModalContent';

import Icon from '../Icon';
import Text from '../Text';
import styles from './ImageUploadInput.module.scss';
import InputErrorMessage from './InputErrorMessage';

type FileUploadButtonProps = {
  name: string;
  loading: boolean;
  children: ReactNode;
};

function ImageUploadButton({
  name,
  loading = false,
  children
}: FileUploadButtonProps & React.LabelHTMLAttributes<HTMLLabelElement>) {
  const ref = useRef<HTMLLabelElement>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  React.useEffect(() => {
    if (ref.current && ref.current.getBoundingClientRect().width) {
      setWidth(ref.current.getBoundingClientRect().width);
    }
    if (ref.current && ref.current.getBoundingClientRect().height) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, [children]);

  return (
    <label
      ref={ref}
      htmlFor={name}
      className={classNames({
        'pm-c-button-subtle--primary': true,
        'pm-c-button--normal': true,
        caption: true,
        semibold: true
      })}
      style={
        loading
          ? {
              width: `${width}px`,
              height: `${height}px`
            }
          : {}
      }
    >
      {loading ? <span className="spinner" /> : children}
    </label>
  );
}

type ImageContext = {
  image: {
    hash: string;
    file: any;
    isUploaded: boolean;
  };
};

type ImageUploadInputProps = {
  as?: 'button' | 'icon';
  label?: string;
  name: string;
  initialImagePreviewURL?: string;
  notUploadedActionLabel: string;
  uploadedActionLabel: string;
  description?: string;
};

function ImageUploadInput({
  as = 'button',
  label,
  name,
  initialImagePreviewURL,
  notUploadedActionLabel,
  uploadedActionLabel,
  ...props
}: ImageUploadInputProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const { setFieldValue, setFieldTouched } = useFormikContext<ImageContext>();
  const [field, meta] = useField(name);
  const [isUploading, setIsUploading] = useState(false);
  const [isCroppingImage, setIsCroppingImage] = useState(false);
  const [croppedImagePreviewURL, setCropperImagePreviewURL] = useState<
    undefined | string
  >(initialImagePreviewURL);
  const [invalidImageError, setInvalidImageError] = useState<
    undefined | string
  >(undefined);

  const isValidImage = imageType =>
    ['image/png', 'image/jpg', 'image/jpeg'].includes(imageType);

  function clearImage() {
    setCropperImagePreviewURL(undefined);

    setFieldValue(name, {
      file: undefined,
      hash: '',
      isUploaded: false
    });
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    setInvalidImageError(undefined);

    if (files && files[0]) {
      if (isValidImage(files[0].type)) {
        setInvalidImageError(undefined);

        setFieldTouched(name, true);
        setFieldValue(name, {
          file: files[0],
          hash: '',
          isUploaded: false
        });

        setIsCroppingImage(true);
      } else {
        clearImage();

        setFieldTouched(name, true);
        setInvalidImageError(
          'Format not supported. Please upload in jpg or png format'
        );
      }
    } else {
      clearImage();
    }
  }

  async function handleCroppedImage(croppedImage: File) {
    setFieldValue(name, {
      file: croppedImage,
      hash: '',
      isUploaded: true
    });

    setCropperImagePreviewURL(URL.createObjectURL(croppedImage));
    setIsCroppingImage(false);

    setIsUploading(true);
    const response = await ipfsService.addFile(croppedImage);
    setIsUploading(false);

    if (response.status !== 200) {
      // TODO: display error toast
      return;
    }

    // TODO: upload hash to smart contract
    const { hash } = response.data;

    setFieldValue(name, {
      file: croppedImage,
      hash,
      isUploaded: true
    });
  }

  function handleCancelCropImage() {
    clearImage();
    setIsCroppingImage(false);
  }

  const uploadActionLabel = field.value.isUploaded
    ? uploadedActionLabel
    : notUploadedActionLabel;

  return (
    <>
      <Modal show={isCroppingImage} size="md" centered>
        <ModalContent>
          <ImageCropper
            image={field.value.file}
            onCrop={handleCroppedImage}
            onCancel={handleCancelCropImage}
          />
        </ModalContent>
      </Modal>
      <div className="pm-c-input__group">
        {label ? (
          <label htmlFor={name} className="pm-c-input__label--default">
            {label}
          </label>
        ) : null}
        <input
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          id={name}
          {...props}
          onChange={handleImageUpload}
          hidden
        />
        <div className="pm-c-file-upload-input__actions">
          {as === 'button' ? (
            <>
              {croppedImagePreviewURL || initialImagePreviewURL ? (
                <img
                  className="pm-c-file-upload-input__thumbnail"
                  alt="Thumbnail"
                  src={croppedImagePreviewURL || initialImagePreviewURL}
                  width={64}
                  height={64}
                />
              ) : null}
              <ImageUploadButton name={name} loading={isUploading}>
                {uploadActionLabel}
              </ImageUploadButton>
              {field.value.isUploaded ? null : (
                <Text
                  as="span"
                  scale="caption"
                  fontWeight="medium"
                  className="pm-c-file-upload-input__status"
                >
                  No file chosen
                </Text>
              )}
            </>
          ) : (
            <>
              {croppedImagePreviewURL || initialImagePreviewURL ? (
                <label
                  htmlFor={name}
                  className={styles.reuploadButtonContainer}
                >
                  <img
                    alt="Thumbnail"
                    src={croppedImagePreviewURL || initialImagePreviewURL}
                    width={52}
                    height={52}
                    className={styles.reuploadButtonImage}
                  />
                  <div className={styles.reuploadButtonOverlay}>
                    <Icon name="Camera" className={styles.buttonIcon} />
                  </div>
                </label>
              ) : (
                <label htmlFor={name} className={styles.button}>
                  <Icon name="Camera" className={styles.buttonIcon} />
                </label>
              )}
            </>
          )}
        </div>
        {!isUploading && meta.touched && (meta.error || invalidImageError) ? (
          <InputErrorMessage
            message={invalidImageError || (meta.error as any).hash}
          />
        ) : null}
      </div>
    </>
  );
}

export default ImageUploadInput;
