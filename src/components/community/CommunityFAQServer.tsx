import { getCommunityContent } from '@/data/community-descriptions';
import CommunityFAQClient from '@/components/community/CommunityFAQ';

interface CommunityFAQServerProps {
  communityName: string;
  communitySlug: string;
  county: string;
}

/**
 * Server wrapper that passes static content data to the FAQ client component.
 * The FAQ schema JSON-LD is rendered server-side even though the accordion is interactive.
 */
export default function CommunityFAQServer({
  communityName,
  communitySlug,
  county,
}: CommunityFAQServerProps) {
  const content = getCommunityContent(communitySlug);

  return (
    <CommunityFAQClient
      communityName={communityName}
      communitySlug={communitySlug}
      county={county}
      highlights={content?.highlights}
      bestFor={content?.bestFor}
      nearbyLandmarks={content?.nearbyLandmarks}
    />
  );
}
