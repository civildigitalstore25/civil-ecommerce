type Props = {
  src: string;
  alt: string;
};

export function BlogDetailHeroImage({ src, alt }: Props) {
  return (
    <figure className="mb-8 md:mb-10 -mx-0 sm:mx-0">
      <div className="rounded-2xl overflow-hidden bg-slate-100 shadow-md ring-1 ring-slate-200/80 aspect-[16/9] max-h-[min(28rem,56vw)]">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    </figure>
  );
}
