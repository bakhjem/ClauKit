---
title: Subscribe to Realtime Changes with Channels and Filters
impact: MEDIUM-HIGH
impactDescription: Live updates without polling; correct cleanup avoids leaks
tags: realtime, channels, postgres-changes, presence, broadcast
---

## Subscribe to Realtime Changes with Channels and Filters

Supabase Realtime exposes three transports on a single channel: `postgres_changes` (CDC from WAL), `broadcast` (peer-to-peer messages), and `presence` (who's-online state). Common mistakes: subscribing without filters (every client receives every row), forgetting `removeChannel` on unmount (zombie subscriptions accumulate), and assuming Realtime respects RLS by default (you must enable RLS *and* add the table to the publication).

**Incorrect (no filter, no cleanup, no RLS enabled for Realtime):**

```ts
// Receives changes for EVERY message in the table, for every client.
// Server-side fanout cost scales with row count × client count.
useEffect(() => {
  supabase
    .channel("messages")
    .on("postgres_changes", { event: "*", schema: "public", table: "messages" },
      (payload) => setMessages((m) => [...m, payload.new])
    )
    .subscribe();
  // No return => channel persists after unmount, leaks WebSocket capacity
}, []);
```

**Correct (filter to room, cleanup on unmount, RLS-protected):**

```sql
-- One-time DB setup (migration):
alter table messages enable row level security;

create policy messages_room_read on messages
  for select
  to authenticated
  using (
    room_id in (select room_id from room_members where user_id = (select auth.uid()))
  );

-- Add table to the realtime publication so changes are streamed
alter publication supabase_realtime add table messages;
```

```ts
useEffect(() => {
  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `room_id=eq.${roomId}`, // server-side filter
      },
      (payload) => setMessages((m) => [...m, payload.new as Message]),
    )
    .subscribe((status) => {
      if (status === "CHANNEL_ERROR") log.error("realtime subscribe failed");
    });

  return () => {
    supabase.removeChannel(channel); // critical: free the slot
  };
}, [roomId]);
```

Presence + broadcast on the same channel:

```ts
const channel = supabase.channel(`room:${roomId}`, {
  config: { presence: { key: userId } },
});

channel
  .on("presence", { event: "sync" }, () => {
    setOnline(Object.keys(channel.presenceState()));
  })
  .on("broadcast", { event: "typing" }, ({ payload }) => {
    setTyping(payload.userId);
  })
  .subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      await channel.track({ online_at: new Date().toISOString() });
    }
  });

// Send a broadcast event (does NOT touch the DB)
await channel.send({ type: "broadcast", event: "typing", payload: { userId } });
```

Gotchas:

- Realtime authorization is JWT-based. After `supabase.auth.setSession()`, call `supabase.realtime.setAuth(jwt)` so existing channels pick up the new token — otherwise they continue with the old anon claims.
- `filter` supports `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`. No arbitrary expressions.
- One project has a connection cap (free tier: 200 concurrent). Reuse channels across components instead of creating one per subscriber.
- Realtime's RLS check is for `select`. UPDATE/DELETE payloads only include the columns in `replica identity` — set `replica identity full` if you need old/new diffs across all columns.

References:
- https://supabase.com/docs/guides/realtime/postgres-changes
- https://supabase.com/docs/guides/realtime/authorization
- https://supabase.com/docs/guides/realtime/presence
