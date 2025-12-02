import Header from "../components/features/header";
import Footer from "../components/features/footer";
import SectionTitle from "../components/features/section-title";
import Works from "../components/ui/works";
export default function works() {
  return (
    <div className="bg-beige w-full h-full">
      <div className="w-full px-[5%] mx-auto">
        <Header />
        <div className="w-full px-[10%] mx-auto">
          <section className="w-full flex flex-col gap-3 my-8">
            <SectionTitle title="frontend" />
            <div className="grid grid-cols-3 justify-between gap-8 my-8mx-auto">
              {Array.from({ length: 6 }, (_, index) => (
                <Works
                  key={index}
                  title="appName"
                  overview="企画概要"
                  tags={["design", "Next.js", "Figma"]}
                  img="/english-image.jpeg"
                />
              ))}
            </div>
            <SectionTitle title="UI/UX" />
            <div className="grid grid-cols-3 justify-between gap-8 my-8mx-auto">
              {Array.from({ length: 6 }, (_, index) => (
                <Works
                  key={index}
                  title="appName"
                  overview="企画概要"
                  tags={["design", "Next.js", "Figma"]}
                  img="/english-image.jpeg"
                />
              ))}
            </div>
            <Footer />
          </section>
        </div>
      </div>
    </div>
  );
}
