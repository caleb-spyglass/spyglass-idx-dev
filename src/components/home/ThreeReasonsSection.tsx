import { HomeIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export function ThreeReasonsSection() {
  const reasons = [
    {
      icon: ChartBarIcon,
      title: "Proven Results",
      description: "Our track record speaks for itself—6x the volume of average agents, 3% higher sale prices, and 23 days faster closings. We deliver results that matter."
    },
    {
      icon: UsersIcon,
      title: "Expert Team",
      description: "Our highly trained and experienced agents know Austin inside and out. With award-winning service and deep local expertise, we're your trusted advisors."
    },
    {
      icon: HomeIcon,
      title: "Cutting-Edge Technology",
      description: "From AI-powered search to advanced marketing strategies, we use the latest technology to give you a competitive advantage in today's market."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Three Reasons to Work With Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what sets Spyglass Realty apart from other real estate brokerages in Austin.
          </p>
        </div>

        {/* Reason Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              {/* Icon */}
              <div className="w-16 h-16 bg-spyglass-orange/10 rounded-full flex items-center justify-center mb-6">
                <reason.icon className="w-8 h-8 text-spyglass-orange" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}