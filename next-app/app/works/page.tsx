import Header from "../components/features/header";
import Footer from "../components/features/footer";
import SectionTitle from "../components/features/section-title";
import Works from "../components/ui/works";

export default function works() {
  return (
    <div className="bg-beige w-full h-full">
      <div className="w-full sm:px-0 px-5 mx-auto">
        <Header />
        <div className="w-full px-[10%] mx-auto">
          <section className="w-full flex flex-col gap-3 my-8 mt-20 sm:mt-30">
            <SectionTitle title="frontend" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 my-8 mx-auto">
              <Works />
            </div>
            <Footer />
          </section>
        </div>
      </div>
    </div>
  );
}
