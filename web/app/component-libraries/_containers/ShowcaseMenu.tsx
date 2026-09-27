import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/bases";

import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

function ShowcaseMenu() {
  return (
    <ShowcaseSection
      id="menu"
      title="Dropdown menu"
      description="212px wide popup with an account label on top and groups split by a separator. The trigger is any component passed through render — it keeps the Button variants intact."
    >
      <ShowcaseExample
        label="account menu"
        code={`<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outlined" />}>
    Open
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuGroup>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Billing</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>Team</DropdownMenuItem>
      <DropdownMenuItem>Subscription</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outlined" />}>
            Open
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ShowcaseExample>

      <ShowcaseExample
        label="align=end · disabled item"
        code={`<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="text" color="gray" />}>
    More
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuGroup>
      <DropdownMenuItem>Share restaurant</DropdownMenuItem>
      <DropdownMenuItem>Duplicate</DropdownMenuItem>
      <DropdownMenuItem disabled>Publish</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="text" color="gray" />}>
            More
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>Share restaurant</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem disabled>Publish</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcaseMenu;
export { ShowcaseMenu };
