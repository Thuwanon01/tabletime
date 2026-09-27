import { Badge } from "@/components/bases";

import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

function ShowcaseBadge() {
  return (
    <ShowcaseSection
      id="badge"
      title="Badge"
      description="Defaults to variant=contained, color=primary, size=medium. Unlike Button, Badge has a success color and only two sizes."
    >
      <ShowcaseExample
        label="contained · primary"
        code={`<Badge variant="contained" color="primary">New</Badge>`}
      >
        <Badge variant="contained" color="primary">
          New
        </Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · primary"
        code={`<Badge variant="outlined" color="primary">New</Badge>`}
      >
        <Badge variant="outlined" color="primary">
          New
        </Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="contained · accent"
        code={`<Badge variant="contained" color="accent">Popular</Badge>`}
      >
        <Badge variant="contained" color="accent">
          Popular
        </Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · accent"
        code={`<Badge variant="outlined" color="accent">Popular</Badge>`}
      >
        <Badge variant="outlined" color="accent">
          Popular
        </Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="contained · success"
        code={`<Badge variant="contained" color="success">Open</Badge>`}
      >
        <Badge variant="contained" color="success">
          Open
        </Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · success"
        code={`<Badge variant="outlined" color="success">Open</Badge>`}
      >
        <Badge variant="outlined" color="success">
          Open
        </Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="contained · error"
        code={`<Badge variant="contained" color="error">Closed</Badge>`}
      >
        <Badge variant="contained" color="error">
          Closed
        </Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · error"
        code={`<Badge variant="outlined" color="error">Closed</Badge>`}
      >
        <Badge variant="outlined" color="error">
          Closed
        </Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="contained · gray"
        code={`<Badge variant="contained" color="gray">Draft</Badge>`}
      >
        <Badge variant="contained" color="gray">
          Draft
        </Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · gray"
        code={`<Badge variant="outlined" color="gray">Draft</Badge>`}
      >
        <Badge variant="outlined" color="gray">
          Draft
        </Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="sizes · contained"
        code={`<Badge size="medium">Medium</Badge>
<Badge size="large">Large</Badge>`}
      >
        <Badge size="medium">Medium</Badge>
        <Badge size="large">Large</Badge>
      </ShowcaseExample>

      <ShowcaseExample
        label="sizes · outlined"
        code={`<Badge variant="outlined" size="medium">Medium</Badge>
<Badge variant="outlined" size="large">Large</Badge>`}
      >
        <Badge variant="outlined" size="medium">
          Medium
        </Badge>
        <Badge variant="outlined" size="large">
          Large
        </Badge>
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcaseBadge;
export { ShowcaseBadge };
