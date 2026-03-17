-- Admin-only RPC helpers to save hierarchy in one call.
-- This keeps the frontend simple and avoids partial updates.

create or replace function public.admin_upsert_collection_hierarchy(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_collection_id integer;
  g jsonb;
  img jsonb;
  v_group_id integer;
  v_image_id integer;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  -- Upsert collection
  v_collection_id := nullif((payload->>'id')::int, 0);

  if v_collection_id is null then
    insert into public.collections (title, category, image_url, description, is_featured, display_order)
    values (
      payload->>'title',
      payload->>'category',
      payload->>'imageUrl',
      payload->>'description',
      coalesce((payload->>'isFeatured')::boolean, false),
      coalesce((payload->>'order')::int, 0)
    )
    returning id into v_collection_id;
  else
    update public.collections
    set
      title = payload->>'title',
      category = payload->>'category',
      image_url = payload->>'imageUrl',
      description = payload->>'description',
      is_featured = coalesce((payload->>'isFeatured')::boolean, false),
      display_order = coalesce((payload->>'order')::int, 0)
    where id = v_collection_id;
  end if;

  -- Replace children: groups + images.
  -- (Simple and robust; suitable for admin curation workflows.)
  delete from public.groups where collection_id = v_collection_id;

  for g in
    select value from jsonb_array_elements(coalesce(payload->'groups', '[]'::jsonb))
  loop
    v_group_id := nullif((g->>'id')::int, 0);

    -- Preserve ID only if it doesn't collide; otherwise let identity generate.
    if v_group_id is not null then
      insert into public.groups (id, collection_id, title, description, date_text, location, display_order)
      values (
        v_group_id,
        v_collection_id,
        g->>'title',
        coalesce(g->>'description',''),
        coalesce(g->>'date',''),
        coalesce(g->>'location',''),
        coalesce((g->>'order')::int, 0)
      )
      on conflict (id) do update set
        collection_id = excluded.collection_id,
        title = excluded.title,
        description = excluded.description,
        date_text = excluded.date_text,
        location = excluded.location,
        display_order = excluded.display_order;
    else
      insert into public.groups (collection_id, title, description, date_text, location, display_order)
      values (
        v_collection_id,
        g->>'title',
        coalesce(g->>'description',''),
        coalesce(g->>'date',''),
        coalesce(g->>'location',''),
        coalesce((g->>'order')::int, 0)
      )
      returning id into v_group_id;
    end if;

    -- Images
    for img in
      select value from jsonb_array_elements(coalesce(g->'images', '[]'::jsonb))
    loop
      v_image_id := nullif((img->>'id')::int, 0);

      if v_image_id is not null then
        insert into public.images (id, group_id, url, caption, orientation, display_order, is_preview, preview_order)
        values (
          v_image_id,
          v_group_id,
          img->>'url',
          img->>'caption',
          nullif(img->>'orientation','')::public.image_orientation,
          coalesce((img->>'order')::int, 0),
          coalesce((img->>'isPreview')::boolean, false),
          nullif((img->>'previewOrder')::int, 0)
        )
        on conflict (id) do update set
          group_id = excluded.group_id,
          url = excluded.url,
          caption = excluded.caption,
          orientation = excluded.orientation,
          display_order = excluded.display_order,
          is_preview = excluded.is_preview,
          preview_order = excluded.preview_order;
      else
        insert into public.images (group_id, url, caption, orientation, display_order, is_preview, preview_order)
        values (
          v_group_id,
          img->>'url',
          img->>'caption',
          nullif(img->>'orientation','')::public.image_orientation,
          coalesce((img->>'order')::int, 0),
          coalesce((img->>'isPreview')::boolean, false),
          nullif((img->>'previewOrder')::int, 0)
        )
        returning id into v_image_id;
      end if;
    end loop;
  end loop;
end;
$$;

revoke all on function public.admin_upsert_collection_hierarchy(jsonb) from public;
grant execute on function public.admin_upsert_collection_hierarchy(jsonb) to authenticated;

