"use client";
import { useRouter } from "next/navigation";

export default function top() {
  const router = useRouter();
  return (
    <div className="bg-beige w-full h-full">
      <div className="w-full px-16">
        <header className="flex items-center justify-between">
          <div className="underline w-[180px] h-fit px-2 py-1 text-center">
            <button
              className="title color-blac w-full h-full"
              onClick={() => router.push("/")}
            >
              Suzuki Shion
            </button>
          </div>
          <div className="flex items-center gap-2">
            {/* aboutページでは自分のプロフィール情報（趣味、スキル、経歴など）を表示 */}
            <h2 className="h2 w-fit px-2 py-1">about</h2>
            {/* worksページでは自分が作成した作品を表示 */}
            <h2 className="h2 w-fit px-2 py-1">works</h2>
            {/* contactページでは自分への連絡先を表示 */}
            <h2 className="h2 w-fit px-2 py-1">contact</h2>
          </div>
        </header>
        <section className="flex items-center relative h-[800px] w-[1150px] mx-auto">
          <div className="absolute left-0 z-10">
            <div className="font-family-title text-[80px] w-[800px] text-blue font-bold">
              Suzuki Shion 's
            </div>
            <div className="relative">
              <p className="font-family-title text-[80px] absolute top-0 left-[200px] text-blue font-bold">
                Portfolio
              </p>
            </div>
          </div>
          <img
            src="/header-img.png"
            alt="ヘッダー画像"
            className="w-[750px] h-[600px] rounded-[16px] absolute right-0"
          />
        </section>
      </div>
    </div>
  );
}
