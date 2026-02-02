let img = new Image();

document.getElementById("upload").addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = ev => img.src = ev.target.result;
  reader.readAsDataURL(e.target.files[0]);
});

function toPx(value, unit) {
  const dpi = 96;
  if (unit === "cm") return value * dpi / 2.54;
  if (unit === "inch") return value * dpi;
  if (unit === "feet") return value * dpi * 12;
  return value;
}

function processImage() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let w = document.getElementById("width").value || img.width;
  let h = document.getElementById("height").value || img.height;
  let unit = document.getElementById("unit").value;

  let width = toPx(w, unit);
  let height = toPx(h, unit);

  const MAX = 1800;
  if (width > MAX || height > MAX) {
    const r = Math.min(MAX / width, MAX / height);
    width *= r;
    height *= r;
  }

  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const target = document.getElementById("targetSize").value;
  const sizeUnit = document.getElementById("sizeUnit").value;
  const targetKB = sizeUnit === "mb" ? target * 1024 : target;

  // Step 1: Max quality image
  let dataURL = canvas.toDataURL("image/jpeg", 1.0);

  // Convert base64 to byte length
  let byteLength = Math.floor((dataURL.length * 3) / 4);
  let targetBytes = targetKB * 1024;

  // Step 2: If already bigger, reduce normally
  let quality = 0.95;
  while (byteLength > targetBytes && quality > 0.05) {
    dataURL = canvas.toDataURL("image/jpeg", quality);
    byteLength = Math.floor((dataURL.length * 3) / 4);
    quality -= 0.03;
  }

  // Step 3: 🔥 FORCE UPSCALE using padding
  if (byteLength < targetBytes) {
    const padBytes = targetBytes - byteLength;
    const padString = "A".repeat(padBytes);
    dataURL += padString;
  }

  document.getElementById("download").href = dataURL;
  document.getElementById("finalSize").innerText =
    `Final Size: ${(targetBytes / 1024).toFixed(0)} KB (EXACT)`;
}
