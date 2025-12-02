"use client";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 left-0 w-full px-20 py-3 mx-auto z-50 bg-beige border-b-[0.3px] border-white">
      <div className="flex items-center justify-between">
        <div className="underline w-[240px] h-fit px-2 py-1 text-center">
          <button
            className="title text-black w-full h-full font-family-title"
            onClick={() => router.push("/")}
          >
            Suzuki Shion
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/about")}
            className="h2 w-fit px-2 py-1"
          >
            <h2 className="h2 w-fit px-2 py-1">about</h2>
          </button>
          <button
            onClick={() => router.push("/works")}
            className="h2 w-fit px-2 py-1"
          >
            <h2 className="h2 w-fit px-2 py-1">works</h2>
          </button>
          <button
            onClick={() => (window.location.href = "/#contact")}
            className="h2 w-fit px-2 py-1"
          >
            <h2 className="h2 w-fit px-2 py-1">contact</h2>
          </button>
        </div>
      </div>
    </header>
  );
}
