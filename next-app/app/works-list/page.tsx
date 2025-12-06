"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPortfolio, PortfolioResponse } from "@/app/api/admin/portfolio";
import Script from "next/script";

interface PortfolioWithImages extends PortfolioResponse {
  imageUrls: string[];
  imageExtensions: string[];
}

export default function WorksList() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<PortfolioWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageStates, setImageStates] = useState<
    Record<
      string,
      { loading: boolean; error: string | null; url: string | null }
    >
  >({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoggedIn = () => {
    // 必須条件: Cookie に token が存在すること
    if (typeof document !== "undefined") {
      const hasTokenCookie = document.cookie
        .split(";")
        .some((cookie) => cookie.trim().startsWith("token="));
      if (!hasTokenCookie) return false;
    }

    // Cookieがある場合にlocalStorageトークンがあれば認証済みとみなす
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return !!token;
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      setIsAuthenticated(false);
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!isLoggedIn()) {
        router.replace("/login");
        return;
      }

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
          processedPortfolios.forEach((portfolio, portfolioIndex) => {
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
  }, [router]);

  // ポートフォリオ取得＋画像パス処理を共通化
  const getPortfolioProcessed = async () => {
    const data = await getPortfolio();
    if (!data) return [];

    return data.map((portfolio) => {
      let imagePaths: string[] = [];
      if (Array.isArray(portfolio.images) && portfolio.images.length > 0) {
        imagePaths = portfolio.images;
      } else if (Array.isArray(portfolio.img) && portfolio.img.length > 0) {
        imagePaths = portfolio.img.map((img) => {
          if (typeof img === "string") return img;
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
  };

  useEffect(() => {
    portfolios.forEach((portfolio, portfolioIndex) => {
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
                error: "画像ーしっぱーーーい",
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

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) {
      return;
    }

    // 楽観的に即時反映（リロード不要で消える）
    setPortfolios((prev) => prev.filter((p) => p.id !== id));
    setImageStates((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (key.startsWith(`${id}-`)) {
          delete updated[key];
        }
      });
      return updated;
    });

    try {
      const token = localStorage.getItem("token");
      const backApiKey = process.env.NEXT_PUBLIC_BACK_API_KEY;

      if (!token) {
        alert("認証トークンがありません。再度ログインしてください。");
        router.push("/login");
        return;
      }

      if (!backApiKey) {
        alert("バックエンドAPIのURLが設定されていません。");
        return;
      }

      const res = await fetch(`${backApiKey}/api/portfolios/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        // API失敗時は元に戻す
        setPortfolios(await getPortfolioProcessed());
        throw new Error("削除に失敗しました");
      }

      // サーバー側の最新状態で再同期
      const refreshed = await getPortfolioProcessed();
      if (refreshed) setPortfolios(refreshed);
    } catch (error) {
      // エラー時は通知し、状態を同期し直す
      const refreshed = await getPortfolioProcessed();
      if (refreshed) setPortfolios(refreshed);
      alert("削除に失敗しました");
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      setIsAuthenticated(false);
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  // 認証チェック中はローディング画面を表示
  if (isAuthenticated === null) {
    return (
      <div className="bg-beige min-h-screen flex items-center justify-center">
        <p className="text-2xl">読み込み中...</p>
      </div>
    );
  }

  // 認証されていない場合は何も表示しない
  if (isAuthenticated === false) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-beige min-h-screen flex items-center justify-center">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js"
        strategy="lazyOnload"
      />
      <div className="bg-beige w-full min-h-screen">
        <div className="max-w-[1580px] mx-auto px-4 py-8">
          <h1 className="text-[#040404] text-4xl font-bold text-center w-full mb-8">
            ポートフォリオ一覧
          </h1>
          <button
            onClick={() => router.push("/work-post")}
            className="w-fit bg-blue-500 text-white p-2 rounded-md mx-8 mb-4"
          >
            投稿ページへ
          </button>

          <div className="w-full h-fit p-4 m-4">
            {portfolios.length === 0 ? (
              <p className="text-center text-xl">ポートフォリオがありません</p>
            ) : (
              portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="w-full h-fit border-2 border-gray-300 rounded-md p-4 my-4"
                >
                  <div className="flex gap-3 items-center mb-2">
                    <h2 className="text-2xl">タイトル：</h2>
                    <p className="text-xl">{portfolio.title}</p>
                  </div>
                  <div className="flex gap-3 items-center mb-2">
                    <h2 className="text-2xl">説明：</h2>
                    <p className="text-xl">{portfolio.explanation}</p>{" "}
                    {/* overview → explanation に変更 */}
                  </div>

                  {portfolio.imageUrls.length > 0 && (
                    <div className="bg-gray-200 rounded-md p-4 flex items-end flex-wrap gap-2 mb-4">
                      {portfolio.imageUrls.map((imageUrl, imageIndex) => {
                        const key = `${portfolio.id}-${imageIndex}`;
                        const imageState = imageStates[key];

                        return (
                          <div key={key} className="relative">
                            {imageState?.loading && (
                              <p className="text-blue-500">
                                画像を読み込み中...
                              </p>
                            )}
                            {imageState?.error && (
                              <p className="text-red-500">
                                画像の読み込みに失敗しました: {imageState.error}
                              </p>
                            )}
                            {imageState?.url && (
                              <img
                                src={imageState.url}
                                alt={portfolio.title}
                                width={200}
                                height={200}
                                className="border border-gray-300 max-w-[200px] max-h-[200px] object-contain m-1"
                                style={{
                                  display: imageState.loading
                                    ? "none"
                                    : "block",
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-4 mb-4 flex">
                    <h2 className="text-2xl mb-2">タグ:</h2>
                    {portfolio.tags && portfolio.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {portfolio.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="border-2 border-gray-300 text-gray-700 px-3 py-1 rounded text-sm bg-white"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p>タグがありません</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 mb-2">
                    <h2 className="text-2xl">URL：</h2>
                    {portfolio.urls && portfolio.urls.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {portfolio.urls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    ) : portfolio.url && portfolio.url.trim() !== "" ? (
                      <a
                        href={portfolio.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        {portfolio.url}
                      </a>
                    ) : (
                      <p className="text-xl">URLなし</p>
                    )}
                  </div>
                  <div className="w-full flex justify-end">
                    <div className="bg-red-500 text-white p-2 rounded-md text-center w-fit">
                      <button
                        type="button"
                        onClick={() => handleDelete(portfolio.id)}
                        className="w-full"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
