export default function Hero() {
  const heroUrl =
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section className="relative overflow-hidden rounded-2xl">
      <div className="h-[240px] sm:h-[340px] lg:h-[420px]">
        <img
          src={heroUrl}
          alt="Scenic travel destination"
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
      <div className="absolute inset-0 flex items-end">
        <div className="p-5 sm:p-8 lg:p-10 max-w-3xl">
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Find your stay
          </h1>
          <p className="mt-2 text-white/90 text-sm sm:text-base lg:text-lg">
            Unique venues - city breaks, cabins and some hidden gems
          </p>
        </div>
      </div>
    </section>
  );
}
