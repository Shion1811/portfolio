import Header from "../components/features/header";
import Footer from "../components/features/footer";
import SectionTitle from "../components/features/section-title";
import Works from "../components/ui/works";
export default function works() {
  return (
    <div>
      <Header />
      <section className="w-full px-45 mx-auto flex flex-col gap-3 my-8">
        <SectionTitle title="Works" />
        <div className="grid grid-cols-3 justify-between gap-4">
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
  );
}
