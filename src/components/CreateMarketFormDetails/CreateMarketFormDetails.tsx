import { useEffect, useMemo } from 'react';

import ui from 'config/ui';
import { useFormikContext } from 'formik';
import { useGetLandBySlugQuery } from 'services/Polkamarkets';

import { CreateMarketFormData } from 'components/CreateMarketForm/CreateMarketForm.type';

import { Input, SelectInput, DateInput, TextArea } from '../Input';
import CreateMarketFormDetailsClasses from './CreateMarketFormDetails.module.scss';

// TODO: replace with actual community slug of the community
const COMMUNITY_SLUG = 'politics';

function CreateMarketFormDetails() {
  const { setFieldValue, setFieldTouched, values } =
    useFormikContext<CreateMarketFormData>();
  const categories = useMemo(
    () =>
      ui.filters.categories.options.map(category => ({
        name: category,
        value: category
      })),
    []
  );

  const { data: community } = useGetLandBySlugQuery({ slug: COMMUNITY_SLUG });
  const communityOptions = [
    ...(community ? [{ name: community.title, value: community.slug }] : [])
  ];
  const contestOptions = [
    ...(community?.tournaments?.length
      ? community.tournaments.map(t => ({
          name: t.title,
          value: t.slug
        }))
      : [])
  ];
  useEffect(() => {
    if (!community?.slug) return;
    setFieldValue('communityName', community?.title);
    setFieldTouched('communityName', true);
    setFieldValue('communitySlug', community?.slug);
    setFieldTouched('communitySlug', true);
    setFieldValue('communityImageUrl', community?.imageUrl);
    setFieldTouched('communityImageUrl', true);
  }, [community, setFieldTouched, setFieldValue]);

  useEffect(() => {
    if (!values?.contestSlug) return;
    const contest = community?.tournaments?.find(
      t => t.slug === values?.contestSlug
    );
    if (!contest) return;
    setFieldValue('contestName', contest.title);
    setFieldTouched('contestName', true);
  }, [
    community?.tournaments,
    setFieldTouched,
    setFieldValue,
    values?.contestSlug
  ]);

  return (
    <div className={CreateMarketFormDetailsClasses.root}>
      <SelectInput
        label="Your Community"
        name="communitySlug"
        placeholder="Select Community"
        options={communityOptions}
        defaultValue={communityOptions?.[0]?.value}
        required
        disabled
      />
      <SelectInput
        label="Choose Contest"
        name="contestSlug"
        placeholder="Select Contest"
        options={contestOptions}
        required
      />
      <Input
        name="question"
        label="Question"
        placeholder="Write your question"
        description="eg: Will the Democracts win the 2024 US presidential election?"
        required
      />
      <TextArea
        rows={5}
        name="description"
        label="Description"
        placeholder="Write the question details here"
        description="Provide background info and question resolution criteria here."
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
        <DateInput label="Closing Date - Local Time" name="closingDate" />
      </div>
      <Input
        name="resolutionSource"
        label="Resolution Source"
        placeholder="https://www.google.com/"
      />
    </div>
  );
}

export default CreateMarketFormDetails;
