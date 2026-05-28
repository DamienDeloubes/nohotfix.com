import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCreateEnvironment, useDeleteEnvironment, useEnvironments, useOrgContext, useRenameEnvironment, useReorderEnvironments } from '@nohotfix/domain-identity/ui';
import { requireRole, type EnvironmentDto } from '@nohotfix/shared';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

import { environmentKeys } from '../../../../api/query-keys.js';

export const Route = createFileRoute('/_authenticated/$orgSlug/settings/environments')({
  component: EnvironmentsSettingsPage,
});

function EnvironmentsSettingsPage() {
  const { orgSlug, role } = useOrgContext();
  const isAdmin = requireRole(role, { minimum: 'admin' });
  const queryClient = useQueryClient();
  const queryKey = environmentKeys.list(orgSlug);
  const invalidateKeys = [queryKey];

  const { data, isLoading, error } = useEnvironments({
    orgSlug,
    queryKey,
  });

  const createMutation = useCreateEnvironment({ orgSlug, invalidateKeys });
  const renameMutation = useRenameEnvironment({ orgSlug, invalidateKeys });
  const reorderMutation = useReorderEnvironments({ orgSlug, invalidateKeys: [] });
  const deleteMutation = useDeleteEnvironment({ orgSlug, invalidateKeys });

  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAdd = useCallback(async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setAddError(null);
    try {
      await createMutation.mutateAsync({ name: trimmed });
      setNewName('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create environment';
      setAddError(message);
    }
  }, [newName, createMutation]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const currentList = data?.environments ?? [];
      const oldIndex = currentList.findIndex((e) => e.id === active.id);
      const newIndex = currentList.findIndex((e) => e.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(currentList, oldIndex, newIndex);

      // Cancel any in-flight refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Optimistically update the query cache so there's zero flicker
      queryClient.setQueryData(queryKey, { environments: reordered });

      // Fire and forget — on success, update cache with server response; on error, rollback
      reorderMutation.mutate(
        { environmentIds: reordered.map((e) => e.id) },
        {
          onSuccess: (serverData) => {
            queryClient.setQueryData(queryKey, serverData);
          },
          onError: () => {
            queryClient.setQueryData(queryKey, { environments: currentList });
          },
        },
      );
    },
    [data, queryClient, queryKey, reorderMutation],
  );

  const handleDelete = useCallback(
    async (environmentId: string) => {
      try {
        await deleteMutation.mutateAsync({ environmentId });
        setDeleteConfirmId(null);
      } catch {
        // Error is handled by mutation state
      }
    },
    [deleteMutation],
  );

  if (!isAdmin) {
    return <div className="p-8 text-error-500">You do not have permission to manage environments.</div>;
  }

  if (isLoading) {
    return <div className="p-4 text-white/40">Loading environments...</div>;
  }

  if (error) {
    return <div className="p-4 text-error-500">Failed to load environments.</div>;
  }

  const environments = data?.environments ?? [];

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Environments</h2>

      {environments.length === 0 ? (
        <p className="text-white/40">No environments configured.</p>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={environments.map((e) => e.id)} strategy={verticalListSortingStrategy}>
            <ul className="list-none p-0 m-0">
              {environments.map((env) => (
                <SortableEnvironmentRow
                  key={env.id}
                  env={env}
                  orgSlug={orgSlug}
                  onRename={async (id, name) => {
                    await renameMutation.mutateAsync({ environmentId: id, name });
                  }}
                  isRenaming={renameMutation.isPending}
                  renameError={renameMutation.error}
                  onDeleteClick={() => setDeleteConfirmId(env.id)}
                  deleteConfirmId={deleteConfirmId}
                  onDeleteConfirm={() => handleDelete(env.id)}
                  onDeleteCancel={() => setDeleteConfirmId(null)}
                  isDeleting={deleteMutation.isPending}
                  deleteError={deleteMutation.error}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <div className="mt-4 flex gap-2 items-center">
        <input
          type="text"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
            setAddError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleAdd();
          }}
          placeholder="New environment name"
          maxLength={100}
          className="bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] text-white text-sm px-3 py-2 outline-none placeholder:text-white/40 focus:border-blue-500 transition-colors [transition-duration:var(--duration-fast)] flex-1"
        />
        <button
          type="button"
          onClick={() => void handleAdd()}
          disabled={createMutation.isPending || !newName.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          Add environment
        </button>
      </div>
      {addError && <p className="text-error-500 text-sm mt-1">{addError}</p>}
    </div>
  );
}

interface SortableEnvironmentRowProps {
  env: EnvironmentDto;
  orgSlug: string;
  onRename: (id: string, name: string) => Promise<void>;
  isRenaming: boolean;
  renameError: Error | null;
  onDeleteClick: () => void;
  deleteConfirmId: string | null;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  isDeleting: boolean;
  deleteError: Error | null;
}

function SortableEnvironmentRow({ env, onRename, onDeleteClick, deleteConfirmId, onDeleteConfirm, onDeleteCancel, isDeleting, deleteError }: SortableEnvironmentRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: env.id,
    animateLayoutChanges: () => false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(env.name);
  const [editError, setEditError] = useState<string | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = async () => {
    const trimmed = editName.trim();
    if (!trimmed) {
      setEditName(env.name);
      setIsEditing(false);
      return;
    }
    if (trimmed === env.name) {
      setIsEditing(false);
      return;
    }
    setEditError(null);
    try {
      await onRename(env.id, trimmed);
      setIsEditing(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to rename';
      setEditError(message);
    }
  };

  const isConfirming = deleteConfirmId === env.id;

  return (
    <li ref={setNodeRef} style={style} className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)] bg-transparent">
      <div className="flex items-center gap-3 flex-1">
        <span {...attributes} {...listeners} className="cursor-grab text-white/30 touch-none">
          &#x2630;
        </span>
        {isEditing ? (
          <div className="flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => {
                setEditName(e.target.value);
                setEditError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleSave();
                if (e.key === 'Escape') {
                  setEditName(env.name);
                  setIsEditing(false);
                }
              }}
              onBlur={() => void handleSave()}
              maxLength={100}
              autoFocus
              className="bg-[var(--glass-4)] border border-blue-500 rounded-[var(--radius-sm)] text-white text-sm px-3 py-2 outline-none placeholder:text-white/40 transition-colors [transition-duration:var(--duration-fast)] w-full"
            />
            {editError && <p className="text-error-500 text-xs mt-1 mb-0">{editError}</p>}
          </div>
        ) : (
          <span
            onClick={() => {
              setEditName(env.name);
              setIsEditing(true);
            }}
            className="cursor-pointer"
          >
            {env.name}
          </span>
        )}
      </div>
      <div>
        {isConfirming ? (
          <div className="flex gap-2 items-center">
            <span className="text-xs text-white/40">Delete?</span>
            <button type="button" onClick={onDeleteConfirm} disabled={isDeleting} className="bg-error-500 text-white border-none rounded px-2 py-1 cursor-pointer text-xs">
              Yes
            </button>
            <button type="button" onClick={onDeleteCancel} className="bg-[var(--glass-12)] text-white border-none rounded px-2 py-1 cursor-pointer text-xs">
              No
            </button>
            {deleteError && <span className="text-error-500 text-xs">{deleteError.message}</span>}
          </div>
        ) : (
          <button type="button" onClick={onDeleteClick} className="bg-transparent border-none text-error-500 hover:text-error-500/80 text-sm cursor-pointer">
            Delete
          </button>
        )}
      </div>
    </li>
  );
}
