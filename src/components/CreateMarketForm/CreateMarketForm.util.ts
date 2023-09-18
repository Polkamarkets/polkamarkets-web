import uuid from 'react-uuid';

import { features } from 'config';
import dayjs from 'dayjs';
import { almost } from 'helpers/math';
import sum from 'lodash/sum';
import * as Yup from 'yup';

import type { CreateMarketFormData } from './CreateMarketForm.type';

const initialValues: CreateMarketFormData = {
  question: '',
  description: '',
  answerType: 'binary',
  outcomes: [
    {
      id: uuid(),
      image: {
        file: undefined,
        hash: '',
        isUploaded: false
      },
      name: 'Yes',
      probability: 50
    },
    {
      id: uuid(),
      image: {
        file: undefined,
        hash: '',
        isUploaded: false
      },
      name: 'No',
      probability: 50
    }
  ],
  image: {
    file: undefined,
    hash: '',
    isUploaded: false
  },
  category: '',
  subcategory: '',
  closingDate: dayjs().toString(),
  liquidity: 0,
  fee: features.fantasy.enabled ? 0 : 2,
  treasuryFee: features.fantasy.enabled ? 0 : 1,
  ...(features.regular.enabled && {
    resolutionSource: ''
  })
};

const validationSchema = [
  Yup.object().shape({
    question: Yup.string().required('Market Question is required.'),
    description: Yup.string()
      .min(100, 'Market Description must be at least 100 characters long.')
      .required('Market Description is required.'),
    category: Yup.string().required('Category is required.'),
    subcategory: Yup.string().required('Subcategory is required.'),
    ...(features.regular.enabled && {
      resolutionSource: Yup.string()
        .url('Please enter a valid url.')
        .required('Resolution source is required.')
    }),
    closingDate: Yup.date()
      .min(
        dayjs().format('MM/DD/YYYY HH:mm'),
        `Closing date must be later than ${dayjs().format('DD/MM/YYYY HH:mm')}`
      )
      .required('Closing date is required.'),
    image: Yup.object().shape({
      hash: Yup.string().required('Image is required.')
    })
  }),
  Yup.object().shape({
    outcomes: Yup.array()
      .of(
        Yup.object().shape({
          image: Yup.object().shape({
            hash: Yup.string()
          }),
          name: Yup.string().required('Outcome name is required.'),
          probability: Yup.number()
            .moreThan(0, 'Probability must be greater than 0%.')
            .lessThan(100, 'Probability must be less than 100%.')
            .required('Probability is required.')
        })
      )
      .test('images-required', 'All outcomes must have an image', value => {
        const outcomes = value as unknown as CreateMarketFormData['outcomes'];

        const hasImage = outcomes.some(
          outcome => outcome.image && outcome.image.hash
        );

        if (!hasImage) {
          return true;
        }

        return outcomes.every(outcome => outcome.image && outcome.image.hash);
      })
      .test('sum', 'Sum of probabilities must be 100%', (_value, context) => {
        const { outcomes } = context.parent;
        const probabilities = outcomes.map(outcome => outcome.probability);
        const sumOfProbabilities = sum(probabilities);
        return almost(sumOfProbabilities, 100);
      })
  }),
  Yup.object().shape({
    liquidity: Yup.number().moreThan(0).required('Liquidity is required.'),
    fee: Yup.number()
      .min(0, 'Fee must be greater than or equal to 0%')
      .max(5, 'Fee must be less than or equal to 5%')
      .required('Fee is required.'),
    treasuryFee: Yup.number()
      .min(0, 'Creator fee must be greater than or equal to 0%')
      .max(5, 'Creator fee must be less than or equal to 5%')
      .required('Creator fee is required.')
  })
];

export { initialValues, validationSchema };
