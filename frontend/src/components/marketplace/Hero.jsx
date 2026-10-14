export default function Hero(props) {
    const {} = props;
    return (
        <>
            <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20 lg:px-8">
                <div>
            <span
                className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
              Wear more. Waste less.
            </span>

                    <h1 className="mt-6 max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                        Your next favorite outfit is already{" "}
                        <span className="text-emerald-800">out there.</span>
                    </h1>

                    <p className="mt-5 max-w-lg text-base leading-7 text-stone-600">
                        Give your pre-loved clothes a new home. Discover unique styles,
                        exchange what you own, and refresh your wardrobe without buying new.
                    </p>

                    <a
                        href="#explore"
                        className="mt-8 inline-flex rounded-full bg-emerald-800 px-7 py-3.5 font-semibold text-white transition hover:bg-emerald-900"
                    >
                        Explore clothing <span className="ml-2">→</span>
                    </a>

                    <div className="mt-10 flex gap-8">
                        <div><p className="text-2xl font-black">100%</p><p className="mt-1 text-sm text-stone-500">Swap
                            focused</p></div>
                        <div><p className="text-2xl font-black">Zero</p><p className="mt-1 text-sm text-stone-500">Money
                            exchanged</p></div>
                        <div><p className="text-2xl font-black">One</p><p className="mt-1 text-sm text-stone-500">Better
                            planet</p></div>
                    </div>
                </div>

                <div className="relative">
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
                        alt="Friends exploring fashion together"
                        className="h-[350px] w-full rounded-3xl object-cover shadow-xl md:h-[470px]"
                    />
                    <div className="absolute -bottom-5 left-4 rounded-2xl bg-white p-4 shadow-lg sm:left-8">
                        <p className="text-sm font-bold">Good clothes deserve more lives.</p>
                        <p className="mt-1 text-xs text-stone-500">Swap • Rewear • Repeat</p>
                    </div>
                </div>
            </section>
        </>
    );
}
