import { Button } from "@/components/bases";

import ShowcaseExample from "../_components/ShowcaseExample";
import ShowcaseSection from "../_components/ShowcaseSection";

function ShowcaseButton() {
  return (
    <ShowcaseSection
      id="button"
      title="Button"
      description="Defaults to variant=contained, color=primary, size=medium. Variants are contained, outlined and text. Colors are primary, accent, error and gray — Button has no success color."
    >
      <ShowcaseExample
        label="contained · primary"
        code={`<Button variant="contained" color="primary">Save</Button>`}
      >
        <Button variant="contained" color="primary">
          Save
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · primary"
        code={`<Button variant="outlined" color="primary">Save</Button>`}
      >
        <Button variant="outlined" color="primary">
          Save
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="contained · accent"
        code={`<Button variant="contained" color="accent">Save</Button>`}
      >
        <Button variant="contained" color="accent">
          Save
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · accent"
        code={`<Button variant="outlined" color="accent">Save</Button>`}
      >
        <Button variant="outlined" color="accent">
          Save
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="contained · error"
        code={`<Button variant="contained" color="error">Delete</Button>`}
      >
        <Button variant="contained" color="error">
          Delete
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · error"
        code={`<Button variant="outlined" color="error">Delete</Button>`}
      >
        <Button variant="outlined" color="error">
          Delete
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="contained · gray"
        code={`<Button variant="contained" color="gray">Cancel</Button>`}
      >
        <Button variant="contained" color="gray">
          Cancel
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="outlined · gray"
        code={`<Button variant="outlined" color="gray">Cancel</Button>`}
      >
        <Button variant="outlined" color="gray">
          Cancel
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="text · primary"
        code={`<Button variant="text" color="primary">Save</Button>`}
      >
        <Button variant="text" color="primary">
          Save
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="text · accent"
        code={`<Button variant="text" color="accent">Save</Button>`}
      >
        <Button variant="text" color="accent">
          Save
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="text · error"
        code={`<Button variant="text" color="error">Delete</Button>`}
      >
        <Button variant="text" color="error">
          Delete
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="text · gray"
        code={`<Button variant="text" color="gray">Cancel</Button>`}
      >
        <Button variant="text" color="gray">
          Cancel
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="sizes · contained"
        code={`<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>`}
      >
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="sizes · outlined"
        code={`<Button variant="outlined" size="small">Small</Button>
<Button variant="outlined" size="medium">Medium</Button>
<Button variant="outlined" size="large">Large</Button>`}
      >
        <Button variant="outlined" size="small">
          Small
        </Button>
        <Button variant="outlined" size="medium">
          Medium
        </Button>
        <Button variant="outlined" size="large">
          Large
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="disabled"
        code={`<Button disabled>Contained</Button>
<Button variant="outlined" disabled>Outlined</Button>
<Button variant="text" disabled>Text</Button>`}
      >
        <Button disabled>Contained</Button>
        <Button variant="outlined" disabled>
          Outlined
        </Button>
        <Button variant="text" disabled>
          Text
        </Button>
      </ShowcaseExample>

      <ShowcaseExample
        label="loading — replaces children, forces disabled"
        code={`<Button loading>Save</Button>
<Button variant="outlined" loading>Save</Button>`}
      >
        <Button loading>Save</Button>
        <Button variant="outlined" loading>
          Save
        </Button>
      </ShowcaseExample>
    </ShowcaseSection>
  );
}

export default ShowcaseButton;
export { ShowcaseButton };
