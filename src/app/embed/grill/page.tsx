import GrillConfigurator from "@/components/GrillConfigurator";

export default function GrillEmbedPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const isEmbed = true;
  const hideCart = searchParams.hideCart === "true";
  const initialWidth = searchParams.width ? Number(searchParams.width) : 0.8;
  const theme = searchParams.theme === "light" ? "light" : "dark";

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-white" : "bg-transparent"} flex items-center justify-center p-2 sm:p-4`}>
      <div className="w-full h-full max-w-5xl mx-auto">
        <GrillConfigurator 
          isEmbed={isEmbed} 
          hideCart={hideCart} 
          initialWidth={initialWidth}
        />
      </div>
    </div>
  );
}
