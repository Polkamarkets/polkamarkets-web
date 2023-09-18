/* eslint-disable import/prefer-default-export */
import uuid from 'react-uuid';

import { features } from 'config';

const defaultBinaryOutcomes = [
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
];

export { defaultBinaryOutcomes };
