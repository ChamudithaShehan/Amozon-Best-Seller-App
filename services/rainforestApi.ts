import axios from 'axios';

const API_KEY = '0AD27B373A374A2CA843A1531EB7B62E';
const API_URL = 'https://api.rainforestapi.com/request';

export interface BestsellerProduct {
  position?: number;
  asin?: string;
  title?: string;
  link?: string;
  image?: string;
  rating?: number;
  ratings_total?: number;
  price?: {
    value?: number;
    currency?: string;
    discounted?: boolean;
  };
}

export interface BestsellersResponse {
  request_info?: {
    success?: boolean;
    credits_used?: number;
    credits_remaining?: number;
  };
  bestsellers?: BestsellerProduct[];
}

export const rainforestApi = {
  async getBestsellers(
    options: {
      categoryId?: string;
      amazonDomain?: string;
      language?: string;
    } = {}
  ): Promise<BestsellersResponse> {
    try {
      const {
        categoryId = 'bestsellers_appliances',
        amazonDomain = 'amazon.com',
        language = 'en_US',
      } = options;

      const params: Record<string, string> = {
        api_key: API_KEY,
        type: 'bestsellers',
        amazon_domain: amazonDomain,
        category_id: categoryId,
        language: language,
      };

      const response = await axios.get<BestsellersResponse>(API_URL, { params });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch bestsellers';
        console.error('Rainforest API Error:', errorMessage);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        throw new Error(errorMessage);
      }
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  },
};

