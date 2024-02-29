import { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Formik, Form } from 'formik';
import {
  useCreateLeaderboardGroupMutation,
  useEditLeaderboardGroupMutation
} from 'services/Polkamarkets';

import type { CreateLeaderboardGroupState } from 'pages/Leaderboard/types';

import { ButtonLoading } from 'components/Button';
import { ImageUploadInput, Input, TextArea } from 'components/Input';
import ModalFooter from 'components/ModalFooter';

import { useAppSelector } from 'hooks';

import CreateLeaderboardGroupFormClasses from './CreateLeaderboardGroupForm.module.scss';
import type { CreateLeaderboardGroupFormValues } from './CreateLeaderboardGroupForm.type';
import {
  formProps,
  getInitialValues,
  sanitizeSubmittedValues,
  validationSchema
} from './CreateLeaderboardGroupForm.util';

type CreateLeaderboardGroupFormProps = {
  mode: CreateLeaderboardGroupState['mode'];
  previousValues?: CreateLeaderboardGroupFormValues;
  slug?: string;
  onHide: () => void;
};

function CreateLeaderboardGroupForm({
  mode,
  previousValues,
  slug,
  onHide
}: CreateLeaderboardGroupFormProps) {
  const history = useHistory();
  const userEthAddress = useAppSelector(state => state.polkamarkets.ethAddress);

  const initialValues = useMemo(
    () => getInitialValues(userEthAddress),
    [userEthAddress]
  );

  const [
    createLeaderboardGroup,
    { data: createLeaderboardGroupData, isSuccess: isSuccessCreate }
  ] = useCreateLeaderboardGroupMutation();

  const [
    editLeaderboardGroup,
    { data: editLeaderboardGroupData, isSuccess: isSuccessEdit }
  ] = useEditLeaderboardGroupMutation();

  const redirectToLeaderboardGroup = useCallback(
    (leaderboardSlug: string) => {
      history.push(`/clubs/${leaderboardSlug}`);
      window.location.reload();
    },
    [history]
  );

  useEffect(() => {
    if (isSuccessCreate && createLeaderboardGroupData) {
      onHide();
      redirectToLeaderboardGroup(createLeaderboardGroupData.slug);
    }

    if (isSuccessEdit && editLeaderboardGroupData) {
      onHide();
      redirectToLeaderboardGroup(editLeaderboardGroupData.slug);
    }
  }, [
    createLeaderboardGroupData,
    editLeaderboardGroupData,
    history,
    isSuccessCreate,
    isSuccessEdit,
    onHide,
    redirectToLeaderboardGroup
  ]);

  const handleCreate = useCallback(
    async values => {
      await createLeaderboardGroup({
        ...values,
        createdBy: userEthAddress
      });
    },
    [createLeaderboardGroup, userEthAddress]
  );

  const handleEdit = useCallback(
    async values => {
      await editLeaderboardGroup({
        ...values,
        slug
      });
    },
    [editLeaderboardGroup, slug]
  );

  const handleSubmit = useCallback(
    async (values: CreateLeaderboardGroupFormValues) => {
      const sanitizedValues = sanitizeSubmittedValues(values);
      if (mode === 'create') {
        await handleCreate(sanitizedValues);
      } else if (mode === 'edit') {
        await handleEdit(sanitizedValues);
      }
    },
    [handleCreate, handleEdit, mode]
  );

  return (
    <Formik
      initialValues={previousValues || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form className={CreateLeaderboardGroupFormClasses.form}>
          <Input
            name="name"
            label="Name"
            placeholder="Club name"
            disabled={isSubmitting}
          />
          <ImageUploadInput
            name="image"
            label="Image"
            initialImagePreviewURL={(previousValues || initialValues).imageUrl}
            notUploadedActionLabel="Upload"
            uploadedActionLabel="Re-upload"
          />
          <TextArea
            hidden={mode === 'create'}
            name="addresses"
            label="Addresses"
            placeholder="Addresses (one per line)"
            rows={8}
            disabled={isSubmitting}
            className={CreateLeaderboardGroupFormClasses.textarea}
          />
          <ModalFooter>
            <ButtonLoading
              type="submit"
              size="sm"
              variant="normal"
              color="primary"
              fullwidth
              disabled={!dirty || !isValid || isSubmitting}
              loading={isSubmitting}
            >
              {formProps[mode].submitTitle}
            </ButtonLoading>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
}

export default CreateLeaderboardGroupForm;
