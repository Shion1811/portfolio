"use client";
import { useRouter } from "next/navigation";
import Header from "../components/features/header";
import SectionTitle from "../components/features/section-title";
import HobbyCard from "../components/ui/hobby-card";
import Github from "../components/features/github";
import Footer from "../components/features/footer";
// aboutページでは自分のプロフィール情報（趣味、スキル、経歴など）を表示
export default function about() {
  const router = useRouter();
  return (
    <div className="bg-beige w-full h-full">
      <div className="w-full px-20">
        <Header />
        <section className="w-full px-45 mx-auto flex flex-col gap-3 my-8">
          <SectionTitle title="趣味" />
          <div>
            <div className="grid grid-cols-3 gap-4 justify-center my-8">
              <HobbyCard
                title="ドッジボール"
                image="/hobby/dodge-ball.jpeg"
                onClick={() => router.push("#dodge-ball")}
              />
              <HobbyCard
                title="ボウリング"
                image="/hobby/bowling.png"
                onClick={() => router.push("#bowling")}
              />
              <HobbyCard
                title="SEKAI NO OWARI"
                image="/hobby/SEKAI_NO_OWARI.jpeg"
                onClick={() => router.push("#sekai-no-owari")}
              />
              <HobbyCard
                title="インコ"
                image="/hobby/bird.jpeg"
                onClick={() => router.push("#bird")}
              />
              <HobbyCard
                title="ガジェット"
                image="/hobby/gadget.jpeg"
                onClick={() => router.push("#gadget")}
              />
            </div>
          </div>
        </section>
        <section className="w-full px-45 mx-auto flex flex-col gap-3 my-8 py-3">
          <div id="dodge-ball">
            <h3 className="h3 text-blue">ドッジボール</h3>
            <p className="p">
              小学1年生の頃からドッジボールを始め、小学6年生の頃にチームで30の大会に出場し、15の優勝,4の準優勝,3度の3位を獲得してチーム初となる全国大会にも出場しベスト8まで進出することができました。
            </p>
          </div>
          <div id="bowling">
            <h3 className="h3 text-blue">ボウリング</h3>
            <p className="p">
              高校生の頃バイト先の人とボウリングに行く機会があり、その時自分が下手すぎて1人でボウリング場に行ってやるようにしてからアベレージが150くらい行くようになり、ハイスコアでも214点を出せるようになりみんなとボウリング行ってもみんなより少し上位を取れるようになってるためボウリングが好きです。
            </p>
          </div>
          <div id="sekai-no-owari">
            <h3 className="h3 text-blue">SEKAI NO OWARI</h3>
            <p className="p">
              小学生の頃、紅白紅白歌合戦でSEKAI NO OWARIが出場し「Dragon
              Night」を歌っていて始めはDJ
              Loveさんのピエロマスクを被ってて興味を持ち、「tree」というアルバム初めて買って聴いたことが始まりでいろんなCDを買ってからはずっと曲を聴き回して「fight
              music」という曲に出会ってからは悲しい気持ちやもっと頑張らなきゃいけない時に聞くと元気になるため不安な時は聞いて何度も救われてるのでSEKAI
              NO OWARIが好きです。
            </p>
          </div>
          <div id="bird">
            <h3 className="h3 text-blue">インコ</h3>
            <p className="p">
              元々小学生の頃からペットを飼いたくて親に何度もおねだりをしたけど、ペットも人と同じ命で小学生には危ないのと自分が動物の毛がアレルギーのため触れ合うこともできなかったですが、鳥の羽は関係ないことを知って親にもう一度相談した時に当時中学生だったので親も承諾してくれて飼うことができ今では2羽のインコを飼育し自分も癒されて元気を貰ってます。
            </p>
          </div>
          <div id="gadget">
            <h3 className="h3 text-blue">ガジェット</h3>
            <p className="p">
              N高等学校に入学してからMakbook
              airを使うため初めて購入をしそこから一気にガジェットの沼にハマってからバイト代で貯めたお金や親がご褒美イヤホンを買ってくれて今ではいろんなガジェットに触れることができて楽しいです。
            </p>
          </div>
        </section>
        <section className="w-full px-45 mx-auto flex flex-col gap-3 my-8 py-3">
          <SectionTitle title="スキル" />
          <Github />
        </section>
        <Footer />
      </div>
    </div>
  );
}
