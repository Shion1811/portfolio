"use client";
import { useRouter } from "next/navigation";
interface WorksProps {
  title: string;
  overview: string;
  tags: string[] | boolean;
  img: string;
}
export default function Works({ title, overview, tags, img }: WorksProps) {
  const router = useRouter();
  return (
    <button className="w-full" onClick={() => router.push("/work-detail")}>
      <div className="w-full border-black border-1 rounded-md p-2 flex lg:flex-col gap-2">
        <div className="flex flex-col gap-2 sm:w-full w-[50%] mx-auto">
          <h3 className="h3">{title}</h3>
          <p className="p w-fit">{overview}</p>
          <div className="small text-white flex xl:gap-2 gap-1 w-full flex-wrap">
            {Array.isArray(tags) &&
              tags.map((tag) => (
                <p
                  className="bg-blue w-fit h-fit rounded-sm sm:px-2 p-1 sm:py-1"
                  key={tag}
                >
                  {tag}
                </p>
              ))}
          </div>
        </div>
        <img
          src={img}
          alt="英会話アプリの画像"
          className=" w-[130px] lg:w-full lg:h-[300px] h-[200px] object-cover rounded-md"
        />
      </div>
    </button>
  );
}
