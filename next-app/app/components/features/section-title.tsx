interface SectionTitleProps {
  title: string;
  className?: string;
}

export default function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <h1 className={`h1 w-fit h-fit my-4 m-auto flex gap-2 ${className || ""}`}>
      <div className="title-center-line w-[50px]"></div>
      {title}
      <div className="title-center-line w-[50px]"></div>
    </h1>
  );
}
