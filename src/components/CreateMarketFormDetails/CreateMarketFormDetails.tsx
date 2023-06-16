import { useMemo } from 'react';

import { useField } from 'formik';

import Feature from 'components/Feature';

import { useFilters } from 'hooks';

import {
  Input,
  ImageUploadInput,
  SelectInput,
  DateInput,
  TextArea
} from '../Input';
import CreateMarketFormDetailsClasses from './CreateMarketFormDetails.module.scss';

function CreateMarketFormDetails() {
  const { filters } = useFilters();
  const [field] = useField('image');

  const uploadedImageURL = field.value.isUploaded
    ? `https://polkamarkets.infura-ipfs.io/ipfs/${field.value.hash}`
    : undefined;

  const categories = useMemo(
    () =>
      filters.dropdowns.categories.options.map(category => ({
        name: category.label,
        value: category.value
      })),
    [filters.dropdowns.categories.options]
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
      <Feature name="regular">
        <Input
          name="resolutionSource"
          label="Resolution Source"
          placeholder="https://www.google.com/"
          required
        />
      </Feature>
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
