import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { NlButton, NlCheckbox, NlPasswordField, NlTextBlock, NlTextField } from '@northline/ui';

/**
 * Login page (DESIGN.md §8.6). Storybook only, built from library components. The form spans 4 columns of the
 * 12-column page grid (§4.4: Space-3XL gutter and margin), starting at column 5 so it sits in the middle, and is
 * centred vertically in the window.
 *
 * Required fields follow D18: Log in with a field left empty puts it in error with an error helper text (and its
 * icon), and focus moves to the first empty field. A field's error clears once it has a value. Nothing is sent.
 */
const meta: Meta = { title: 'Pages/Login', parameters: { layout: 'fullscreen' } };
export default meta;

type Field = 'username' | 'password';

const errorText: Record<Field, string> = {
  username: 'Enter your username or email',
  password: 'Enter your password',
};

/** True when the form has a non-blank value for the field. */
function isFilled(data: FormData, field: Field) {
  const value = data.get(field);
  return typeof value === 'string' && value.trim() !== '';
}

function LoginPage() {
  const [errors, setErrors] = useState<Record<Field, boolean>>({ username: false, password: false });
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = { username: !isFilled(data, 'username'), password: !isFilled(data, 'password') };
    setErrors(next);
    if (next.username) usernameRef.current?.focus();
    else if (next.password) passwordRef.current?.focus();
  };

  /** Clears a field's error once it has a value. */
  const clearError = (field: Field) => (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim() !== '') setErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
  };

  return (
    <main className="nl:grid nl:min-h-dvh nl:grid-cols-12 nl:items-center nl:gap-x-3xl nl:bg-primary nl:px-3xl nl:py-4xl">
      <form className="nl:col-span-4 nl:col-start-5 nl:flex nl:flex-col nl:gap-4xl" noValidate onSubmit={handleSubmit}>
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
          <NlTextField
            ref={usernameRef}
            label="Username or email"
            name="username"
            autoComplete="username"
            required
            error={errors.username}
            helperText={errors.username ? errorText.username : undefined}
            onChange={clearError('username')}
          />
          <NlPasswordField
            ref={passwordRef}
            label="Password"
            name="password"
            required
            error={errors.password}
            helperText={errors.password ? errorText.password : undefined}
            onChange={clearError('password')}
          />
          <div className="nl:flex nl:items-center nl:justify-between nl:gap-xl">
            <NlButton variant="link" size="small" flush as="a" href="#forgot-password">
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
