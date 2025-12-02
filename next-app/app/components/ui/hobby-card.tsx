interface HobbyCardProps {
  title: string;
  image: string;
  onClick: () => void;
}

export default function HobbyCard({ title, image, onClick }: HobbyCardProps) {
  return (
    <button
      className="sm:hobby-card-image border-blue border-1 text-black rounded-md hidden sm:block w-fit"
      onClick={onClick}
    >
      <div className="w-[20vw] h-[150px] flex items-center justify-center relative">
        <img
          src={image}
          alt={`${title}の画像`}
          className="w-full h-full object-cover rounded-md"
        />
        <h3 className="h3 font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 box-shadow text-blue">
          {title}
        </h3>
      </div>
    </button>
  );
}
