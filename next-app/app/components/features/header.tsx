"use client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 left-0 w-full px-20 py-3 mx-auto z-50 bg-beige border-b-[0.3px] border-white">
      <div className="flex items-center justify-between">
        <div className="underline w-[240px] h-fit px-2 py-1 text-center">
          <button
            className="title color-blac w-full h-full"
            onClick={() => router.push("/")}
          >
            Suzuki Shion
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* aboutページでは自分のプロフィール情報（趣味、スキル、経歴など）を表示 */}
          <button
            onClick={() => router.push("/about")}
            className="h2 w-fit px-2 py-1"
          >
            <h2 className="h2 w-fit px-2 py-1">about</h2>
          </button>
          {/* worksページでは自分が作成した作品とgithubから使った言語と割合を表示 */}
          <button
            onClick={() => router.push("/works")}
            className="h2 w-fit px-2 py-1"
          >
            <h2 className="h2 w-fit px-2 py-1">works</h2>
          </button>
          {/* contactページでは自分への連絡先を表示 */}
          <button
            onClick={() => router.push("/contact")}
            className="h2 w-fit px-2 py-1"
          >
            <h2 className="h2 w-fit px-2 py-1">contact</h2>
          </button>
          {/* <button
            onClick={() => router.push("/about")}
            className="h2 w-fit px-2 py-1"
          >
            <h2 className="h2 w-fit px-2 py-1">about</h2>
          </button> */}
        </div>
      </div>
    </header>
  );
}
