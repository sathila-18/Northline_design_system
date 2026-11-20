import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { NlFileUpload, type NlFileUploadState } from './NlFileUpload';

const states: NlFileUploadState[] = ['enabled', 'uploading', 'complete', 'error'];
const copy: Record<NlFileUploadState, { title: string; description?: string }> = {
  enabled: { title: 'Drop a file here or choose one', description: 'PNG or JPG' },
  uploading: { title: 'reward-image.png', description: '1.2 MB' },
  complete: { title: 'reward-image.png', description: '1.2 MB · Uploaded' },
  error: { title: 'Upload failed', description: 'The file is larger than 5 MB.' },
};

const meta = {
  title: 'Components/Molecules/File upload',
  component: NlFileUpload,
  args: {
    size: 'large',
    state: 'enabled',
    progress: 40,
    accept: 'image/png,image/jpeg',
    maxSizeLabel: 'Up to 5 MB',
    title: copy.enabled.title,
    description: copy.enabled.description,
    disabled: false,
    onFileSelect: () => undefined,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['large', 'small'] },
    state: { control: 'select', options: states },
    progress: { control: { type: 'range', min: 0, max: 100 } },
    title: { control: 'text' },
    description: { control: 'text' },
    maxSizeLabel: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="nl:w-full nl:bg-primary nl:p-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NlFileUpload>;
export default meta;

type Story = StoryObj<typeof meta>;

/** One upload with every option as a control. Drag a file over it to see the drag-over look (OD-122). */
export const Default: Story = {
  render: (args) => (
    <div {...(args.disabled ? { 'data-a11y-known-issue': 'K3' } : {})}>
      <NlFileUpload {...args} />
    </div>
  ),
};

/** Every state, large. */
export const LargeStates: Story = {
  render: (args) => (
    <div className="nl:grid nl:grid-cols-2 nl:gap-xl">
      {states.map((state) => (
        <NlFileUpload
          {...args}
          key={state}
          state={state}
          {...copy[state]}
          maxSizeLabel={state === 'enabled' ? args.maxSizeLabel : undefined}
        />
      ))}
    </div>
  ),
};

/** Every state, small: the progress bar sits below the row while uploading. */
export const SmallStates: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-xl">
      {states.map((state) => (
        <NlFileUpload
          {...args}
          key={state}
          size="small"
          state={state}
          {...copy[state]}
          maxSizeLabel={state === 'enabled' ? args.maxSizeLabel : undefined}
        />
      ))}
    </div>
  ),
};

/** Disabled (OD-123), large and small. Disabled text: K3. */
export const Disabled: Story = {
  render: (args) => (
    <div className="nl:flex nl:flex-col nl:gap-xl" data-a11y-known-issue="K3">
      <NlFileUpload {...args} disabled />
      <NlFileUpload {...args} size="small" disabled />
    </div>
  ),
};

function Simulated() {
  const [state, setState] = useState<NlFileUploadState>('enabled');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state !== 'uploading') return;
    const timer = setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          clearInterval(timer);
          setState('complete');
          return 100;
        }
        return value + 10;
      });
    }, 300);
    return () => {
      clearInterval(timer);
    };
  }, [state]);

  const name = file?.name ?? '';
  const view =
    state === 'enabled'
      ? copy.enabled
      : state === 'error'
        ? { title: 'Upload failed', description: 'Only PNG or JPG files can be uploaded.' }
        : { title: name, description: state === 'complete' ? 'Uploaded' : `${progress}%` };

  return (
    <NlFileUpload
      state={state}
      progress={progress}
      accept="image/png,image/jpeg"
      maxSizeLabel={state === 'enabled' ? 'Up to 5 MB' : undefined}
      {...view}
      onFileSelect={(chosen) => {
        setFile(chosen);
        setProgress(0);
        setState('uploading');
      }}
      onFileReject={() => {
        setState('error');
      }}
      onCancel={() => {
        setState('enabled');
      }}
      onDelete={() => {
        setFile(null);
        setState('enabled');
      }}
      onRetry={() => {
        setState('enabled');
      }}
    />
  );
}

/** A simulated upload: choose or drop a PNG or JPG; a wrong type shows the error (OD-178). */
export const Simulation: Story = {
  render: () => <Simulated />,
};
