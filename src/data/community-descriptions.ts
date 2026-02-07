// Rich, locally-informed community descriptions for Austin-area neighborhoods
// Written to sound like a knowledgeable local realtor — not a robot.

export interface CommunityContent {
  slug: string;
  description: string;
  highlights: string[];
  bestFor: string[];
  nearbyLandmarks: string[];
}

export const communityDescriptions: CommunityContent[] = [
  // ─── CENTRAL AUSTIN / SOUTH ───────────────────────────────────────────
  {
    slug: 'zilker',
    description: `Zilker is the crown jewel of central Austin living. Nestled between Barton Creek and Lady Bird Lake, this neighborhood delivers an unbeatable combination of outdoor access, walkability, and old Austin charm. Residents wake up minutes from Barton Springs Pool, the hike-and-bike trail, and the sprawling 351-acre Zilker Metropolitan Park — the same park that hosts Austin City Limits Music Festival every October.

Homes in Zilker range from lovingly maintained 1940s bungalows on tree-lined streets to sleek modern builds that have popped up along Kinney Avenue and Rabb Road. The housing stock is diverse, but demand is fierce — properties here rarely sit on market for long. Zilker Elementary is a beloved neighborhood school, and the area's central location means easy access to both downtown and South Lamar's restaurant row.

Day-to-day life in Zilker revolves around the outdoors. You'll see neighbors paddleboarding on the lake, running the Butler Trail, or grabbing tacos at Torchy's on South 1st. Barton Springs Road serves as the neighborhood's main artery, lined with local favorites like Shady Grove and Chuy's. If you want the quintessential Austin lifestyle with real community roots, Zilker is it.`,
    highlights: [
      'Walk or bike to Barton Springs Pool and Zilker Park year-round',
      'Zilker Elementary consistently rated among Austin\'s top public schools',
      'Minutes from South Lamar dining, SoCo shopping, and downtown',
      'Butler Hike-and-Bike Trail access at multiple trailheads',
      'Strong home values with consistent appreciation over the past decade',
    ],
    bestFor: ['Outdoor enthusiasts', 'Young professionals', 'Families', 'Dog owners'],
    nearbyLandmarks: [
      'Zilker Metropolitan Park',
      'Barton Springs Pool',
      'Lady Bird Lake / Butler Trail',
      'Austin City Limits at Zilker Park',
      'Umlauf Sculpture Garden',
    ],
  },
  {
    slug: 'barton-hills',
    description: `Barton Hills is one of Austin's best-kept secrets — a quiet, wooded enclave tucked between Zilker Park and the Barton Creek Greenbelt. The neighborhood has a distinctly unhurried, almost rural feel despite being just minutes from downtown. Streets wind through mature live oaks and cedar elms, and it's not uncommon to spot deer on your morning walk along Barton Hills Drive.

The housing stock is predominantly mid-century ranch homes from the 1950s and '60s, many of which have been thoughtfully updated while retaining their original character. Larger lots are common here — you won't feel like you're on top of your neighbors. Newer custom homes have filled in along Robert E. Lee Road and Homedale Drive, but strict neighborhood covenants keep development in check.

What makes Barton Hills truly special is the greenbelt access. Residents can walk to some of Austin's best swimming holes, including Campbell's Hole and Twin Falls, via trails that connect directly from neighborhood streets. Barton Hills Elementary anchors the community, and the neighborhood pool is a popular summer gathering spot. For groceries, the Barton Hills Market on South Lamar has been a fixture for decades.`,
    highlights: [
      'Direct access to the Barton Creek Greenbelt and swimming holes',
      'Large lots with mature trees and a quiet, wooded character',
      'Barton Hills Elementary — a strong neighborhood school',
      'Community pool and neighborhood association events',
      'Short drive to Zilker Park, South Lamar, and downtown',
    ],
    bestFor: ['Nature lovers', 'Families', 'Privacy seekers', 'Hikers and trail runners'],
    nearbyLandmarks: [
      'Barton Creek Greenbelt',
      'Campbell\'s Hole',
      'Twin Falls',
      'Zilker Park',
      'Barton Hills Market',
    ],
  },
  {
    slug: 'travis-heights',
    description: `Travis Heights is one of Austin's most storied neighborhoods, perched on the bluffs south of Lady Bird Lake with some of the city's most enviable views. Established in the 1910s, the neighborhood is a mosaic of charming Craftsman bungalows, Spanish Revival cottages, and modern infill — all shaded by towering pecans and live oaks along streets like Travis Heights Boulevard and Newning Avenue.

The vibe here is creative and community-minded. Travis Heights hosts one of Austin's best-loved traditions: the annual Holiday Trail of Lights walk, where neighbors go all out with decorations. The neighborhood is walkable to South Congress Avenue's eclectic mix of shops, restaurants, and music venues, and a short stroll north puts you on the hike-and-bike trail at the lake.

Stacy Park and Big Stacy Pool are neighborhood anchors — the spring-fed pool is free and open all summer, a true Austin gem. Travis Heights Elementary feeds into Fulmore Middle School, and families here appreciate the tight-knit feel. Dining options are exceptional: Uchi, Lenoir, and Perla's are all within walking distance. If you value character, walkability, and proximity to the heart of Austin, Travis Heights delivers.`,
    highlights: [
      'Stunning Lady Bird Lake and downtown skyline views from the bluffs',
      'Walking distance to South Congress shops, restaurants, and music venues',
      'Big Stacy Pool — free, spring-fed, and open to the public',
      'Beloved annual Holiday Trail of Lights neighborhood tradition',
      'Historic character homes mixed with tasteful modern builds',
    ],
    bestFor: ['Young professionals', 'Couples', 'Foodies', 'Culture seekers'],
    nearbyLandmarks: [
      'South Congress Avenue (SoCo)',
      'Big Stacy Pool',
      'Lady Bird Lake',
      'Continental Club',
      'Uchi Restaurant',
    ],
  },
  {
    slug: 'bouldin-creek',
    description: `Bouldin Creek is the heart and soul of South Austin. Wedged between South 1st Street and South Congress, this tight-knit neighborhood has evolved from a bohemian enclave of artists and musicians into one of the most desirable addresses in the city — without losing its funky, independent spirit. You'll still find yard art, community gardens, and the legendary Bouldin Creek Café serving vegetarian breakfast to a loyal crowd.

The streets are narrow and shaded, lined with a mix of classic 1940s cottages, renovated bungalows, and striking contemporary homes. Development has been intense — lot values alone regularly exceed $700K — but longtime residents and newcomers coexist in a neighborhood that still feels welcoming. The Bouldin Creek Neighborhood Association is one of Austin's most active, organizing everything from park cleanups to street parties.

Location is Bouldin's superpower. You're a 10-minute bike ride to downtown, steps from the food trucks and boutiques on South 1st, and a short walk to Lady Bird Lake. Bouldin Creek itself runs through the neighborhood, feeding into a small greenbelt perfect for dog walks. Zilker Elementary and Becker Elementary both serve the area, and the community garden on West Mary Street is a neighborhood institution.`,
    highlights: [
      'Walkable to South 1st and South Congress corridors',
      '10-minute bike ride to downtown Austin',
      'Eclectic mix of historic cottages and modern architecture',
      'Active neighborhood association with regular community events',
      'Bouldin Creek Café — a beloved South Austin institution',
    ],
    bestFor: ['Young professionals', 'Creatives', 'Bike commuters', 'Foodies'],
    nearbyLandmarks: [
      'South Congress Avenue',
      'South 1st Street',
      'Bouldin Creek Café',
      'Lady Bird Lake',
      'Zilker Park',
    ],
  },
  {
    slug: 'south-congress',
    description: `South Congress — or SoCo, as locals call it — is Austin's most iconic strip, and the neighborhood surrounding it is every bit as vibrant as the avenue itself. Living on or near South Congress means you're immersed in the energy that defines Austin: live music drifting from the Continental Club, the smell of brisket from nearby trailers, and a constant parade of people-watching along the sidewalks.

Residential streets just off the main drag are surprisingly quiet and tree-lined, with a mix of vintage bungalows, mid-century ranches, and newer townhome developments. The proximity to downtown — you can see the Capitol dome from several intersections — makes SoCo one of the most walkable and bikeable neighborhoods in the city. The Ann and Roy Butler Hike-and-Bike Trail is just blocks north.

SoCo's commercial scene needs no introduction: Hotel San José, Jo's Coffee (home of the famous "I love you so much" mural), Allen's Boots, and dozens of locally owned boutiques and restaurants line the avenue. For families, Travis Heights Elementary is nearby, and the neighborhood feeds into Austin ISD. Whether you're grabbing breakfast at Elizabeth Street Café or catching a show at the Continental, daily life on SoCo feels like a permanent Austin vacation.`,
    highlights: [
      'Austin\'s most famous walkable commercial strip at your doorstep',
      'Walkable to Lady Bird Lake and the Butler Hike-and-Bike Trail',
      'Iconic local businesses: Jo\'s Coffee, Continental Club, Allen\'s Boots',
      'Easy bike commute to downtown and across the Congress Avenue Bridge',
      'Strong short-term rental potential for investment buyers',
    ],
    bestFor: ['Young professionals', 'Investors', 'Culture seekers', 'Walkability enthusiasts'],
    nearbyLandmarks: [
      'Continental Club',
      'Jo\'s Coffee & "I love you so much" mural',
      'Hotel San José',
      'Congress Avenue Bridge (bat colony)',
      'South Congress shopping district',
    ],
  },
  {
    slug: 'south-lamar',
    description: `South Lamar has quietly become one of Austin's most dynamic corridors. Once a sleepy stretch of auto shops and dive bars, the boulevard has transformed into a culinary and entertainment destination while the residential streets behind it have maintained their South Austin character. You'll find everything from classic '50s ranch homes to brand-new condo developments, all within an easy drive — or bike ride — of downtown.

The dining scene along South Lamar is outstanding. Uchi put the street on the culinary map, and it's since been joined by favorites like Odd Duck, Loro, and Loro's sibling Uchi ko. The Alamo Drafthouse on South Lamar is a beloved movie-going institution, and live music venues like The Saxon Pub keep Austin's musical soul alive on this side of town.

Residential pockets off South Lamar — particularly between Barton Skyway and Oltorf — offer a mix of affordability and access that's hard to beat. The neighborhood is well-connected via the Butler Trail and multiple bus routes, and grocery options include a Trader Joe's and the South Lamar H-E-B. For buyers who want the energy of central Austin without the premium of Zilker or Travis Heights, South Lamar delivers tremendous value.`,
    highlights: [
      'Restaurant row with Uchi, Odd Duck, Loro, and dozens more',
      'Alamo Drafthouse South Lamar — Austin\'s iconic dine-in cinema',
      'Mix of affordable homes, condos, and new construction',
      'Excellent access to downtown, Zilker, and Barton Creek Greenbelt',
      'Trader Joe\'s, H-E-B, and local shops within the corridor',
    ],
    bestFor: ['Foodies', 'Young professionals', 'First-time buyers', 'Renters looking to buy'],
    nearbyLandmarks: [
      'Alamo Drafthouse South Lamar',
      'Uchi / Odd Duck / Loro',
      'The Saxon Pub',
      'Barton Creek Greenbelt (Spyglass entrance)',
      'Lady Bird Lake',
    ],
  },

  // ─── DOWNTOWN / EAST ──────────────────────────────────────────────────
  {
    slug: 'downtown',
    description: `Downtown Austin is the pulsing heart of the city — a dense, walkable urban core where the Texas State Capitol, Sixth Street entertainment district, and Lady Bird Lake converge. Living downtown means trading a yard for a skyline view, with high-rise condos and luxury lofts dominating the housing stock. Buildings like The Independent, 70 Rainey, and the Austonian offer resort-style amenities and panoramic views of the Hill Country.

Rainey Street has transformed from a quiet residential block into one of Austin's hottest nightlife districts, while the nearby Warehouse District and West 6th cater to a more upscale crowd. The Second Street District offers boutique shopping and sidewalk dining at spots like La Condesa and Trace. For culture, the Blanton Museum, the MEXIC-ARTE Museum, and the Paramount Theatre are all within walking distance.

Downtown living isn't for everyone — parking is tight, noise is real, and HOA fees on high-rises can be steep. But for buyers who want zero-commute urban living with world-class dining, live music seven nights a week, and the lake at their feet, there's nothing else like it in Texas. The ongoing development around the new downtown Austin FC stadium area continues to reshape the skyline.`,
    highlights: [
      'True walkable urban living — no car needed for daily life',
      'Lady Bird Lake and Butler Trail steps from your front door',
      'World-class dining on Rainey Street, 2nd Street, and West 6th',
      'High-rise condos with skyline and Hill Country views',
      'Cultural institutions: Paramount Theatre, Blanton Museum, ACL Live',
    ],
    bestFor: ['Urban professionals', 'Empty nesters', 'Investors', 'Nightlife enthusiasts'],
    nearbyLandmarks: [
      'Texas State Capitol',
      'Lady Bird Lake',
      'Rainey Street District',
      'Sixth Street Entertainment District',
      'ACL Live at The Moody Theater',
    ],
  },
  {
    slug: 'east-austin',
    description: `East Austin is Austin's most creatively charged neighborhood and one of its fastest-evolving. Roughly bounded by I-35 to the west and Airport Boulevard to the east, this area has undergone a dramatic transformation over the past decade. Historic homes along streets like Holly, Chicon, and Cesar Chavez now sit alongside modern duplexes, boutique hotels, and some of the city's best restaurants.

The food and drink scene east of I-35 is arguably Austin's best. Franklin Barbecue draws legendary lines on East 11th, while spots like Suerte, Nixta Taqueria, and Dai Due have earned national acclaim. The craft brewery and cocktail bar density is unmatched — Lazarus Brewing, Meanwhile Brewing, and Whisler's are neighborhood staples. First Fridays on East 6th bring gallery openings, live music, and street vendors.

East Austin's real estate market is dynamic and competitive. You'll find everything from $300K condos to $1M+ new construction. The diversity of housing types — shotgun cottages, converted warehouses, sleek townhomes — attracts a wide range of buyers. Proximity to downtown (often a 5-minute drive) and the neighborhood's independent, creative energy make East Austin one of the most exciting places to own a home in the city.`,
    highlights: [
      'Austin\'s best food scene: Franklin BBQ, Suerte, Nixta Taqueria',
      'Thriving arts and gallery district with First Friday events',
      'Wide range of price points from condos to luxury new builds',
      '5-minute commute to downtown Austin across I-35',
      'Craft brewery hub: Lazarus, Meanwhile, Blue Owl, and more',
    ],
    bestFor: ['Creatives', 'Foodies', 'Young professionals', 'Investors'],
    nearbyLandmarks: [
      'Franklin Barbecue',
      'Meanwhile Brewing Co.',
      'Huston-Tillotson University',
      'Boggy Creek Greenbelt',
      'East 6th Street entertainment',
    ],
  },
  {
    slug: 'mueller',
    description: `Mueller is Austin's premier master-planned urban community, built on the site of the former Robert Mueller Municipal Airport just east of I-35. Developed with new urbanist principles, Mueller offers something rare in Austin: brand-new homes with genuine walkability, mixed-use retail, and abundant parks — all within 10 minutes of downtown.

The neighborhood features a thoughtful mix of housing types: single-family homes, townhomes, condos, and apartments arranged around a central retail district anchored by an H-E-B, Alamo Drafthouse, and dozens of local shops and restaurants. Thinkery children's museum and the Dell Children's Medical Center campus border the community. Streets are designed for pedestrians first, with wide sidewalks, bike lanes, and a network of greenbelts connecting to the larger trail system.

Mueller's crown jewel is Lake Park, a 30-acre green space with a constructed lake, amphitheater, playgrounds, and walking paths. The Sunday Farmers' Market at Mueller draws crowds from across the city. Homes here hold their value exceptionally well thanks to the community's design standards and ongoing demand. For families and professionals who want new construction with a neighborhood feel — not a suburban one — Mueller stands alone.`,
    highlights: [
      'Master-planned new urbanist community with excellent walkability',
      'On-site H-E-B, Alamo Drafthouse, Thinkery, and local retail',
      'Lake Park with trails, amphitheater, and farmers\' market',
      'Mix of single-family homes, townhomes, and condos',
      '10 minutes to downtown with strong home value retention',
    ],
    bestFor: ['Families', 'Young professionals', 'Walkability enthusiasts', 'New construction buyers'],
    nearbyLandmarks: [
      'Mueller Lake Park',
      'Thinkery Children\'s Museum',
      'Dell Children\'s Medical Center',
      'Mueller H-E-B and Aldrich Street shops',
      'Sunday Mueller Farmers\' Market',
    ],
  },
  {
    slug: 'hyde-park',
    description: `Hyde Park is Austin's first suburb, established in 1891, and it remains one of the city's most beloved neighborhoods. Located just north of the University of Texas campus along Guadalupe and Duval streets, Hyde Park is defined by its canopy of mature pecan trees, beautifully preserved Victorian and Craftsman homes, and a walkable commercial strip that feels like a small town within a big city.

Avenue B Grocery & Market has been the neighborhood's gathering place since 1909 — grab a sandwich, a cold beer, and sit on the porch. Quack's Bakery, Dolce Vita Gelato, and Hyde Park Bar & Grill (home of the famous battered french fries) round out the local dining scene. The Hyde Park Theatre and Elisabet Ney Museum add cultural depth to this historically rich community.

Real estate in Hyde Park is a mix of beautifully restored homes from the early 1900s, some with original hardwood floors and sleeping porches, alongside garage apartments and a handful of modern builds. Prices have climbed significantly, but the neighborhood's walkability, UT proximity, and genuine community spirit justify the investment. Shipe Park hosts neighborhood events throughout the year, and the area is served by solid Austin ISD schools.`,
    highlights: [
      'Austin\'s original suburb with stunning Victorian and Craftsman homes',
      'Walkable to UT campus, local shops, and restaurants',
      'Avenue B Grocery — neighborhood institution since 1909',
      'Shipe Park and the Elisabet Ney Museum within walking distance',
      'Strong sense of community with active neighborhood association',
    ],
    bestFor: ['History buffs', 'UT faculty and staff', 'Walkability enthusiasts', 'Couples'],
    nearbyLandmarks: [
      'Avenue B Grocery & Market',
      'Shipe Park',
      'Elisabet Ney Museum',
      'University of Texas at Austin',
      'Hyde Park Bar & Grill',
    ],
  },
  {
    slug: 'north-loop',
    description: `North Loop is a small but mighty neighborhood just north of Hyde Park that has become one of Austin's coolest pockets for independent culture. Centered on North Loop Boulevard between Burnet Road and Avenue F, this area punches well above its weight in terms of walkable retail, vintage shopping, and neighborhood character.

The commercial strip along North Loop Boulevard is a curated row of indie businesses: Breakaway Records, Room Service Vintage, Epoch Coffee, and the beloved Monkeywrench Books. Restaurants like Foreign & Domestic and the drink.well gastropub have put North Loop on the culinary map. The neighborhood has a distinctly alternative vibe — think more record stores and tattoo parlors than chains.

Housing in North Loop is predominantly small-to-mid-size bungalows and cottages from the 1930s through 1950s, many on generous lots with mature trees. Some have been updated with modern finishes while retaining their vintage charm. Prices are more accessible than neighboring Hyde Park, though the gap has narrowed as buyers discover North Loop's appeal. The location is ideal: central enough to bike anywhere, with easy access to the Red Line commuter rail and multiple bus routes.`,
    highlights: [
      'Indie retail strip: Breakaway Records, Room Service Vintage, Epoch Coffee',
      'Walkable to restaurants like Foreign & Domestic and drink.well',
      'Affordable relative to neighboring Hyde Park and Rosedale',
      'Excellent central location with easy bike access to campus and downtown',
      'Charming 1930s-1950s bungalows on tree-lined streets',
    ],
    bestFor: ['Creatives', 'Vinyl collectors', 'Young professionals', 'Bike commuters'],
    nearbyLandmarks: [
      'Breakaway Records',
      'Epoch Coffee',
      'Foreign & Domestic',
      'Monkeywrench Books',
      'North Loop Boulevard shops',
    ],
  },

  // ─── WEST AUSTIN / WESTLAKE ───────────────────────────────────────────
  {
    slug: 'westlake-hills',
    description: `Westlake Hills is Austin's most prestigious address — a lush, hilly enclave west of MoPac that consistently ranks among the top communities in Texas for schools, safety, and quality of life. The City of Westlake Hills is an incorporated municipality within the Austin metro, giving residents their own city services while maintaining easy access to downtown, just 15 minutes east on Bee Cave Road.

The neighborhood is defined by rolling terrain, towering oaks, and homes that range from established 1970s ranches to breathtaking contemporary estates perched on limestone bluffs. Lot sizes are generous, often an acre or more, and many properties offer Hill Country views that never get old. Streets like Redbud Trail, Westlake Drive, and Laurel Valley Road showcase some of the finest residential architecture in the region.

What draws most families to Westlake is the Eanes Independent School District — consistently one of the highest-rated districts in Texas. Westlake High School is a perennial state football powerhouse, and the schools routinely produce National Merit Scholars. The Westlake community is active and engaged, with the Hill Country Galleria and the shops at the Davenport Village providing nearby retail and dining. For buyers seeking top-tier schools, privacy, and a Hill Country setting minutes from the city, Westlake Hills is the gold standard.`,
    highlights: [
      'Eanes ISD — one of the top-rated school districts in Texas',
      'Generous lot sizes with Hill Country views and mature trees',
      'Incorporated city with its own police, roads, and low taxes',
      '15-minute commute to downtown Austin via MoPac or Bee Cave Road',
      'Westlake High School — top academics and athletics statewide',
    ],
    bestFor: ['Families', 'Executives', 'Top-school seekers', 'Privacy and space'],
    nearbyLandmarks: [
      'Westlake High School',
      'Wild Basin Wilderness Preserve',
      'Hill Country Galleria',
      'Davenport Village',
      'Emma Long Metropolitan Park',
    ],
  },
  {
    slug: 'west-lake-hills',
    description: `West Lake Hills is Austin's most prestigious address — a lush, hilly enclave west of MoPac that consistently ranks among the top communities in Texas for schools, safety, and quality of life. The City of West Lake Hills is an incorporated municipality within the Austin metro, giving residents their own city services while maintaining easy access to downtown, just 15 minutes east on Bee Cave Road.

The neighborhood is defined by rolling terrain, towering oaks, and homes that range from established 1970s ranches to breathtaking contemporary estates perched on limestone bluffs. Lot sizes are generous, often an acre or more, and many properties offer Hill Country views that never get old. Streets like Redbud Trail, Westlake Drive, and Laurel Valley Road showcase some of the finest residential architecture in the region.

What draws most families here is the Eanes Independent School District — consistently one of the highest-rated districts in Texas. Westlake High School is a perennial state football powerhouse, and the schools routinely produce National Merit Scholars. The community is active and engaged, with the Hill Country Galleria and nearby Bee Cave shops providing retail and dining. For buyers seeking top-tier schools, privacy, and a Hill Country setting minutes from the city, West Lake Hills is the gold standard.`,
    highlights: [
      'Eanes ISD — one of the top-rated school districts in Texas',
      'Generous lot sizes with Hill Country views and mature trees',
      'Incorporated city with its own police, roads, and services',
      '15-minute commute to downtown Austin via MoPac or Bee Cave Road',
      'Westlake High School — top academics and athletics statewide',
    ],
    bestFor: ['Families', 'Executives', 'Top-school seekers', 'Privacy and space'],
    nearbyLandmarks: [
      'Westlake High School',
      'Wild Basin Wilderness Preserve',
      'Hill Country Galleria',
      'Davenport Village',
      'Emma Long Metropolitan Park',
    ],
  },
  {
    slug: 'tarrytown',
    description: `Tarrytown is Austin's quintessential old-money neighborhood — a stately, tree-canopied enclave between MoPac and Lake Austin that has been home to Austin's civic and business leaders for generations. The winding streets are lined with gracious colonials, Tudor revivals, and mid-century ranches, many set on large lots shaded by centuries-old pecan and live oak trees. Newer custom homes command premium prices along Exposition Boulevard and Windsor Road.

The neighborhood's location is exceptional. Tarrytown sits between Red Bud Isle (a beloved off-leash dog park on Lake Austin), the Walsh Boat Landing, and the shops and restaurants along Exposition Boulevard. Deep Eddy Pool — the oldest swimming pool in Texas, spring-fed and city-operated — is a neighborhood treasure that draws swimmers from across Austin every summer.

Tarrytown feeds into Austin ISD's Casis Elementary, a highly rated neighborhood school, and ultimately into Austin High School. The Tarrytown Pharmacy and the shops along Exposition form the neighborhood's commercial heart. For buyers who want established prestige, walkable convenience, lake proximity, and some of the most beautiful residential streets in Austin, Tarrytown is the answer.`,
    highlights: [
      'Deep Eddy Pool — Texas\' oldest swimming pool, spring-fed and free',
      'Red Bud Isle — off-leash dog park on Lake Austin',
      'Casis Elementary and Austin High School — top-rated AISD schools',
      'Grand, tree-lined streets with established luxury homes',
      'Walking distance to shops and dining on Exposition Boulevard',
    ],
    bestFor: ['Families', 'Executives', 'Dog owners', 'Luxury home buyers'],
    nearbyLandmarks: [
      'Deep Eddy Pool',
      'Red Bud Isle',
      'Tarrytown Pharmacy',
      'Lake Austin',
      'Casis Elementary School',
    ],
  },
  {
    slug: 'clarksville',
    description: `Clarksville is a tiny, historically significant neighborhood wedged between downtown Austin and MoPac, offering a rare combination of walkability, character, and urban convenience. Originally founded in 1871 as a freedmen's community by Charles Clark, Clarksville is one of the oldest African American settlements west of the Mississippi, and its history is woven into every block.

Today, Clarksville is a high-demand neighborhood of charming cottages, renovated bungalows, and modern infill homes on small lots along streets like West Lynn, Waterston, and West 10th. The commercial strip along West Lynn Street anchors the neighborhood with favorites like Josephine House, Nau's Enfield Drug (a classic soda fountain), Jeffrey's (fine dining landmark), and Cipollina. You can walk to Whole Foods flagship, BookPeople, and Waterloo Records on nearby Lamar.

Despite its compact size, Clarksville feels like a village. The neighborhood association is active, the annual Clarksville Jazz Festival celebrates the area's heritage, and the proximity to Pease Park and Shoal Creek Trail adds green space to this urban pocket. Homes here command top dollar — it's among the most expensive per-square-foot neighborhoods in Austin — but buyers are paying for a lifestyle that's truly irreplaceable.`,
    highlights: [
      'Walkable to downtown, Whole Foods flagship, and West Lynn shops',
      'Rich history as one of Texas\' oldest freedmen\'s communities',
      'Top-tier dining: Jeffrey\'s, Josephine House, Cipollina',
      'Charming cottages and bungalows with historic character',
      'Adjacent to Pease Park and Shoal Creek Trail',
    ],
    bestFor: ['Urban professionals', 'History enthusiasts', 'Foodies', 'Walkability enthusiasts'],
    nearbyLandmarks: [
      'Jeffrey\'s Restaurant',
      'Nau\'s Enfield Drug',
      'Pease Park',
      'Whole Foods Market flagship',
      'Shoal Creek Trail',
    ],
  },
  {
    slug: 'old-west-austin',
    description: `Old West Austin encompasses some of the city's most historic and desirable residential streets, stretching roughly from Lamar Boulevard west to MoPac between Enfield Road and Lake Austin Boulevard. This is where Austin's earliest families built their homes, and the neighborhood retains a graceful, established character that's increasingly rare in the city's booming real estate landscape.

Homes here span a remarkable range of architectural styles: stately 1920s colonials on Scenic Drive, charming stone cottages along Harris Boulevard, and tasteful contemporary builds that blend seamlessly with the older fabric. The terrain is gently rolling, with mature trees providing shade and privacy. Many properties back up to Shoal Creek or offer glimpses of the Hill Country skyline.

Old West Austin's location is its calling card. You're within easy walking or biking distance of downtown, the West Lynn shops, and Lake Austin. Pease Park — Austin's Central Park equivalent — borders the neighborhood to the north, and the Shoal Creek Trail provides a shaded corridor all the way to Lady Bird Lake. Mathews Elementary and Austin High School serve the area. This is established Austin at its finest: quiet streets, deep roots, and unbeatable proximity to everything that makes the city great.`,
    highlights: [
      'Some of Austin\'s most historic and architecturally significant homes',
      'Walking distance to downtown, West Lynn, and Lake Austin',
      'Adjacent to Pease Park and Shoal Creek Trail',
      'Mathews Elementary and Austin High School attendance zone',
      'Quiet, tree-lined streets with a strong sense of heritage',
    ],
    bestFor: ['History buffs', 'Luxury home buyers', 'Families', 'Downtown commuters'],
    nearbyLandmarks: [
      'Pease Park',
      'Shoal Creek Trail',
      'Lake Austin',
      'West Lynn shops and restaurants',
      'Austin High School',
    ],
  },
  {
    slug: 'rollingwood',
    description: `Rollingwood is a small, incorporated city nestled between Zilker Park and Westlake Hills that punches well above its weight. With just over 1,500 residents, this tight-knit community offers the privacy and space of west Austin with a remarkably short commute to downtown — most residents are at their desk in 10 minutes via Bee Cave Road or MoPac.

The housing stock in Rollingwood is a mix of well-maintained mid-century homes from the 1950s and '60s and stunning contemporary rebuilds. The lots are spacious, the streets are quiet, and the community has its own city services including a beloved swimming pool and tennis courts at the Rollingwood City Park. Zilker Park and the Barton Creek Greenbelt are literally next door.

Rollingwood feeds into the Eanes ISD school system — the same top-rated district that serves Westlake Hills. Rollingwood Elementary is the neighborhood school, and residents benefit from Eanes' exceptional academic programs. The small-town governance means responsive city services and a genuine sense of community. With its combination of location, schools, and livability, Rollingwood offers perhaps the best value proposition in the Eanes ISD footprint.`,
    highlights: [
      'Eanes ISD schools — top-rated academics in Texas',
      '10-minute commute to downtown Austin',
      'Adjacent to Zilker Park and Barton Creek Greenbelt',
      'Community pool, tennis courts, and city park',
      'Incorporated city with responsive local government',
    ],
    bestFor: ['Families', 'Outdoor enthusiasts', 'Short commuters', 'Value seekers in Eanes ISD'],
    nearbyLandmarks: [
      'Zilker Park',
      'Barton Creek Greenbelt',
      'Rollingwood City Park & Pool',
      'Barton Springs Pool',
      'Bee Cave Road shops',
    ],
  },

  // ─── LAKE / WEST COMMUNITIES ──────────────────────────────────────────
  {
    slug: 'steiner-ranch',
    description: `Steiner Ranch is one of Austin's most popular master-planned communities, spread across 4,600 acres of rolling Hill Country terrain along the shores of Lake Austin. Developed beginning in the late 1990s, the community has matured into a vibrant neighborhood of roughly 10,000 homes with an extensive amenity package that rivals any resort: multiple pools, a lakeside park, tennis courts, sports fields, and miles of hike-and-bike trails.

The housing stock ranges from starter homes in the mid-$400Ks to luxury estates above $2M in gated sections like The Commons and River Dance. Architecture leans Mediterranean and Hill Country contemporary, with many homes offering dramatic views of Lake Austin or the surrounding canyon lands. The community's three swim centers — including the impressive Lakeside Amenity Center — are social hubs throughout the summer.

Steiner Ranch is served by Leander ISD, which has invested heavily in the area's schools. Steiner Ranch Elementary, River Ridge Elementary, and Canyon Ridge Middle School are all within the community. The main trade-off is the commute: RM 620 can be congested during peak hours, though the 45th/MoPac route provides an alternative. For families who prioritize amenities, outdoor living, and lake access, Steiner Ranch is hard to beat.`,
    highlights: [
      'Resort-style amenities: multiple pools, sports courts, lakeside park',
      'Lake Austin access with boat ramp and shoreline parks',
      'Miles of hike-and-bike trails through Hill Country terrain',
      'Leander ISD schools within the community',
      'Wide range of home prices from $400Ks to $2M+',
    ],
    bestFor: ['Families', 'Lake lovers', 'Active lifestyles', 'Resort-style living'],
    nearbyLandmarks: [
      'Lake Austin',
      'Steiner Ranch Lakeside Amenity Center',
      'Hippie Hollow Park',
      'Lakeway',
      'RM 620 corridor',
    ],
  },
  {
    slug: 'river-place',
    description: `River Place is a well-established master-planned community tucked into the canyons of northwest Austin along RM 2222, offering a secluded Hill Country lifestyle within 20 minutes of downtown. The community wraps around a dramatic limestone canyon and the River Place Country Club, a private facility with golf, tennis, swimming, and dining that serves as the neighborhood's social centerpiece.

Homes in River Place range from the low $500Ks for townhomes near the entrance to multi-million-dollar custom estates deeper within the community. The terrain is dramatic — many homes are built into hillsides with expansive canyon and lake views. Architectural styles lean toward Hill Country limestone and stucco, with generous lot sizes and mature landscaping throughout.

River Place is served by Leander ISD and feeds into Four Points Middle School and Vandegrift High School, which has quickly become one of the top-rated high schools in the area. The community's trail system connects to the River Place Nature Trail, one of the more challenging and scenic hikes in the Austin area. While RM 2222 can be winding, the trade-off is a peaceful, almost retreat-like setting that feels worlds away from the city.`,
    highlights: [
      'Private country club with golf, tennis, and swimming',
      'Dramatic canyon and Hill Country views',
      'River Place Nature Trail — one of Austin\'s best hikes',
      'Leander ISD with Vandegrift High School',
      'Secluded Hill Country feel, 20 minutes from downtown',
    ],
    bestFor: ['Families', 'Golf enthusiasts', 'Nature lovers', 'Country club lifestyle'],
    nearbyLandmarks: [
      'River Place Country Club',
      'River Place Nature Trail',
      'Lake Austin',
      'Concordia University',
      'Four Points area shops',
    ],
  },
  {
    slug: 'lakeway',
    description: `Lakeway is the crown jewel of the Lake Travis corridor — an incorporated city of roughly 20,000 residents that combines resort-style living with Hill Country beauty and a strong sense of community. Situated on the southern shore of Lake Travis about 30 minutes west of downtown Austin, Lakeway offers an escape from the city's pace while remaining well-connected via RM 620 and Bee Cave Road.

The real estate landscape in Lakeway is diverse. Neighborhoods like Rough Hollow offer new construction with marina access, while established communities like Lakeway proper feature mid-century ranches and custom homes on spacious lots. The Lakeway Resort and Spa and the Flintrock Falls golf course anchor the community's resort identity. The new Lakeway Town Center has added walkable retail, restaurants, and a sense of downtown energy.

Lake Travis access is the headline, but Lakeway's appeal runs deeper. The Lake Travis ISD is well-regarded, with Lake Travis High School consistently ranked among the state's best. The community offers its own police force, city services, and a packed events calendar. Hamilton Pool Preserve is a short drive away, and the Hill Country wine trail begins just to the south. For buyers seeking a lake lifestyle with top schools and community infrastructure, Lakeway delivers.`,
    highlights: [
      'Direct Lake Travis access with multiple marinas and boat launches',
      'Lake Travis ISD — top-rated schools, including LT High School',
      'Lakeway Resort and Spa with golf at Flintrock Falls',
      'New Lakeway Town Center with walkable shops and restaurants',
      'Hill Country wine trail and Hamilton Pool Preserve nearby',
    ],
    bestFor: ['Lake lovers', 'Families', 'Retirees', 'Golf enthusiasts'],
    nearbyLandmarks: [
      'Lake Travis',
      'Lakeway Resort and Spa',
      'Rough Hollow marina',
      'Hamilton Pool Preserve',
      'Hill Country Galleria',
    ],
  },
  {
    slug: 'bee-cave',
    description: `Bee Cave has evolved from a tiny Hill Country outpost into one of the Austin metro's most sought-after suburban communities. Located along Highway 71 about 20 minutes west of downtown, Bee Cave offers a small-town atmosphere backed by excellent schools, upscale shopping, and easy access to Lake Travis and the Hill Country wine trail.

The Hill Country Galleria is Bee Cave's commercial centerpiece — an open-air lifestyle center with shops, restaurants, a movie theater, and a live music venue that hosts free concerts on the lawn. Residential neighborhoods like Spanish Oaks, Falconhead, and The Backyard surround the commercial core, offering everything from family-friendly tract homes to gated luxury estates on sprawling lots.

Bee Cave falls within the Lake Travis ISD, one of the top school districts in the Austin metro. The community's growth has been thoughtful, with an emphasis on preserving the Hill Country character that draws people here in the first place. Weekend life in Bee Cave often involves trips to Pedernales Falls State Park, winery hopping along 290, or boat days on Lake Travis. With its combination of suburban convenience and Hill Country charm, Bee Cave has become a magnet for relocating families and executives.`,
    highlights: [
      'Hill Country Galleria — open-air shopping, dining, and live music',
      'Lake Travis ISD — among the top school districts in the metro',
      'Gateway to Hill Country wineries and Pedernales Falls',
      'Mix of family neighborhoods and luxury gated communities',
      '20 minutes to downtown Austin via Highway 71',
    ],
    bestFor: ['Families', 'Executives', 'Wine enthusiasts', 'Hill Country lifestyle'],
    nearbyLandmarks: [
      'Hill Country Galleria',
      'Lake Travis',
      'Pedernales Falls State Park',
      'Bee Cave Central Park',
      'Backyard amphitheater area',
    ],
  },
  {
    slug: 'dripping-springs',
    description: `Dripping Springs has earned its nickname as "The Gateway to the Hill Country" — and for good reason. This charming small town about 25 miles southwest of Austin has become one of the fastest-growing communities in the region, attracting buyers who want acreage, Hill Country views, and a slower pace of life without being far from the city. The drive along Highway 290 is scenic, and Austin is reachable in 30-40 minutes.

The town's character is defined by its thriving local food and drink scene. Dripping Springs is home to Treaty Oak Distilling, Deep Eddy Vodka's production facility, Jester King Brewery, and a growing collection of wineries, wedding venues, and farm-to-table restaurants. Mercer Street, the historic main drag, has been revitalized with local shops, a farmers' market, and community events that bring residents together.

Real estate in Dripping Springs ranges from affordable new construction in master-planned communities like Caliterra and Headwaters to large ranch properties and custom Hill Country estates. The Dripping Springs ISD is well-regarded and growing, with new campuses opening to keep pace with demand. For buyers who dream of space, sunsets, and a community where the barista knows your name, Dripping Springs delivers the Hill Country lifestyle at its best.`,
    highlights: [
      'Gateway to Hill Country — wineries, distilleries, and scenic drives',
      'Jester King Brewery, Treaty Oak Distilling, and Deep Eddy Vodka nearby',
      'Dripping Springs ISD with new, modern school campuses',
      'Mix of master-planned communities and ranch-style acreage',
      'Charming downtown with local shops and farmers\' market',
    ],
    bestFor: ['Families', 'Hill Country lovers', 'Space seekers', 'Foodies and craft drink fans'],
    nearbyLandmarks: [
      'Jester King Brewery',
      'Treaty Oak Distilling',
      'Hamilton Pool Preserve',
      'Pedernales Falls State Park',
      'Mercer Street downtown',
    ],
  },
  {
    slug: 'lake-travis',
    description: `The Lake Travis area encompasses a collection of communities along Austin's beloved Highland Lakes chain, stretching from Lakeway and Bee Cave in the south to Jonestown and Lago Vista in the north. Lake Travis itself is a 63-mile-long reservoir known for its clear blue water, dramatic limestone cliffs, and some of the best recreational boating in Texas.

Living along Lake Travis means embracing the water. Many homes offer lake views or direct waterfront access, and weekend life revolves around boating, paddleboarding, swimming, and sunset watching from one of the area's many waterfront restaurants. The Oasis on Lake Travis — the self-proclaimed "Sunset Capital of Texas" — is a landmark dining destination with panoramic views from its multi-level deck.

Real estate along the lake varies dramatically: from modest lake cabins and condos in the $300Ks to sprawling waterfront estates above $5M. Communities like Rough Hollow, Briarcliff, and Cardinal Hills offer different lifestyle options at various price points. Lake Travis ISD and Lago Vista ISD serve the area with solid schools. The trade-off for lake living is the commute — most residents are 30-45 minutes from downtown — but for those who measure quality of life by sunsets over the water, there's no better place in the Austin metro.`,
    highlights: [
      '63-mile reservoir with world-class boating and water sports',
      'Dramatic waterfront properties with cliff and lake views',
      'The Oasis on Lake Travis — iconic sunset dining',
      'Lake Travis ISD and strong community schools',
      'Wide range of price points from lake condos to waterfront estates',
    ],
    bestFor: ['Lake lovers', 'Boaters', 'Retirees', 'Vacation home buyers'],
    nearbyLandmarks: [
      'Lake Travis',
      'The Oasis on Lake Travis',
      'Hippie Hollow Park',
      'Mansfield Dam',
      'Volente Beach',
    ],
  },

  // ─── NORTH CENTRAL / CENTRAL ──────────────────────────────────────────
  {
    slug: 'rosedale',
    description: `Rosedale is one of central Austin's most charming and family-friendly neighborhoods, tucked between Burnet Road and Shoal Creek just north of 45th Street. The neighborhood is defined by its tree-lined streets, well-maintained mid-century homes, and a warm, neighborly atmosphere that feels like a throwback to a simpler era. Residents here know each other — block parties, front-porch conversations, and kids playing in the street are everyday occurrences.

The housing stock is predominantly 1940s and 1950s bungalows and ranches, many of which have been lovingly updated with modern kitchens and additions while retaining their original character. Lots are modest but well-kept, and the mature live oaks and pecans create a shaded canopy that makes summer walks bearable. Rosedale Park, the neighborhood's green heart, features a pool, playscape, and basketball courts.

Rosedale's location is its secret weapon. You're within biking distance of the Domain, UT campus, and downtown, with Burnet Road's restaurant row — including Barley Swine, Uchiko, and the Aristocrat Lounge — on your doorstep. Rosedale Elementary is a beloved AISD school, and the neighborhood feeds into Lamar Middle School and McCallum High School. For families and couples seeking central Austin living with genuine neighborhood charm, Rosedale is hard to beat.`,
    highlights: [
      'Charming 1940s-1950s bungalows on tree-lined streets',
      'Rosedale Park with community pool, playscapes, and sports courts',
      'Rosedale Elementary — a highly regarded AISD neighborhood school',
      'Walking distance to Burnet Road restaurants: Barley Swine, Uchiko',
      'Central location with easy access to downtown, UT, and the Domain',
    ],
    bestFor: ['Families', 'Couples', 'Neighborhood charm seekers', 'Central location lovers'],
    nearbyLandmarks: [
      'Rosedale Park & Pool',
      'Burnet Road restaurant row',
      'Ramsey Park',
      'Shoal Creek Trail',
      'Barley Swine / Uchiko',
    ],
  },
  {
    slug: 'allandale',
    description: `Allandale is one of Austin's most dependable and well-loved neighborhoods — a sprawling, established community between Burnet Road and Shoal Creek that consistently delivers strong value for central Austin living. The neighborhood stretches roughly from 2222 south to 45th Street, offering a generous footprint of tree-shaded streets, neighborhood parks, and easy access to some of Austin's best retail and dining corridors.

Homes in Allandale are predominantly mid-century ranch houses from the 1950s and '60s, many on quarter-acre lots or larger. The building boom has brought numerous teardown-and-rebuilds, resulting in a mix of character-filled originals and striking modern homes. Prices are competitive for central Austin, making Allandale a popular choice for families who want quality without the seven-figure price tags of Tarrytown or Zilker.

The neighborhood is served by several strong AISD elementary schools, including Gullett and Davis, and feeds into Lamar Middle School and McCallum High School. Northwest Recreation Center offers a community pool, gym, and event space. Shoal Creek Trail runs along the neighborhood's eastern edge, and Burnet Road provides an endless supply of restaurants, coffee shops, and local businesses. Allandale is the kind of neighborhood where you plant roots and stay.`,
    highlights: [
      'Spacious mid-century homes on generous lots at central Austin prices',
      'Multiple AISD elementary schools: Gullett, Davis',
      'Shoal Creek Trail and Northwest Recreation Center',
      'Adjacent to Burnet Road\'s booming restaurant scene',
      'Active neighborhood association with strong community identity',
    ],
    bestFor: ['Families', 'Value seekers in central Austin', 'Mid-century home lovers', 'Outdoor enthusiasts'],
    nearbyLandmarks: [
      'Northwest Recreation Center',
      'Shoal Creek Trail',
      'Burnet Road shops and restaurants',
      'Allandale Park',
      'Beverly S. Sheffield Northwest District Park',
    ],
  },
  {
    slug: 'crestview',
    description: `Crestview is one of Austin's most buzzworthy neighborhoods — a formerly under-the-radar pocket between Burnet Road and North Lamar that has blossomed into a walkable, community-driven destination. The neighborhood's commercial heart along Justin Lane features a curated collection of local favorites: Little Deli & Pizzeria, Brentwood Social House, and the original Genuine Joe Coffeehouse.

The Crestview Station development brought a MetroRail stop to the neighborhood, making it one of the few Austin neighborhoods with viable public transit connections to downtown. The mixed-use development around the station includes condos, townhomes, and retail, adding density while maintaining the neighborhood's character. Surrounding streets are filled with 1950s ranch homes, many thoughtfully renovated.

What makes Crestview special is the neighborhood's intentional community building. The Crestview Neighborhood Association hosts regular events, the pocket parks are well-maintained, and the walkable commercial strip creates natural gathering points. For buyers who want a genuine neighborhood feel with transit access and a walkable main street — rare in Austin — Crestview checks every box.`,
    highlights: [
      'Crestview Station MetroRail stop — transit to downtown',
      'Walkable commercial strip: Little Deli, Brentwood Social House',
      'Strong neighborhood association with regular community events',
      'Renovated 1950s ranch homes with modern updates',
      'Central location between Burnet Road and North Lamar corridors',
    ],
    bestFor: ['Transit riders', 'Community-minded buyers', 'Young families', 'Walkability seekers'],
    nearbyLandmarks: [
      'Crestview Station (MetroRail)',
      'Little Deli & Pizzeria',
      'Brentwood Social House',
      'Justin Lane shops',
      'Brentwood Park',
    ],
  },
  {
    slug: 'brentwood',
    description: `Brentwood sits right next to Crestview and shares many of its virtues — tree-lined streets, mid-century charm, and a central location that's hard to beat. Bounded roughly by Burnet Road, North Lamar, Justin Lane, and 45th Street, Brentwood offers a slightly quieter residential feel than its buzzier neighbor while enjoying the same walkable amenities.

The housing stock is classic central Austin: 1950s ranch homes and bungalows, many of which have been renovated with open floor plans, updated kitchens, and additions that double or triple the original square footage. Teardown-and-rebuilds are common, resulting in modern homes on established, tree-shaded lots. The neighborhood park — Brentwood Park — features a playground, basketball courts, and a popular neighborhood pool.

Brentwood's proximity to Burnet Road means residents have Uchiko, Barley Swine, Top Notch Hamburgers, and dozens of other restaurants within walking distance. The neighborhood feeds into Brentwood Elementary (a strong AISD school), Lamar Middle School, and McCallum High School. For buyers priced out of Rosedale or seeking more value than Crestview's station-adjacent condos, Brentwood offers an excellent middle ground.`,
    highlights: [
      'Classic mid-century homes on tree-lined streets',
      'Brentwood Park with community pool and playground',
      'Brentwood Elementary — well-regarded AISD school',
      'Walking distance to Burnet Road dining and shopping',
      'Excellent value for central Austin real estate',
    ],
    bestFor: ['Families', 'Value seekers', 'Mid-century home lovers', 'Central location seekers'],
    nearbyLandmarks: [
      'Brentwood Park & Pool',
      'Top Notch Hamburgers',
      'Burnet Road corridor',
      'Brentwood Elementary',
      'Twin Oaks Library',
    ],
  },

  // ─── NORTH AUSTIN / SUBURBAN ──────────────────────────────────────────
  {
    slug: 'circle-c-ranch',
    description: `Circle C Ranch is southwest Austin's premier master-planned community — a sprawling, amenity-rich neighborhood that has been home to families since the early 1990s. Situated along MoPac's southern corridor near Slaughter Lane, Circle C offers a suburban lifestyle with surprisingly good access to central Austin. Downtown is about 20 minutes via MoPac, and the area's commercial growth means most daily needs are met locally.

The community is divided into distinct sections — Hielscher, Meridian, Heritage, and the newer Grey Rock addition — each with its own character and price range. Homes range from the $400Ks for updated original builds to $1M+ for newer construction in Grey Rock. The Circle C amenity package is impressive: a community center, multiple pools (including the swim center with competition lanes and water slides), sports fields, playgrounds, and miles of greenbelt trails along Slaughter Creek.

Circle C feeds into Austin ISD and is anchored by Mills Elementary, Kiker Elementary, and Bailey Middle School — all well-regarded campuses. The Grey Rock Golf Club offers public play on a scenic Hill Country course. For families who want space, amenities, and nature without leaving Austin city limits, Circle C Ranch has delivered for three decades.`,
    highlights: [
      'Extensive amenity package: pools, sports fields, community center',
      'Miles of greenbelt trails along Slaughter Creek',
      'Grey Rock Golf Club — public Hill Country golf',
      'Strong AISD schools: Mills Elementary, Kiker Elementary, Bailey Middle',
      '20-minute commute to downtown via MoPac',
    ],
    bestFor: ['Families', 'Golfers', 'Trail runners', 'Suburban lifestyle seekers'],
    nearbyLandmarks: [
      'Grey Rock Golf Club',
      'Circle C Community Center',
      'Slaughter Creek Greenbelt',
      'Escarpment Village shopping',
      'Lady Bird Johnson Wildflower Center',
    ],
  },
  {
    slug: 'avery-ranch',
    description: `Avery Ranch is one of northwest Austin's most popular master-planned communities, straddling Parmer Lane and Avery Ranch Boulevard in the rapidly growing Cedar Park / Austin corridor. Since its debut in the early 2000s, Avery Ranch has attracted thousands of families with its excellent schools, resort-style amenities, and a location that balances suburban space with urban access.

The community is anchored by the Avery Ranch Golf Club, a public course that winds through the neighborhood's rolling terrain. Residents also enjoy multiple pools, a splash pad, sports courts, a fitness center, and miles of walking trails. The homes range from townhomes and patio homes in the $300Ks to larger single-family residences above $700K in newer sections like Lakeline Oaks.

Avery Ranch is served by Round Rock ISD — consistently one of the top school districts in Central Texas. Fern Bluff Elementary, Pearson Ranch Middle School, and McNeil High School all serve portions of the community. The 183A toll road provides a quick commute south to the Domain or downtown, and the local retail along Parmer Lane includes H-E-B, Target, and a growing roster of restaurants. For families seeking a complete suburban package with top-tier schools, Avery Ranch delivers.`,
    highlights: [
      'Round Rock ISD — one of Central Texas\' top school districts',
      'Avery Ranch Golf Club and resort-style community amenities',
      'Multiple pools, fitness center, and miles of walking trails',
      'Quick access to the Domain and downtown via 183A toll road',
      'Homes from the $300Ks to $700K+ — variety for every buyer',
    ],
    bestFor: ['Families', 'Golfers', 'Suburban lifestyle seekers', 'Round Rock ISD fans'],
    nearbyLandmarks: [
      'Avery Ranch Golf Club',
      'Avery Ranch Community Pool',
      'Brushy Creek Regional Trail',
      'The Domain (10 min south)',
      '1890 Ranch Shopping Center',
    ],
  },
  {
    slug: 'domain',
    description: `The Domain — also known as North Burnet — has transformed from an empty stretch of office parks into Austin's second downtown. This mixed-use mega-development at MoPac and Burnet Road combines high-rise living, luxury retail, tech-company headquarters, and a walkable street grid that's unlike anything else in the city. Apple, Facebook (Meta), Amazon, and dozens of tech companies have offices here, making it a true live-work-play destination.

Residential options at the Domain include sleek high-rise apartments and condos at buildings like The Whitley, Moontower, and AMLI. The Domain NORTHSIDE addition expanded the retail footprint with more upscale brands and restaurants, while Rock Rose Avenue has become the area's social heart — a pedestrian-friendly strip of bars, restaurants, and entertainment venues that draws crowds nightly.

Living at the Domain is a lifestyle choice: you're trading yard space for walkability, concierge services, and the ability to stroll from your front door to Restoration Hardware, North Italia, or the Topgolf entertainment complex. The area is served by the MetroRail and multiple bus routes, and MoPac provides direct access to downtown in about 15 minutes. For young professionals, remote workers, and anyone who craves urban energy in a newer setting, the Domain has become Austin's most exciting address north of the river.`,
    highlights: [
      'Austin\'s second downtown — walkable urban living, dining, and shopping',
      'Major tech employers: Apple, Meta, Amazon within walking distance',
      'Rock Rose Avenue nightlife and restaurant scene',
      'High-rise condos and apartments with resort-style amenities',
      'MetroRail access and 15-minute drive to downtown via MoPac',
    ],
    bestFor: ['Young professionals', 'Tech workers', 'Urban lifestyle seekers', 'Empty nesters'],
    nearbyLandmarks: [
      'The Domain & Domain NORTHSIDE',
      'Rock Rose Avenue',
      'Topgolf Austin',
      'Apple Austin campus',
      'North Burnet Gateway',
    ],
  },
  {
    slug: 'anderson-mill',
    description: `Anderson Mill is one of northwest Austin's most established and family-friendly communities, stretching along US 183 between Cedar Park and the city proper. Developed primarily in the 1970s and '80s, Anderson Mill offers a rare combination in today's market: affordable homes in a mature, well-maintained neighborhood with convenient access to both the Domain corridor and Cedar Park's retail centers.

The housing stock is predominantly traditional single-family homes ranging from modest three-bedroom ranches to larger two-story colonials, most on comfortable quarter-acre lots. The neighborhood has aged gracefully, with mature trees providing shade and established landscaping giving the streets a settled, welcoming feel. Several cul-de-sac pockets offer quiet, kid-friendly environments.

Anderson Mill is split between Round Rock ISD and Leander ISD, both excellent school districts. The neighborhood association maintains community pools, tennis courts, and a clubhouse that hosts regular events. El Salido Park and Cat Hollow Park provide green space and sports facilities. For grocery runs, the H-E-B at Anderson Mill and 183 is a local staple. Buyers looking for affordable central-suburban living with good schools and easy highway access consistently find what they're looking for in Anderson Mill.`,
    highlights: [
      'Affordable homes in a mature, well-established neighborhood',
      'Round Rock ISD and Leander ISD — both top-rated districts',
      'Community pools, tennis courts, and neighborhood events',
      'Easy access to US 183, the Domain, and Cedar Park retail',
      'Mature trees and established landscaping throughout',
    ],
    bestFor: ['Families', 'First-time buyers', 'Value seekers', 'Suburban commuters'],
    nearbyLandmarks: [
      'Anderson Mill Community Pool',
      'El Salido Park',
      'Lakeline Mall',
      'The Domain (15 min south)',
      'H-E-B Anderson Mill',
    ],
  },
  {
    slug: 'cedar-park',
    description: `Cedar Park is the northwest Austin suburb that has it all — top-rated schools, a booming retail scene, excellent parks, and an increasingly diverse housing market that attracts everyone from first-time buyers to move-up families. With a population that has more than doubled since 2000, Cedar Park's growth has been matched by thoughtful infrastructure investment, making it one of the most livable suburbs in the Austin metro.

The city stretches from Brushy Creek in the east to the shores of Lake Travis in the west, encompassing established neighborhoods like Anderson Mill West and Buttercup Creek as well as newer developments like Bryson and Crystal Falls. Homes range from the $300Ks for starter properties to $800K+ for homes in the newer lakeside communities. The H-E-B Center at Cedar Park hosts concerts and the Texas Stars hockey team, giving the city its own entertainment anchor.

Cedar Park is served by Leander ISD, which has seen dramatic improvements and is now one of the most sought-after districts in the metro. The city's parks system includes Brushy Creek Lake Park, Elizabeth Milburn Park, and the newly expanded Cedar Park Recreation Center. The 183A toll road connects to the Domain and downtown Austin in about 20 minutes. Cedar Park offers the rare suburban combination of affordability, growth, and genuine quality of life.`,
    highlights: [
      'Leander ISD — rapidly rising school district with new campuses',
      'H-E-B Center — concerts, hockey, and community events',
      'Brushy Creek Lake Park and Elizabeth Milburn Park',
      '183A toll road — 20 minutes to the Domain and downtown',
      'Diverse housing from $300K starter homes to $800K+ estates',
    ],
    bestFor: ['Families', 'First-time buyers', 'Sports fans', 'Growing families'],
    nearbyLandmarks: [
      'H-E-B Center at Cedar Park',
      'Brushy Creek Lake Park',
      '1890 Ranch Shopping Center',
      'Cedar Park Recreation Center',
      'Lakeline Mall',
    ],
  },
  {
    slug: 'round-rock',
    description: `Round Rock is the Austin metro's most established major suburb and a city in its own right — home to over 240,000 residents, the Dell Technologies headquarters, and one of the best public school districts in Texas. Located about 20 miles north of downtown Austin along I-35, Round Rock has evolved from a sleepy bedroom community into a thriving city with its own economic engine, cultural scene, and identity.

The real estate landscape is remarkably diverse. Historic downtown Round Rock along Main Street features charming older homes and a revitalized commercial district. Master-planned communities like Teravista, Paloma Lake, and Walsh Ranch offer newer homes with full amenity packages. Prices range from the low $300Ks in established sections to $700K+ in premium communities, making Round Rock accessible to a wide range of buyers.

Round Rock ISD is consistently rated among the top districts in Texas, with standout campuses like Westwood High School and Round Rock High School. Old Settlers Park provides 570 acres of sports fields, trails, and the Dell Diamond — home of the Round Rock Express minor league baseball team. Premium Outlets, IKEA, and the new Kalahari Resorts indoor waterpark have cemented Round Rock's status as a destination, not just a suburb. For buyers seeking value, schools, and community at scale, Round Rock is the standard bearer.`,
    highlights: [
      'Round Rock ISD — consistently among Texas\' top school districts',
      'Dell Technologies HQ and growing tech employment base',
      'Old Settlers Park: 570 acres, Dell Diamond, sports complexes',
      'Diverse housing: $300Ks to $700K+ across many communities',
      'Kalahari Resorts, IKEA, and Round Rock Premium Outlets',
    ],
    bestFor: ['Families', 'Tech workers', 'Value seekers', 'Sports families'],
    nearbyLandmarks: [
      'Dell Diamond (Round Rock Express)',
      'Old Settlers Park',
      'Round Rock Premium Outlets',
      'Kalahari Resorts',
      'Historic downtown Round Rock',
    ],
  },
  {
    slug: 'pflugerville',
    description: `Pflugerville — affectionately known as "Pflug" — is the Austin suburb that offers the most bang for your buck. Located just northeast of Austin along I-35 and SH 130, Pflugerville has grown from a small German farming community into a diverse, vibrant city of over 75,000 residents. The city's combination of affordability, community amenities, and improving infrastructure makes it one of the most popular destinations for families and first-time buyers in the metro.

The housing stock spans several decades, from established neighborhoods near downtown Pflugerville to expansive new master-planned communities like Avalon, Blackhawk, and Falcon Pointe. Home prices generally range from the mid-$200Ks to the low $600Ks — significantly below comparable homes in central Austin — with lot sizes and square footage that are hard to match at these price points.

Pflugerville ISD has invested heavily in new schools and programs, and the district continues to improve. Lake Pflugerville provides 180 acres of fishing, kayaking, and hiking trails right in the city, and the annual Deutschen Pfest celebrates the community's German heritage with food, music, and family fun. The SH 130 toll road provides a fast alternative to I-35 for commuters. For buyers who prioritize value, space, and a family-friendly atmosphere, Pflugerville is one of the Austin area's best-kept secrets.`,
    highlights: [
      'Most affordable homes in the close-in Austin suburbs',
      'Lake Pflugerville — 180 acres of fishing, kayaking, and trails',
      'Pflugerville ISD with continued investment in new campuses',
      'SH 130 toll road for fast commuting to east Austin and beyond',
      'Deutschen Pfest and strong community event calendar',
    ],
    bestFor: ['First-time buyers', 'Families', 'Value seekers', 'Commuters'],
    nearbyLandmarks: [
      'Lake Pflugerville',
      'Stone Hill Town Center',
      'Typhoon Texas Waterpark',
      'Deutschen Pfest',
      'Pflugerville Pfarmers Market',
    ],
  },
  {
    slug: 'wells-branch',
    description: `Wells Branch is a well-established master-planned community in north Austin that has been providing families with affordable, amenity-rich living since the early 1980s. Governed by a Municipal Utility District (MUD), Wells Branch offers its residents something unique: community-owned parks, pools, and recreation facilities funded through the MUD tax rather than HOA fees, resulting in an extensive amenity package at a reasonable cost.

The neighborhood sits along Wells Branch Parkway between I-35 and MoPac, giving residents easy access to both north Austin corridors. Homes are predominantly traditional single-family houses from the 1980s and '90s, with prices that remain among the most accessible in the Austin city limits. The housing stock is well-maintained, with tree-lined streets and a settled suburban character.

Wells Branch's real selling point is its amenity package. The Katherine Fleischer Park features a pool, splash pad, disc golf course, playgrounds, and a community garden. The Wells Branch Recreation Center hosts events throughout the year. The community's network of trails connects to Walnut Creek Metropolitan Park, one of Austin's premier mountain biking destinations. For buyers seeking affordable north Austin living with community infrastructure, Wells Branch has been delivering for four decades.`,
    highlights: [
      'MUD-funded amenities: pools, parks, recreation center, trails',
      'Katherine Fleischer Park with pool, splash pad, and disc golf',
      'Connected to Walnut Creek Metropolitan Park trail system',
      'Affordable homes in Austin city limits',
      'Easy access to I-35, MoPac, and the Domain corridor',
    ],
    bestFor: ['Families', 'First-time buyers', 'Mountain bikers', 'Value seekers'],
    nearbyLandmarks: [
      'Katherine Fleischer Park',
      'Walnut Creek Metropolitan Park',
      'Wells Branch Recreation Center',
      'Tech Ridge shopping',
      'Stone Hill Town Center',
    ],
  },
  {
    slug: 'brushy-creek',
    description: `Brushy Creek is a sprawling residential area in the Cedar Park / Round Rock corridor that encompasses several neighborhoods and subdivisions along the banks of its namesake waterway. The area combines the appeal of established suburban living — mature trees, good schools, and reasonable prices — with access to one of the best trail systems in the Austin metro.

The Brushy Creek Regional Trail is the area's crown jewel: a 10+ mile paved hike-and-bike trail that follows the creek through parks, neighborhoods, and natural areas from Champion Park in Cedar Park all the way to Brushy Creek Lake Park. Residents use it for commuting, jogging, cycling, and dog walking. The trail connects to several parks including Cat Hollow Park, which features a popular public pool.

Housing in the Brushy Creek area spans a wide range, from affordable 1980s-era homes in the low $300Ks to newer construction in the $500-600K range in communities like Ranch at Brushy Creek and Brushy Creek North. The area is served by both Round Rock ISD and Leander ISD, giving families multiple excellent school options. With its combination of trail access, school quality, and affordability, Brushy Creek is a dependable choice for families moving to the northwest Austin corridor.`,
    highlights: [
      'Brushy Creek Regional Trail — 10+ miles of paved hike-and-bike',
      'Cat Hollow Park with public pool and sports facilities',
      'Round Rock ISD and Leander ISD — both top-rated',
      'Wide range of home prices from $300Ks to $600Ks',
      'Established, tree-lined neighborhoods with suburban charm',
    ],
    bestFor: ['Families', 'Trail runners and cyclists', 'Value seekers', 'Nature lovers'],
    nearbyLandmarks: [
      'Brushy Creek Regional Trail',
      'Cat Hollow Park & Pool',
      'Brushy Creek Lake Park',
      'Champion Park',
      '1890 Ranch Shopping Center',
    ],
  },

  // ─── WEST / HILL COUNTRY ──────────────────────────────────────────────
  {
    slug: 'barton-creek',
    description: `Barton Creek is one of Austin's most exclusive residential communities — a gated enclave of luxury homes surrounding the prestigious Barton Creek Resort & Spa and its four championship golf courses. Nestled in the rolling Hill Country west of MoPac, the neighborhood offers a level of privacy, space, and natural beauty that few Austin communities can match.

The homes here are substantial, ranging from elegant Mediterranean villas to expansive Hill Country contemporary estates, most on lots of a half-acre or more. Price points start around $1M and climb well into the $3-5M range for premier golf course and canyon view properties. The architectural standards are high, and the community's mature landscaping — towering oaks, native stone walls, and manicured common areas — give Barton Creek a polished, resort-like atmosphere.

The Barton Creek Country Club offers multiple membership tiers with access to golf, tennis, spa, fitness, and dining. Despite its secluded feel, the community is well-connected: MoPac is minutes away, downtown Austin is about 20 minutes by car, and the shops and restaurants of Bee Cave and Westlake are nearby. Barton Creek feeds into Eanes ISD, adding top-tier schools to an already compelling lifestyle package. For buyers seeking premier Hill Country living with country club amenities, Barton Creek is Austin's gold standard.`,
    highlights: [
      'Gated community with four championship golf courses',
      'Barton Creek Resort & Spa — world-class amenities on-site',
      'Eanes ISD — top-rated schools in Texas',
      'Luxury estates on large lots with canyon and golf course views',
      '20-minute drive to downtown Austin via MoPac',
    ],
    bestFor: ['Luxury home buyers', 'Golf enthusiasts', 'Executives', 'Privacy seekers'],
    nearbyLandmarks: [
      'Barton Creek Resort & Spa',
      'Barton Creek Country Club',
      'Barton Creek Greenbelt',
      'Hill Country Galleria',
      'Bee Cave shops and restaurants',
    ],
  },
  {
    slug: 'lost-creek',
    description: `Lost Creek is a hidden gem of west Austin — a quiet, wooded neighborhood tucked between MoPac, Loop 360, and the Barton Creek Greenbelt. The community was developed primarily in the 1970s and '80s and retains a natural, almost rural character despite being just 15 minutes from downtown. Mature live oaks and cedars shade the winding streets, and many homes back up directly to the greenbelt.

The housing stock is predominantly single-family homes ranging from comfortable mid-century ranches to larger custom builds, with prices generally in the $600K to $1.2M range. Lots are spacious, and the neighborhood's topography — gentle hills and creek beds — gives each property a sense of privacy and seclusion. The Lost Creek Country Club, a private facility with a pool, tennis courts, and social events, anchors the community's social life.

Lost Creek feeds into Eanes ISD, giving residents access to the same top-tier schools as Westlake Hills at a somewhat lower price point. Barton Creek Greenbelt access is a major draw — several trailheads connect directly from neighborhood streets, making it easy to hike or mountain bike on a whim. The Loop 360 corridor provides convenient access to Westlake shops, the Hill Country Galleria, and the tech campuses along Research Boulevard. For buyers who want Eanes ISD schools and greenbelt living at a relative value, Lost Creek delivers.`,
    highlights: [
      'Direct access to Barton Creek Greenbelt from neighborhood streets',
      'Eanes ISD schools — top-rated at a relative value compared to Westlake',
      'Quiet, wooded streets with a secluded Hill Country feel',
      'Lost Creek Country Club with pool, tennis, and social events',
      '15-minute drive to downtown via MoPac or Loop 360',
    ],
    bestFor: ['Families', 'Outdoor enthusiasts', 'Value seekers in Eanes ISD', 'Privacy seekers'],
    nearbyLandmarks: [
      'Barton Creek Greenbelt',
      'Lost Creek Country Club',
      'Loop 360 / Capital of Texas Highway',
      'Westlake shops and restaurants',
      'Wild Basin Wilderness Preserve',
    ],
  },
  {
    slug: 'great-hills',
    description: `Great Hills is one of northwest Austin's most established and sought-after neighborhoods, perched on rolling terrain along the Loop 360 corridor between Spicewood Springs Road and US 183. The community has been a favorite of executives, tech professionals, and families since the 1980s, thanks to its combination of spacious homes, mature landscaping, and a central location that provides quick access to both the Arboretum area and downtown.

The homes in Great Hills are predominantly traditional two-story residences from the 1980s and '90s, set on generous lots with mature trees and landscaped yards. Many have been extensively updated, and the neighborhood's hilltop positions offer Hill Country views that are rare at this price point — generally $600K to $1.2M. The Great Hills Country Club features a pool, tennis courts, and an active social calendar.

Great Hills feeds into Round Rock ISD on the north side and Austin ISD on the south, so school zoning varies by address — buyers should verify specific campus assignments. The Arboretum and Gateway shopping centers are right next door, offering H-E-B, restaurants, and major retailers. The Loop 360 corridor provides scenic commuting, and the Balcones District Park offers trails and green space. Great Hills is the northwest Austin neighborhood where established families stay for decades.`,
    highlights: [
      'Spacious homes with Hill Country views on mature, wooded lots',
      'Great Hills Country Club — pool, tennis, and community events',
      'Adjacent to the Arboretum and Gateway shopping centers',
      'Central northwest location with Loop 360 and 183 access',
      'Homes in the $600K-$1.2M range — value for the quality',
    ],
    bestFor: ['Families', 'Tech professionals', 'Executives', 'Value seekers in northwest Austin'],
    nearbyLandmarks: [
      'The Arboretum shopping center',
      'Great Hills Country Club',
      'Balcones District Park',
      'St. Edward\'s Park',
      'Loop 360 scenic corridor',
    ],
  },

  // ─── ADDITIONAL COMMUNITIES ───────────────────────────────────────────
  {
    slug: 'north-burnet',
    description: `North Burnet — often used interchangeably with "The Domain area" — is Austin's most rapidly transforming corridor. Stretching along Burnet Road from Braker Lane to Parmer Lane, this area has evolved from a patchwork of office parks, industrial lots, and strip malls into a dense, mixed-use urban district anchored by the Domain development.

The residential boom in North Burnet has produced a wave of modern apartment complexes, urban condos, and townhome communities. Developments like The Whitley, 5 Fifty-Five, and Moontower offer contemporary urban living with walkability to shops, restaurants, and tech offices. Apple's new Austin campus is a major anchor, and the MetroRail Red Line provides transit connections to downtown.

What makes North Burnet compelling as a residential investment is its trajectory. The City of Austin has designated this as a major growth corridor with infrastructure improvements including dedicated bus lanes, improved bike infrastructure, and potential light rail connections. Properties here are appreciating as the area densifies and adds amenities. For buyers who want to be at the forefront of Austin's urban evolution — with modern construction and walkable living — North Burnet is the opportunity zone.`,
    highlights: [
      'Austin\'s fastest-growing mixed-use urban corridor',
      'Walkable to the Domain, Rock Rose Avenue, and major employers',
      'MetroRail Red Line access to downtown',
      'Modern construction: condos, townhomes, and luxury apartments',
      'Apple, Meta, and Amazon campuses nearby — tech employment hub',
    ],
    bestFor: ['Tech workers', 'Young professionals', 'Investors', 'Urban lifestyle seekers'],
    nearbyLandmarks: [
      'The Domain',
      'Apple Austin campus',
      'Topgolf Austin',
      'MetroRail stations',
      'Rock Rose Avenue',
    ],
  },
];

// Import generated descriptions for communities without hand-written content
import { generatedCommunityDescriptions } from './generated-community-descriptions';

// Combined list: hand-written first (takes priority), then generated
const allDescriptions: CommunityContent[] = [
  ...communityDescriptions,
  ...generatedCommunityDescriptions,
];

// Helper function to look up community content by slug
// Hand-written descriptions take priority over generated ones
export function getCommunityContent(slug: string): CommunityContent | undefined {
  return allDescriptions.find(
    (c) => c.slug === slug || c.slug === slug.toLowerCase().replace(/\s+/g, '-')
  );
}
