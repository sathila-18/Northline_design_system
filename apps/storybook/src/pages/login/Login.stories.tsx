import type { Meta, StoryObj } from '@storybook/react-vite';
import type { SyntheticEvent } from 'react';
import { NlButton, NlCheckbox, NlPasswordField, NlTextBlock, NlTextField } from '@northline/ui';

/**
 * Login page (DESIGN.md §8.6). Storybook only, built from library components. The form spans 4 columns of the
 * 12-column page grid (§4.4: Space-3XL gutter and margin), starting at column 5 so it sits in the middle, and is
 * centred vertically in the window.
 */
const meta: Meta = { title: 'Pages/Login', parameters: { layout: 'fullscreen' } };
export default meta;

/** The page only shows the layout, so submitting does nothing. */
function preventSubmit(event: SyntheticEvent<HTMLFormElement>) {
  event.preventDefault();
}

function LoginPage() {
  return (
    <main className="nl:grid nl:min-h-dvh nl:grid-cols-12 nl:items-center nl:gap-x-3xl nl:bg-primary nl:px-3xl nl:py-4xl">
      <form className="nl:col-span-4 nl:col-start-5 nl:flex nl:flex-col nl:gap-4xl" onSubmit={preventSubmit}>
        <div className="nl:flex nl:flex-col nl:items-center nl:gap-4xl">
          {/* Story-only wordmark, as in the NlAppShell stories. There is no logo component. */}
          <span className="nl:text-headline-small-h6 nl:text-primary">Northline</span>
          <NlTextBlock
            type="headline-large"
            headingAs="h1"
            align="center"
            heading="Get started now"
            description="Enter your login details"
          />
        </div>
        <div className="nl:flex nl:flex-col nl:gap-xl">
          <NlTextField label="Username or email" name="username" autoComplete="username" required />
          <NlPasswordField label="Password" name="password" required />
          <div className="nl:flex nl:items-center nl:justify-between nl:gap-xl">
            <NlButton variant="link" flush as="a" href="#forgot-password">
              Forgot password
            </NlButton>
            {/* NlCheckbox fills its row by spec; the wrapper shrinks it to its content so it sits at the end. */}
            <div>
              <NlCheckbox name="remember">Remember me</NlCheckbox>
            </div>
          </div>
        </div>
        <NlButton type="submit" className="nl:w-full">
          Log in
        </NlButton>
      </form>
    </main>
  );
}

export const Login: StoryObj = { render: () => <LoginPage /> };
