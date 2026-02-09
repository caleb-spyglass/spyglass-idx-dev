/**
 * Rich descriptions for area-based communities (zip codes and cities).
 * Used on the community detail pages for SEO and user value.
 */

export interface AreaCommunityDescription {
  slug: string;
  /** Multi-paragraph description */
  description: string;
  /** Bullet-point highlights */
  highlights: string[];
  /** "Best For" tags */
  bestFor: string[];
  /** Nearby landmarks / points of interest */
  nearbyLandmarks: string[];
}

// ─── ZIP CODE DESCRIPTIONS ───────────────────────────────────────────────

export const zipDescriptions: Record<string, AreaCommunityDescription> = {
  'zip-78701': {
    slug: 'zip-78701',
    description: `The 78701 zip code covers the heart of Downtown Austin — from the Texas State Capitol and Sixth Street entertainment district to the shores of Lady Bird Lake. This is Austin's urban core, home to high-rise condominiums, luxury lofts, and walkable neighborhoods like the Warehouse District and Rainey Street.

Living in 78701 means trading a backyard for a skyline view. Residents enjoy world-class dining, live music seven nights a week, and unmatched walkability. Properties range from studio condos in the mid-$300Ks to penthouses above $3M. The area continues to transform with new development along Waller Creek and the Red River Cultural District.`,
    highlights: [
      'True walkable urban living — restaurants, bars, and culture at your doorstep',
      'Lady Bird Lake and the Butler Hike-and-Bike Trail steps away',
      'High-rise condominiums with panoramic views',
      'Home to Rainey Street, 6th Street, and the Warehouse District',
      'Texas State Capitol and major employers within walking distance',
    ],
    bestFor: ['Urban professionals', 'Empty nesters', 'Investors', 'Nightlife enthusiasts'],
    nearbyLandmarks: ['Texas State Capitol', 'Lady Bird Lake', 'Rainey Street', 'Sixth Street', 'Convention Center'],
  },
  'zip-78702': {
    slug: 'zip-78702',
    description: `78702 is the zip code that defines East Austin — one of the city's fastest-evolving and most creatively charged areas. Stretching east of I-35 from Holly Street to Airport Boulevard, this zip code encompasses neighborhoods like East Cesar Chavez, Holly, and Govalle. It's where Franklin Barbecue draws legendary lines and where craft breweries, taco trucks, and art galleries line every block.

Real estate in 78702 ranges from historic shotgun cottages and Craftsman bungalows to sleek modern townhomes and new condo developments. The diversity of housing stock attracts everyone from first-time buyers to investors. Proximity to downtown (often a 5-minute drive across I-35) and the area's independent, creative energy make 78702 one of Austin's most exciting zip codes.`,
    highlights: [
      'Austin\'s hottest food scene: Franklin BBQ, Suerte, Nixta Taqueria',
      'Thriving arts district with galleries and First Friday events',
      'Mix of historic homes and modern new construction',
      '5-minute commute to downtown Austin',
      'Rapidly appreciating real estate values',
    ],
    bestFor: ['Creatives', 'Foodies', 'Young professionals', 'Investors'],
    nearbyLandmarks: ['Franklin Barbecue', 'Meanwhile Brewing', 'Boggy Creek Greenbelt', 'East 6th Street', 'Huston-Tillotson University'],
  },
  'zip-78703': {
    slug: 'zip-78703',
    description: `78703 encompasses some of Austin's most prestigious and established neighborhoods — Tarrytown, Bryker Woods, and Old West Austin. Located between MoPac and downtown, these tree-canopied streets are lined with stately colonials, mid-century ranches, and modern custom homes on generous lots. Deep Eddy Pool, Red Bud Isle, and Lake Austin are all within easy reach.

This zip code is synonymous with old Austin elegance. Homes here command premium prices, often starting above $1M for updated properties. The area is served by highly rated AISD schools including Casis Elementary and Austin High School. Walkable to shops on Exposition Boulevard and West Lynn Street, 78703 offers a rare combination of established luxury and urban convenience.`,
    highlights: [
      'Premier neighborhoods: Tarrytown, Bryker Woods, Old West Austin',
      'Deep Eddy Pool and Red Bud Isle within walking distance',
      'Top-rated AISD schools: Casis Elementary, Austin High',
      'Mature tree canopy and generous lot sizes',
      'Walking distance to downtown and Lake Austin',
    ],
    bestFor: ['Families', 'Executives', 'Luxury home buyers', 'Dog owners'],
    nearbyLandmarks: ['Deep Eddy Pool', 'Red Bud Isle', 'Lake Austin', 'Tarrytown Pharmacy', 'Pease Park'],
  },
  'zip-78704': {
    slug: 'zip-78704',
    description: `78704 is the soul of South Austin — home to Zilker Park, Barton Springs Pool, South Congress Avenue, and Travis Heights. This iconic zip code stretches from Lady Bird Lake south through Bouldin Creek, South Lamar, and into the 78704 corridor that locals simply call "South Austin." It's where you'll find the "I love you so much" mural, the Continental Club, and some of the best food trailers in the city.

Real estate in 78704 spans charming 1940s bungalows, modern infill homes, and trendy condo developments. Prices reflect the area's desirability — the median sits well above the Austin average — but the lifestyle is hard to beat. Whether you're paddleboarding on Lady Bird Lake, grabbing breakfast at Jo's Coffee, or hiking the Barton Creek Greenbelt, 78704 delivers the quintessential Austin experience.`,
    highlights: [
      'Zilker Park, Barton Springs Pool, and Lady Bird Lake at your doorstep',
      'South Congress Avenue — Austin\'s most famous commercial strip',
      'Vibrant food and music scene: Continental Club, Jo\'s Coffee, Uchi',
      'Strong home value appreciation over the past decade',
      'Walkable and bikeable neighborhoods with local character',
    ],
    bestFor: ['Outdoor enthusiasts', 'Young professionals', 'Foodies', 'Culture seekers'],
    nearbyLandmarks: ['Zilker Park', 'Barton Springs Pool', 'South Congress Avenue', 'Continental Club', 'Lady Bird Lake'],
  },
  'zip-78705': {
    slug: 'zip-78705',
    description: `78705 surrounds the University of Texas at Austin campus, encompassing neighborhoods like Hyde Park, North Campus, and West Campus. This is Austin's academic hub — a dense, walkable area with a mix of student housing, historic bungalows, and new residential developments. The Drag (Guadalupe Street) serves as the main commercial corridor.

Beyond student rentals, 78705 offers charming owner-occupied homes in Hyde Park — one of Austin's first suburbs, established in 1891. Victorian cottages and Craftsman bungalows share tree-lined streets with neighborhood institutions like Avenue B Grocery and Shipe Park. For investors, the proximity to UT ensures strong rental demand year-round.`,
    highlights: [
      'Walking distance to University of Texas campus',
      'Historic Hyde Park neighborhood with Victorian and Craftsman homes',
      'Highly walkable with shops, restaurants, and transit access',
      'Strong rental market driven by UT students and faculty',
      'Avenue B Grocery, Epoch Coffee, and local favorites',
    ],
    bestFor: ['Investors', 'UT faculty & staff', 'Students', 'History buffs'],
    nearbyLandmarks: ['University of Texas', 'Hyde Park', 'Shipe Park', 'Avenue B Grocery', 'The Drag / Guadalupe St'],
  },
  'zip-78717': {
    slug: 'zip-78717',
    description: `78717 covers the popular Brushy Creek and Avery Ranch areas in northwest Austin/Cedar Park. This family-friendly zip code is known for its master-planned communities, excellent Williamson County schools, and abundant parks and trails. The Brushy Creek Regional Trail system connects residents to miles of hike-and-bike paths.

Housing in 78717 features well-maintained single-family homes from the 2000s and 2010s, with many neighborhoods offering community pools, playgrounds, and HOA-maintained common areas. The area provides easy access to US-183 and TX-45, making commutes to downtown Austin, the Domain, and Round Rock manageable.`,
    highlights: [
      'Master-planned communities with resort-style amenities',
      'Brushy Creek Regional Trail for hiking and biking',
      'Excellent Round Rock and Leander ISD schools',
      'Family-oriented neighborhoods with parks and pools',
      'Easy access to US-183, TX-45, and major employers',
    ],
    bestFor: ['Families', 'First-time buyers', 'Outdoor enthusiasts', 'Commuters'],
    nearbyLandmarks: ['Brushy Creek Regional Trail', 'Avery Ranch Golf Club', 'H-E-B Plus', 'Lake Creek Pool', 'Parmer Lane corridor'],
  },
  'zip-78719': {
    slug: 'zip-78719',
    description: `78719 lies in southeast Austin near Austin-Bergstrom International Airport and the Del Valle area. This zip code has historically offered some of the most affordable housing in the Austin metro, attracting first-time buyers and investors looking for value. The area is undergoing significant development as Austin grows southward.

The proximity to the airport, Tesla's Gigafactory, and the Circuit of the Americas Formula 1 track has sparked new interest and investment in 78719. New master-planned communities and commercial development are transforming the landscape while maintaining relatively affordable price points compared to central Austin.`,
    highlights: [
      'Affordable entry point to the Austin housing market',
      'Near Austin-Bergstrom International Airport',
      'Close to Tesla Gigafactory and Circuit of the Americas',
      'Rapid development and infrastructure improvements',
      'Strong investment potential as Austin expands south',
    ],
    bestFor: ['First-time buyers', 'Investors', 'Airport workers', 'Value seekers'],
    nearbyLandmarks: ['Austin-Bergstrom Airport', 'Circuit of the Americas', 'Tesla Gigafactory', 'McKinney Falls State Park', 'Del Valle'],
  },
  'zip-78721': {
    slug: 'zip-78721',
    description: `78721 covers the eastern portion of East Austin, including the Govalle and Johnston Terrace neighborhoods. Once one of Austin's most affordable areas, 78721 has seen significant appreciation as the East Austin renaissance spreads further from I-35. The zip code offers a mix of older ranch homes, renovated properties, and new construction.

The area retains a strong sense of community with neighborhood parks, community gardens, and local businesses. Govalle Park and the nearby Boggy Creek Greenbelt provide green space, while the emerging commercial corridor along East 7th Street brings new restaurants and shops to the area.`,
    highlights: [
      'East Austin location with strong appreciation potential',
      'Mix of affordable older homes and modern new builds',
      'Govalle Park and Boggy Creek Greenbelt nearby',
      'Growing restaurant and retail scene along East 7th',
      'Quick access to downtown Austin and Airport Boulevard',
    ],
    bestFor: ['First-time buyers', 'Investors', 'Young professionals', 'Value seekers'],
    nearbyLandmarks: ['Govalle Park', 'Boggy Creek Greenbelt', 'East 7th Street', 'Springdale General', 'Quickie Pickie'],
  },
  'zip-78722': {
    slug: 'zip-78722',
    description: `78722 is a small but highly desirable zip code east of I-35, covering the Cherrywood, French Place, and Upper Boggy Creek neighborhoods. Known for their walkability and proximity to both downtown and the University of Texas, these neighborhoods feature charming bungalows from the 1930s-1950s beneath a canopy of mature trees.

Cherrywood Coffeehouse is the neighborhood's beloved gathering spot, and the Cherrywood Art Fair draws crowds twice a year. The area is walkable to Mueller's retail and parks, and the Boggy Creek Greenbelt provides a shaded corridor through the neighborhood. 78722 offers a sweet spot of central location, neighborhood charm, and relatively accessible pricing for the core.`,
    highlights: [
      'Charming Cherrywood and French Place bungalows',
      'Walking distance to Mueller, UT, and downtown',
      'Cherrywood Coffeehouse and neighborhood art fairs',
      'Boggy Creek Greenbelt trail access',
      'Strong neighborhood identity and community events',
    ],
    bestFor: ['Young professionals', 'Couples', 'Bike commuters', 'UT faculty'],
    nearbyLandmarks: ['Cherrywood Coffeehouse', 'Mueller Lake Park', 'Boggy Creek Greenbelt', 'Vortex Theatre', 'Patterson Park'],
  },
  'zip-78723': {
    slug: 'zip-78723',
    description: `78723 covers the popular Windsor Park and Mueller neighborhoods in northeast central Austin. Mueller — built on the former Robert Mueller Municipal Airport — is one of Austin's premier master-planned communities with walkable retail, parks, and mixed housing. Windsor Park offers mid-century homes on spacious lots at more accessible price points.

This zip code hits a sweet spot: close to downtown (10-15 minutes), served by good Austin ISD schools, and anchored by Mueller's H-E-B, Alamo Drafthouse, and Thinkery children's museum. The Mueller Farmers' Market on Sundays is one of Austin's best. Housing ranges from $350K condos to $1M+ single-family homes in Mueller's custom-home sections.`,
    highlights: [
      'Mueller master-planned community with walkable retail',
      'Windsor Park mid-century homes at accessible prices',
      'Mueller H-E-B, Alamo Drafthouse, and Thinkery',
      'Sunday Mueller Farmers\' Market',
      '10-15 minute commute to downtown Austin',
    ],
    bestFor: ['Families', 'Young professionals', 'New construction buyers', 'Walkability enthusiasts'],
    nearbyLandmarks: ['Mueller Lake Park', 'Thinkery', 'Alamo Drafthouse Mueller', 'Bartholomew Pool', 'Dell Children\'s Medical Center'],
  },
  'zip-78724': {
    slug: 'zip-78724',
    description: `78724 is in far northeast Austin, encompassing the Colony Park and Pioneer Hills areas. This is one of Austin's most affordable zip codes, offering opportunities for first-time buyers and investors. The area features a mix of established neighborhoods and new development, with large lots and rural-feeling pockets that belie its Austin address.

The City of Austin has invested significantly in Colony Park with plans for a sustainable mixed-use development. Walter E. Long Lake (Decker Lake) provides boating, fishing, and outdoor recreation. As Austin continues to expand eastward, 78724 is positioned for growth while maintaining lower entry points.`,
    highlights: [
      'One of Austin\'s most affordable zip codes',
      'Walter E. Long Lake for boating and fishing',
      'Large lots and spacious properties',
      'Colony Park master plan bringing new investment',
      'Growing infrastructure and commercial development',
    ],
    bestFor: ['First-time buyers', 'Investors', 'Space seekers', 'Outdoor enthusiasts'],
    nearbyLandmarks: ['Walter E. Long Lake', 'Colony Park', 'Pioneer Hills', 'Decker Lane', 'SH-130 corridor'],
  },
  'zip-78725': {
    slug: 'zip-78725',
    description: `78725 is in southeast Austin, a transitional area that's experiencing new growth as Austin expands. The zip code offers affordable housing options and larger lots compared to central Austin. New subdivisions are being developed alongside established neighborhoods, creating a mix of housing options.

The area benefits from proximity to the Tesla Gigafactory and other major employers along SH-130. Several new master-planned communities are bringing modern homes and amenities to the area, making 78725 an increasingly attractive option for buyers who want to be in Austin's city limits without paying central Austin prices.`,
    highlights: [
      'Affordable housing within Austin city limits',
      'New master-planned communities under development',
      'Proximity to Tesla Gigafactory and SH-130 employers',
      'Larger lots and newer construction options',
      'Growing commercial and retail infrastructure',
    ],
    bestFor: ['First-time buyers', 'Commuters', 'Investors', 'New construction seekers'],
    nearbyLandmarks: ['Tesla Gigafactory', 'SH-130 toll corridor', 'Southeast Metropolitan Park', 'Austin-Bergstrom area', 'Elroy Road'],
  },
  'zip-78726': {
    slug: 'zip-78726',
    description: `78726 covers the Four Points area and Canyon Creek neighborhoods in northwest Austin. This well-established zip code sits at the intersection of RM 2222 and RM 620, providing access to Lake Travis, the Hill Country, and central Austin. The area features mature master-planned communities with excellent schools in both Austin ISD and Leander ISD.

Canyon Creek is one of the area's most popular neighborhoods, known for its tree-lined streets, community pool, and neighborhood feel. Four Points has become a commercial hub with grocery stores, restaurants, and retail. The area offers a balance of suburban comfort and Hill Country scenery while remaining within a reasonable commute to major employers.`,
    highlights: [
      'Well-established Four Points and Canyon Creek communities',
      'RM 620 and RM 2222 corridor access',
      'Top-rated schools in both AISD and Leander ISD',
      'Close to Lake Travis and Hill Country recreation',
      'Strong home value retention in mature neighborhoods',
    ],
    bestFor: ['Families', 'Outdoor enthusiasts', 'Lake Travis access', 'Established neighborhoods'],
    nearbyLandmarks: ['Canyon Creek pool', 'Four Points H-E-B', 'Lake Travis', 'RM 2222 corridor', 'River Place Nature Trail'],
  },
  'zip-78727': {
    slug: 'zip-78727',
    description: `78727 covers the Scofield Farms and Duval Road areas in far north-central Austin. This zip code offers some of the best value in the Austin metro for families seeking good schools, newer homes, and easy commuter access. Neighborhoods like Scofield Farms and Angus Valley provide well-maintained homes from the 1990s and 2000s.

The area sits at the intersection of MoPac and Parmer Lane, providing efficient access to the Domain, major tech employers along the MoPac corridor, and downtown Austin. Walnut Creek Metropolitan Park is nearby for hiking and mountain biking. The zip code is served by Austin ISD and Round Rock ISD, both offering strong educational options.`,
    highlights: [
      'Excellent value for north Austin families',
      'Scofield Farms and Duval neighborhoods',
      'Easy MoPac and Parmer Lane commuter access',
      'Close to the Domain and major tech employers',
      'Walnut Creek Metropolitan Park nearby',
    ],
    bestFor: ['Families', 'Tech workers', 'Value seekers', 'Commuters'],
    nearbyLandmarks: ['Walnut Creek Metropolitan Park', 'Scofield Farms pool', 'The Domain', 'Parmer Lane corridor', 'H-E-B Scofield'],
  },
  'zip-78728': {
    slug: 'zip-78728',
    description: `78728 encompasses the Wells Branch and North Austin neighborhoods along the IH-35 corridor north of Parmer Lane. Wells Branch is a well-established master-planned community with an active MUD (Municipal Utility District) that provides resort-style amenities including pools, parks, trails, and a recreation center — all funded by MUD taxes rather than HOA fees.

The zip code offers a range of housing from affordable condos and townhomes to larger single-family homes. The Wells Branch Trail system connects to the larger regional trail network, and the area's central north Austin location provides easy access to IH-35, US-183, and major employers in both Austin and Round Rock.`,
    highlights: [
      'Wells Branch MUD with resort-style community amenities',
      'Miles of hike-and-bike trails',
      'Affordable housing options including condos and townhomes',
      'Central north Austin location near IH-35 and US-183',
      'Community pools, parks, and recreation center',
    ],
    bestFor: ['Families', 'First-time buyers', 'Trail enthusiasts', 'Commuters'],
    nearbyLandmarks: ['Wells Branch Pool & Rec Center', 'Wells Branch Trail', 'Katherine Fleischer Park', 'Parmer Lane corridor', 'Stone Hill Town Center'],
  },
  'zip-78729': {
    slug: 'zip-78729',
    description: `78729 covers the Anderson Mill and Milwood neighborhoods in northwest Austin — an established area that offers solid mid-range housing with great access to both central Austin and the lakeside communities to the west. The Milwood community is particularly well-regarded for its neighborhood pool, park system, and active homeowner association.

This zip code sits along US-183 and RM 620, providing multiple commuter routes. The area has mature landscaping, established retail centers, and a neighborhood feel that comes from decades of community building. Anderson Mill Limited District maintains several community facilities, and the area feeds into quality schools in both Leander and Round Rock ISDs.`,
    highlights: [
      'Established Anderson Mill and Milwood communities',
      'Community pools, parks, and active neighborhood associations',
      'Multiple commuter routes: US-183, RM 620, MoPac',
      'Quality schools in Leander and Round Rock ISDs',
      'Mature neighborhoods with stable home values',
    ],
    bestFor: ['Families', 'Value seekers', 'Commuters', 'Established neighborhood fans'],
    nearbyLandmarks: ['Anderson Mill Pool', 'Milwood Park', 'US-183 corridor', 'Lakeline Mall area', 'Balcones District Park'],
  },
  'zip-78730': {
    slug: 'zip-78730',
    description: `78730 covers the River Place and Northwest Hills communities west of MoPac along RM 2222. This is some of the most dramatic terrain in the Austin area — homes perched on limestone bluffs with canyon views, tucked into mature Hill Country landscapes. River Place Country Club anchors the area with golf, tennis, and swimming.

The zip code offers a secluded, retreat-like atmosphere while remaining just 15-20 minutes from downtown. Homes range from the $500Ks for townhomes to multi-million-dollar custom estates. The River Place Nature Trail is one of Austin's best hikes. Schools are in Leander ISD, with Vandegrift High School emerging as one of the area's top-rated campuses.`,
    highlights: [
      'Dramatic Hill Country terrain with canyon views',
      'River Place Country Club with golf, tennis, swimming',
      'River Place Nature Trail — premier Austin hiking',
      'Leander ISD with top-rated Vandegrift High School',
      '15-20 minutes to downtown, secluded feel',
    ],
    bestFor: ['Families', 'Golf enthusiasts', 'Nature lovers', 'Privacy seekers'],
    nearbyLandmarks: ['River Place Country Club', 'River Place Nature Trail', 'RM 2222', 'Lake Austin', 'Four Points area'],
  },
  'zip-78731': {
    slug: 'zip-78731',
    description: `78731 includes the highly desirable Cat Mountain, Highland Park West, and Northwest Hills neighborhoods. This central west Austin zip code is coveted for its proximity to downtown (10-15 minutes), excellent schools, and beautiful Hill Country terrain. Many homes offer sweeping views of the surrounding hills and Lake Austin in the distance.

The area is anchored by strong Austin ISD schools and established neighborhoods with mature trees and spacious lots. Far West Boulevard provides neighborhood retail and dining, while the 360/Capital of Texas Highway corridor offers easy north-south access. Homes range from $500K condos to $3M+ custom estates in gated sections of Cat Mountain.`,
    highlights: [
      'Cat Mountain and Northwest Hills — premier central west Austin',
      'Hill Country views and mature landscaping',
      '10-15 minute commute to downtown',
      'Strong Austin ISD schools',
      'Far West retail corridor and neighborhood amenities',
    ],
    bestFor: ['Families', 'Professionals', 'View seekers', 'Central location lovers'],
    nearbyLandmarks: ['Cat Mountain', 'Far West Boulevard', 'Mt. Bonnell', 'Loop 360', 'Emma Long Metropolitan Park'],
  },
  'zip-78732': {
    slug: 'zip-78732',
    description: `78732 is home to Steiner Ranch, one of Austin's most popular and well-amenitized master-planned communities. Spread across 4,600 acres of Hill Country terrain along Lake Austin, Steiner Ranch offers resort-style living with multiple pools, a lakeside park, tennis courts, sports fields, and miles of trails.

Housing ranges from the mid-$400Ks for starter homes to $2M+ for luxury estates in gated sections like The Commons and River Dance. The community is served by Leander ISD with multiple schools within the neighborhood. Weekend life revolves around the lake, the trails, and the community amenity centers. The main trade-off is the commute along RM 620, though many residents consider it a worthwhile exchange.`,
    highlights: [
      'Steiner Ranch — Austin\'s premier master-planned community',
      'Resort-style amenities: multiple pools, lakeside park, sports courts',
      'Lake Austin access with boat ramp and shoreline parks',
      'Miles of Hill Country hike-and-bike trails',
      'Leander ISD schools within the community',
    ],
    bestFor: ['Families', 'Lake lovers', 'Active lifestyles', 'Community amenity seekers'],
    nearbyLandmarks: ['Lake Austin', 'Steiner Ranch Lakeside Amenity Center', 'RM 620', 'Hippie Hollow Park', 'River Place'],
  },
  'zip-78733': {
    slug: 'zip-78733',
    description: `78733 covers the Bee Cave and Spanish Oaks area west of Austin along Highway 71 and RM 620. This Hill Country zip code features luxury communities like Spanish Oaks, a private golf club community with stunning homes on large lots. The area offers a more rural, spacious feel while remaining within 20-25 minutes of downtown.

The Hill Country Galleria in nearby Bee Cave provides upscale shopping, dining, and entertainment. Lake Travis and the Hill Country wine trail are easily accessible. Schools fall under the highly rated Lake Travis ISD, making this area a magnet for families seeking top education and a Hill Country lifestyle.`,
    highlights: [
      'Spanish Oaks — exclusive private golf club community',
      'Hill Country luxury on large lots',
      'Lake Travis ISD — among the top districts in the metro',
      'Hill Country Galleria shopping and dining nearby',
      'Easy access to Lake Travis and wine trail',
    ],
    bestFor: ['Luxury buyers', 'Golf enthusiasts', 'Families', 'Hill Country lifestyle'],
    nearbyLandmarks: ['Spanish Oaks Golf Club', 'Hill Country Galleria', 'Bee Cave', 'Lake Travis', 'Highway 71 corridor'],
  },
  'zip-78734': {
    slug: 'zip-78734',
    description: `78734 encompasses the Lakeway area and surrounding communities along the south shore of Lake Travis. This is the heart of Austin's lake lifestyle — from the established Lakeway Resort and Spa to the newer Rough Hollow community with its private marina. The zip code offers everything from waterfront estates to family-friendly neighborhoods.

Lakeway's Town Center has added walkable retail and restaurants to the community. Lake Travis ISD schools, including the highly rated Lake Travis High School, serve the area. Weekend life revolves around the lake — boating, swimming, fishing, and sunset watching from waterfront restaurants. Hamilton Pool Preserve is a short drive south.`,
    highlights: [
      'Lake Travis waterfront and lake-view properties',
      'Lakeway Resort and Spa, Rough Hollow marina',
      'Lake Travis ISD — top-rated schools',
      'Lakeway Town Center with shops and restaurants',
      'Hamilton Pool Preserve and Hill Country recreation',
    ],
    bestFor: ['Lake lovers', 'Families', 'Retirees', 'Boaters'],
    nearbyLandmarks: ['Lake Travis', 'Lakeway Resort & Spa', 'Rough Hollow marina', 'Hamilton Pool Preserve', 'Lakeway Town Center'],
  },
  'zip-78735': {
    slug: 'zip-78735',
    description: `78735 covers the Circle C Ranch and Barton Creek communities in southwest Austin. Circle C is one of Austin's largest and most popular master-planned neighborhoods, known for its excellent schools, swim center, and extensive trail system. The neighboring Barton Creek community features luxury estates near the Barton Creek Country Club.

This zip code offers a range of price points — from the $400Ks in Circle C to multi-million-dollar properties in Barton Creek. The area is served by Austin ISD with well-regarded schools including Kiker and Mills elementary schools. MoPac provides a direct commute to downtown and north Austin, while the Barton Creek Greenbelt offers world-class hiking and swimming just minutes away.`,
    highlights: [
      'Circle C Ranch — large master-planned community with great amenities',
      'Barton Creek luxury estates near country club',
      'Excellent Austin ISD schools: Kiker, Mills, Bowie',
      'Extensive trail system and swim center',
      'Direct MoPac access to downtown',
    ],
    bestFor: ['Families', 'Outdoor enthusiasts', 'Community amenity seekers', 'Value in southwest Austin'],
    nearbyLandmarks: ['Circle C Swim Center', 'Barton Creek Country Club', 'Barton Creek Greenbelt', 'Bowie High School', 'Slaughter Lane retail'],
  },
  'zip-78736': {
    slug: 'zip-78736',
    description: `78736 covers the Oak Hill area and surrounding neighborhoods in southwest Austin where Highway 71 and US 290 converge (the "Y at Oak Hill"). This area has long been a gateway between Austin and the Hill Country, and it's experiencing a transformation with the ongoing Y at Oak Hill highway improvement project.

Housing ranges from established neighborhoods like Covered Bridge Ranch and Travis Country to newer developments pushing toward Dripping Springs. The area offers more affordable options than nearby Westlake and Barton Creek while still providing Hill Country character and Austin ISD schools. The Barton Creek Greenbelt's western trailheads are easily accessible.`,
    highlights: [
      'Oak Hill — gateway to the Hill Country',
      'More affordable than neighboring Westlake/Barton Creek',
      'Austin ISD schools including Bowie High School',
      'Barton Creek Greenbelt trailheads nearby',
      'Highway improvements bringing better traffic flow',
    ],
    bestFor: ['Families', 'Value seekers', 'Hill Country commuters', 'Outdoor enthusiasts'],
    nearbyLandmarks: ['Y at Oak Hill', 'Barton Creek Greenbelt', 'Covered Bridge Park', 'US-290 corridor', 'HWY 71'],
  },
  'zip-78737': {
    slug: 'zip-78737',
    description: `78737 covers the Dripping Springs and Belterra communities southwest of Austin. Belterra is a popular master-planned community that blends Hill Country aesthetics with family-friendly amenities, while the broader Dripping Springs area offers ranch properties, wineries, and a charming small-town downtown.

This zip code is where Austin meets the Hill Country. New communities continue to be developed along Highway 290, offering modern homes with Hill Country views. Dripping Springs ISD serves the area with well-regarded schools. Weekend life revolves around the wineries, breweries, and natural beauty that earned Dripping Springs its "Gateway to the Hill Country" nickname.`,
    highlights: [
      'Belterra master-planned community with resort amenities',
      'Gateway to Hill Country wineries and breweries',
      'Dripping Springs ISD — quality growing school district',
      'Ranch properties and acreage available',
      'Modern new construction with Hill Country views',
    ],
    bestFor: ['Families', 'Hill Country lovers', 'Space seekers', 'Wine and craft beer enthusiasts'],
    nearbyLandmarks: ['Belterra community', 'Jester King Brewery', 'Treaty Oak Distilling', 'Dripping Springs downtown', 'Hamilton Pool Preserve'],
  },
  'zip-78738': {
    slug: 'zip-78738',
    description: `78738 covers the Bee Cave and Lake Pointe communities along Highway 71 west of MoPac. This is a high-growth area that has transformed from rural Hill Country into a thriving suburban corridor with upscale shopping, dining, and master-planned communities. The Hill Country Galleria anchors the commercial core.

Lake Pointe, Falconhead, and The Backyard are among the popular residential communities in this zip code. The area falls within the Lake Travis ISD, one of the top school districts in the metro. Easy access to Lake Travis for boating and the Hill Country for weekend excursions makes 78738 appealing to families and professionals alike.`,
    highlights: [
      'Hill Country Galleria — upscale outdoor shopping and dining',
      'Lake Travis ISD — top-rated school district',
      'Popular communities: Lake Pointe, Falconhead',
      'Easy access to Lake Travis and Hill Country',
      'Growing commercial corridor with modern amenities',
    ],
    bestFor: ['Families', 'Executives', 'Lake access seekers', 'Upscale suburban living'],
    nearbyLandmarks: ['Hill Country Galleria', 'Lake Travis', 'Falconhead Golf Club', 'Highway 71 corridor', 'Bee Cave Central Park'],
  },
  'zip-78739': {
    slug: 'zip-78739',
    description: `78739 covers the Circle C, Shady Hollow, and Bauerle Ranch areas in south-southwest Austin along Slaughter Lane and MoPac. This is a well-established family-oriented area with strong neighborhoods, community pools, and good access to Austin ISD's well-regarded Bowie High School feeder pattern.

Shady Hollow is one of Austin's most popular HOA-managed communities with a golf course, multiple pools, and extensive amenities. Circle C extends into this zip code as well, offering its own set of community facilities. The area provides a suburban feel with the convenience of being 20-25 minutes from downtown via MoPac.`,
    highlights: [
      'Shady Hollow with golf course and community amenities',
      'Circle C neighborhood access and swim center',
      'Bowie High School feeder pattern — well-regarded AISD schools',
      'Established suburban neighborhoods with mature landscaping',
      '20-25 minute MoPac commute to downtown',
    ],
    bestFor: ['Families', 'Golfers', 'Suburban lifestyle seekers', 'South Austin professionals'],
    nearbyLandmarks: ['Shady Hollow Golf Course', 'Circle C Swim Center', 'Bowie High School', 'Slaughter Lane retail', 'Lady Bird Johnson Wildflower Center'],
  },
  'zip-78741': {
    slug: 'zip-78741',
    description: `78741 covers the Riverside and Oltorf areas in southeast central Austin. This zip code has undergone a remarkable transformation, driven by the South Shore development, Oracle's new campus, and the extension of the Riverside corridor. Once primarily student housing, the area is now attracting young professionals and major employers.

The zip code stretches from Lady Bird Lake south through Riverside Drive to Oltorf Street. New luxury apartments and mixed-use developments are reshaping the skyline along Riverside. The area offers some of the best value in central Austin for condos and townhomes, with excellent proximity to downtown, the Eastside, and South Austin.`,
    highlights: [
      'Rapid transformation with new development along Riverside',
      'Oracle campus bringing major employment to the area',
      'Best value for central Austin condos and apartments',
      'Lady Bird Lake and Roy G. Guerrero Park access',
      '5-10 minute commute to downtown Austin',
    ],
    bestFor: ['Young professionals', 'First-time buyers', 'Investors', 'Tech workers'],
    nearbyLandmarks: ['Oracle campus', 'Roy G. Guerrero Park', 'Lady Bird Lake', 'Riverside Drive', 'South Shore development'],
  },
  'zip-78742': {
    slug: 'zip-78742',
    description: `78742 covers the Montopolis area in southeast Austin along the Colorado River. This historically underserved neighborhood is experiencing new investment and attention as Austin's growth pushes east. The area offers some of the most affordable housing within Austin's urban core, with older homes on spacious lots.

The Colorado River and Roy G. Guerrero Park provide green space and outdoor recreation. The neighborhood has a strong sense of community with deep roots in Austin's history. As infrastructure improvements and new development continue, 78742 represents a significant opportunity for buyers seeking central Austin proximity at accessible prices.`,
    highlights: [
      'Affordable housing near Austin\'s urban core',
      'Colorado River and Roy G. Guerrero Park access',
      'Strong community with deep Austin roots',
      'Significant investment and improvement potential',
      'Close proximity to downtown and East Austin',
    ],
    bestFor: ['First-time buyers', 'Investors', 'Value seekers', 'Community-minded buyers'],
    nearbyLandmarks: ['Roy G. Guerrero Park', 'Colorado River', 'Montopolis Bridge', 'Airport Boulevard', 'Riverside Drive'],
  },
  'zip-78744': {
    slug: 'zip-78744',
    description: `78744 covers south-southeast Austin including the Southpark Meadows area and neighborhoods south of Ben White Boulevard. The area is anchored by the massive Southpark Meadows retail center, which provides extensive shopping and dining options. Established neighborhoods offer mid-range housing with good access to IH-35 and SH-71.

McKinney Falls State Park, one of Austin's hidden gems, lies within 78744, offering camping, swimming, and hiking along Onion Creek. The zip code provides a balance of affordability and access, with newer apartment complexes and townhome developments adding to the housing mix. Austin ISD and Del Valle ISD serve different portions of the area.`,
    highlights: [
      'Southpark Meadows — major retail and dining center',
      'McKinney Falls State Park for camping and hiking',
      'Mid-range pricing with good IH-35 and SH-71 access',
      'Mix of established neighborhoods and new development',
      'Growing commercial infrastructure',
    ],
    bestFor: ['Families', 'Value seekers', 'Outdoor enthusiasts', 'Commuters'],
    nearbyLandmarks: ['McKinney Falls State Park', 'Southpark Meadows', 'Onion Creek', 'SH-71 corridor', 'Stassney Lane'],
  },
  'zip-78745': {
    slug: 'zip-78745',
    description: `78745 covers the Garrison Park, Westgate, and South Manchaca areas — the working heart of South Austin. This zip code offers a classic South Austin vibe with neighborhood bars, taco joints, and a diverse mix of residents. Housing ranges from affordable 1960s-era ranch homes to newer infill developments and townhomes.

The area along South Lamar and Manchaca Road has experienced significant restaurant and retail growth. Garrison Park provides green space and community gathering areas. The zip code offers some of the best value in South Austin for buyers who want to be close to the 78704 lifestyle without paying 78704 prices. Austin ISD's Bowie and Crockett high schools serve the area.`,
    highlights: [
      'Classic South Austin character at accessible prices',
      'Growing restaurant scene along Manchaca and South Lamar',
      'Garrison Park and neighborhood green spaces',
      'Strong value compared to neighboring 78704',
      'Close to Barton Creek Greenbelt and Lady Bird Lake',
    ],
    bestFor: ['First-time buyers', 'Young professionals', 'South Austin enthusiasts', 'Value seekers'],
    nearbyLandmarks: ['Garrison Park', 'South Manchaca Road', 'Westgate shopping', 'South Lamar corridor', 'Mary Moore Searight Park'],
  },
  'zip-78746': {
    slug: 'zip-78746',
    description: `78746 is Austin's most prestigious zip code, encompassing Westlake Hills and Rollingwood — two incorporated cities known for their stunning Hill Country homes, exceptional schools, and proximity to both downtown and the great outdoors. The Eanes Independent School District, which serves this area, is consistently ranked among the top districts in Texas.

Homes in 78746 range from $800K updated ranches to $10M+ custom estates on multi-acre lots. The terrain is dramatic — rolling hills, towering oaks, and limestone outcroppings create a natural beauty that's hard to match. Wild Basin Wilderness Preserve, Emma Long Park, and the Barton Creek Greenbelt are all nearby. The Hill Country Galleria provides upscale shopping.`,
    highlights: [
      'Eanes ISD — consistently top-rated schools in Texas',
      'Westlake Hills and Rollingwood incorporated cities',
      'Stunning Hill Country estates on large lots',
      '15-minute commute to downtown via MoPac or Bee Cave Road',
      'Wild Basin Preserve and Barton Creek Greenbelt access',
    ],
    bestFor: ['Families', 'Executives', 'Top-school seekers', 'Luxury home buyers'],
    nearbyLandmarks: ['Westlake High School', 'Wild Basin Wilderness Preserve', 'Hill Country Galleria', 'Rollingwood City Park', 'Barton Creek Greenbelt'],
  },
  'zip-78747': {
    slug: 'zip-78747',
    description: `78747 covers the Slaughter Creek and South Manchaca areas in far south Austin. This zip code includes established communities as well as newer developments pushing south along IH-35 and Manchaca Road. The area offers relatively affordable single-family homes with good access to south Austin retail and dining corridors.

The Lady Bird Johnson Wildflower Center, one of Austin's most beloved botanical attractions, is located in 78747. The zip code provides a suburban feel while remaining within Austin's city limits. Slaughter Creek Trail offers hike-and-bike connections, and the area's schools are served by Austin ISD.`,
    highlights: [
      'Lady Bird Johnson Wildflower Center',
      'Affordable south Austin housing options',
      'Slaughter Creek Trail for hiking and biking',
      'Mix of established and new development',
      'Austin ISD schools with suburban feel',
    ],
    bestFor: ['Families', 'Value seekers', 'Nature lovers', 'South Austin commuters'],
    nearbyLandmarks: ['Lady Bird Johnson Wildflower Center', 'Slaughter Creek Trail', 'Manchaca Road', 'IH-35 corridor', 'Southpark Meadows'],
  },
  'zip-78748': {
    slug: 'zip-78748',
    description: `78748 covers the Shady Hollow, Maple Run, and South MoPac corridor in southwest Austin. This well-established area features mature neighborhoods with community amenities, good schools, and a convenient MoPac commute to downtown. Shady Hollow Golf Course provides a centerpiece for the area's most popular community.

The zip code offers solid mid-range housing in neighborhoods that have proven their value over decades. Access to the Lady Bird Johnson Wildflower Center, Slaughter Creek Trail, and the Veloway cycling trail make this area appealing for outdoor enthusiasts. The Bowie High School feeder pattern and strong neighborhood schools anchor the family appeal.`,
    highlights: [
      'Shady Hollow community with golf course and pools',
      'Established neighborhoods with proven home values',
      'MoPac commute to downtown and north Austin employers',
      'Veloway cycling trail and Slaughter Creek Trail',
      'Bowie High School feeder — strong AISD schools',
    ],
    bestFor: ['Families', 'Cyclists', 'Suburban comfort seekers', 'South Austin professionals'],
    nearbyLandmarks: ['Shady Hollow Golf Course', 'Veloway', 'Lady Bird Johnson Wildflower Center', 'Slaughter Lane retail', 'MoPac corridor'],
  },
  'zip-78749': {
    slug: 'zip-78749',
    description: `78749 covers southwest Austin communities along the MoPac and US 290 corridors, including parts of the Barton Creek area. This zip code features a mix of established neighborhoods from the 1980s and 1990s alongside newer developments. The area is well-served by Austin ISD, with the popular Bowie and Small Middle School feeder pattern.

The Barton Creek Greenbelt's western trailheads provide some of Austin's best hiking, and the neighborhood shopping centers along US 290 (William Cannon/Convict Hill area) offer everyday convenience. Homes range from the $300Ks for condos to $1M+ for larger single-family properties, making 78749 accessible to a range of buyers.`,
    highlights: [
      'Southwest Austin with Barton Creek Greenbelt access',
      'Austin ISD with Bowie High School feeder pattern',
      'Mix of established homes and newer development',
      'Accessible price range for southwest Austin',
      'Good retail and dining along US 290 and William Cannon',
    ],
    bestFor: ['Families', 'Outdoor enthusiasts', 'Southwest Austin commuters', 'Mid-range buyers'],
    nearbyLandmarks: ['Barton Creek Greenbelt', 'Bowie High School', 'US 290 corridor', 'Convict Hill Road', 'Circle C area'],
  },
  'zip-78750': {
    slug: 'zip-78750',
    description: `78750 covers the Anderson Mill and Jollyville areas in northwest Austin, straddling the Austin/Williamson County line. This established zip code offers a well-rounded suburban experience with mature trees, community amenities, and easy access to US-183, RM 620, and MoPac. The area is popular with families seeking quality schools and neighborhood stability.

Both Round Rock ISD and Leander ISD serve portions of 78750, providing families with strong educational options. The neighborhood retail along US-183 and Research Boulevard provides everyday convenience, while the Hill Country and Lake Travis are a short drive west. The Balcones District Park and neighborhood trails add recreational value.`,
    highlights: [
      'Established Anderson Mill and Jollyville neighborhoods',
      'Quality schools in Round Rock and Leander ISDs',
      'Easy access to US-183, RM 620, and MoPac',
      'Mature neighborhoods with stable home values',
      'Close to both the Domain and Lake Travis areas',
    ],
    bestFor: ['Families', 'Commuters', 'Value seekers', 'Established neighborhood fans'],
    nearbyLandmarks: ['Balcones District Park', 'Anderson Mill area', 'US-183 corridor', 'Lakeline Mall area', 'Lake Creek Trail'],
  },
  'zip-78751': {
    slug: 'zip-78751',
    description: `78751 covers the Rosedale, Brentwood, and North Central Austin neighborhoods — some of the city's most charming and family-friendly areas. These tree-lined streets feature well-maintained mid-century homes, active neighborhood associations, and a strong sense of community that's increasingly rare in fast-growing Austin.

The area is walkable to Burnet Road's booming restaurant scene (Barley Swine, Uchiko, Pinthouse Pizza) and the shops along North Lamar. Rosedale Park and Brentwood Park provide community green spaces with pools and playscapes. Austin ISD schools including Rosedale Elementary and McCallum High School serve the area. 78751 is where central Austin living meets genuine neighborhood charm.`,
    highlights: [
      'Rosedale and Brentwood — Austin\'s most charming neighborhoods',
      'Walking distance to Burnet Road restaurants: Barley Swine, Uchiko',
      'Tree-lined streets with mid-century character homes',
      'Active neighborhood associations and community events',
      'Central location: easy access to downtown, UT, and the Domain',
    ],
    bestFor: ['Families', 'Couples', 'Foodies', 'Neighborhood charm seekers'],
    nearbyLandmarks: ['Rosedale Park', 'Brentwood Park', 'Burnet Road dining', 'North Lamar', 'Ramsey Park pool'],
  },
  'zip-78752': {
    slug: 'zip-78752',
    description: `78752 covers north-central Austin neighborhoods including Windsor Hills, Delwood, and areas along Airport Boulevard and I-35. This zip code offers some of the best value in central Austin, with established neighborhoods that are experiencing revitalization and new development.

The area benefits from proximity to Highland Mall (being redeveloped as Austin Community College's Highland campus), the growing North Loop commercial district, and easy access to I-35 and US-183. Housing ranges from affordable mid-century homes to new construction townhomes. The St. John's and Georgian Acres areas are seeing new investment and community improvements.`,
    highlights: [
      'Central Austin value with revitalization underway',
      'ACC Highland campus redevelopment nearby',
      'Easy I-35 and US-183 commuter access',
      'Mix of affordable older homes and new townhomes',
      'Close to North Loop dining and retail district',
    ],
    bestFor: ['First-time buyers', 'Investors', 'Young professionals', 'Value seekers'],
    nearbyLandmarks: ['ACC Highland campus', 'Airport Boulevard corridor', 'North Loop district', 'Bartholomew Park', 'I-35 corridor'],
  },
  'zip-78753': {
    slug: 'zip-78753',
    description: `78753 covers North Austin neighborhoods including Copperfield, Quail Creek, and areas along the Rundberg and Braker Lane corridors. This diverse zip code offers some of the most affordable housing in the Austin metro while providing central location and good transit access.

The area features a vibrant international food scene along North Lamar, with authentic Vietnamese, Korean, Chinese, and Mexican restaurants drawing diners from across the city. The Chinatown Center and numerous Asian markets make this one of Austin's most culinarily diverse zip codes. New apartment developments and commercial improvements are reshaping the area's landscape.`,
    highlights: [
      'Affordable central Austin housing',
      'Incredible international dining along North Lamar',
      'Chinatown Center and diverse shopping options',
      'Good transit access with Capital Metro routes',
      'Ongoing revitalization and new development',
    ],
    bestFor: ['First-time buyers', 'Food adventurers', 'Value seekers', 'Investors'],
    nearbyLandmarks: ['Chinatown Center', 'North Lamar international dining', 'Quail Creek', 'Rundberg Lane', 'Walnut Creek Trail'],
  },
  'zip-78754': {
    slug: 'zip-78754',
    description: `78754 covers northeast Austin including the Dessau and Copperfield areas. This zip code has seen significant growth driven by Samsung's semiconductor fabrication facility and the expansion of tech employers along the SH-130 and US-290 corridors. New master-planned communities are developing alongside established neighborhoods.

The area offers the most affordable housing in the Austin metro with an Austin mailing address. Samsung's massive investment has catalyzed infrastructure improvements, new retail, and residential development. Harris Branch is one of the area's established master-planned communities with community amenities. The growth trajectory suggests strong long-term value.`,
    highlights: [
      'Affordable housing near Samsung semiconductor facility',
      'Rapid growth and infrastructure development',
      'Harris Branch master-planned community',
      'Growing commercial and retail options',
      'Strong investment potential as northeast Austin grows',
    ],
    bestFor: ['First-time buyers', 'Investors', 'Tech workers', 'Value seekers'],
    nearbyLandmarks: ['Samsung semiconductor facility', 'Harris Branch', 'SH-130 corridor', 'Walter E. Long Lake', 'Dessau Road'],
  },
  'zip-78756': {
    slug: 'zip-78756',
    description: `78756 is a compact, highly desirable zip code covering Brentwood, Crestview, and parts of Rosedale in central-north Austin. This area has become one of Austin's most buzzworthy neighborhoods, with the Crestview MetroRail station adding transit connectivity and the commercial strips along Burnet Road and Justin Lane attracting top restaurants and local businesses.

The housing stock is predominantly 1950s ranch homes on generous lots, many of which have been thoughtfully renovated. New construction and ADUs (accessory dwelling units) are filling in along some streets. Prices reflect the area's central location and walkability — the median is well above the Austin average — but buyers gain access to a genuine neighborhood with active community organizations and events.`,
    highlights: [
      'Brentwood and Crestview — Austin\'s hottest central neighborhoods',
      'Crestview MetroRail station for downtown commute',
      'Walkable to Little Deli, Epoch Coffee, and Justin Lane shops',
      'Mid-century homes with character on generous lots',
      'Strong community identity with active associations',
    ],
    bestFor: ['Young professionals', 'Families', 'Transit commuters', 'Walkability enthusiasts'],
    nearbyLandmarks: ['Crestview MetroRail station', 'Little Deli & Pizzeria', 'Epoch Coffee', 'Brentwood Park', 'Burnet Road dining'],
  },
  'zip-78757': {
    slug: 'zip-78757',
    description: `78757 covers the Allandale and Crestview neighborhoods in central-north Austin — one of the most reliably family-friendly areas in the city. Allandale's spacious mid-century homes on tree-lined streets offer solid value for central Austin, while Crestview's commercial corridor along North Lamar and Justin Lane provides walkable shopping and dining.

The neighborhood is bordered by Shoal Creek Trail to the east and Burnet Road to the west, providing both recreational trails and restaurant access. Austin ISD schools including Gullett Elementary and McCallum High School serve the area. The combination of central location, neighborhood character, and reasonable (for central Austin) pricing makes 78757 one of the most popular zip codes for families.`,
    highlights: [
      'Allandale and Crestview — central Austin\'s most family-friendly area',
      'Spacious mid-century homes at accessible central Austin prices',
      'Shoal Creek Trail and multiple neighborhood parks',
      'Walkable to Burnet Road dining and North Lamar shops',
      'Strong AISD schools: Gullett Elementary, McCallum High',
    ],
    bestFor: ['Families', 'Value seekers in central Austin', 'Trail runners', 'Mid-century home lovers'],
    nearbyLandmarks: ['Shoal Creek Trail', 'Northwest Recreation Center', 'Allandale Park', 'Burnet Road', 'Beverly Sheffield Northwest Park'],
  },
  'zip-78758': {
    slug: 'zip-78758',
    description: `78758 covers the Gracywoods, Quail Hollow, and North Austin neighborhoods along the MoPac and US-183 corridors. This centrally located zip code offers tremendous value for buyers who want proximity to the Domain, major tech employers, and central Austin amenities without the central Austin price tag.

The Domain — Austin's premier mixed-use development with upscale shopping, dining, and major corporate offices (Apple, Facebook, Amazon) — sits nearby. Neighborhoods like Gracywoods offer established homes from the 1980s with mature trees and community pools. The area has excellent transit connectivity and multiple commuter routes. It's one of the best entry points into north-central Austin homeownership.`,
    highlights: [
      'Close to the Domain — Austin\'s premier shopping and dining',
      'Proximity to Apple, Facebook, Amazon offices',
      'Affordable north-central Austin housing',
      'Good transit connectivity and commuter routes',
      'Established neighborhoods with community amenities',
    ],
    bestFor: ['Tech workers', 'First-time buyers', 'Domain lifestyle seekers', 'Commuters'],
    nearbyLandmarks: ['The Domain', 'Apple campus', 'Gracywoods Park', 'US-183 corridor', 'Walnut Creek Trail'],
  },
  'zip-78759': {
    slug: 'zip-78759',
    description: `78759 covers the Great Hills, Balcones Woods, and Spicewood Springs areas in northwest Austin. This is one of the most desirable suburban zip codes in the city, known for its tree-covered neighborhoods, excellent schools, and proximity to both the Arboretum shopping area and major employers like Apple, Dell, and National Instruments.

Homes range from the $400Ks for condos to $1.5M+ for custom homes on wooded lots. The area feeds into Austin ISD's Anderson High School as well as Round Rock ISD schools in some sections. Great Hills Country Club, the Arboretum, and extensive neighborhood trails make this a well-rounded choice for families and professionals seeking northwest Austin's best.`,
    highlights: [
      'Great Hills and Balcones Woods — premier northwest Austin',
      'The Arboretum shopping and dining nearby',
      'Proximity to Apple, Dell, and other major tech employers',
      'Tree-covered neighborhoods with quality schools',
      'Mix of condos, townhomes, and custom single-family homes',
    ],
    bestFor: ['Families', 'Tech professionals', 'Suburban comfort seekers', 'Northwest Austin fans'],
    nearbyLandmarks: ['The Arboretum', 'Great Hills Country Club', 'Balcones District Park', 'Spicewood Springs', 'Loop 360'],
  },
};

// ─── CITY DESCRIPTIONS ───────────────────────────────────────────────────

export const cityDescriptions: Record<string, AreaCommunityDescription> = {
  'city-bastrop': {
    slug: 'city-bastrop',
    description: `Bastrop is a charming small city on the Colorado River about 30 miles southeast of Austin. Known for its historic downtown, lush Lost Pines forest, and Bastrop State Park, this community offers a slower pace of life while remaining within commuting distance of Austin's tech corridor via SH-71 and SH-130.

The housing market in Bastrop ranges from historic homes in the walkable downtown core to new master-planned communities like the Colony and Piney Creek Bend. Bastrop ISD serves the area with solid schools. The city has attracted artists, retirees, and families looking for character and affordability that's increasingly hard to find closer to Austin.`,
    highlights: [
      'Historic downtown with local shops, restaurants, and galleries',
      'Bastrop State Park and the Lost Pines forest',
      'Colorado River access for kayaking and fishing',
      'Growing master-planned communities with modern amenities',
      'Affordable compared to Austin metro with strong character',
    ],
    bestFor: ['Nature lovers', 'Retirees', 'History buffs', 'Families seeking affordability'],
    nearbyLandmarks: ['Bastrop State Park', 'Colorado River', 'Historic Main Street', 'Lost Pines Art Center', 'McKinney Roughs Nature Park'],
  },
  'city-bee-cave': {
    slug: 'city-bee-cave',
    description: `Bee Cave is a thriving Hill Country city west of Austin along Highway 71, known for upscale shopping at the Hill Country Galleria, excellent Lake Travis ISD schools, and easy access to Lake Travis. The city has grown from a small rural community into one of the metro's most desirable addresses for families and professionals.

Residential neighborhoods like Spanish Oaks, Falconhead, and The Backyard offer homes ranging from family-friendly tract houses to luxury estates. The Hill Country Galleria provides open-air shopping, dining, and a live music venue, giving Bee Cave its own center of gravity. Weekend life often involves Lake Travis boating, winery visits, and hiking in the Hill Country.`,
    highlights: [
      'Hill Country Galleria — premier outdoor shopping and dining',
      'Lake Travis ISD — among the top school districts in Texas',
      'Gateway to Lake Travis and Hill Country wine trail',
      'Mix of family communities and luxury estates',
      '20-minute commute to downtown Austin',
    ],
    bestFor: ['Families', 'Executives', 'Lake lovers', 'Hill Country lifestyle seekers'],
    nearbyLandmarks: ['Hill Country Galleria', 'Lake Travis', 'Bee Cave Central Park', 'Falconhead Golf Club', 'Spanish Oaks'],
  },
  'city-buda': {
    slug: 'city-buda',
    description: `Buda (pronounced "byoo-duh") is a fast-growing small city just south of Austin along IH-35 in Hays County. Once a quiet railroad town, Buda has experienced explosive growth driven by families seeking affordable housing, quality schools, and a small-town atmosphere within easy commuting distance of Austin.

The historic downtown is anchored by the old Buda Depot and hosts popular events like the Buda Wiener Dog Races. New master-planned communities like Sunfield and Garlic Creek offer modern homes with community amenities. Hays CISD serves the area with growing school facilities. The combination of affordability, character, and IH-35 connectivity makes Buda one of the most popular choices for young families.`,
    highlights: [
      'Small-town charm just south of Austin on IH-35',
      'Affordable housing with new master-planned communities',
      'Historic downtown with festivals and community events',
      'Hays CISD with growing, improving schools',
      '15-20 minute commute to south Austin employers',
    ],
    bestFor: ['Young families', 'First-time buyers', 'Small-town lovers', 'South Austin commuters'],
    nearbyLandmarks: ['Historic Buda Depot', 'Stagecoach Park', 'Sunfield community', 'IH-35 corridor', 'Kyle Crossing shopping'],
  },
  'city-cedar-park': {
    slug: 'city-cedar-park',
    description: `Cedar Park is one of Austin's most popular suburban cities, located northwest of the capital in Williamson County. Known for its excellent schools (Leander ISD), family-friendly neighborhoods, and the HEB Center entertainment venue, Cedar Park offers a high quality of life with reasonable housing costs and strong community amenities.

The city features a mix of established neighborhoods from the 1990s-2000s and newer developments. The 1890 Ranch shopping center, Lakeline Mall, and a growing restaurant scene along US-183 and Whitestone Boulevard provide everyday convenience. Cedar Park's parks system is extensive, with Brushy Creek Trail connecting to a regional trail network. Major employers are nearby in both Austin and the growing Williamson County tech corridor.`,
    highlights: [
      'Leander ISD — one of the fastest-growing and top-rated districts',
      'HEB Center — concerts, minor league hockey, and events',
      'Extensive parks system and Brushy Creek Trail',
      'Strong retail: 1890 Ranch, Lakeline Mall, US-183 corridor',
      'Family-friendly neighborhoods with community amenities',
    ],
    bestFor: ['Families', 'Sports fans', 'Suburban lifestyle seekers', 'North Austin commuters'],
    nearbyLandmarks: ['HEB Center', '1890 Ranch', 'Brushy Creek Trail', 'Lakeline Mall', 'Cedar Park Sculpture Garden'],
  },
  'city-dripping-springs': {
    slug: 'city-dripping-springs',
    description: `Dripping Springs is the "Gateway to the Hill Country" — a charming community about 25 miles southwest of Austin that's become one of the metro's most sought-after addresses. The town is home to an extraordinary concentration of wineries, distilleries, and breweries, including Jester King Brewery and Treaty Oak Distilling, making it a weekend destination as well as a desirable place to live.

Real estate ranges from affordable new construction in master-planned communities like Caliterra and Headwaters to sprawling ranch properties and custom Hill Country estates. The historic Mercer Street downtown has been revitalized with local shops and restaurants. Dripping Springs ISD is well-regarded and growing. For buyers who dream of space, Hill Country sunsets, and a community where people know your name, Dripping Springs delivers.`,
    highlights: [
      'Gateway to Hill Country — wineries, distilleries, scenic drives',
      'Jester King Brewery, Treaty Oak Distilling, Deep Eddy Vodka nearby',
      'Dripping Springs ISD with new, modern campus facilities',
      'Master-planned communities and ranch acreage available',
      'Charming downtown Mercer Street with local shops',
    ],
    bestFor: ['Families', 'Hill Country lovers', 'Space seekers', 'Wine and craft drink enthusiasts'],
    nearbyLandmarks: ['Jester King Brewery', 'Treaty Oak Distilling', 'Hamilton Pool Preserve', 'Pedernales Falls', 'Mercer Street downtown'],
  },
  'city-elgin': {
    slug: 'city-elgin',
    description: `Elgin, the "Sausage Capital of Texas," is a growing community about 25 miles east of Austin in Bastrop County. The town is famous for its hot sausage tradition — Southside Market has been smoking sausage here since 1882 — but modern Elgin is increasingly known as an affordable alternative for Austin-area homebuyers.

The city offers a genuine small-town atmosphere with a historic downtown, community events, and open countryside. New subdivisions are providing modern homes at price points well below the Austin average. Elgin ISD serves the community, and the SH-130 toll road provides a quick commute to Austin's east side. For buyers seeking value and character, Elgin is worth the drive.`,
    highlights: [
      'Famous "Sausage Capital of Texas" heritage',
      'Affordable housing well below Austin metro average',
      'Small-town atmosphere with genuine community',
      'SH-130 toll road access for Austin commuters',
      'New subdivisions with modern homes',
    ],
    bestFor: ['First-time buyers', 'Value seekers', 'Small-town lovers', 'Commuters via SH-130'],
    nearbyLandmarks: ['Southside Market & Barbeque', 'Historic downtown Elgin', 'Elgin Memorial Park', 'SH-130 corridor', 'Bastrop State Park'],
  },
  'city-georgetown': {
    slug: 'city-georgetown',
    description: `Georgetown is one of the Austin metro's most charming and fastest-growing cities, known for its beautifully preserved Victorian downtown square, the sprawling Sun City 55+ community, and Blue Hole Park on the San Gabriel River. Located about 30 miles north of Austin in Williamson County, Georgetown offers a distinct identity while maintaining strong connectivity via IH-35.

The real estate landscape is diverse: Sun City draws active retirees from across the country, while new master-planned communities like Wolf Ranch and Riverwalk cater to families. The Georgetown ISD is well-regarded with modern facilities. The town square, listed on the National Register of Historic Places, is the heart of the community — home to local restaurants, antique shops, and the popular Tamale Festival and Red Poppy Festival each year.`,
    highlights: [
      'Historic Victorian downtown square on the National Register',
      'Sun City — one of the nation\'s premier 55+ communities',
      'Blue Hole Park — stunning swimming spot on the San Gabriel River',
      'Georgetown ISD with strong schools and modern facilities',
      'Red Poppy Festival and vibrant community events calendar',
    ],
    bestFor: ['Retirees', 'Families', 'History enthusiasts', 'Active adults'],
    nearbyLandmarks: ['Georgetown Square', 'Sun City', 'Blue Hole Park', 'Inner Space Cavern', 'San Gabriel River'],
  },
  'city-hutto': {
    slug: 'city-hutto',
    description: `Hutto, the "Hippo Capital of Texas," is a rapidly growing community in eastern Williamson County that has transformed from a small farming town into one of the Austin metro's most popular affordable suburbs. The city's hippo mascot (celebrating a famous 1915 circus escapee) gives Hutto a playful character that extends to its friendly, family-oriented culture.

New master-planned communities like Star Ranch and Hutto Parke offer modern homes at price points that are among the most accessible in the metro. Hutto ISD has invested heavily in new school campuses to keep pace with growth. The city's location along US-79 and SH-130 provides commuter access to Round Rock, Austin, and the growing eastern corridor. Hutto's downtown is experiencing its own renaissance with new restaurants and small businesses.`,
    highlights: [
      'Among the most affordable cities in the Austin metro',
      'Fast-growing with new master-planned communities',
      'Hutto ISD investing in new school facilities',
      'Friendly small-town culture with community events',
      'SH-130 and US-79 commuter access to Round Rock and Austin',
    ],
    bestFor: ['First-time buyers', 'Young families', 'Value seekers', 'Small-town atmosphere'],
    nearbyLandmarks: ['Hutto Hippo statue', 'Fritz Park', 'Star Ranch', 'US-79 corridor', 'Old Settlers Park (Round Rock)'],
  },
  'city-kyle': {
    slug: 'city-kyle',
    description: `Kyle is one of the fastest-growing cities in America, located along the IH-35 corridor in Hays County between Austin and San Marcos. The city offers some of the most affordable housing in the Austin metro while providing easy access to employment centers in both Austin and San Marcos. New master-planned communities are developing rapidly to meet demand.

Kyle's growth has attracted major retailers and restaurants to the SH-45/IH-35 interchange area. The city maintains a small-town character in its historic downtown, and community events like Kyle Fair and Music Festival bring residents together. Hays CISD serves the area with expanding school facilities. For buyers priced out of Austin, Kyle offers a genuine path to homeownership with strong long-term growth potential.`,
    highlights: [
      'One of the fastest-growing cities in the U.S.',
      'Affordable housing along the IH-35 corridor',
      'Growing retail and dining at SH-45/IH-35 interchange',
      'Hays CISD with new school campuses',
      'Historic downtown character with modern growth',
    ],
    bestFor: ['First-time buyers', 'Young families', 'Austin commuters', 'Value seekers'],
    nearbyLandmarks: ['Kyle Town Center', 'Plum Creek Golf Course', 'Five Mile Dam Park', 'SH-45 corridor', 'San Marcos River (nearby)'],
  },
  'city-lakeway': {
    slug: 'city-lakeway',
    description: `Lakeway is the crown jewel of the Lake Travis corridor — an incorporated city of roughly 20,000 residents that combines resort-style living with Hill Country beauty and a strong sense of community. Situated on the southern shore of Lake Travis about 30 minutes west of downtown Austin, Lakeway offers an escape from the city's pace while remaining well-connected.

Real estate ranges from established neighborhoods with mid-century homes to the newer Rough Hollow community with its private marina. The Lakeway Resort and Spa and Flintrock Falls golf course anchor the community's resort identity. Lake Travis ISD is well-regarded, with Lake Travis High School consistently ranked among the state's best. The new Lakeway Town Center has added walkable retail and restaurants.`,
    highlights: [
      'Lake Travis waterfront with marinas and boat launches',
      'Lake Travis ISD — top-rated schools',
      'Lakeway Resort and Spa, Flintrock Falls golf',
      'Lakeway Town Center with walkable shops and dining',
      'Incorporated city with its own services and events',
    ],
    bestFor: ['Lake lovers', 'Families', 'Retirees', 'Golf enthusiasts'],
    nearbyLandmarks: ['Lake Travis', 'Lakeway Resort & Spa', 'Rough Hollow marina', 'Flintrock Falls', 'Lakeway Town Center'],
  },
  'city-leander': {
    slug: 'city-leander',
    description: `Leander has been one of Texas' fastest-growing cities for the past decade, transforming from a small railroad town into a thriving community of over 75,000 residents. Located northwest of Austin in Williamson County, Leander offers new master-planned communities, excellent Leander ISD schools, and a MetroRail station connecting to downtown Austin.

Master-planned communities like Travisso, Crystal Falls, and the massive Bryson development offer a range of new construction options from starter homes to luxury properties. The Leander ISD is one of the state's fastest-growing districts with consistently strong academic performance. H-E-B Plus, major retailers, and a growing restaurant scene along US-183 and Crystal Falls Parkway provide everyday convenience.`,
    highlights: [
      'One of Texas\' fastest-growing cities',
      'Leander ISD — top-rated, fast-growing school district',
      'MetroRail station with downtown Austin connection',
      'Abundant new construction in master-planned communities',
      'Growing retail and dining scene along US-183',
    ],
    bestFor: ['Families', 'New construction buyers', 'Transit commuters', 'Growing community seekers'],
    nearbyLandmarks: ['Leander MetroRail station', 'Crystal Falls Golf Club', 'Devine Lake Park', 'H-E-B Plus Leander', 'Travisso amenity center'],
  },
  'city-liberty-hill': {
    slug: 'city-liberty-hill',
    description: `Liberty Hill is a rapidly growing Hill Country community in northwestern Williamson County that has maintained its small-town Texas character despite explosive residential growth. Known for its annual festival, antique shops along Main Street, and stunning Hill Country terrain, Liberty Hill attracts buyers who want space and a genuine community feel.

New master-planned communities like Santa Rita Ranch and Stagecoach Hills are bringing modern homes to the area while the old town center retains its heritage. Liberty Hill ISD has invested in new campuses to serve the growing population. The scenic drive along SH-29 connects to Georgetown and the IH-35 corridor. For buyers willing to trade a longer commute for acreage, views, and a small-town lifestyle, Liberty Hill delivers.`,
    highlights: [
      'Authentic small-town Texas character in the Hill Country',
      'Santa Rita Ranch — popular master-planned community',
      'Liberty Hill ISD with new school campuses',
      'Scenic Hill Country terrain with large lots',
      'Growing while maintaining community identity',
    ],
    bestFor: ['Families', 'Space seekers', 'Hill Country lovers', 'Small-town lifestyle'],
    nearbyLandmarks: ['Santa Rita Ranch', 'Liberty Hill downtown', 'SH-29 corridor', 'Lake Georgetown', 'Cedar Park (nearby)'],
  },
  'city-manor': {
    slug: 'city-manor',
    description: `Manor is a fast-growing community east of Austin that offers some of the most affordable housing in the metro area. Located along US-290 in eastern Travis County, Manor has attracted thousands of new residents seeking homeownership at price points well below the Austin average. The city maintains a small-town feel with a growing set of amenities.

New master-planned communities like ShadowGlen, Presidential Meadows, and Manor Commons provide modern homes with community pools and parks. Manor ISD is expanding rapidly with new school facilities. The Samsung semiconductor facility nearby and the SH-130 toll road provide employment and commuter options. Manor's proximity to Austin (15 minutes to east Austin) and affordability make it one of the most compelling value propositions in the metro.`,
    highlights: [
      'Among the most affordable communities in the Austin metro',
      'New master-planned communities with modern amenities',
      'Growing Manor ISD with new school campuses',
      'Near Samsung semiconductor facility and SH-130 employers',
      '15 minutes from east Austin, accessible US-290 commute',
    ],
    bestFor: ['First-time buyers', 'Young families', 'Value seekers', 'East Austin commuters'],
    nearbyLandmarks: ['ShadowGlen Golf Club', 'Manor downtown', 'US-290 corridor', 'SH-130', 'Walter E. Long Lake (nearby)'],
  },
  'city-pflugerville': {
    slug: 'city-pflugerville',
    description: `Pflugerville (pronounced "FLOO-ger-ville") is a thriving city northeast of Austin that has grown from a small German farming community into one of the metro's most popular family destinations. Known for its excellent schools, diverse communities, and strong city services, Pflugerville offers a complete suburban package with genuine Texas warmth.

The city's housing stock ranges from established neighborhoods in Windermere and Spring Trails to newer communities like Avalon and Blackhawk. Lake Pflugerville provides a surprising oasis for fishing, kayaking, and trail running. Pflugerville ISD consistently performs above state averages, and the city's parks system is extensive. Stone Hill Town Center and the SH-130/IH-35 interchange area provide growing retail and dining options.`,
    highlights: [
      'Pflugerville ISD — strong academics above state averages',
      'Lake Pflugerville for kayaking, fishing, and trails',
      'Diverse, welcoming community with city-organized events',
      'Mix of established and new construction neighborhoods',
      'Strong city services and extensive parks system',
    ],
    bestFor: ['Families', 'Diverse community seekers', 'Outdoor enthusiasts', 'Northeast Austin commuters'],
    nearbyLandmarks: ['Lake Pflugerville', 'Stone Hill Town Center', 'Pfluger Park', 'SH-130 corridor', 'German heritage sites'],
  },
  'city-round-rock': {
    slug: 'city-round-rock',
    description: `Round Rock is the Austin metro's largest suburb and one of the best-rounded cities in Texas. Home to Dell Technologies' world headquarters, a AAA baseball stadium (Dell Diamond), a premium outlet mall, and one of the state's top school districts, Round Rock offers everything a family or professional could want.

Real estate spans the full spectrum: from affordable condos and starter homes in the $300Ks to luxury estates in Brushy Creek and Fern Bluff above $1M. Round Rock ISD is consistently ranked among the top districts in the state, and the city's parks system includes Old Settlers Park, a 570-acre recreational hub. The downtown round rock (the actual rock in Brushy Creek) anchors a growing entertainment district. IH-35, US-183, and SH-45 provide multiple commuter routes.`,
    highlights: [
      'Round Rock ISD — among the top school districts in Texas',
      'Dell Technologies HQ and major employment hub',
      'Dell Diamond (AAA baseball) and Round Rock Premium Outlets',
      'Old Settlers Park — 570 acres of recreation',
      'Growing downtown entertainment district',
    ],
    bestFor: ['Families', 'Tech professionals', 'Sports fans', 'Suburban lifestyle seekers'],
    nearbyLandmarks: ['Dell Diamond', 'Round Rock Premium Outlets', 'Old Settlers Park', 'Dell HQ', 'Downtown Round Rock'],
  },
  'city-san-marcos': {
    slug: 'city-san-marcos',
    description: `San Marcos is a vibrant college town in Hays County, home to Texas State University and the crystal-clear San Marcos River. Located along the IH-35 corridor between Austin and San Antonio, San Marcos offers a unique blend of college-town energy, outdoor recreation, and growing commercial development.

The real estate market serves a diverse population: from student rentals near campus to family homes in communities like Blanco Vista and Kissing Tree (a 55+ community). The San Marcos River is the town's centerpiece — a spring-fed waterway perfect for tubing, kayaking, and swimming. The San Marcos Premium Outlets draw shoppers from across the state. For buyers seeking affordability with lifestyle amenities, San Marcos delivers exceptional value.`,
    highlights: [
      'Texas State University campus and college-town energy',
      'Crystal-clear San Marcos River for tubing and swimming',
      'San Marcos Premium Outlets — major retail destination',
      'Affordable housing compared to Austin metro',
      'Growing community with Kissing Tree 55+ and new developments',
    ],
    bestFor: ['Investors', 'First-time buyers', 'Outdoor enthusiasts', 'Active adults'],
    nearbyLandmarks: ['San Marcos River', 'Texas State University', 'San Marcos Premium Outlets', 'Kissing Tree', 'Meadows Center'],
  },
  'city-taylor': {
    slug: 'city-taylor',
    description: `Taylor is a historic railroad town in eastern Williamson County that's experiencing a renaissance driven by Samsung's massive semiconductor fabrication plant. The $17 billion investment has transformed Taylor's economic outlook, attracting new residents, businesses, and infrastructure development while the city works to preserve its small-town Texas heritage.

The downtown square and Main Street retain their early 1900s character, with local restaurants, antique shops, and the beloved Louie Mueller Barbecue (a Texas BBQ Hall of Fame member). New subdivisions are developing rapidly to meet housing demand, offering modern homes at prices well below the Austin average. Taylor ISD is investing in new facilities. For buyers seeking ground-floor opportunity in a transforming community, Taylor is compelling.`,
    highlights: [
      'Samsung $17B semiconductor plant driving massive growth',
      'Historic downtown with Louie Mueller Barbecue (Hall of Fame)',
      'Affordable housing with new subdivisions developing',
      'Ground-floor investment opportunity',
      'Small-town Texas character being preserved alongside growth',
    ],
    bestFor: ['Investors', 'First-time buyers', 'Samsung employees', 'Small-town lovers'],
    nearbyLandmarks: ['Samsung semiconductor facility', 'Louie Mueller Barbecue', 'Murphy Park', 'Downtown Taylor square', 'Lake Granger (nearby)'],
  },
  'city-west-lake-hills': {
    slug: 'city-west-lake-hills',
    description: `West Lake Hills is an incorporated city west of Austin that represents the pinnacle of Austin-area living. The city's residents enjoy stunning Hill Country views, generous lot sizes, and access to the Eanes Independent School District — consistently ranked as one of the top districts in Texas. Westlake High School is a perennial state academic and athletic powerhouse.

Homes range from $800K updated mid-century properties to $10M+ custom estates on multi-acre hilltop lots. The terrain is dramatic: rolling limestone hills, towering live oaks, and panoramic Hill Country vistas. West Lake Hills maintains its own city services, police department, and low tax rates. The location is superb — downtown Austin is 15 minutes via MoPac, while the Hill Country Galleria and Lake Travis are minutes west.`,
    highlights: [
      'Eanes ISD — top-rated school district in Texas',
      'Stunning Hill Country views and estates on large lots',
      'Incorporated city with responsive local government',
      '15-minute commute to downtown Austin',
      'Westlake High School — academic and athletic excellence',
    ],
    bestFor: ['Families', 'Executives', 'Top-school seekers', 'Luxury home buyers'],
    nearbyLandmarks: ['Westlake High School', 'Wild Basin Wilderness Preserve', 'Hill Country Galleria', 'Davenport Village', 'Camp Mabry'],
  },
  'city-wimberley': {
    slug: 'city-wimberley',
    description: `Wimberley is a charming Hill Country village in Hays County known for its artistic community, natural beauty, and iconic swimming holes. Jacob's Well — a crystal-clear natural spring that's one of Texas' most photographed swimming spots — and Blue Hole Regional Park draw visitors from across the state. But for residents, Wimberley's appeal is in its daily quality of life.

The town square hosts a thriving market day on the first Saturday of each month, and local galleries, boutiques, and restaurants give Wimberley a creative, welcoming vibe. Real estate ranges from cottages in the village to ranch properties and Hill Country estates with dramatic views. Wimberley ISD is a small, community-oriented district. The town is about 45 minutes from Austin, making it a popular choice for remote workers and those seeking a Hill Country retreat.`,
    highlights: [
      'Jacob\'s Well and Blue Hole — legendary swimming holes',
      'Thriving arts community with galleries and Market Day',
      'Charming village square with local shops and restaurants',
      'Ranch properties and Hill Country estates available',
      'Ideal for remote workers seeking Hill Country lifestyle',
    ],
    bestFor: ['Artists and creatives', 'Remote workers', 'Nature lovers', 'Retirees'],
    nearbyLandmarks: ['Jacob\'s Well', 'Blue Hole Regional Park', 'Wimberley Square', 'Cypress Creek', 'Devil\'s Backbone scenic drive'],
  },
};

/**
 * Get description for an area community by slug.
 */
export function getAreaCommunityDescription(slug: string): AreaCommunityDescription | undefined {
  return zipDescriptions[slug] || cityDescriptions[slug];
}
