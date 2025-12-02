export type ghResponse = {
  // data.viewer.repositories.totalCount
  data: {
    viewer: {
      login: string;
      repositories: {
        // リポジトリの総数
        totalCount: number;
        nodes: Array<{
          name: string;
          isFork: boolean;
          owner: {
            __typename: string;
            login: string;
          };
          languages: {
            edges: Array<{
              // 各言語のコードサイズ（バイト単位）
              size: number;
              node: {
                // 言語名（技術スタック）
                name: string;
              };
            }>;
          };
          defaultBranchRef: {
            target: {
              history?: {
                // コミット件数
                totalCount?: number;
              } | null;
            };
          } | null;
        }>;
      };
    };
  };
};

export async function ghResponse(): Promise<ghResponse | null> {
  try {
    const res = await fetch("/api/github");

    if (!res.ok) {
      console.error("エラー", res.status);
      return null;
    }
    const data = await res.json();
    return data as ghResponse;
  } catch (error) {
    console.error(error);
    return null;
  }
}
