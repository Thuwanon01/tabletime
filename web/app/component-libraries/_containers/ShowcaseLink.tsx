import { ExternalLinkIcon, HomeIcon } from "lucide-react";

import { Link } from "@/components/bases";

import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

function ShowcaseLink() {
  return (
    <ShowcaseSection
      id="link"
      title="Link"
      description="Wraps next/link — internal hrefs navigate client-side, external hrefs work as plain anchors. target=_blank adds rel=noopener noreferrer. Icons render at 16px and follow the text color."
    >
      <ShowcaseExample
        label="internal"
        code={`<Link href="/">Link to Homepage</Link>`}
      >
        <Link href="/">Link to Homepage</Link>
      </ShowcaseExample>

      <ShowcaseExample
        label="internal · icon"
        code={`<Link href="/">
  <HomeIcon />
  Link to Homepage
</Link>`}
      >
        <Link href="/">
          <HomeIcon />
          Link to Homepage
        </Link>
      </ShowcaseExample>

      <ShowcaseExample
        label="external · target=_blank"
        code={`<Link href="https://www.google.com" target="_blank">
  Link to Google
</Link>`}
      >
        <Link href="https://www.google.com" target="_blank">
          Link to Google
        </Link>
      </ShowcaseExample>

      <ShowcaseExample
        label="external · trailing icon"
        code={`<Link href="https://www.google.com" target="_blank">
  Link to Google
  <ExternalLinkIcon />
</Link>`}
      >
        <Link href="https://www.google.com" target="_blank">
          Link to Google
          <ExternalLinkIcon />
        </Link>
      </ShowcaseExample>

      <ShowcaseExample
        label="color"
        code={`<Link href="/" color="primary">Primary</Link>
<Link href="/" color="accent">Accent</Link>
<Link href="/" color="error">Error</Link>
<Link href="/" color="gray">Gray</Link>`}
      >
        <Link href="/" color="primary">
          Primary
        </Link>
        <Link href="/" color="accent">
          Accent
        </Link>
        <Link href="/" color="error">
          Error
        </Link>
        <Link href="/" color="gray">
          Gray
        </Link>
      </ShowcaseExample>

      <ShowcaseExample
        label="color · icon"
        code={`<Link href="/" color="gray">
  <HomeIcon />
  Homepage
</Link>`}
      >
        <Link href="/" color="gray">
          <HomeIcon />
          Homepage
        </Link>
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcaseLink;
export { ShowcaseLink };
