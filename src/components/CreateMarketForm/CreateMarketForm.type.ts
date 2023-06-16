export type Outcome = {
  id: string;
  name: string;
  probability: number;
};

export type CreateMarketFormData = {
  question: string;
  description: string;
  answerType: 'binary' | 'multiple';
  outcomes: Outcome[];
  image: {
    file: any;
    hash: string;
    isUploaded: boolean;
  };
  category: string;
  subcategory: string;
  closingDate: string;
  liquidity: number;
  fee: number;
  treasuryFee: number;
  resolutionSource?: string;
};
