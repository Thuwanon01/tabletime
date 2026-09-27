import { Avatar, AvatarGroup } from "@/components/bases";

import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

const TEAM = [
  { name: "John Doe", imageUrl: "https://i.pravatar.cc/128?img=12" },
  { name: "Alice Max" },
  { name: "Luna Holland", imageUrl: "https://i.pravatar.cc/128?img=47" },
  { name: "Nok Charoen" },
  { name: "June P." },
];

function ShowcaseAvatar() {
  return (
    <ShowcaseSection
      id="avatar"
      title="Avatar"
      description="Defaults to variant=circular, size=medium. circular is the only variant. name is required — it drives the aria-label and the initials fallback."
    >
      <ShowcaseExample
        label="sizes"
        code={`<Avatar name="John Doe" size="small" />
<Avatar name="John Doe" size="medium" />
<Avatar name="John Doe" size="large" />`}
      >
        <Avatar name="John Doe" size="small" />
        <Avatar name="John Doe" size="medium" />
        <Avatar name="John Doe" size="large" />
      </ShowcaseExample>

      <ShowcaseExample
        label="with image"
        code={`<Avatar
  name="Luna Holland"
  imageUrl="https://i.pravatar.cc/128?img=47"
/>`}
      >
        <Avatar
          name="Luna Holland"
          imageUrl="https://i.pravatar.cc/128?img=47"
        />
      </ShowcaseExample>

      <ShowcaseExample
        label="initials fallback — Latin uses first + last word"
        code={`<Avatar name="John Doe" />
<Avatar name="Luna Holland" />
<Avatar name="June" />`}
      >
        <Avatar name="John Doe" />
        <Avatar name="Luna Holland" />
        <Avatar name="June" />
      </ShowcaseExample>

      <ShowcaseExample
        label="initials fallback — Thai uses first two characters"
        code={`<Avatar name="อรนุมา ก." />
<Avatar name="นกชาญ" size="large" />`}
      >
        <Avatar name="อรนุมา ก." />
        <Avatar name="นกชาญ" size="large" />
      </ShowcaseExample>

      <ShowcaseExample
        label="broken image falls back to initials"
        code={`<Avatar name="Alice Max" imageUrl="/does-not-exist.png" />`}
      >
        <Avatar name="Alice Max" imageUrl="/does-not-exist.png" />
      </ShowcaseExample>

      <ShowcaseExample
        label="AvatarGroup · max overflow"
        code={`<AvatarGroup
  max={3}
  avatars={[
    { name: "John Doe", imageUrl: "https://i.pravatar.cc/128?img=12" },
    { name: "Alice Max" },
    { name: "Luna Holland", imageUrl: "https://i.pravatar.cc/128?img=47" },
    { name: "Nok Charoen" },
    { name: "June P." },
  ]}
/>`}
      >
        <AvatarGroup max={3} avatars={TEAM} />
      </ShowcaseExample>

      <ShowcaseExample
        label="AvatarGroup · spacing"
        code={`<AvatarGroup spacing="small" avatars={team} />
<AvatarGroup spacing="medium" avatars={team} />`}
      >
        <AvatarGroup spacing="small" avatars={TEAM.slice(0, 3)} />
        <AvatarGroup spacing="medium" avatars={TEAM.slice(0, 3)} />
      </ShowcaseExample>

      <ShowcaseExample
        label="AvatarGroup · size pass-through"
        code={`<AvatarGroup size="small" avatars={team} />
<AvatarGroup size="medium" avatars={team} />
<AvatarGroup size="large" avatars={team} />`}
      >
        <AvatarGroup size="small" avatars={TEAM.slice(0, 3)} />
        <AvatarGroup size="medium" avatars={TEAM.slice(0, 3)} />
        <AvatarGroup size="large" avatars={TEAM.slice(0, 3)} />
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcaseAvatar;
export { ShowcaseAvatar };
