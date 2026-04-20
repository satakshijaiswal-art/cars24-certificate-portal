// Shared background-removal providers used by both single + batch functions.

async function tryRemoveBg(buffer, filename, mimetype) {
  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) return null;
  const fd = new FormData();
  fd.append('image_file', new Blob([buffer], { type: mimetype }), filename);
  fd.append('size', 'auto');
  const res = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: fd,
  });
  if (!res.ok) return null;
  const ab = await res.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(ab).toString('base64')}`;
}

async function tryPhotoRoom(buffer, filename, mimetype) {
  const apiKey = process.env.PHOTOROOM_API_KEY;
  if (!apiKey) return null;
  const fd = new FormData();
  fd.append('image_file', new Blob([buffer], { type: mimetype }), filename);
  const res = await fetch('https://sdk.photoroom.com/v1/segment', {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
    body: fd,
  });
  if (!res.ok) return null;
  const ab = await res.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(ab).toString('base64')}`;
}

async function tryClipdrop(buffer, filename, mimetype) {
  const apiKey = process.env.CLIPDROP_API_KEY;
  if (!apiKey) return null;
  const fd = new FormData();
  fd.append('image_file', new Blob([buffer], { type: mimetype }), filename);
  const res = await fetch('https://clipdrop-api.co/remove-background/v1', {
    method: 'POST',
    headers: { 'x-api-key': apiKey },
    body: fd,
  });
  if (!res.ok) return null;
  const ab = await res.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(ab).toString('base64')}`;
}

export async function removeBackground(buffer, filename, mimetype) {
  const providers = [
    { name: 'remove.bg', fn: tryRemoveBg },
    { name: 'photoroom', fn: tryPhotoRoom },
    { name: 'clipdrop', fn: tryClipdrop },
  ];
  for (const p of providers) {
    const result = await p.fn(buffer, filename, mimetype);
    if (result) return { processedImage: result, usedApi: p.name };
  }
  return null;
}
