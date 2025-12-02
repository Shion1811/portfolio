interface WorksProps {
  title: string;
  overview: string;
  tags: string[] | boolean;
  img: string;
}
export default function Works({ title, overview, tags, img }: WorksProps) {
  return (
    <div>
      <div className="w-[325px] border-black border-1 rounded-md p-2 flex flex-col gap-2">
        <h3 className="h3">{title}</h3>
        <p className="p">{overview}</p>
        <div className="small text-white flex gap-2">
          {Array.isArray(tags) &&
            tags.map((tag) => (
              <p className="bg-blue w-fit rounded-sm px-2 py-1">{tag}</p>
            ))}
        </div>
        <img
          src={img}
          alt="英会話アプリの画像"
          className="w-full h-[200px] object-cover rounded-md"
        />
      </div>
    </div>
  );
}
