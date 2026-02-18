'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';
import {
  BuildingOffice2Icon,
  ClockIcon,
  BoltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

/* ─── Types ─── */
interface SubmarketCard {
  name: string;
  rate: string;
  highlight: string;
  icon: React.ReactNode;
}

interface FAQItem {
  question: string;
  answer: string;
}

/* ─── Data ─── */
const submarkets: SubmarketCard[] = [
  { name: 'Downtown / CBD', rate: '$45–55/sf', highlight: 'Class A Trophy', icon: <BuildingOffice2Icon className="w-6 h-6" /> },
  { name: 'Domain / North Austin', rate: '$35–48/sf', highlight: 'Tech Hub', icon: <BoltIcon className="w-6 h-6" /> },
  { name: 'NW / 183 Corridor', rate: '$28–38/sf', highlight: 'Best Value', icon: <CurrencyDollarIcon className="w-6 h-6" /> },
  { name: 'SW / MoPac', rate: '$30–42/sf', highlight: 'Growing Fast', icon: <ArrowTrendingUpIcon className="w-6 h-6" /> },
  { name: 'East Austin / Airport', rate: '$25–35/sf', highlight: 'Creative / Flex', icon: <MapPinIcon className="w-6 h-6" /> },
  { name: 'Round Rock / Cedar Park', rate: '$22–32/sf', highlight: 'Suburban Office', icon: <UserGroupIcon className="w-6 h-6" /> },
];

const faqs: FAQItem[] = [
  {
    question: 'How much does office space cost in Austin?',
    answer:
      'Austin office lease rates range from about $22/sf in suburban areas like Round Rock to $55/sf for Class A space downtown. Rates depend on building class, submarket, amenities, and lease term. NNN (triple-net) leases add $8–15/sf for operating expenses on top of base rent.',
  },
  {
    question: 'What insurance do I need for a commercial lease?',
    answer:
      "Most landlords require Commercial General Liability (CGL), commercial property/contents coverage, and workers' compensation if you have employees. Many also require business interruption insurance. We coordinate all of this so your policy is in place before signing.",
  },
  {
    question: 'How long does it take to find office space?',
    answer:
      'With a traditional broker, 60–90 days is typical. Spyglass uses AI-powered matching to surface viable options in minutes and get you touring within the same week. Most tenants are signed within 2–4 weeks of first contact.',
  },
  {
    question: "What's included in NNN lease rates?",
    answer:
      'A NNN (triple-net) lease means you pay base rent plus your proportional share of property taxes, building insurance, and common-area maintenance (CAM). In Austin, NNN charges typically add $8–15/sf annually. Full-service (gross) leases bundle everything into one rate.',
  },
  {
    question: 'Do I need a broker to lease office space?',
    answer:
      "You don't legally need one, but tenant representation is typically free — the landlord pays the commission. That means you get expert negotiation, market data, and lease review at no cost. There's no reason not to have one in your corner.",
  },
];

/* ─── FAQ Accordion ─── */
function FAQAccordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-lg font-medium text-gray-900">{item.question}</span>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <p className="pb-5 text-gray-600 leading-relaxed">{item.answer}</p>}
    </div>
  );
}

/* ─── Page ─── */
export default function CommercialPage() {
  const [formType, setFormType] = useState<'tenant' | 'landlord'>('tenant');

  const [tenantForm, setTenantForm] = useState({
    company: '', squareFeet: '', budget: '', area: '', timeline: '', email: '', phone: '',
  });

  const [landlordForm, setLandlordForm] = useState({
    building: '', availableSF: '', buildingClass: '', askingRent: '', name: '', email: '', phone: '',
  });

  const handleTenantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setTenantForm({ ...tenantForm, [e.target.name]: e.target.value });

  const handleLandlordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setLandlordForm({ ...landlordForm, [e.target.name]: e.target.value });

  const handleTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Commercial Tenant Inquiry');
    const body = encodeURIComponent(
      `Company: ${tenantForm.company}\nSpace Needed: ${tenantForm.squareFeet} SF\nBudget: ${tenantForm.budget}\nPreferred Area: ${tenantForm.area}\nTimeline: ${tenantForm.timeline}\nPhone: ${tenantForm.phone}`
    );
    window.location.href = `mailto:info@spyglassrealty.com?subject=${subject}&body=${body}`;
  };

  const handleLandlordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Commercial Landlord Inquiry');
    const body = encodeURIComponent(
      `Building: ${landlordForm.building}\nAvailable SF: ${landlordForm.availableSF}\nClass: ${landlordForm.buildingClass}\nAsking Rent: ${landlordForm.askingRent}\nContact: ${landlordForm.name}\nPhone: ${landlordForm.phone}`
    );
    window.location.href = `mailto:info@spyglassrealty.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* ── Structured Data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Spyglass Realty — Commercial Leasing',
            description:
              'AI-powered commercial real estate services in Austin, TX. Office leasing, tenant representation, and landlord services.',
            url: 'https://spyglassrealty.com/commercial',
            telephone: '+1-737-727-4889',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '2025 Guadalupe Street',
              addressLocality: 'Austin',
              addressRegion: 'TX',
              postalCode: '78705',
              addressCountry: 'US',
            },
            areaServed: {
              '@type': 'City',
              name: 'Austin',
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }),
        }}
      />

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative bg-gradient-to-br from-spyglass-dark via-spyglass-charcoal to-spyglass-dark text-white py-28 md:py-36 overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <p className="inline-block text-spyglass-orange font-semibold text-sm tracking-widest uppercase mb-6">
            Austin Commercial Real Estate
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] mb-6">
            Commercial Space.{' '}
            <span className="text-spyglass-orange">Found Fast.</span>
            <br />
            Insured Faster.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Austin&apos;s first AI-powered commercial real estate team. We respond in minutes, not days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-spyglass-orange hover:bg-spyglass-orange-hover px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              <MagnifyingGlassIcon className="w-5 h-5" /> Find Office Space
            </a>
            <a
              href="#contact"
              onClick={() => setFormType('landlord')}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/80 hover:bg-white hover:text-spyglass-charcoal px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              <BuildingOffice2Icon className="w-5 h-5" /> List Your Property
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════ THE PROBLEM ══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <div>
              <p className="text-spyglass-orange font-semibold text-sm uppercase tracking-wide mb-3">The Status Quo</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                10 inquiries sent.
                <br />
                <span className="text-gray-400">0 follow-ups.</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  You send 10 inquiries to commercial brokers. <strong className="text-gray-900">3 respond within 48 hours.</strong> 1 sends
                  something useful. 0 follow up.
                </p>
                <p>
                  Austin's commercial market is{' '}
                  <strong className="text-gray-900">23% vacant</strong> — and yet finding space still feels like pulling teeth.
                </p>
              </div>
            </div>

            {/* Spyglass Way */}
            <div className="bg-gradient-to-br from-spyglass-dark to-spyglass-charcoal rounded-2xl p-8 text-white">
              <p className="text-spyglass-orange font-semibold text-sm uppercase tracking-wide mb-3">The Spyglass Way</p>
              <h3 className="text-2xl font-bold mb-6">Minutes, not days.</h3>
              <ul className="space-y-4">
                {[
                  'AI matches you to available spaces instantly',
                  'Human broker responds within the hour',
                  'Tour options curated for your exact needs',
                  'Insurance coordinated before lease signing',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-spyglass-orange flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-spyglass-orange font-semibold text-sm uppercase tracking-wide mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              From inquiry to lease in <span className="text-spyglass-orange">weeks</span>, not months.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <DocumentTextIcon className="w-8 h-8 text-spyglass-orange" />,
                title: 'Tell Us Your Requirements',
                desc: 'Size, budget, location, move-in date. Takes 2 minutes.',
              },
              {
                step: '02',
                icon: <BoltIcon className="w-8 h-8 text-spyglass-orange" />,
                title: 'Get Matched in Minutes',
                desc: 'Our AI scans every available listing and surfaces the best fits instantly.',
              },
              {
                step: '03',
                icon: <ShieldCheckIcon className="w-8 h-8 text-spyglass-orange" />,
                title: 'Tour This Week, Insured at Signing',
                desc: 'We schedule tours within days and coordinate your required insurance so you move in on time.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow group"
              >
                <span className="absolute top-4 right-6 text-6xl font-black text-gray-100 group-hover:text-spyglass-orange/10 transition-colors">
                  {s.step}
                </span>
                <div className="w-14 h-14 bg-spyglass-orange/10 rounded-xl flex items-center justify-center mb-5">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ MARKET STATS ══════════════════ */}
      <section className="py-20 bg-spyglass-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-spyglass-orange font-semibold text-sm uppercase tracking-wide mb-3">Market Snapshot</p>
            <h2 className="text-3xl md:text-4xl font-bold">Austin Commercial Real Estate — Q1 2025</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { stat: '~23%', label: 'Office Vacancy Rate', sub: 'Highest in a decade' },
              { stat: '65M+', label: 'SF Available', sub: 'Across all submarkets' },
              { stat: '$22–55', label: 'Per SF Range', sub: 'Suburban to CBD Class A' },
              { stat: '<2 wks', label: 'Avg Spyglass Match', sub: 'From inquiry to tour' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-4xl md:text-5xl font-extrabold text-spyglass-orange mb-2">{item.stat}</div>
                <div className="text-lg font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-gray-400">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ SUBMARKETS GRID ══════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-spyglass-orange font-semibold text-sm uppercase tracking-wide mb-3">Explore Submarkets</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Austin Office Space by Submarket
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Average asking rates for Class A / Class B office space. Rates shown are Full‑Service Gross equivalents where possible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {submarkets.map((sm) => (
              <div
                key={sm.name}
                className="border border-gray-200 rounded-2xl p-6 hover:border-spyglass-orange/40 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-spyglass-orange/10 rounded-xl flex items-center justify-center text-spyglass-orange group-hover:bg-spyglass-orange group-hover:text-white transition-colors">
                    {sm.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{sm.name}</h3>
                    <span className="text-xs font-medium text-spyglass-orange uppercase tracking-wide">{sm.highlight}</span>
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{sm.rate}</div>
                <p className="text-sm text-gray-500">per SF / year</p>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center text-sm font-medium text-spyglass-orange hover:text-spyglass-orange-hover"
                >
                  Search this area →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FOR LANDLORDS ══════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-spyglass-orange font-semibold text-sm uppercase tracking-wide mb-3">For Landlords</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Fill Your Space <span className="text-spyglass-orange">Faster.</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Austin's vacancy rate is climbing. Standing out requires more than a CoStar listing. Spyglass brings AI-powered tenant matching, real-time reporting, and built-in insurance facilitation so deals close faster.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { icon: <ChartBarIcon className="w-5 h-5" />, text: 'Real-time leasing dashboard & analytics' },
                  { icon: <UserGroupIcon className="w-5 h-5" />, text: 'AI tenant matching from our active pipeline' },
                  { icon: <ShieldCheckIcon className="w-5 h-5" />, text: 'Insurance facilitation — tenants insured at signing' },
                  { icon: <ClockIcon className="w-5 h-5" />, text: 'Faster time-to-lease, lower vacancy loss' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-spyglass-orange mt-0.5">{item.icon}</span>
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={() => setFormType('landlord')}
                className="inline-flex items-center gap-2 bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                <BuildingOffice2Icon className="w-5 h-5" /> List Your Property
              </a>
            </div>

            {/* Visual stat block */}
            <div className="bg-gradient-to-br from-spyglass-dark to-spyglass-charcoal rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-8">Spyglass Landlord Advantage</h3>
              <div className="space-y-6">
                {[
                  { value: '3×', label: 'faster tenant matching vs. industry average' },
                  { value: '14 days', label: 'average time from listing to qualified lead' },
                  { value: '100%', label: 'of tenants insured before move-in' },
                  { value: '$0', label: 'cost to list — we earn on tenant side' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-2xl font-extrabold text-spyglass-orange w-24 flex-shrink-0">{s.value}</span>
                    <span className="text-gray-300">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ INSURANCE CROSS-SELL ══════════════════ */}
      <section className="py-20 bg-spyglass-charcoal text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-spyglass-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheckIcon className="w-8 h-8 text-spyglass-orange" />
          </div>
          <p className="text-spyglass-orange font-semibold text-sm uppercase tracking-wide mb-3">One-Stop Lease + Insurance</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don&apos;t let insurance delay your move-in.
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
            Every commercial lease requires proof of insurance — CGL, commercial property, workers' comp, and often more.
            Most tenants scramble for quotes after signing. <strong className="text-white">We handle it before you sign</strong>, so your
            certificate of insurance is ready on day one.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { title: 'General Liability', desc: 'Required by every landlord. We bind same-day.' },
              { title: 'Property / Contents', desc: 'Protect your buildout, equipment, and inventory.' },
              { title: "Workers' Comp", desc: 'Mandatory in Texas if you have employees.' },
            ].map((ins) => (
              <div key={ins.title} className="text-left">
                <CheckCircleIcon className="w-6 h-6 text-spyglass-orange mb-2" />
                <h4 className="font-semibold mb-1">{ins.title}</h4>
                <p className="text-sm text-gray-400">{ins.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CONTACT / LEAD FORM ══════════════════ */}
      <section id="contact" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-spyglass-orange font-semibold text-sm uppercase tracking-wide mb-3">Get Started</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tell us what you need.
            </h2>
            <p className="text-gray-600 text-lg">
              Whether you&apos;re searching for space or looking to fill it, we&apos;ll get back to you within the hour.
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setFormType('tenant')}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  formType === 'tenant'
                    ? 'bg-spyglass-orange text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                I Need Space
              </button>
              <button
                onClick={() => setFormType('landlord')}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  formType === 'landlord'
                    ? 'bg-spyglass-orange text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                I Have Space
              </button>
            </div>
          </div>

          {/* ── Tenant Form ── */}
          {formType === 'tenant' && (
            <form onSubmit={handleTenantSubmit} className="bg-gray-50 rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={tenantForm.company}
                    onChange={handleTenantChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-2">
                    Space Needed (SF) *
                  </label>
                  <input
                    type="text"
                    id="squareFeet"
                    name="squareFeet"
                    value={tenantForm.squareFeet}
                    onChange={handleTenantChange}
                    placeholder="e.g. 2,000 – 5,000"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Budget
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={tenantForm.budget}
                    onChange={handleTenantChange}
                    placeholder="e.g. $5,000 – $10,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Area
                  </label>
                  <select
                    id="area"
                    name="area"
                    value={tenantForm.area}
                    onChange={handleTenantChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  >
                    <option value="">Select submarket</option>
                    <option value="downtown">Downtown / CBD</option>
                    <option value="domain">Domain / North Austin</option>
                    <option value="northwest">NW / 183 Corridor</option>
                    <option value="southwest">SW / MoPac</option>
                    <option value="east">East Austin / Airport</option>
                    <option value="suburban">Round Rock / Cedar Park</option>
                    <option value="flexible">Flexible / Not sure</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                    Move-in Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={tenantForm.timeline}
                    onChange={handleTenantChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  >
                    <option value="">Select timeline</option>
                    <option value="immediate">Immediately</option>
                    <option value="1-3months">1–3 months</option>
                    <option value="3-6months">3–6 months</option>
                    <option value="6plus">6+ months</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tenant-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="tenant-email"
                    name="email"
                    value={tenantForm.email}
                    onChange={handleTenantChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="tenant-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="tenant-phone"
                    name="phone"
                    value={tenantForm.phone}
                    onChange={handleTenantChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2 text-center pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-10 py-4 rounded-lg text-lg font-semibold transition-colors"
                  >
                    <EnvelopeIcon className="w-5 h-5" /> Send Inquiry
                  </button>
                  <p className="text-sm text-gray-500 mt-3">We respond within the hour during business hours.</p>
                </div>
              </div>
            </form>
          )}

          {/* ── Landlord Form ── */}
          {formType === 'landlord' && (
            <form onSubmit={handleLandlordSubmit} className="bg-gray-50 rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-2">
                    Building Name & Address *
                  </label>
                  <input
                    type="text"
                    id="building"
                    name="building"
                    value={landlordForm.building}
                    onChange={handleLandlordChange}
                    placeholder="e.g. Frost Tower, 401 Congress Ave"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="availableSF" className="block text-sm font-medium text-gray-700 mb-2">
                    Available SF *
                  </label>
                  <input
                    type="text"
                    id="availableSF"
                    name="availableSF"
                    value={landlordForm.availableSF}
                    onChange={handleLandlordChange}
                    placeholder="e.g. 15,000"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="buildingClass" className="block text-sm font-medium text-gray-700 mb-2">
                    Building Class
                  </label>
                  <select
                    id="buildingClass"
                    name="buildingClass"
                    value={landlordForm.buildingClass}
                    onChange={handleLandlordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  >
                    <option value="">Select class</option>
                    <option value="A">Class A</option>
                    <option value="B">Class B</option>
                    <option value="C">Class C</option>
                    <option value="flex">Flex / Industrial</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="askingRent" className="block text-sm font-medium text-gray-700 mb-2">
                    Asking Rent ($/SF/yr)
                  </label>
                  <input
                    type="text"
                    id="askingRent"
                    name="askingRent"
                    value={landlordForm.askingRent}
                    onChange={handleLandlordChange}
                    placeholder="e.g. $35 NNN"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="landlord-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    id="landlord-name"
                    name="name"
                    value={landlordForm.name}
                    onChange={handleLandlordChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="landlord-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="landlord-email"
                    name="email"
                    value={landlordForm.email}
                    onChange={handleLandlordChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="landlord-phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="landlord-phone"
                    name="phone"
                    value={landlordForm.phone}
                    onChange={handleLandlordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spyglass-orange focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2 text-center pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-spyglass-orange hover:bg-spyglass-orange-hover text-white px-10 py-4 rounded-lg text-lg font-semibold transition-colors"
                  >
                    <BuildingOffice2Icon className="w-5 h-5" /> List My Property
                  </button>
                  <p className="text-sm text-gray-500 mt-3">Free to list. We earn our commission on the tenant side.</p>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ══════════════════ FAQ ══════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-spyglass-orange font-semibold text-sm uppercase tracking-wide mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Common Questions About Austin Commercial Leasing
            </h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <FAQAccordion key={faq.question} item={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FINAL CTA ══════════════════ */}
      <section className="py-20 bg-gradient-to-br from-spyglass-dark to-spyglass-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to move faster than every other broker in Austin?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Whether you need 500 SF or 50,000 SF — we&apos;ll have options in your inbox before your coffee gets cold.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-spyglass-orange hover:bg-spyglass-orange-hover px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              <MagnifyingGlassIcon className="w-5 h-5" /> Find Space Now
            </a>
            <a
              href="tel:+17377274889"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/80 hover:bg-white hover:text-spyglass-charcoal px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              <PhoneIcon className="w-5 h-5" /> Call 737-727-4889
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
