'use client';

import { useTransition } from 'react';
import { deleteBlogPostAction } from '../../actions';

export function DeleteButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    startTransition(async () => {
      await deleteBlogPostAction(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
