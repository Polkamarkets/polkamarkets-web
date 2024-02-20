import { useMemo } from 'react';

import ui from 'config/ui';
import { useField } from 'formik';

import {
  Input,
  ImageUploadInput,
  SelectInput,
  DateInput,
  TextArea
} from '../Input';
import CreateMarketFormDetailsClasses from './CreateMarketFormDetails.module.scss';

function CreateMarketFormDetails() {
  const [field] = useField('image');

  const uploadedImageURL = field.value.isUploaded
    ? `https://polkamarkets.infura-ipfs.io/ipfs/${field.value.hash}`
    : undefined;

  const categories = useMemo(
    () =>
      ui.filters.categories.options.map(category => ({
        name: category,
        value: category
      })),
    []
  );

  return (
    <div className={CreateMarketFormDetailsClasses.root}>
      <Input
        name="question"
        label="Question"
        placeholder="What would you like to see the world predict?"
        description="eg: Will the Democracts win the 2024 US presidential election?"
        required
      />
      <TextArea
        rows={5}
        name="description"
        label="Description"
        placeholder="Write the market details here"
        description="Provide background info and market resolution criteria here."
        className={CreateMarketFormDetailsClasses.textArea}
        required
      />
      <div className={CreateMarketFormDetailsClasses.groupRow}>
        <SelectInput
          label="Category"
          name="category"
          placeholder="Select Category"
          options={categories}
          required
        />
        <Input
          name="subcategory"
          label="Subcategory"
          placeholder="Subcategory"
          required
        />
      </div>
      <div className={CreateMarketFormDetailsClasses.groupRow}>
        <DateInput label="Closing Date - Local Time" name="closingDate" />
        <ImageUploadInput
          label="Thumbnail"
          name="image"
          notUploadedActionLabel="Upload Image"
          uploadedActionLabel="Re-Upload"
          initialImagePreviewURL={uploadedImageURL}
        />
      </div>
    </div>
  );
}

export default CreateMarketFormDetails;
