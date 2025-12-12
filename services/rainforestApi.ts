import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_RAINFOREST_API_KEY;
const API_URL = process.env.EXPO_PUBLIC_RAINFOREST_API_URL || 'https://api.rainforestapi.com/request';

if (!API_KEY) {
  throw new Error('EXPO_PUBLIC_RAINFOREST_API_KEY is not defined in .env file');
}

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
        categoryId = 'bestsellers_fashion',
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

      // Log credit usage info if available
      if (response.data.request_info) {
        console.log(`[Rainforest API] Credits remaining: ${response.data.request_info.credits_remaining}`);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const apiMessage = error.response?.data?.request_info?.message;
        const creditsRemaining = error.response?.data?.request_info?.credits_remaining;

        // Handle specific HTTP status codes
        if (status === 402) {
          const errorMsg = `API Credits Exhausted: ${apiMessage || 'Please upgrade your plan or get a new API key'}`;
          console.error(`[Rainforest API] ${errorMsg} (Credits remaining: ${creditsRemaining})`);
          throw new Error(errorMsg);
        }

        if (status === 401) {
          const errorMsg = 'Invalid API Key: Please check your EXPO_PUBLIC_RAINFOREST_API_KEY in .env file';
          console.error(`[Rainforest API] ${errorMsg}`);
          throw new Error(errorMsg);
        }

        if (status === 429) {
          const errorMsg = 'Rate Limited: Too many requests. Please wait before trying again';
          console.error(`[Rainforest API] ${errorMsg}`);
          throw new Error(errorMsg);
        }

        if (status === 404) {
          const errorMsg = `Category Not Found: The category_id "${options.categoryId}" may be invalid`;
          console.error(`[Rainforest API] ${errorMsg}`);
          throw new Error(errorMsg);
        }

        // Network or other axios errors
        const errorMessage = apiMessage || error.message || 'Failed to fetch bestsellers';
        console.error('[Rainforest API] Error:', errorMessage);

        if (error.response) {
          console.error('[Rainforest API] Response status:', error.response.status);
        }

        throw new Error(errorMessage);
      }

      // Non-axios errors
      console.error('[Rainforest API] Unexpected error:', error);
      throw new Error('An unexpected error occurred while fetching data');
    }
  },
};

