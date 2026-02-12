export function StatsBar() {
  const stats = [
    {
      value: "6x Times",
      description: "Volume of Average Agent",
      subtext: "We sell more homes than the typical agent"
    },
    {
      value: "3% Higher",
      description: "Sale Price",
      subtext: "On average compared to other agents"
    },
    {
      value: "23 Days Less",
      description: "Than Average Agent",
      subtext: "Faster time on market"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-spyglass-orange mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {stat.description}
              </div>
              <div className="text-sm text-gray-600">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}