export type Image = {
  file: any;
  hash: string;
  isUploaded: boolean;
};

export type Outcome = {
  id: string;
  image?: Image;
  name: string;
  probability: number;
};

export type CreateMarketFormData = {
  question: string;
  description: string;
  answerType: 'binary' | 'multiple';
  outcomes: Outcome[];
  image: Image;
  category: string;
  subcategory: string;
  closingDate: string;
  liquidity: number;
  fee: number;
  treasuryFee: number;
  resolutionSource?: string;
};
