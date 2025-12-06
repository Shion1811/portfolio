import { NextResponse } from "next/server";

const gh = process.env.GITHUB_API_KEY;

const ghResponse = `
query {
            viewer {
              login
              repositories(first: 100, isFork: false) {
                nodes {
                  name
                  languages(first: 100) {
                    edges {
                      size
                      node {
                        name
                      }
                    }
                  }
                }
              }
            }
          }`;

export async function GET() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${gh}`,
    },
    body: JSON.stringify({ query: ghResponse }),
  });
  if (!res.ok) {
    console.error("エラー", res.status);
    return NextResponse.json({ error: "エラー" }, { status: 500 });
  }
  const data = await res.json();
  if (data.data?.viewer?.repositories?.nodes) {
    data.data.viewer.repositories.nodes =
      data.data.viewer.repositories.nodes.map((repo: any) => {
        if (!repo.languages?.edges || repo.languages.edges.length === 0) {
          return repo;
        }

        // 各言語のサイズの合計を計算
        const totalSize = repo.languages.edges.reduce(
          (sum: number, edge: any) => sum + edge.size,
          0
        );

        // 1%未満の言語を除外
        repo.languages.edges = repo.languages.edges.filter((edge: any) => {
          const percentage = (edge.size / totalSize) * 100;
          return percentage >= 2;
        });

        return repo;
      });
  }
  return NextResponse.json(data);
}
