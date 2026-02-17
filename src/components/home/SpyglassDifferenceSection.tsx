export function SpyglassDifferenceSection() {
  const differences = [
    {
      title: "We don't just list it. We launch it.",
      description: "Professional photography, staging, and advanced marketing drive results. Our listings get unmatched exposure.",
      stat: "$50K+",
      statLabel: "More per sale on average",
    },
    {
      title: "Your bottom line is our obsession.",
      description: "Data-driven pricing and expert negotiation ensures exceptional results for every client.",
      stat: "102%",
      statLabel: "Average sale-to-list ratio",
    },
    {
      title: "Boutique service. Big results.",
      description: "Highly trained agents with personalized attention means you get the experience you deserve.",
      stat: "23",
      statLabel: "Days less on market",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          The Spyglass Difference
        </h2>
        <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
          What sets us apart from every other brokerage in Austin
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {differences.map((item, index) => (
            <div key={index} className="text-center p-8">
              <div className="text-5xl font-bold text-spyglass-orange mb-3">
                {item.stat}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-6">
                {item.statLabel}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
