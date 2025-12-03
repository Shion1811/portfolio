"use client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className="fixed top-0 md:px-20 sm:px-0 sm:h-[110px] h-[80px] py-3 mx-auto z-50 bg-beige border-b-[0.3px] border-white sm:w-full w-full px-3">
      <div className="flex items-center justify-between gap-2">
        <div className="underline sm:w-[25%] h-fit sm:px-2 px-0 py-1 text-center w-[60%] mx-auto">
          <button
            className="title text-black w-full h-full font-family-title"
            onClick={() => router.push("/")}
          >
            Suzuki Shion
          </button>
        </div>
        <div className="flex items-center gap-5 w-[90%] mx-auto justify-end">
          <button
            onClick={() => router.push("/about")}
            className="sm:h2 h3 w-fit sm:px-2 py-1"
          >
            <h2 className="sm:h2 h3 w-fit sm:px-2 py-1">about</h2>
          </button>
          <button
            onClick={() => router.push("/works")}
            className="h2 w-fit sm:px-2 py-1"
          >
            <h2 className="sm:h2 h3 w-fit sm:px-2 py-1">works</h2>
          </button>
          <button
            onClick={() => (window.location.href = "/#contact")}
            className="h2 w-fit sm:px-2 py-1"
          >
            <h2 className="sm:h2 h3 w-fit sm:px-2 py-1">contact</h2>
          </button>
        </div>
      </div>
    </header>
  );
}
