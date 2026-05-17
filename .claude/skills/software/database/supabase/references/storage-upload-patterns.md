---
title: Upload Large Files with TUS Resumable and Transform Images on Read
impact: MEDIUM-HIGH
impactDescription: Reliable uploads on flaky networks; smaller payloads on render
tags: storage, upload, resumable, tus, image-transform
---

## Upload Large Files with TUS Resumable and Transform Images on Read

`storage.from(bucket).upload(...)` posts the whole file in one request, so a 200MB upload that fails at 95% has to start over. For anything above ~6MB, use the resumable (TUS) endpoint — it chunks the upload and resumes after disconnects. For images, use Supabase's on-the-fly transform API to serve resized variants instead of storing each size yourself.

**Incorrect (single POST for a large video, original image served everywhere):**

```ts
// 200MB video, single PUT — fails on the subway, user starts over.
await supabase.storage
  .from("videos")
  .upload(`${userId}/clip.mp4`, file);

// Renders the full 4000×3000 original even for a 64px avatar
<img src={publicUrl} width={64} height={64} />
```

**Correct (TUS resumable + image transform URL):**

```ts
// Resumable upload — works for any size, resumes from last chunk
import * as tus from "tus-js-client";

async function uploadResumable(file: File, path: string) {
  const { data: { session } } = await supabase.auth.getSession();

  return new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${session!.access_token}`,
        "x-upsert": "true",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: "videos",
        objectName: path,
        contentType: file.type,
        cacheControl: "3600",
      },
      chunkSize: 6 * 1024 * 1024, // required: 6MB
      onError: reject,
      onProgress: (sent, total) => log.debug({ pct: (sent / total) * 100 }),
      onSuccess: () => resolve(),
    });

    // Resume from prior session if user retries
    upload.findPreviousUploads().then((prev) => {
      if (prev.length) upload.resumeFromPreviousUpload(prev[0]);
      upload.start();
    });
  });
}
```

```ts
// Image transform — Supabase resizes/format-converts on read
const { data } = supabase
  .storage
  .from("avatars")
  .getPublicUrl(`${userId}/avatar.jpg`, {
    transform: {
      width: 64,
      height: 64,
      resize: "cover",     // 'cover' | 'contain' | 'fill'
      quality: 80,
      format: "origin",    // or 'webp' (auto when client accepts)
    },
  });

// For private buckets, the same transform options apply to signed URLs:
await supabase.storage.from("avatars").createSignedUrl(path, 3600, {
  transform: { width: 64, height: 64, resize: "cover" },
});
```

Rules of thumb:

- **>6MB**: use TUS. **≤6MB**: regular `upload()` is fine.
- Set `cacheControl: "3600"` (or longer) on upload — CDN caches the response and shaves latency on subsequent reads.
- Transforms are billed per *origin* image, not per variant, and are cached at the CDN. Generating 5 sizes from one upload is cheaper than storing 5 files.
- Transform API supports JPG/PNG/WebP/AVIF input. SVG and GIF pass through untransformed.
- For user-generated content, also set `bucket.allowed_mime_types` and `file_size_limit` — RLS cannot enforce these.

References:
- https://supabase.com/docs/guides/storage/uploads/resumable-uploads
- https://supabase.com/docs/guides/storage/serving/image-transformations
