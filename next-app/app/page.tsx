"use client";
import { useRouter } from "next/navigation";

export default function top() {
  const router = useRouter();
  return (
    <div className="bg-beige w-full h-full">
      <div className="w-full px-20">
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
        <section className="w-full px-45 flex flex-col gap-3 my-8">
          <h1 className="h1 w-fit h-fit my-4 m-auto flex gap-2">
            <div className="title-center-line w-[50px]"></div>
            About
            <div className="title-center-line w-[50px]"></div>
          </h1>
          <div className="flex gap-2 items-end">
            <h2 className="h2 font-bold">Suzuki Shion</h2>
            <h3 className="h3">鈴木至恩</h3>
          </div>
          <p className="p">2006年 1月 1日</p>
          <div className="p">
            <p>バンタンに入った理由</p>
            <p>
              友達がバンタンを通っていて、尊敬したので自分もバンタンに入学することに決めました。
            </p>
          </div>
          <div className="p">
            1年生では<span className="tracking-wider">HTML</span> ,
            <span className="tracking-wider">CSS</span> ,
            <span className="tracking-wider">python</span>
            でコーディングを学びつつ、
            <span className="tracking-wider">figma</span> ,
            でデザインも一緒に学び学校のイベントを参加して、1年生の後期
            <span className="tracking-wider">Next.js</span>を学び始めました。
          </div>
          <div className="p">
            2年生では1年生で学んだ知識を培い簡単なToDoアプリを作ったり、APIも学びbackendとのAPI通信を学びました。
          </div>
          <div className="p">3年生 coming soon...</div>
          <div className="flex justify-end w-full">
            <button className="w-fit h-fit p-2 bg-blue text-white rounded-[4px]">
              about ページへ
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
