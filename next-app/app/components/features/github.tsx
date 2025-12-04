"use client";
import { ghResponse } from "@/app/api/gh";
import { useState, useEffect } from "react";

export default function Github() {
  const [gh, setGh] = useState<ghResponse | null>(null);
  const links = (node: { name: string }) =>
    `https://github.com/${gh?.data.viewer.login}/${node.name}`;

  useEffect(() => {
    const fetchGh = async () => {
      const gh = await ghResponse();
      setGh(gh);
    };
    fetchGh();
  }, []);

  console.log(gh);

  const languageColors = {
    JavaScript: "#55c505",
    TypeScript: "#0076c6",
    Python: "#002856",
    HTML: "#dc4925",
    CSS: "#0391d4",
    React: "#03d1f7",
    PHP: "#5766a1",
    その他: "#050505",
  };

  // 全リポジトリの言語データを集計
  const getAllLanguagePercentages = () => {
    if (!gh?.data.viewer.repositories.nodes) return [];

    // 指定された言語のリスト
    const specifiedLanguages = Object.keys(languageColors).filter(
      (key) => key !== "その他"
    );

    // 全リポジトリの言語データを集計
    const languageMap = new Map<string, number>();
    let otherSize = 0;

    gh.data.viewer.repositories.nodes.forEach((repo) => {
      if (repo.languages?.edges) {
        repo.languages.edges.forEach((edge) => {
          const languageName = edge.node.name;

          // 指定された言語かどうかチェック
          if (specifiedLanguages.includes(languageName)) {
            const currentSize = languageMap.get(languageName) || 0;
            languageMap.set(languageName, currentSize + edge.size);
          } else {
            // 指定されていない言語は「その他」に追加
            otherSize += edge.size;
          }
        });
      }
    });

    // 「その他」を追加（0%より大きい場合のみ）
    if (otherSize > 0) {
      languageMap.set("その他", otherSize);
    }

    // 合計サイズを計算
    const totalSize = Array.from(languageMap.values()).reduce(
      (sum, size) => sum + size,
      0
    );

    if (totalSize === 0) return [];

    // 割合を計算
    const languages = Array.from(languageMap.entries())
      .map(([name, size]) => ({
        name,
        percentage: Math.floor((size / totalSize) * 100),
      }))
      .filter((lang) => lang.percentage > 0); // 0%の言語は除外

    // 「その他」を分離
    const otherLanguage = languages.find((lang) => lang.name === "その他");
    const otherLanguages = languages.filter((lang) => lang.name !== "その他");

    // 現在の合計を計算
    const currentTotal = languages.reduce(
      (sum, lang) => sum + lang.percentage,
      0
    );
    const diff = 100 - currentTotal;

    // 不足分を「その他」に追加（「その他」が存在しない場合は新規作成）
    if (diff > 0) {
      if (otherLanguage) {
        otherLanguage.percentage += diff;
      } else {
        // 「その他」が存在しない場合は新規作成
        otherLanguages.push({
          name: "その他",
          percentage: diff,
        });
      }
    }

    // 「その他」以外を割合の多い順にソートし、「その他」を最後に配置
    return [
      ...otherLanguages.sort((a, b) => b.percentage - a.percentage),
      ...(otherLanguage ? [otherLanguage] : []),
    ];
  };

  const getLanguagePercentages = (node: {
    languages: {
      edges: Array<{
        size: number;
        node: { name: string };
      }>;
    };
  }) => {
    const edges = node.languages.edges;
    if (edges.length === 0) return [];

    const totalSize = edges.reduce((sum, edge) => sum + edge.size, 0);
    const result = edges.map((edge) => ({
      name: edge.node.name,
      percentage: Math.floor((edge.size / totalSize) * 100),
    }));
    return result;
  };

  const allLanguages = getAllLanguagePercentages();

  // MonoStackedBarの代わりにカスタムコンポーネントを使用
  const StackedBar = ({
    data,
  }: {
    data: Array<{ name: string; value: number; color: string }>;
  }) => {
    return (
      <div className="w-full h-[24px] flex overflow-hidden rounded-[12px]">
        {data.map((item, index) => (
          <div
            key={item.name}
            style={{
              width: `${item.value}%`,
              backgroundColor: item.color,
              fontSize: "14px",
            }}
            title={`${item.name}: ${item.value}%`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col my-4 w-full flex-wrap">
      <div className="mb-8">
        <h2 className="h2 mb-2">全リポジトリの言語統計</h2>
        <p className="small mb-2">
          {allLanguages.map((language, index) => (
            <span key={language.name}>
              <span
                style={{
                  color:
                    languageColors[
                      language.name as keyof typeof languageColors
                    ],
                }}
              >
                {language.name}
              </span>
              : {language.percentage}%{index < allLanguages.length - 1 && ", "}
            </span>
          ))}
        </p>
        <StackedBar
          data={allLanguages.map((language) => ({
            name: language.name,
            value: language.percentage,
            color: languageColors[language.name as keyof typeof languageColors],
          }))}
        />
      </div>
    </div>
  );
}
