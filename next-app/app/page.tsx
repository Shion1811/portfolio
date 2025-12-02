import Header from "./components/features/header";
import SectionTitle from "./components/features/section-title";
import Footer from "./components/features/footer";
import Works from "./components/ui/works";
export default function top() {
  return (
    <div className="bg-beige w-full h-full">
      <div className="w-full px-20">
        <Header />
        <section className="flex items-center relative h-[800px] w-[1150px] mx-auto mt-14">
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
          <SectionTitle title="About" />
          <div className="flex gap-2 items-end">
            <h4 className="h4 font-bold">Suzuki Shion</h4>
            <p className="p">鈴木至恩</p>
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
        <section className="w-full px-45 mx-auto flex flex-col gap-3 my-8">
          <SectionTitle title="Works" />
          <div className="flex justify-between">
            {Array.from({ length: 3 }, (_, index) => (
              <Works
                key={index}
                title="appName"
                overview="企画概要"
                tags={["design", "Next.js", "Figma"]}
                img="/english-image.jpeg"
              />
            ))}
          </div>
          <div className="flex justify-end w-full">
            <button className="w-fit h-fit p-2 bg-blue text-white rounded-[4px]">
              works ページへ
            </button>
          </div>
        </section>
        <section className="w-full px-45 mx-auto flex flex-col gap-3 my-8">
          <SectionTitle title="Contact" />
          <div className="flex justify-around my-4">
            <div className="border-b-[0.3px] border-black w-40 h-fit py-1 text-center bg-white contact-hover">
              <a href="https://github.com/Shion1811">
                <h4 className="h4">github</h4>
              </a>
            </div>
            <div className="border-b-[0.3px] border-black w-40 h-fit py-1 text-center bg-white contact-hover">
              <a href="mailto:shion48691811@gmail.com">
                <h4 className="h4">gmail</h4>
              </a>
            </div>
            <div className="border-b-[0.3px] border-black w-40 h-fit py-1 text-center bg-white contact-hover">
              <a href="https://www.wantedly.com/id/shion_2006">
                <h4 className="h4">wantedly</h4>
              </a>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
