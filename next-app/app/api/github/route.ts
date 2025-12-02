import { NextResponse } from "next/server";

const gh = process.env.GITHUB_API_KEY;

const ghResponse = `
query {
            viewer {
              login
              repositories(first: 100, isFork: false) {
                totalCount
                nodes {
                  name
                  isFork
                  owner {
                    __typename
                    login
                  }
                  languages(first: 100) {
                    edges {
                      size
                      node {
                        name
                      }
                    }
                  }
                  defaultBranchRef {
                    target {
                      ... on Commit {
                        history(first: 100) {
                          totalCount
                        }
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
  return NextResponse.json(data);
}
