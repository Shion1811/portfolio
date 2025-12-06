"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PortfolioRequest } from "@/app/api/admin/portfolio";
import { authenticatedFetch, getAuthToken } from "@/app/utils/api";

const AVAILABLE_TAGS = [
  "design",
  "Next.js",
  "Figma",
  "React",
  "TypeScript",
  "JavaScript",
  "UI/UX",
  "frontend",
  "backend",
  "Python",
  "PHP",
  "Laravel",
];

export default function WorkPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState(""); // overview → explanation に変更
  const [images, setImages] = useState<File[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [urls, setUrls] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoggedIn = () => {
    // 必須条件: Cookie に token が存在すること
    if (typeof document !== "undefined") {
      const hasTokenCookie = document.cookie
        .split(";")
        .some((cookie) => cookie.trim().startsWith("token="));
      if (!hasTokenCookie) return false;
    }

    // 追加でlocalStorageのトークンがあれば認証済みとみなす（なくてもCookie優先で可）
    const token = getAuthToken();
    return !!token;
  };

  useEffect(() => {
    // ログインしていなければ投稿画面に入らせず即リダイレクト
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
      <div className="bg-beige w-full min-h-screen flex items-center justify-center">
        <p className="text-2xl">読み込み中...</p>
      </div>
    );
  }

  // 認証されていない場合は何も表示しない
  if (isAuthenticated === false) {
    return null;
  }

  const toggleTag = (tag: string) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tag)) {
      newSelectedTags.delete(tag);
    } else {
      newSelectedTags.add(tag);
    }
    setSelectedTags(newSelectedTags);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // HEIC/HEIFは未対応のため警告を出して処理を中断
      const hasHeic = filesArray.some((file) => {
        const lowerName = file.name.toLowerCase();
        return (
          file.type === "image/heic" ||
          file.type === "image/heif" ||
          lowerName.endsWith(".heic") ||
          lowerName.endsWith(".heif")
        );
      });
      if (hasHeic) {
        setError(
          "HEIC/HEIF形式の画像はアップロードできません。JPEG/PNGなどで再度お試しください。"
        );
        return;
      }

      // 画像をリサイズ
      const resizedImages = await Promise.all(
        filesArray.map(async (file) => {
          // 画像ファイルでない場合はそのまま返す
          if (!file.type.startsWith("image/")) {
            return file;
          }

          return new Promise<File>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 1920;
                const MAX_HEIGHT = 1920;
                const MAX_SIZE = 10 * 1024 * 1024;

                let width = img.width;
                let height = img.height;

                // サイズを調整
                if (width > height) {
                  if (width > MAX_WIDTH) {
                    height = (height * MAX_WIDTH) / width;
                    width = MAX_WIDTH;
                  }
                } else {
                  if (height > MAX_HEIGHT) {
                    width = (width * MAX_HEIGHT) / height;
                    height = MAX_HEIGHT;
                  }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(img, 0, 0, width, height);

                  // 品質を調整してファイルサイズを小さくする
                  let quality = 0.9;
                  canvas.toBlob(
                    (blob) => {
                      if (blob) {
                        // ファイルサイズが大きい場合は品質を下げる
                        if (blob.size > MAX_SIZE && quality > 0.1) {
                          quality -= 0.1;
                          canvas.toBlob(
                            (smallerBlob) => {
                              if (smallerBlob) {
                                const resizedFile = new File(
                                  [smallerBlob],
                                  file.name,
                                  { type: file.type }
                                );
                                resolve(resizedFile);
                              } else {
                                resolve(file);
                              }
                            },
                            file.type,
                            quality
                          );
                        } else {
                          const resizedFile = new File([blob], file.name, {
                            type: file.type,
                          });
                          resolve(resizedFile);
                        }
                      } else {
                        resolve(file);
                      }
                    },
                    file.type,
                    quality
                  );
                } else {
                  resolve(file);
                }
              };
              img.onerror = () => resolve(file);
              if (event.target?.result) {
                img.src = event.target.result as string;
              } else {
                resolve(file);
              }
            };
            reader.onerror = () => resolve(file);
            reader.readAsDataURL(file);
          });
        })
      );

      setImages(resizedImages);
    }
  };

  // URL入力を動的に追加・削除
  const handleUrlChange = (index: number, value: string) => {
    const updated = [...urls];
    updated[index] = value;
    setUrls(updated);
  };

  const addUrlField = () => {
    setUrls((prev) => [...prev, ""]);
  };

  const removeUrlField = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLoggedIn()) {
      setError("ログインが必要です。ログインし直してください。");
      setLoading(false);
      router.replace("/login");
      return;
    }

    try {
      // 各Cookieを個別に確認
      const cookies = document.cookie.split("; ");
      const cookieMap: Record<string, string> = {};
      cookies.forEach((cookie) => {
        const [name, value] = cookie.split("=");
        cookieMap[name] = value;
      });
      console.log("Cookie map:", cookieMap);
      console.log("laravel-session exists:", !!cookieMap["laravel-session"]);
      console.log("token exists:", !!cookieMap["token"]);

      // XSRF-TOKENを取得（LaravelのCSRF保護用）
      const xsrfToken = cookieMap["XSRF-TOKEN"];

      console.log("XSRF-TOKEN:", xsrfToken);

      // PortfolioRequest型に基づいてデータを検証
      const normalizedUrls = urls.map((u) => u.trim()).filter((u) => u !== "");

      const portfolioData: PortfolioRequest = {
        title,
        explanation, // overview → explanation に変更
        tags: Array.from(selectedTags),
        img: [], // 画像はFormDataで送信するため、ここでは空配列
        url: normalizedUrls[0], // 従来APIの後方互換
        urls: normalizedUrls,
      };

      // バリデーション
      if (!portfolioData.title || !portfolioData.explanation) {
        // overview → explanation に変更
        setError("タイトルと内容は必須です。");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", portfolioData.title);
      formData.append("explanation", portfolioData.explanation); // overview → explanation に変更

      // URLが空でない場合のみ送信（単体+複数両方）
      if (portfolioData.url) {
        formData.append("url", portfolioData.url);
      }
      if (portfolioData.urls && portfolioData.urls.length > 0) {
        portfolioData.urls.forEach((u) => formData.append("urls[]", u));
      }

      portfolioData.tags.forEach((tag) => {
        formData.append("tags[]", tag);
      });

      images.forEach((image) => {
        formData.append("images[]", image);
      });

      // リクエストサイズを計算（デバッグ用）
      let totalSize = 0;
      images.forEach((image) => {
        totalSize += image.size;
      });
      const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
      console.log(`リクエストサイズ: ${sizeInMB}MB (${totalSize} bytes)`);
      console.log(`画像数: ${images.length}`);

      // FormDataの内容をデバッグ出力
      console.log("FormData contents:");
      console.log("  title:", portfolioData.title);
      console.log("  explanation:", portfolioData.explanation); // overview → explanation に変更
      console.log("  urls:", portfolioData.urls);
      console.log("  tags:", Array.from(selectedTags));
      console.log("  images count:", images.length);
      images.forEach((image, index) => {
        console.log(
          `  image[${index}]:`,
          image.name,
          `(${(image.size / 1024).toFixed(2)}KB)`
        );
      });

      const token = getAuthToken();
      if (!token) {
        setError("認証トークンがありません。再度ログインしてください。");
        setLoading(false);
        router.push("/login");
        return;
      }

      const headers: Record<string, string> = {};

      if (xsrfToken) {
        headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
      }

      const backApiKey = process.env.NEXT_PUBLIC_BACK_API_KEY;

      if (!backApiKey) {
        setError("バックエンドAPIのURLが設定されていません。");
        setLoading(false);
        return;
      }

      const apiUrl = `${backApiKey}/api/portfolios`;

      const res = await authenticatedFetch(apiUrl, {
        method: "POST",
        headers: Object.keys(headers).length > 0 ? headers : undefined,
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.error("認証エラー: セッションが無効または期限切れ");

          setLoading(false);
          return;
        }

        // 422エラー（バリデーションエラー）の処理
        if (res.status === 422) {
          try {
          } catch {}

          setLoading(false);
          return;
        }

        // 500エラーの場合、より詳細なエラーメッセージを表示
        if (res.status === 500) {
          let errorMessage = "サーバーエラーが発生しました。";
          let errorDetails = "";

          try {
            // Laravelのエラーレスポンスをパース

            // 詳細情報を収集
            const details: string[] = [];

            // バリデーションエラーの場合（500エラー内でも発生する可能性がある）

            // メモリエラーの検出
            if (
              errorMessage?.includes("memory") ||
              errorDetails?.includes("Memory")
            ) {
              errorMessage = `メモリ不足エラーが発生しました。\nリクエストサイズ: ${sizeInMB}MB\n\n画像サイズを小さくするか、サーバーのメモリ制限を確認してください。`;
            }
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
            // JSONパースに失敗した場合、HTMLレスポンスの可能性がある
            // HTMLからエラーメッセージを抽出

            if (
              errorMessage?.includes("upload_max_filesize") ||
              errorMessage?.includes("post_max_size")
            ) {
              errorMessage = `ファイルサイズが大きすぎます。リクエストサイズ: ${sizeInMB}MB。PHPのupload_max_filesizeまたはpost_max_sizeの制限を確認してください。`;
            } else if (
              errorMessage?.includes("memory") ||
              errorMessage?.includes("Memory")
            ) {
              errorMessage = `メモリ不足エラーが発生しました。リクエストサイズ: ${sizeInMB}MB。画像サイズを小さくするか、サーバーのメモリ制限を確認してください。`;
            } else if (
              errorMessage?.includes("timeout") ||
              errorMessage?.includes("Timeout")
            ) {
              errorMessage = `リクエストがタイムアウトしました。リクエストサイズ: ${sizeInMB}MB。画像サイズを小さくするか、サーバーのタイムアウト設定を確認してください。`;
            } else if (errorMessage === "サーバーエラーが発生しました。") {
              // エラーメッセージが抽出できなかった場合、最初の500文字を表示
              errorMessage = `サーバーエラー: ${errorMessage?.substring(
                0,
                500
              )}${errorMessage?.length > 500 ? "..." : ""}`;
            }
          }

          setError(errorMessage + errorDetails);
          setLoading(false);
          return;
        }

        throw new Error(
          `投稿に失敗しました: ${res.status} - ${res.statusText}`
        );
      }

      router.push("/works-list");
    } catch (err) {
      console.error("投稿エラー:", err);

      // より詳細なエラーメッセージ
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          "ネットワークエラー: バックエンドサーバーに接続できません。サーバーが起動しているか確認してください。"
        );
      } else {
        setError(err instanceof Error ? err.message : "投稿に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-beige w-full min-h-screen">
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center w-full mb-8">管理画面</h1>
        <div className="h-20 mb-4">
          <button
            onClick={() => router.push("/works-list")}
            className="w-fit bg-blue-500 text-white p-3 rounded-md mx-8"
          >
            投稿一覧ページ
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col gap-4"
        >
          {/* エラーの時に表示 */}
          {error && <div className=" text-red-700 rounded p-2">{error}</div>}

          <div className="flex gap-3 items-center h-[44px]">
            <label htmlFor="title" className="text-2xl font-bold w-[200px]">
              タイトル
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-full p-2 rounded-md border-2 border-gray-300 bg-white"
              required
            />
          </div>

          <div className="flex gap-3 items-start">
            <label
              htmlFor="explanation"
              className="text-2xl font-bold w-[200px]"
            >
              内容
            </label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full h-[300px] p-2 rounded-md border-2 border-gray-300 bg-white resize-y"
              required
            />
          </div>

          <div className="flex gap-3 items-center">
            <label htmlFor="images" className="text-2xl font-bold w-[200px]">
              画像
            </label>
            <div className="flex flex-col gap-2 w-full">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 rounded-md border-2 border-gray-300 bg-white"
              />
              {images.length > 0 && (
                <p className="text-sm text-gray-600">
                  {images.length}個のファイルが選択されています
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <label htmlFor="tags" className="text-2xl font-bold w-[200px]">
              タグ
            </label>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-wrap gap-2 p-2 border-2 border-gray-300 rounded-md min-h-[60px] bg-white">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.has(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-md border-2 transition-colors ${
                        isSelected
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-300 border-gray-300"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              {selectedTags.size > 0 && (
                <p className="text-sm text-gray-600">
                  選択されたタグ: {Array.from(selectedTags).join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <label className="text-2xl font-bold w-[200px] pt-2">URL</label>
            <div className="flex flex-col gap-2 w-full">
              {urls.map((u, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={u}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className="w-full p-2 rounded-md border-2 border-gray-300 bg-white"
                    placeholder="https://example.com"
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlField(index)}
                      className="bg-red-500 text-white px-3 h-[44px] w-[84px] rounded-md"
                    >
                      削除
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addUrlField}
                className="w-fit bg-blue-500 text-white px-3 py-2 rounded-md"
              >
                URLを追加
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`w-fit bg-blue-500 text-white p-2 rounded-md text-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "送信中..." : "追加"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
