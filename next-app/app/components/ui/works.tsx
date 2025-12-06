"use client";
import { useRouter } from "next/navigation";
import { getPortfolio, PortfolioResponse } from "@/app/api/admin/portfolio";
import { useEffect, useState } from "react";

interface PortfolioWithImages extends PortfolioResponse {
  imageUrls: string[];
  imageExtensions: string[];
}

export default function Works() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<PortfolioWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageStates, setImageStates] = useState<
    Record<
      string,
      { loading: boolean; error: string | null; url: string | null }
    >
  >({});

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const data = await getPortfolio();
        if (data) {
          const processedPortfolios = data.map((portfolio) => {
            let imagePaths: string[] = [];

            if (
              Array.isArray(portfolio.images) &&
              portfolio.images.length > 0
            ) {
              imagePaths = portfolio.images;
            } else if (
              Array.isArray(portfolio.img) &&
              portfolio.img.length > 0
            ) {
              imagePaths = portfolio.img.map((img) => {
                if (typeof img === "string") {
                  return img;
                }
                return JSON.stringify(img);
              });
            }

            const imageUrls = imagePaths.map((path) => {
              const backApiKey = process.env.NEXT_PUBLIC_BACK_API_KEY || "";
              return `${backApiKey}/storage/${path}`;
            });

            const imageExtensions = imagePaths.map((path) => {
              const extension = path.split(".").pop()?.toLowerCase() || "";
              return extension;
            });

            return {
              ...portfolio,
              imageUrls,
              imageExtensions,
            };
          });

          setPortfolios(processedPortfolios);

          const initialImageStates: Record<
            string,
            { loading: boolean; error: string | null; url: string | null }
          > = {};
          processedPortfolios.forEach((portfolio) => {
            portfolio.imageUrls.forEach((_, imageIndex) => {
              const key = `${portfolio.id}-${imageIndex}`;
              initialImageStates[key] = {
                loading: true,
                error: null,
                url: null,
              };
            });
          });
          setImageStates(initialImageStates);
        } else {
          setPortfolios([]);
        }
      } catch (error) {
        setPortfolios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  useEffect(() => {
    portfolios.forEach((portfolio) => {
      portfolio.imageUrls.forEach((imageUrl, imageIndex) => {
        const key = `${portfolio.id}-${imageIndex}`;
        const extension = portfolio.imageExtensions[imageIndex];

        if (imageStates[key]?.url || imageStates[key]?.error) {
          return;
        }

        if (!imageStates[key]?.loading) {
          return;
        }

        if (extension === "heic" || extension === "heif") {
          if (typeof window !== "undefined" && (window as any).heic2any) {
            fetch(imageUrl)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(
                    "画像の取得に失敗しました: " + response.status
                  );
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
    });
  }, [portfolios]);

  if (loading) {
    return <div className="text-center">読み込み中...</div>;
  }

  if (portfolios.length === 0) {
    return <div className="text-center">ポートフォリオがありません</div>;
  }

  return (
    <>
      {portfolios.map((portfolio) => {
        const firstImageUrl = portfolio.imageUrls[0];
        const firstImageKey = `${portfolio.id}-0`;
        const firstImageState = imageStates[firstImageKey];

        return (
          <button
            key={portfolio.id}
            className="w-full"
            onClick={() => router.push(`/work-detail?id=${portfolio.id}`)}
          >
            <div className="w-full border-black border-1 rounded-md p-2 flex lg:flex-col gap-2 h-full">
              <div className="flex flex-col gap-2 sm:w-full w-[50%] mx-auto">
                <h3 className="h3 sm:h-[80px] text-left border-b-[0.1px] h-[40px]">
                  {portfolio.title}
                </h3>
                <p className="p w-full text-left border-b-[0.1px] sm:max-h-[84px] p-y-[2px] text-ellipsis h-fit overflow-y-hidden">
                  {portfolio.explanation}
                </p>
                <div className="small text-white flex xl:gap-2 gap-1 w-full flex-wrap">
                  {Array.isArray(portfolio.tags) &&
                    portfolio.tags.map((tag) => (
                      <p
                        className="bg-blue w-fit h-fit rounded-sm sm:px-2 p-1 sm:py-1"
                        key={tag}
                      >
                        {tag}
                      </p>
                    ))}
                </div>
              </div>
              {firstImageUrl && (
                <div className="relative">
                  {firstImageState?.loading && (
                    <div className="w-[130px] lg:w-full lg:h-[300px] h-[200px] flex items-center justify-center bg-gray-200 rounded-md">
                      <p className="text-blue-500">Loading...</p>
                    </div>
                  )}
                  {firstImageState?.error && (
                    <div className="w-[130px] lg:w-full lg:h-[300px] h-[200px] flex items-center justify-center bg-gray-200 rounded-md">
                      <p className="text-red-500 text-sm">
                        {firstImageState.error}
                      </p>
                    </div>
                  )}
                  {firstImageState?.url && (
                    <img
                      src={firstImageState.url}
                      alt={portfolio.title}
                      className="w-[130px] lg:w-full lg:h-[300px] h-[200px] object-cover rounded-md"
                    />
                  )}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </>
  );
}
