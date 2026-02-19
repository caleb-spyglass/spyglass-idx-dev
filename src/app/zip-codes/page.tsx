import React from 'react';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/home/Footer';
import { getAllZipCodes } from '@/data/zip-codes-data';
import ZipCodeMap from '@/components/zip-codes/ZipCodeMap';
import ZipCodeGrid from '@/components/zip-codes/ZipCodeGrid';
import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, HomeIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// All zip codes in the order from the original page
const ALL_ZIP_CODES = [
  '78613', '78617', '78620', '78628', '78641', '78645', '78652',
  '78701', '78702', '78703', '78704', '78705', '78717', '78721',
  '78722', '78723', '78724', '78726', '78728', '78731', '78732',
  '78733', '78734', '78735', '78737', '78738', '78739', '78741',
  '78744', '78745', '78746', '78748', '78749', '78750', '78751',
  '78752', '78753', '78754', '78756', '78757', '78758', '78759',
];

export default function ZipCodesPage() {
  const zipCodes = getAllZipCodes();

  // Split zip codes into rows of 3 for the browse table
  const zipRows: string[][] = [];
  for (let i = 0; i < ALL_ZIP_CODES.length; i += 3) {
    zipRows.push(ALL_ZIP_CODES.slice(i, i + 3));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-spyglass-orange to-red-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Austin, TX Zip Codes
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Explore our Austin Zipcode Neighborhood Search. Each zip code has a wide selection of Austin homes and condos for sale, duplexes, townhouses, and vacant lots.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span>Interactive Zip Code Map</span>
              </div>
              <div className="flex items-center gap-2">
                <HomeIcon className="w-5 h-5" />
                <span>Active Listings by Area</span>
              </div>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5" />
                <span>Market Data &amp; Trends</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-900 text-white px-6 py-4">
            <h2 className="text-xl font-bold tracking-wide uppercase">
              Austin and Surrounding Area Zip Codes
            </h2>
            <p className="text-white/90 text-sm mt-1">
              Click on any zip code to view detailed market information, active listings, and neighborhood insights.
            </p>
          </div>
          
          <div style={{ height: '500px' }} className="md:h-[500px] h-[350px]">
            <ZipCodeMap zipCodes={zipCodes} />
          </div>
        </div>
      </div>

      {/* Intro Overview */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="prose prose-gray max-w-none text-gray-600">
            <p className="mb-4">
              Here&apos;s a quick overview of some of the zip codes within Austin. Experience the vibrant and lively life of{' '}
              <Link href="/zip-codes/78701" className="text-spyglass-orange hover:text-red-700 font-medium">
                Downtown Austin
              </Link>{' '}
              at 78701.{' '}
              <Link href="/zip-codes/78702" className="text-spyglass-orange hover:text-red-700 font-medium">
                78702
              </Link>{' '}
              upcoming community that reflects the diverse culture and artistry of the residents. Find homes to the west of Austin&apos;s urban core, take a look at the neighborhoods within{' '}
              <Link href="/zip-codes/78703" className="text-spyglass-orange hover:text-red-700 font-medium">
                78703
              </Link>{' '}
              such as Tarrytown, Crestview, and parts of Lake Austin.
            </p>
            <p className="mb-4">
              <Link href="/zip-codes/78704" className="text-spyglass-orange hover:text-red-700 font-medium">
                78704
              </Link>{' '}
              is the hottest neighborhood in Austin that is a reflection of the &quot;Keep Austin Weird&quot; slogan. Discover homes and condos in 78704 which includes Bouldin Creek, Barton Hills, Travis Heights, and South Lamar. View the stunning neighborhood within{' '}
              <Link href="/zip-codes/78731" className="text-spyglass-orange hover:text-red-700 font-medium">
                78731
              </Link>{' '}
              where one of the most desirable neighborhoods, Allandale, is located.{' '}
              <Link href="/zip-codes/78748" className="text-spyglass-orange hover:text-red-700 font-medium">
                78748
              </Link>{' '}
              offers plenty of home styles such as mid-century designs, and sizes of new homes. Ranches and planned communities are also within the zip code, some neighborhoods in 78748 are Shady Hollow, Southland Oaks, Onion Creek, and South Slaughter.
            </p>
            <p className="mb-4">
              Check out the prominent neighborhoods in{' '}
              <Link href="/zip-codes/78749" className="text-spyglass-orange hover:text-red-700 font-medium">
                78749
              </Link>{' '}
              that include Deer Haven, Circle C Ranch, Oak Park, Heights at Loma Vista, Legend Oaks, and Maple Run. Fall in love with the beauty of a mix of suburban neighborhoods and master-planned communities at{' '}
              <Link href="/zip-codes/78750" className="text-spyglass-orange hover:text-red-700 font-medium">
                78750
              </Link>{' '}
              such as Bull Creek, Spicewood Vista, and Lakewood Park. Located at{' '}
              <Link href="/zip-codes/78759" className="text-spyglass-orange hover:text-red-700 font-medium">
                78759
              </Link>{' '}
              are the neighborhoods of Bull Creek, Jollyville, and Great Hills. The Domain, a large shopping center consisting of stores, restaurants, and a hotel are also within the zipcode.
            </p>
            <p className="text-gray-700 font-medium">
              Click on a zip code below on our Austin Zip Code Lookup to view the listings and know more details about the area.
            </p>
          </div>
        </div>
      </div>

      {/* Browse Zip Codes Table */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Dark header bar */}
          <div className="bg-gray-900 text-white px-6 py-4">
            <h2 className="text-lg font-bold tracking-wide uppercase">Browse Zip Codes</h2>
          </div>
          
          {/* 3-column grid */}
          <div className="divide-y divide-gray-200">
            {zipRows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-3 divide-x divide-gray-200">
                {row.map((zip) => (
                  <Link
                    key={zip}
                    href={`/zip-codes/${zip}`}
                    className="px-6 py-4 text-spyglass-orange hover:text-red-700 hover:bg-orange-50 font-medium text-center transition-colors"
                  >
                    {zip}
                  </Link>
                ))}
                {/* Fill empty cells in last row */}
                {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="px-6 py-4" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Zip Codes Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Zip Codes</h2>
        <ZipCodeGrid zipCodes={zipCodes.filter(z => z.marketData)} />
      </div>

      {/* Best Austin Zip Codes to Live In */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Best Austin, TX Zip Codes to Live In
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
            <p>
              <Link href="/zip-codes/78613" className="text-spyglass-orange hover:text-red-700 font-medium">78613</Link>{' '}
              is Cedar Park&apos;s zip code. This is one of the fastest-growing Austin suburbs. Aside from one of the cities with the lowest crime rates, 78613 has large employers such as Cedar Park Regional Medical Center and National Oilwell Varco. Homes this Austin zip code vary from traditional to contemporary and modern builds. One of the popular communities in Cedar Park 78613 is Avery Ranch where the iconic 18-hole golf course is located plus different amenities for residents to enjoy. 78613 is located near Austin&apos;s Anderson Mill and Brushy Creek.
            </p>

            <p>
              One of the thriving zip codes in greater Austin is Del Valle&apos;s{' '}
              <Link href="/zip-codes/78617" className="text-spyglass-orange hover:text-red-700 font-medium">78617</Link>{' '}
              located to the east of Austin-Bergstrom International Airport. Residents in the area enjoy the combination of country living with the entertainment of a city. Popular attractions in 78617 are Circuit of Americas and Austin360 Amphitheater where one of the biggest events, the F1 and other Grand Prix events are being held. Lake Bastrop is also near the area where families can enjoy trips and boating plus picnicking in Lockhart!
            </p>

            <p>
              <Link href="/zip-codes/78620" className="text-spyglass-orange hover:text-red-700 font-medium">78620</Link>{' '}
              is located in the southwest of Austin that covers Dripping Springs and goes as far as the Hamilton Pool. A popular community in the area is Arrowhead Ranch that features outstanding amenities and green spaces that surrounds each home. If you are looking for a home that offers privacy, the desirable community in the Ranches at Hamilton Pool is one of the popular communities in the area. 78620 is located nearby the hill country towns of Driftwood, Wimberley, and Johnson City.
            </p>

            <p>
              For a charming town that offers big city amenities, Georgetown&apos;s{' '}
              <Link href="/zip-codes/78628" className="text-spyglass-orange hover:text-red-700 font-medium">78628</Link>{' '}
              is one Austin zip code to watch. The magnificent scenery attracts residents in the area. Georgetown was even on top of the list of Top Places to Live and Launch a Small Business. The area includes three different golf courses that will truly be enjoyed by golfers, Berry Creek Country Club, Georgetown Country Club, and Jack Nicklaus signature Cimarron Hills. Residents enjoy camping and jogging the trails parallel to San Gabriel River or boat and fish on Lake Georgetown.
            </p>

            <p>
              <Link href="/zip-codes/78641" className="text-spyglass-orange hover:text-red-700 font-medium">78641</Link>{' '}
              homes feature several residential and commercial hubs. This North Austin zip code has become a place for healthcare, tech, and various booming industries with plenty of opportunities for Austinites. Homes in 78641 are also affordable and peaceful making it one of the most ideal places to live and work in. The Austin zip code is bordered by Cedar Park and Leander suburbs. Leander&apos;s 78641 is located to the north of Cedar Park and northeast end of Lake Travis.
            </p>

            <p>
              The{' '}
              <Link href="/zip-codes/78645" className="text-spyglass-orange hover:text-red-700 font-medium">78645</Link>{' '}
              zip code is bordered by the Balcones Canyonlands Wildlife Refuge to the north and Lake Travis on the south. This Austin zip code is located in the west of Cedar Park. Nearby communities and neighborhoods in the area are Lago Vista, Jonestown, Point Venture, The Hollows, and Highland Lakes Estates. 78645 is a zip code that will make every day feel like you&apos;re on a vacation with various amenities for relaxation in the area. Residents can enjoy hiking at the Balcones Canyonlands. Water sports are readily available at Lake Travis.
            </p>

            <p>
              Manchaca&apos;s{' '}
              <Link href="/zip-codes/78652" className="text-spyglass-orange hover:text-red-700 font-medium">78652</Link>{' '}
              is known as the &quot;Way South Awesome&quot; to the locals. Get away from the hustle and bustle of the city in this neighborhood with an easygoing feel. Despite being a retreat from the big city, the neighboring areas of Buda and South Austin are still close enough for residents to enjoy the best of Austin. Plenty of recreational areas can be found in South Austin such as Barton Springs and Barton Creek Greenbelt. Residents can enjoy Mary Moore Searight Metropolitan Park and Bauerle Ranch Park for some golf, fishing, and many more activities. Homes in 78652 Austin zip code features traditional, ranch-style houses.
            </p>

            <p>
              Located to the north of downtown Austin is{' '}
              <Link href="/zip-codes/78705" className="text-spyglass-orange hover:text-red-700 font-medium">78705</Link>,{' '}
              a popular place for residents that go to UT Austin. If you are looking for a peaceful place to live in Austin, add 78705 to your list. Single-family homes, bungalows, and historical homes are located at the West Campus. Major employers are also located within the zip code such as AT&amp;T and the State of Texas. This Austin zip code is located in Central Austin nearby Shoal Creek Greenbelt, the University of Texas, and I-35.
            </p>

            <p>
              <Link href="/zip-codes/78717" className="text-spyglass-orange hover:text-red-700 font-medium">78717</Link>{' '}
              is located to the southeast of Cedar Park. The suburban neighborhood features homes that were constructed in the 21st century. Major employers in the area are Apple and Oracle. 78717 is located in between Cedar Park in the far Northwest Austin and Round Rock. HEB Center at Cedar Park is home to the NBA Development League Austin Spurs and NHL affiliate Texas Stars.
            </p>

            <p>
              Located in East Austin,{' '}
              <Link href="/zip-codes/78721" className="text-spyglass-orange hover:text-red-700 font-medium">78721</Link>{' '}
              covers Airport Boulevard and East Martin Luther King, Jr Boulevard. The Austin zip code is one of the growing regions in Austin where the population remains to grow. Homes in 78721 includes contemporary homes, traditional ranch-style homes, and craftsman homes.
            </p>

            <p className="font-medium text-gray-700">
              Continue your search through our Austin Zip Code Lookup to find relevant listings for homes, condos, and lots located in Austin, Texas.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}