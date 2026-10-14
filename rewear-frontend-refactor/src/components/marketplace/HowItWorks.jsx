export default function HowItWorks(props) {
    const {} = props;
    return (
        <>
            <section id="how-it-works" className="bg-emerald-950 px-5 py-16 text-white lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm font-bold uppercase tracking-widest text-emerald-300">Simple by design</p>
                    <h2 className="mt-3 text-3xl font-black sm:text-4xl">A better wardrobe, in three steps.</h2>
                    <div className="mt-10 grid gap-8 md:grid-cols-3">
                        {[
                            ["01", "List what you own", "Give clothes you no longer wear a new home."],
                            ["02", "Discover something new", "Find pieces that match your style and size."],
                            ["03", "Make the exchange", "Request a swap and agree with the other owner."],
                        ].map(([number, title, description]) => (
                            <div key={number} className="rounded-2xl border border-white/15 p-6">
                                <p className="text-sm font-bold text-emerald-300">{number}</p>
                                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                                <p className="mt-3 leading-6 text-emerald-100/75">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
