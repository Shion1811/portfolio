"use client";
import Header from "../components/features/header";
import Footer from "../components/features/footer";
import SectionTitle from "../components/features/section-title";
import { getPortfolio, PortfolioResponse } from "@/app/api/admin/portfolio";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface PortfolioWithImages extends PortfolioResponse {
  imageUrls: string[];
  imageExtensions: string[];
}

export default function workDetail() {
  const [portfolio, setPortfolio] = useState<PortfolioWithImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageStates, setImageStates] = useState<
    Record<
      string,
      { loading: boolean; error: string | null; url: string | null }
    >
  >({});
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get("id"));

    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio();
        console.log("取得したポートフォリオデータ:", data);
        console.log("検索するID:", id);
        console.log("IDの型:", typeof id);

        if (data && id) {
          // IDに一致するポートフォリオを検索（型を統一して比較）
          const foundPortfolio = data.find((p) => {
            const portfolioId = String(p.id);
            const searchId = String(id);
            console.log(
              "比較:",
              portfolioId,
              "===",
              searchId,
              portfolioId === searchId
            );
            return portfolioId === searchId;
          });

          console.log("見つかったポートフォリオ:", foundPortfolio);

          if (foundPortfolio) {
            // 画像データを処理
            let imagePaths: string[] = [];

            // imagesフィールドを優先的に使用
            if (
              Array.isArray(foundPortfolio.images) &&
              foundPortfolio.images.length > 0
            ) {
              imagePaths = foundPortfolio.images;
            } else if (
              Array.isArray(foundPortfolio.img) &&
              foundPortfolio.img.length > 0
            ) {
              imagePaths = foundPortfolio.img.map((img) => {
                if (typeof img === "string") {
                  return img;
                }
                return JSON.stringify(img);
              });
            }

            // 画像URLと拡張子を取得
            const imageUrls = imagePaths.map((path) => {
              const backApiKey = process.env.NEXT_PUBLIC_BACK_API_KEY || "";
              return `${backApiKey}/storage/${path}`;
            });

            const imageExtensions = imagePaths.map((path) => {
              const extension = path.split(".").pop()?.toLowerCase() || "";
              return extension;
            });

            const processedPortfolio: PortfolioWithImages = {
              ...foundPortfolio,
              imageUrls,
              imageExtensions,
            };

            setPortfolio(processedPortfolio);

            // 画像状態を初期化
            const initialImageStates: Record<
              string,
              { loading: boolean; error: string | null; url: string | null }
            > = {};
            imageUrls.forEach((_, imageIndex) => {
              const key = `${foundPortfolio.id}-${imageIndex}`;
              initialImageStates[key] = {
                loading: true,
                error: null,
                url: null,
              };
            });
            setImageStates(initialImageStates);
          } else {
            console.warn("ポートフォリオが見つかりませんでした");
            console.warn(
              "利用可能なID:",
              data.map((p) => p.id)
            );
          }
        } else if (!id) {
          console.warn("URLパラメータにIDがありません");
        }
      } catch (error) {
        console.error("ポートフォリオ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [id]);

  useEffect(() => {
    // 画像読み込み処理
    if (!portfolio) return;

    portfolio.imageUrls.forEach((imageUrl, imageIndex) => {
      const key = `${portfolio.id}-${imageIndex}`;
      const extension = portfolio.imageExtensions[imageIndex];

      // 既に読み込み済みまたはエラーの場合はスキップ
      if (imageStates[key]?.url || imageStates[key]?.error) {
        return;
      }

      // 読み込み中でない場合はスキップ
      if (!imageStates[key]?.loading) {
        return;
      }

      if (extension === "heic" || extension === "heif") {
        // HEICファイルの場合、JPEGに変換
        if (typeof window !== "undefined" && (window as any).heic2any) {
          fetch(imageUrl)
            .then((response) => {
              if (!response.ok) {
                throw new Error("画像の取得に失敗しました: " + response.status);
              }
              return response.blob();
            })
            .then((blob) => {
              return (window as any).heic2any({
                blob: blob,
                toType: "image/jpeg",
                quality: 0.8,
              });
            })
            .then((conversionResult: any) => {
              const result = Array.isArray(conversionResult)
                ? conversionResult[0]
                : conversionResult;
              const url = URL.createObjectURL(result);
              setImageStates((prev) => ({
                ...prev,
                [key]: { loading: false, error: null, url },
              }));
            })
            .catch((error) => {
              console.error("HEIC変換エラー:", error);
              setImageStates((prev) => ({
                ...prev,
                [key]: { loading: false, error: error.message, url: null },
              }));
            });
        } else {
          setImageStates((prev) => ({
            ...prev,
            [key]: {
              loading: false,
              error: "HEIC変換ライブラリが読み込まれていません",
              url: null,
            },
          }));
        }
      } else {
        // JPEG/PNGなどの場合はそのまま表示
        const img = new Image();
        img.onload = () => {
          setImageStates((prev) => ({
            ...prev,
            [key]: { loading: false, error: null, url: imageUrl },
          }));
        };
        img.onerror = () => {
          setImageStates((prev) => ({
            ...prev,
            [key]: {
              loading: false,
              error: "画像の読み込みに失敗しました",
              url: null,
            },
          }));
        };
        img.src = imageUrl;
      }
    });
  }, [portfolio, imageStates]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!portfolio) {
    return <div>ポートフォリオが見つかりませんでした</div>;
  }

  return (
    <div className="bg-beige w-full h-full">
      <Header />
      <div className="w-full sm:px-0 px-5 mx-auto">
        <section className="w-full px-[10%] mx-auto flex flex-col gap-3 mt-32">
          <div className="flex">
            <button className="w-[84px] h-[44px]" onClick={() => router.back()}>
              <p className="text-white bg-blue rounded-md w-full h-full text-center flex items-center justify-center">
                戻る
              </p>
            </button>
            <SectionTitle title={portfolio.title} className="text-[34px]!" />
          </div>
          <div className="flex flex-col gap-3 justify-start">
            <div className="flex flex-col gap-2">
              <h3 className="h3">説明</h3>
              <p className="p w-full h-fit overflow-y-auto bg-white rounded-md p-2">
                {portfolio.explanation}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="h3">使用した技術スタック</h3>
              <div className="w-full h-fit overflow-y-auto bg-white rounded-md p-2">
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(portfolio.tags) && portfolio.tags.length > 0
                    ? portfolio.tags.map((tag) => (
                        <p
                          key={tag}
                          className="bg-blue text-white rounded-md px-2 py-1"
                        >
                          {tag}
                        </p>
                      ))
                    : null}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="h3">プロジェクトの画像</h3>
              <div className="w-full h-fit overflow-y-auto bg-white rounded-md p-2">
                <div className="grid lg:grid-cols-3 grid-cols-2 gap-4 justify-between items-end">
                  {portfolio.imageUrls.map((imageUrl, index) => {
                    const key = `${portfolio.id}-${index}`;
                    const imageState = imageStates[key];

                    return (
                      <div key={key} className="relative">
                        {imageState?.loading && (
                          <div className="w-full h-[200px] flex items-centr justify-center bg-gray-200 rounded-md">
                            <p className="text-blue-500">読み込み中...</p>
                          </div>
                        )}
                        {imageState?.error && (
                          <div className="w-full h-[200px] flex items-start justify-center bg-gray-200 rounded-md">
                            <p className="text-red-500 text-sm">
                              {imageState.error}
                            </p>
                          </div>
                        )}
                        {imageState?.url && (
                          <img
                            src={imageState.url}
                            alt={`${portfolio.title}の画像${index + 1}`}
                            className="object-contain rounded-md w-full h-full"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {((portfolio.urls && portfolio.urls.length > 0) ||
              portfolio.url) && (
              <div className="flex flex-col gap-2">
                <h3 className="h4">URL</h3>
                <div className="flex flex-col gap-1">
                  {portfolio.urls && portfolio.urls.length > 0
                    ? portfolio.urls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue border-b-[0.3px] border-blue w-fit"
                        >
                          ・{url}
                        </a>
                      ))
                    : portfolio.url && (
                        <a
                          href={portfolio.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue border-b-[0.3px] border-blue w-fit"
                        >
                          ・{portfolio.url}
                        </a>
                      )}
                </div>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
