// Austin Zip Codes Data - Focused on specific zip codes for the interactive zip code finder

export interface ZipCodeData {
  zipCode: string;
  name: string; // Neighborhood/area name
  slug: string;
  county: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  polygon: Array<{ lat: number; lng: number }>;
  description: string;
  neighborhoods: string[];
  // Market data placeholders - these would come from your Pulse app or MLS API
  marketData?: {
    activeListings: number;
    medianPrice: number;
    pricePerSqft: number;
    avgDaysOnMarket: number;
    marketTemperature: 'hot' | 'warm' | 'cool' | 'cold';
  };
}

// All Austin area zip codes
export const AUSTIN_ZIP_CODES: ZipCodeData[] = [
  {
    zipCode: '78613',
    name: 'Cedar Park',
    slug: '78613',
    county: 'Travis/Williamson',
    coordinates: { lat: 30.5052, lng: -97.8203 },
    polygon: [
      { lat: 30.5252, lng: -97.8503 },
      { lat: 30.5252, lng: -97.7903 },
      { lat: 30.4852, lng: -97.7903 },
      { lat: 30.4852, lng: -97.8503 },
    ],
    description: "78613 is Cedar Park's zip code. This is one of the fastest-growing Austin suburbs. Aside from one of the cities with the lowest crime rates, 78613 has large employers such as Cedar Park Regional Medical Center and National Oilwell Varco. Homes in this Austin zip code vary from traditional to contemporary and modern builds.",
    neighborhoods: ['Avery Ranch', 'Anderson Mill', 'Brushy Creek', 'Twin Creeks', 'Ranch at Brushy Creek'],
  },
  {
    zipCode: '78617',
    name: 'Del Valle',
    slug: '78617',
    county: 'Travis',
    coordinates: { lat: 30.1563, lng: -97.6083 },
    polygon: [
      { lat: 30.1863, lng: -97.6383 },
      { lat: 30.1863, lng: -97.5783 },
      { lat: 30.1263, lng: -97.5783 },
      { lat: 30.1263, lng: -97.6383 },
    ],
    description: "One of the thriving zip codes in greater Austin is Del Valle's 78617 located to the east of Austin-Bergstrom International Airport. Residents in the area enjoy the combination of country living with the entertainment of a city. Popular attractions in 78617 are Circuit of Americas and Austin360 Amphitheater.",
    neighborhoods: ['Del Valle', 'Kellam', 'Creedmoor', 'Mustang Ridge'],
  },
  {
    zipCode: '78620',
    name: 'Dripping Springs',
    slug: '78620',
    county: 'Hays',
    coordinates: { lat: 30.1902, lng: -98.0868 },
    polygon: [
      { lat: 30.2202, lng: -98.1168 },
      { lat: 30.2202, lng: -98.0568 },
      { lat: 30.1602, lng: -98.0568 },
      { lat: 30.1602, lng: -98.1168 },
    ],
    description: "78620 is located in the southwest of Austin that covers Dripping Springs and goes as far as the Hamilton Pool. A popular community in the area is Arrowhead Ranch that features outstanding amenities and green spaces that surround each home. 78620 is located nearby the hill country towns of Driftwood, Wimberley, and Johnson City.",
    neighborhoods: ['Arrowhead Ranch', 'Ranches at Hamilton Pool', 'Caliterra', 'Headwaters'],
  },
  {
    zipCode: '78628',
    name: 'Georgetown',
    slug: '78628',
    county: 'Williamson',
    coordinates: { lat: 30.6333, lng: -97.6770 },
    polygon: [
      { lat: 30.6633, lng: -97.7070 },
      { lat: 30.6633, lng: -97.6470 },
      { lat: 30.6033, lng: -97.6470 },
      { lat: 30.6033, lng: -97.7070 },
    ],
    description: "For a charming town that offers big city amenities, Georgetown's 78628 is one Austin zip code to watch. Georgetown was on top of the list of Top Places to Live and Launch a Small Business. The area includes three different golf courses: Berry Creek Country Club, Georgetown Country Club, and Jack Nicklaus signature Cimarron Hills.",
    neighborhoods: ['Berry Creek', 'Cimarron Hills', 'Sun City', 'Georgetown Village', 'Serenada'],
  },
  {
    zipCode: '78641',
    name: 'Leander',
    slug: '78641',
    county: 'Williamson',
    coordinates: { lat: 30.5788, lng: -97.8531 },
    polygon: [
      { lat: 30.6088, lng: -97.8831 },
      { lat: 30.6088, lng: -97.8231 },
      { lat: 30.5488, lng: -97.8231 },
      { lat: 30.5488, lng: -97.8831 },
    ],
    description: "78641 homes feature several residential and commercial hubs. This North Austin zip code has become a place for healthcare, tech, and various booming industries with plenty of opportunities for Austinites. Homes in 78641 are also affordable and peaceful making it one of the most ideal places to live and work in.",
    neighborhoods: ['Leander', 'Crystal Falls', 'Travisso', 'Mason Hills', 'Sarita Valley'],
  },
  {
    zipCode: '78645',
    name: 'Lago Vista / Jonestown',
    slug: '78645',
    county: 'Travis',
    coordinates: { lat: 30.4631, lng: -97.9889 },
    polygon: [
      { lat: 30.4931, lng: -98.0189 },
      { lat: 30.4931, lng: -97.9589 },
      { lat: 30.4331, lng: -97.9589 },
      { lat: 30.4331, lng: -98.0189 },
    ],
    description: "The 78645 zip code is bordered by the Balcones Canyonlands Wildlife Refuge to the north and Lake Travis on the south. Nearby communities are Lago Vista, Jonestown, Point Venture, The Hollows, and Highland Lakes Estates. 78645 will make every day feel like you're on vacation with various amenities for relaxation.",
    neighborhoods: ['Lago Vista', 'Jonestown', 'Point Venture', 'The Hollows', 'Highland Lakes Estates'],
  },
  {
    zipCode: '78652',
    name: 'Manchaca',
    slug: '78652',
    county: 'Travis',
    coordinates: { lat: 30.1419, lng: -97.8328 },
    polygon: [
      { lat: 30.1719, lng: -97.8628 },
      { lat: 30.1719, lng: -97.8028 },
      { lat: 30.1119, lng: -97.8028 },
      { lat: 30.1119, lng: -97.8628 },
    ],
    description: "Manchaca's 78652 is known as the \"Way South Awesome\" to the locals. Get away from the hustle and bustle in this neighborhood with an easygoing feel. Despite being a retreat from the big city, the neighboring areas of Buda and South Austin are still close enough for residents to enjoy the best of Austin.",
    neighborhoods: ['Manchaca', 'Shady Hollow', 'Bauerle Ranch'],
  },
  {
    zipCode: '78701',
    name: 'Downtown Austin',
    slug: '78701',
    county: 'Travis',
    coordinates: { lat: 30.2672, lng: -97.7431 },
    polygon: [
      { lat: 30.2822, lng: -97.7581 },
      { lat: 30.2822, lng: -97.7281 },
      { lat: 30.2522, lng: -97.7281 },
      { lat: 30.2522, lng: -97.7581 },
    ],
    description: "Experience the vibrant and lively life of Downtown Austin at 78701. This is the heart of the city, home to the Texas State Capitol, Sixth Street entertainment district, and world-class dining. High-rise condos and urban living define this zip code, with Lady Bird Lake just steps away.",
    neighborhoods: ['Downtown', 'Rainey Street', 'Sixth Street District', 'Congress Avenue', 'Warehouse District'],
  },
  {
    zipCode: '78702',
    name: 'East Austin',
    slug: '78702',
    county: 'Travis',
    coordinates: { lat: 30.2617, lng: -97.7161 },
    polygon: [
      { lat: 30.2817, lng: -97.7361 },
      { lat: 30.2817, lng: -97.6961 },
      { lat: 30.2417, lng: -97.6961 },
      { lat: 30.2417, lng: -97.7361 },
    ],
    description: "78702 is an upcoming community that reflects the diverse culture and artistry of the residents. East Austin has become one of Austin's hottest neighborhoods with a thriving food and art scene, craft breweries, and vibrant nightlife along East 6th Street and East Cesar Chavez.",
    neighborhoods: ['East Cesar Chavez', 'Holly', 'Govalle', 'East 6th Street', 'Plaza Saltillo'],
  },
  {
    zipCode: '78703',
    name: 'West Austin / Tarrytown',
    slug: '78703',
    county: 'Travis',
    coordinates: { lat: 30.2979, lng: -97.7736 },
    polygon: [
      { lat: 30.3179, lng: -97.7936 },
      { lat: 30.3179, lng: -97.7536 },
      { lat: 30.2779, lng: -97.7536 },
      { lat: 30.2779, lng: -97.7936 },
    ],
    description: "Find homes to the west of Austin's urban core in 78703, which includes neighborhoods such as Tarrytown, Crestview, and parts of Lake Austin. This area features some of Austin's most prestigious homes with tree-lined streets, proximity to downtown, and access to Lake Austin waterfront.",
    neighborhoods: ['Tarrytown', 'Bryker Woods', 'Old Enfield', 'Pemberton Heights', 'Deep Eddy'],
  },
  {
    zipCode: '78704',
    name: 'South Austin - SoCo & Barton Hills',
    slug: '78704',
    county: 'Travis',
    coordinates: { lat: 30.2379, lng: -97.7722 },
    polygon: [
      { lat: 30.2520, lng: -97.7900 },
      { lat: 30.2520, lng: -97.7500 },
      { lat: 30.2200, lng: -97.7500 },
      { lat: 30.2200, lng: -97.7900 },
    ],
    description: '78704 is the hottest neighborhood in Austin that is a reflection of the "Keep Austin Weird" slogan. Discover homes and condos in 78704 which includes Bouldin Creek, Barton Hills, Travis Heights, and South Lamar. This area is famous for its eclectic mix of music venues, local eateries, and vibrant community.',
    neighborhoods: ['Barton Hills', 'Travis Heights', 'South Lamar', 'Zilker', 'Bouldin Creek'],
    marketData: {
      activeListings: 45,
      medianPrice: 895000,
      pricePerSqft: 425,
      avgDaysOnMarket: 28,
      marketTemperature: 'warm',
    },
  },
  {
    zipCode: '78705',
    name: 'Central Austin - West Campus & Clarksville',
    slug: '78705',
    county: 'Travis',
    coordinates: { lat: 30.2941, lng: -97.7491 },
    polygon: [
      { lat: 30.3100, lng: -97.7700 },
      { lat: 30.3100, lng: -97.7300 },
      { lat: 30.2800, lng: -97.7300 },
      { lat: 30.2800, lng: -97.7700 },
    ],
    description: "Located to the north of downtown Austin is 78705, a popular place for residents that go to UT Austin. Single-family homes, bungalows, and historical homes are located at the West Campus. Major employers are also located within the zip code such as AT&T and the State of Texas. This Austin zip code is located in Central Austin nearby Shoal Creek Greenbelt, the University of Texas, and I-35.",
    neighborhoods: ['West Campus', 'Clarksville', 'Old West Austin', 'Pease Park', 'Shoal Creek'],
    marketData: {
      activeListings: 32,
      medianPrice: 1150000,
      pricePerSqft: 520,
      avgDaysOnMarket: 22,
      marketTemperature: 'hot',
    },
  },
  {
    zipCode: '78717',
    name: 'Brushy Creek',
    slug: '78717',
    county: 'Williamson',
    coordinates: { lat: 30.4850, lng: -97.7570 },
    polygon: [
      { lat: 30.5050, lng: -97.7770 },
      { lat: 30.5050, lng: -97.7370 },
      { lat: 30.4650, lng: -97.7370 },
      { lat: 30.4650, lng: -97.7770 },
    ],
    description: "78717 is located to the southeast of Cedar Park. The suburban neighborhood features homes that were constructed in the 21st century. Major employers in the area are Apple and Oracle. 78717 is located in between Cedar Park in the far Northwest Austin and Round Rock. HEB Center at Cedar Park is home to the Austin Spurs and Texas Stars.",
    neighborhoods: ['Brushy Creek', 'Avery Ranch South', 'Ranch at Brushy Creek', 'Sendero Springs'],
  },
  {
    zipCode: '78721',
    name: 'East Austin',
    slug: '78721',
    county: 'Travis',
    coordinates: { lat: 30.2686, lng: -97.6908 },
    polygon: [
      { lat: 30.2886, lng: -97.7108 },
      { lat: 30.2886, lng: -97.6708 },
      { lat: 30.2486, lng: -97.6708 },
      { lat: 30.2486, lng: -97.7108 },
    ],
    description: "Located in East Austin, 78721 covers Airport Boulevard and East Martin Luther King, Jr Boulevard. The Austin zip code is one of the growing regions in Austin where the population continues to grow. Homes in 78721 include contemporary homes, traditional ranch-style homes, and craftsman homes.",
    neighborhoods: ['East Austin', 'MLK', 'Airport Boulevard', 'Govalle'],
  },
  {
    zipCode: '78722',
    name: 'Cherrywood / Mueller',
    slug: '78722',
    county: 'Travis',
    coordinates: { lat: 30.2912, lng: -97.7155 },
    polygon: [
      { lat: 30.3012, lng: -97.7255 },
      { lat: 30.3012, lng: -97.7055 },
      { lat: 30.2812, lng: -97.7055 },
      { lat: 30.2812, lng: -97.7255 },
    ],
    description: "78722 encompasses the charming Cherrywood neighborhood and parts of the award-winning Mueller development. This close-in East Austin area offers walkable streets, local coffee shops, and easy access to downtown. Mueller features new-urbanist design with shops, restaurants, and parks.",
    neighborhoods: ['Cherrywood', 'Mueller', 'French Place', 'Delwood'],
  },
  {
    zipCode: '78723',
    name: 'Windsor Park',
    slug: '78723',
    county: 'Travis',
    coordinates: { lat: 30.3073, lng: -97.6923 },
    polygon: [
      { lat: 30.3273, lng: -97.7123 },
      { lat: 30.3273, lng: -97.6723 },
      { lat: 30.2873, lng: -97.6723 },
      { lat: 30.2873, lng: -97.7123 },
    ],
    description: "78723 covers the Windsor Park area of East Austin, offering an eclectic mix of mid-century homes and new construction. This neighborhood has seen significant growth with new restaurants, shops, and community gardens. Bartholomew District Park provides green space and recreation.",
    neighborhoods: ['Windsor Park', 'University Hills', 'Bartholomew', 'Mueller East'],
  },
  {
    zipCode: '78724',
    name: 'East Austin',
    slug: '78724',
    county: 'Travis',
    coordinates: { lat: 30.2963, lng: -97.6370 },
    polygon: [
      { lat: 30.3263, lng: -97.6670 },
      { lat: 30.3263, lng: -97.6070 },
      { lat: 30.2663, lng: -97.6070 },
      { lat: 30.2663, lng: -97.6670 },
    ],
    description: "78724 is located in far East Austin, offering affordable housing options with a mix of rural and suburban feel. The area features larger lots and new developments. Walter E. Long Metropolitan Park and its lake provide excellent recreation including fishing, camping, and trails.",
    neighborhoods: ['Colony Park', 'Hornsby Bend', 'Walter E. Long Lake', 'Pioneer Crossing'],
  },
  {
    zipCode: '78726',
    name: 'Northwest Hills',
    slug: '78726',
    county: 'Travis',
    coordinates: { lat: 30.4319, lng: -97.8339 },
    polygon: [
      { lat: 30.4519, lng: -97.8539 },
      { lat: 30.4519, lng: -97.8139 },
      { lat: 30.4119, lng: -97.8139 },
      { lat: 30.4119, lng: -97.8539 },
    ],
    description: "78726 encompasses the scenic Northwest Hills area of Austin, known for its rolling terrain and family-friendly communities. The area features top-rated schools in the Leander and Round Rock school districts, proximity to major tech employers, and quick access to 183A toll road and RM 620.",
    neighborhoods: ['Canyon Creek', 'Block House Creek', 'Grandview Hills'],
  },
  {
    zipCode: '78728',
    name: 'Wells Branch',
    slug: '78728',
    county: 'Travis/Williamson',
    coordinates: { lat: 30.4530, lng: -97.6797 },
    polygon: [
      { lat: 30.4730, lng: -97.6997 },
      { lat: 30.4730, lng: -97.6597 },
      { lat: 30.4330, lng: -97.6597 },
      { lat: 30.4330, lng: -97.6997 },
    ],
    description: "78728 covers the Wells Branch area in North Austin, a well-established community known for its MUD (Municipal Utility District) that provides a recreation center, pool, and extensive trail system. The area offers affordable housing near major employers along the I-35 and Parmer Lane tech corridors.",
    neighborhoods: ['Wells Branch', 'Springbrook', 'Bratton Hill'],
  },
  {
    zipCode: '78731',
    name: 'Northwest Austin / Allandale',
    slug: '78731',
    county: 'Travis',
    coordinates: { lat: 30.3497, lng: -97.7621 },
    polygon: [
      { lat: 30.3697, lng: -97.7821 },
      { lat: 30.3697, lng: -97.7421 },
      { lat: 30.3297, lng: -97.7421 },
      { lat: 30.3297, lng: -97.7821 },
    ],
    description: "View the stunning neighborhoods within 78731 where one of the most desirable neighborhoods, Allandale, is located. This zip code offers a mix of mid-century charm and modern living with proximity to downtown Austin, top-rated schools, and access to Shoal Creek and Bull Creek trails.",
    neighborhoods: ['Allandale', 'Northwest Hills', 'Cat Mountain', 'Highland Park West'],
  },
  {
    zipCode: '78732',
    name: 'Steiner Ranch',
    slug: '78732',
    county: 'Travis',
    coordinates: { lat: 30.3753, lng: -97.8964 },
    polygon: [
      { lat: 30.3953, lng: -97.9164 },
      { lat: 30.3953, lng: -97.8764 },
      { lat: 30.3553, lng: -97.8764 },
      { lat: 30.3553, lng: -97.9164 },
    ],
    description: "78732 is home to the master-planned community of Steiner Ranch, one of Austin's most popular family-friendly neighborhoods. Situated along the shores of Lake Austin and Lake Travis, the area offers stunning hill country views, excellent LISD schools, community pools, parks, and miles of trails.",
    neighborhoods: ['Steiner Ranch', 'River Dance', 'Emerald Ridge'],
  },
  {
    zipCode: '78733',
    name: 'Bee Cave Area',
    slug: '78733',
    county: 'Travis',
    coordinates: { lat: 30.3164, lng: -97.8712 },
    polygon: [
      { lat: 30.3364, lng: -97.8912 },
      { lat: 30.3364, lng: -97.8512 },
      { lat: 30.2964, lng: -97.8512 },
      { lat: 30.2964, lng: -97.8912 },
    ],
    description: "78733 covers the scenic Bee Cave area west of Austin, featuring hill country living at its finest. The area provides access to the Hill Country Galleria shopping center, proximity to Lake Travis, and some of Austin's most exclusive neighborhoods with large lots and luxury homes.",
    neighborhoods: ['Rob Roy', 'Barton Creek West', 'Seven Oaks'],
  },
  {
    zipCode: '78734',
    name: 'Lakeway',
    slug: '78734',
    county: 'Travis',
    coordinates: { lat: 30.3544, lng: -97.9417 },
    polygon: [
      { lat: 30.3844, lng: -97.9717 },
      { lat: 30.3844, lng: -97.9117 },
      { lat: 30.3244, lng: -97.9117 },
      { lat: 30.3244, lng: -97.9717 },
    ],
    description: "78734 encompasses the resort-style city of Lakeway on the shores of Lake Travis. Known for luxury waterfront homes, golf courses, and a relaxed lakeside lifestyle, Lakeway offers world-class amenities including the Lakeway Resort & Spa, multiple marinas, and the beautiful Flintrock Falls golf course.",
    neighborhoods: ['Lakeway', 'Flintrock Falls', 'Rough Hollow', 'Lakeway Highlands'],
  },
  {
    zipCode: '78735',
    name: 'Southwest Austin',
    slug: '78735',
    county: 'Travis',
    coordinates: { lat: 30.2625, lng: -97.8684 },
    polygon: [
      { lat: 30.2825, lng: -97.8884 },
      { lat: 30.2825, lng: -97.8484 },
      { lat: 30.2425, lng: -97.8484 },
      { lat: 30.2425, lng: -97.8884 },
    ],
    description: "78735 covers Southwest Austin, offering a blend of hill country living with urban convenience. The area features established neighborhoods, Barton Creek Country Club, and access to the Barton Creek Greenbelt. Residents enjoy proximity to the Hill Country Galleria and easy downtown access via MoPac.",
    neighborhoods: ['Barton Creek', 'Travis Country', 'Lost Creek', 'Westcreek'],
  },
  {
    zipCode: '78737',
    name: 'Circle C / Shady Hollow',
    slug: '78737',
    county: 'Travis/Hays',
    coordinates: { lat: 30.1756, lng: -97.8836 },
    polygon: [
      { lat: 30.2056, lng: -97.9136 },
      { lat: 30.2056, lng: -97.8536 },
      { lat: 30.1456, lng: -97.8536 },
      { lat: 30.1456, lng: -97.9136 },
    ],
    description: "78737 encompasses the growing area south of MoPac and west of I-35 including Shady Hollow and nearby developments. The area offers family-friendly communities with top-rated schools, hill country views, and access to outdoor recreation along the Barton Creek Greenbelt corridor.",
    neighborhoods: ['Shady Hollow', 'Thomas Springs', 'Belterra', 'Sweetwater'],
  },
  {
    zipCode: '78738',
    name: 'Bee Cave / Lakeway',
    slug: '78738',
    county: 'Travis',
    coordinates: { lat: 30.3205, lng: -97.9400 },
    polygon: [
      { lat: 30.3505, lng: -97.9700 },
      { lat: 30.3505, lng: -97.9100 },
      { lat: 30.2905, lng: -97.9100 },
      { lat: 30.2905, lng: -97.9700 },
    ],
    description: "78738 covers the Bee Cave and Lakeway area west of Austin, featuring upscale communities set in the Texas Hill Country. The area is home to the Hill Country Galleria, Falconhead Golf Club, and numerous master-planned communities with resort-style amenities.",
    neighborhoods: ['Bee Cave', 'Spanish Oaks', 'Falconhead', 'Lake Pointe'],
  },
  {
    zipCode: '78739',
    name: 'Southwest Austin',
    slug: '78739',
    county: 'Travis',
    coordinates: { lat: 30.2041, lng: -97.8648 },
    polygon: [
      { lat: 30.2241, lng: -97.8848 },
      { lat: 30.2241, lng: -97.8448 },
      { lat: 30.1841, lng: -97.8448 },
      { lat: 30.1841, lng: -97.8848 },
    ],
    description: "78739 is located in Southwest Austin and features the popular Circle C Ranch community and surrounding neighborhoods. The area offers excellent schools, community pools and parks, and the Lady Bird Johnson Wildflower Center. Residents enjoy a suburban feel with easy access to downtown.",
    neighborhoods: ['Circle C Ranch', 'Meridian', 'Covered Bridge', 'Escarpment Village'],
  },
  {
    zipCode: '78741',
    name: 'South Austin',
    slug: '78741',
    county: 'Travis',
    coordinates: { lat: 30.2265, lng: -97.7217 },
    polygon: [
      { lat: 30.2465, lng: -97.7417 },
      { lat: 30.2465, lng: -97.7017 },
      { lat: 30.2065, lng: -97.7017 },
      { lat: 30.2065, lng: -97.7417 },
    ],
    description: "78741 covers South Austin east of I-35, an area experiencing rapid growth and development. The zip code is near the Austin-Bergstrom International Airport and features a mix of affordable housing, new developments, and proximity to South Congress and East Riverside entertainment.",
    neighborhoods: ['East Riverside', 'Montopolis', 'Pleasant Valley', 'Parker Lane'],
  },
  {
    zipCode: '78744',
    name: 'Southeast Austin',
    slug: '78744',
    county: 'Travis',
    coordinates: { lat: 30.1828, lng: -97.7353 },
    polygon: [
      { lat: 30.2128, lng: -97.7653 },
      { lat: 30.2128, lng: -97.7053 },
      { lat: 30.1528, lng: -97.7053 },
      { lat: 30.1528, lng: -97.7653 },
    ],
    description: "78744 is located in Southeast Austin and offers some of the most affordable housing options in the Austin metro. The area features a diverse community, proximity to McKinney Falls State Park, and growing commercial development. Easy access to I-35 and Ben White Boulevard connects residents to the city.",
    neighborhoods: ['McKinney Falls', 'Onion Creek', 'Dove Springs', 'Southpark Meadows'],
  },
  {
    zipCode: '78745',
    name: 'South Austin',
    slug: '78745',
    county: 'Travis',
    coordinates: { lat: 30.2041, lng: -97.7964 },
    polygon: [
      { lat: 30.2241, lng: -97.8164 },
      { lat: 30.2241, lng: -97.7764 },
      { lat: 30.1841, lng: -97.7764 },
      { lat: 30.1841, lng: -97.8164 },
    ],
    description: "78745 covers a large swath of South Austin, home to established neighborhoods near Garrison Park and West Gate. The area offers a mix of mid-century ranch homes and newer construction, with excellent access to South Lamar dining, Barton Creek Greenbelt hiking, and downtown Austin.",
    neighborhoods: ['Garrison Park', 'West Gate', 'Cherry Creek', 'Westgate'],
  },
  {
    zipCode: '78746',
    name: 'West Lake Hills',
    slug: '78746',
    county: 'Travis',
    coordinates: { lat: 30.2972, lng: -97.8234 },
    polygon: [
      { lat: 30.3172, lng: -97.8434 },
      { lat: 30.3172, lng: -97.8034 },
      { lat: 30.2772, lng: -97.8034 },
      { lat: 30.2772, lng: -97.8434 },
    ],
    description: "78746 encompasses the affluent cities of West Lake Hills and Rollingwood, among the most prestigious addresses in the Austin area. Known for top-rated Eanes ISD schools, stunning hill country views, and luxury estates. The area features the Barton Creek Country Club and exclusive gated communities.",
    neighborhoods: ['West Lake Hills', 'Rollingwood', 'Eanes', 'Davenport Ranch', 'Barton Creek'],
  },
  {
    zipCode: '78748',
    name: 'South Austin',
    slug: '78748',
    county: 'Travis',
    coordinates: { lat: 30.1700, lng: -97.8131 },
    polygon: [
      { lat: 30.1900, lng: -97.8331 },
      { lat: 30.1900, lng: -97.7931 },
      { lat: 30.1500, lng: -97.7931 },
      { lat: 30.1500, lng: -97.8331 },
    ],
    description: "78748 offers plenty of home styles such as mid-century designs and sizes of new homes. Ranches and planned communities are also within the zip code. Some neighborhoods in 78748 are Shady Hollow, Southland Oaks, Onion Creek, and South Slaughter. Great schools and family-friendly amenities abound.",
    neighborhoods: ['Shady Hollow', 'Southland Oaks', 'Onion Creek', 'South Slaughter', 'Bauerle Ranch'],
  },
  {
    zipCode: '78749',
    name: 'Circle C Ranch Area',
    slug: '78749',
    county: 'Travis',
    coordinates: { lat: 30.2166, lng: -97.8481 },
    polygon: [
      { lat: 30.2366, lng: -97.8681 },
      { lat: 30.2366, lng: -97.8281 },
      { lat: 30.1966, lng: -97.8281 },
      { lat: 30.1966, lng: -97.8681 },
    ],
    description: "Check out the prominent neighborhoods in 78749 that include Deer Haven, Circle C Ranch, Oak Park, Heights at Loma Vista, Legend Oaks, and Maple Run. This Southwest Austin zip code offers family-friendly communities, excellent schools, and proximity to the Barton Creek Greenbelt and Lady Bird Johnson Wildflower Center.",
    neighborhoods: ['Circle C Ranch', 'Deer Haven', 'Oak Park', 'Legend Oaks', 'Maple Run'],
  },
  {
    zipCode: '78750',
    name: 'Anderson Mill / Jollyville',
    slug: '78750',
    county: 'Travis/Williamson',
    coordinates: { lat: 30.4189, lng: -97.7972 },
    polygon: [
      { lat: 30.4389, lng: -97.8172 },
      { lat: 30.4389, lng: -97.7772 },
      { lat: 30.3989, lng: -97.7772 },
      { lat: 30.3989, lng: -97.8172 },
    ],
    description: "Fall in love with the beauty of a mix of suburban neighborhoods and master-planned communities at 78750 such as Bull Creek, Spicewood Vista, and Lakewood Park. The area offers established neighborhoods with mature trees, proximity to the Arboretum shopping district, and quick access to major employers.",
    neighborhoods: ['Anderson Mill', 'Jollyville', 'Spicewood Vista', 'Lakewood Park', 'Bull Creek'],
  },
  {
    zipCode: '78751',
    name: 'Hyde Park',
    slug: '78751',
    county: 'Travis',
    coordinates: { lat: 30.3102, lng: -97.7261 },
    polygon: [
      { lat: 30.3202, lng: -97.7361 },
      { lat: 30.3202, lng: -97.7161 },
      { lat: 30.3002, lng: -97.7161 },
      { lat: 30.3002, lng: -97.7361 },
    ],
    description: "78751 covers the beloved Hyde Park neighborhood, one of Austin's oldest and most charming residential areas. Known for its historic bungalows, tree-canopied streets, and strong community spirit, Hyde Park offers walkability to UT campus, local shops on Duval Street, and the iconic Shipe Park.",
    neighborhoods: ['Hyde Park', 'North University', 'Hancock', 'Ridgetop'],
  },
  {
    zipCode: '78752',
    name: 'North Loop / Highland',
    slug: '78752',
    county: 'Travis',
    coordinates: { lat: 30.3275, lng: -97.7102 },
    polygon: [
      { lat: 30.3475, lng: -97.7302 },
      { lat: 30.3475, lng: -97.6902 },
      { lat: 30.3075, lng: -97.6902 },
      { lat: 30.3075, lng: -97.7302 },
    ],
    description: "78752 covers the North Loop and Highland Mall areas of Austin, a neighborhood undergoing exciting transformation. The area is home to Austin Community College's Highland campus redevelopment and features eclectic shops, vintage stores, and local restaurants along North Loop Boulevard.",
    neighborhoods: ['North Loop', 'Highland', 'Coronado Hills', 'North Acres'],
  },
  {
    zipCode: '78753',
    name: 'North Austin',
    slug: '78753',
    county: 'Travis',
    coordinates: { lat: 30.3756, lng: -97.6797 },
    polygon: [
      { lat: 30.3956, lng: -97.6997 },
      { lat: 30.3956, lng: -97.6597 },
      { lat: 30.3556, lng: -97.6597 },
      { lat: 30.3556, lng: -97.6997 },
    ],
    description: "78753 is a diverse and affordable North Austin zip code with a strong sense of community. The area features a mix of apartment communities and single-family homes, proximity to the Domain and major tech employers, and excellent access to I-35 and US-183 for commuting.",
    neighborhoods: ['Georgian Acres', 'Copperfield', 'Quail Creek', 'Walnut Creek'],
  },
  {
    zipCode: '78754',
    name: 'Northeast Austin',
    slug: '78754',
    county: 'Travis',
    coordinates: { lat: 30.3561, lng: -97.6417 },
    polygon: [
      { lat: 30.3761, lng: -97.6617 },
      { lat: 30.3761, lng: -97.6217 },
      { lat: 30.3361, lng: -97.6217 },
      { lat: 30.3361, lng: -97.6617 },
    ],
    description: "78754 is located in Northeast Austin, an area seeing new development and growth. The Samsung semiconductor facility and other tech employers are nearby. The area features access to Walter E. Long Metropolitan Park and is positioned for significant appreciation as East Austin continues to expand.",
    neighborhoods: ['Samsung Corridor', 'Harris Branch', 'Dessau', 'Pioneer Hills'],
  },
  {
    zipCode: '78756',
    name: 'Rosedale / Brentwood',
    slug: '78756',
    county: 'Travis',
    coordinates: { lat: 30.3289, lng: -97.7444 },
    polygon: [
      { lat: 30.3389, lng: -97.7544 },
      { lat: 30.3389, lng: -97.7344 },
      { lat: 30.3189, lng: -97.7344 },
      { lat: 30.3189, lng: -97.7544 },
    ],
    description: "78756 covers the sought-after Rosedale and Brentwood neighborhoods in Central Austin. These tree-lined communities offer charming mid-century homes, walkability to local shops and restaurants along Burnet Road, proximity to The Triangle development, and quick downtown access via MoPac or Lamar.",
    neighborhoods: ['Rosedale', 'Brentwood', 'The Triangle', 'Shoalmont'],
  },
  {
    zipCode: '78757',
    name: 'Crestview / Allandale',
    slug: '78757',
    county: 'Travis',
    coordinates: { lat: 30.3500, lng: -97.7350 },
    polygon: [
      { lat: 30.3700, lng: -97.7550 },
      { lat: 30.3700, lng: -97.7150 },
      { lat: 30.3300, lng: -97.7150 },
      { lat: 30.3300, lng: -97.7550 },
    ],
    description: "78757 encompasses Crestview and parts of Allandale, two of Central Austin's most desirable neighborhoods. Known for the Crestview MetroRail station, vintage shops along Burnet Road, and charming 1950s ranch homes. The area has become a foodie destination with numerous acclaimed restaurants.",
    neighborhoods: ['Crestview', 'Allandale', 'Brentwood', 'Wooten'],
  },
  {
    zipCode: '78758',
    name: 'North Austin',
    slug: '78758',
    county: 'Travis',
    coordinates: { lat: 30.3908, lng: -97.7139 },
    polygon: [
      { lat: 30.4108, lng: -97.7339 },
      { lat: 30.4108, lng: -97.6939 },
      { lat: 30.3708, lng: -97.6939 },
      { lat: 30.3708, lng: -97.7339 },
    ],
    description: "78758 is located in North Austin near the Domain, Austin's second downtown. This area offers a mix of established neighborhoods and new development, proximity to major tech employers including Apple, IBM, and Dell, and the vibrant shopping, dining, and entertainment of the Domain and Rock Rose districts.",
    neighborhoods: ['North Austin', 'The Domain', 'Gracywoods', 'Quail Hollow'],
  },
  {
    zipCode: '78759',
    name: 'Great Hills / Bull Creek',
    slug: '78759',
    county: 'Travis',
    coordinates: { lat: 30.4047, lng: -97.7642 },
    polygon: [
      { lat: 30.4247, lng: -97.7842 },
      { lat: 30.4247, lng: -97.7442 },
      { lat: 30.3847, lng: -97.7442 },
      { lat: 30.3847, lng: -97.7842 },
    ],
    description: "Located at 78759 are the neighborhoods of Bull Creek, Jollyville, and Great Hills. The Domain, a large shopping center consisting of stores, restaurants, and a hotel are also within the zipcode. The area features top-rated RRISD schools, access to the Arboretum, and beautiful Bull Creek greenbelt trails.",
    neighborhoods: ['Great Hills', 'Bull Creek', 'Jollyville', 'Balcones Woods', 'Arboretum'],
  },
];

export function getZipCodeBySlug(slug: string): ZipCodeData | null {
  return AUSTIN_ZIP_CODES.find(zip => zip.slug === slug) || null;
}

export function getAllZipCodes(): ZipCodeData[] {
  return AUSTIN_ZIP_CODES;
}

// Utility function to get market temperature color
export function getMarketTempColor(temperature: string): string {
  switch (temperature) {
    case 'hot':
      return 'text-red-600';
    case 'warm':
      return 'text-orange-500';  
    case 'cool':
      return 'text-blue-500';
    case 'cold':
      return 'text-blue-800';
    default:
      return 'text-gray-600';
  }
}

// Utility function to get market temperature background
export function getMarketTempBg(temperature: string): string {
  switch (temperature) {
    case 'hot':
      return 'bg-red-50 border-red-200';
    case 'warm':
      return 'bg-orange-50 border-orange-200';
    case 'cool':
      return 'bg-blue-50 border-blue-200';
    case 'cold':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}
