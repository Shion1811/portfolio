import Header from "../components/features/header";
import Footer from "../components/features/footer";
import SectionTitle from "../components/features/section-title";
export default function workDetail() {
  const works = {
    title: "英会話アプリ",
    overview: "WebDesignの授業で英会話のアプリデザインを作成しました",
    tags: ["design", "Next.js", "Figma"],
    img: "/english-image.jpeg",
    link: Boolean(true) ? "https://apple.com" : undefined,
  };

  const link = works.link ? (
    <a href={works.link} target="_blank" rel="noopener noreferrer">
      {works.link}
    </a>
  ) : (
    "No link"
  );

  return (
    <div className="bg-beige w-full h-full">
      <Header />
      <div className="w-full sm:px-0 px-5 mx-auto">
        <section className="w-full px-[10%] mx-auto flex flex-col gap-3 mt-32">
          <SectionTitle title={works.title} className="sm:text-[34px]!" />
          <div className="flex flex-col gap-3 justify-start">
            <p className="p">{works.overview}</p>
            <div className="flex flex-wrap gap-2">
              {works.tags.map((tag) => (
                <p
                  key={tag}
                  className="bg-blue text-white rounded-md px-2 py-1"
                >
                  {tag}
                </p>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 grid-cols-1 gap-4 justify-between">
              {Array.from({ length: 5 }, (_, index) => (
                <img
                  key={index}
                  src={`/english-image.jpeg`}
                  alt={`${works.title}の画像${index + 1}`}
                  className=" object-cover rounded-md w-full h-full"
                />
              ))}
            </div>
            <div className="flex my-6">
              <a
                href={works.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue border-b-[0.3px] border-blue w-fit"
              >
                {link}
              </a>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
