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

  let unit = document.getElementById("unit").value;
  let w = document.getElementById("width").value || img.width;
  let h = document.getElementById("height").value || img.height;

  let width = toPx(w, unit);
  let height = toPx(h, unit);

  // 🔥 MOBILE SAFE LIMIT
  const MAX = 2000;
  if (width > MAX || height > MAX) {
    const ratio = Math.min(MAX / width, MAX / height);
    width *= ratio;
    height *= ratio;
  }

  canvas.width = Math.round(width);
  canvas.height = Math.round(height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const target = document.getElementById("targetSize").value;
  const sizeUnit = document.getElementById("sizeUnit").value;
  const targetKB = sizeUnit === "mb" ? target * 1024 : target;

  let minQ = 0.2;
  let maxQ = 0.9;
  let bestData = null;
  let bestSize = Infinity;

  for (let i = 0; i < 15; i++) {
    let q = (minQ + maxQ) / 2;
    let data = canvas.toDataURL("image/jpeg", q);
    let sizeKB = (data.length * 3) / 4 / 1024;

    if (Math.abs(sizeKB - targetKB) < Math.abs(bestSize - targetKB)) {
      bestSize = sizeKB;
      bestData = data;
    }

    sizeKB > targetKB ? maxQ = q : minQ = q;
  }

  document.getElementById("download").href = bestData;
  document.getElementById("finalSize").innerText =
    `Final Size: ${bestSize.toFixed(1)} KB (${(bestSize / 1024).toFixed(2)} MB)`;
}
