export type PortfolioRequest = {
  title: string;
  explanation: string;
  tags: string[];
  img: JSON[];
  url?: string; // 従来の単一URL
  urls?: string[]; // 複数URLに対応
};
export type PortfolioResponse = {
  id: string;
  title: string;
  explanation: string;
  tags: string[];
  images: string[];
  img?: JSON[];
  url?: string; // 後方互換性のため残す
  urls?: string[]; // 新しい配列形式
  created_at?: string;
  updated_at?: string;
};

import { authenticatedFetch, getAuthToken } from "@/app/utils/api";

const backApiKey = process.env.NEXT_PUBLIC_BACK_API_KEY;

export async function getPortfolio(): Promise<PortfolioResponse[] | null> {
  try {
    if (!backApiKey) {
      return null;
    }

    const token = getAuthToken();
    if (!token) {
      return null;
    }

    const res = await authenticatedFetch(`${backApiKey}/api/portfolios`, {
      method: "GET",
    });

    if (!res.ok) {
      if (res.status === 401) {
        return null;
      }
      return [];
    }

    const response = await res.json();

    if (response.success && response.data) {
      return response.data as PortfolioResponse[];
    }

    return response as PortfolioResponse[];
  } catch (error) {
    return null;
  }
}
