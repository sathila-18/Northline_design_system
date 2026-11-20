import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NlFileUpload } from './NlFileUpload';

const png = new File(['x'], 'reward.png', { type: 'image/png' });
const pdf = new File(['x'], 'notes.pdf', { type: 'application/pdf' });
const card = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlFileUpload', () => {
  it('empty: dashed card, info icon, Choose file described by the hint; input labelled', () => {
    const { container } = render(
      <NlFileUpload title="Drop a file" description="PNG" maxSizeLabel="Up to 5 MB" onFileSelect={() => undefined} />,
    );
    expect(card(container)).toHaveClass('nl:border-dashed', 'nl:border-default', 'nl:bg-primary', 'nl:rounded-l');
    expect(card(container)).toHaveAttribute('data-state', 'enabled');
    expect(container.querySelector('[data-slot="icon"]')).toHaveAttribute('data-tone', 'info');
    const choose = screen.getByRole('button', { name: 'Choose file' });
    expect(choose).toHaveAccessibleDescription('PNG · Up to 5 MB');
    expect(screen.getByLabelText('Upload a file')).toHaveAttribute('type', 'file');
  });

  it('choosing a file calls onFileSelect', async () => {
    const onFileSelect = vi.fn();
    render(<NlFileUpload title="T" onFileSelect={onFileSelect} />);
    await userEvent.upload(screen.getByLabelText('Upload a file'), png);
    expect(onFileSelect).toHaveBeenCalledWith(png);
  });

  it('drop: matching files are selected, others rejected (OD-178); drag-over look (OD-122)', () => {
    const onFileSelect = vi.fn();
    const onFileReject = vi.fn();
    const { container } = render(
      <NlFileUpload title="T" accept="image/*" onFileSelect={onFileSelect} onFileReject={onFileReject} />,
    );
    fireEvent.dragOver(card(container), { dataTransfer: { files: [png] } });
    expect(card(container)).toHaveClass('nl:border-active', 'nl:bg-active');
    fireEvent.drop(card(container), { dataTransfer: { files: [png] } });
    expect(onFileSelect).toHaveBeenCalledWith(png);
    fireEvent.drop(card(container), { dataTransfer: { files: [pdf] } });
    expect(onFileReject).toHaveBeenCalledWith(pdf);
    expect(card(container)).toHaveClass('nl:bg-primary');
  });

  it('uploading: active border, named progress bar, Cancel', async () => {
    const onCancel = vi.fn();
    const { container } = render(
      <NlFileUpload
        state="uploading"
        progress={40}
        title="reward.png"
        onFileSelect={() => undefined}
        onCancel={onCancel}
      />,
    );
    expect(card(container)).toHaveClass('nl:border-active');
    expect(screen.getByRole('progressbar', { name: 'Uploading reward.png' })).toHaveAttribute('aria-valuenow', '40');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('complete: strong border, success icon, destructive Delete; announced; focus back to Choose after delete', async () => {
    const onDelete = vi.fn();
    const { container, rerender } = render(
      <NlFileUpload state="complete" title="reward.png" onFileSelect={() => undefined} onDelete={onDelete} />,
    );
    expect(card(container)).toHaveClass('nl:border-strong');
    expect(container.querySelector('[data-slot="icon"]')).toHaveAttribute('data-tone', 'success');
    expect(screen.getByRole('status')).toHaveTextContent('reward.png uploaded');
    const del = screen.getByRole('button', { name: 'Delete' });
    expect(del).toHaveAttribute('data-tone', 'destructive');
    await userEvent.click(del);
    expect(onDelete).toHaveBeenCalledTimes(1);
    rerender(<NlFileUpload state="enabled" title="Drop a file" onFileSelect={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Choose file' })).toHaveFocus();
  });

  it('error: error border and icon, Try again, announced', async () => {
    const onRetry = vi.fn();
    const { container } = render(
      <NlFileUpload state="error" title="Upload failed" onFileSelect={() => undefined} onRetry={onRetry} />,
    );
    expect(card(container)).toHaveClass('nl:border-error');
    expect(container.querySelector('[data-slot="icon"]')).toHaveAttribute('data-tone', 'error');
    expect(screen.getByRole('status')).toHaveTextContent('Upload failed');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('disabled (OD-123): disabled border and icon, button and input disabled, no drop', () => {
    const onFileSelect = vi.fn();
    const { container } = render(<NlFileUpload disabled title="T" onFileSelect={onFileSelect} />);
    expect(card(container)).toHaveClass('nl:border-disabled');
    expect(container.querySelector('[data-slot="icon"]')).toHaveAttribute('data-tone', 'disabled');
    expect(screen.getByRole('button', { name: 'Choose file' })).toBeDisabled();
    expect(screen.getByLabelText('Upload a file')).toBeDisabled();
    fireEvent.drop(card(container), { dataTransfer: { files: [png] } });
    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it('clicking the card opens the picker when empty', () => {
    const { container } = render(<NlFileUpload title="T" onFileSelect={() => undefined} />);
    const input = screen.getByLabelText<HTMLInputElement>('Upload a file');
    const click = vi.spyOn(input, 'click');
    act(() => {
      card(container).click();
    });
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('small: row with a 40 icon, start-aligned text', () => {
    const { container } = render(<NlFileUpload size="small" title="T" onFileSelect={() => undefined} />);
    expect(container.querySelector('[data-slot="icon"]')).toHaveAttribute('data-size', '40');
    expect(card(container)).toHaveAttribute('data-size', 'small');
  });
});
