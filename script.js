let img = new Image();

document.getElementById("upload").addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = ev => img.src = ev.target.result;
  reader.readAsDataURL(e.target.files[0]);
});

// unit → px
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

  const unit = document.getElementById("unit").value;
  const w = document.getElementById("width").value || img.width;
  const h = document.getElementById("height").value || img.height;

  canvas.width = toPx(w, unit);
  canvas.height = toPx(h, unit);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const target = document.getElementById("targetSize").value;
  const sizeUnit = document.getElementById("sizeUnit").value;
  const targetKB = sizeUnit === "mb" ? target * 1024 : target;

  let minQ = 0.1;
  let maxQ = 0.95;
  let bestData = null;
  let bestSize = Infinity;

  // Binary search for best quality
  for (let i = 0; i < 20; i++) {
    const q = (minQ + maxQ) / 2;
    const data = canvas.toDataURL("image/jpeg", q);
    const sizeKB = (data.length * 3) / 4 / 1024;

    if (Math.abs(sizeKB - targetKB) < Math.abs(bestSize - targetKB)) {
      bestSize = sizeKB;
      bestData = data;
    }

    if (sizeKB > targetKB) {
      maxQ = q;
    } else {
      minQ = q;
    }
  }

  document.getElementById("download").href = bestData;
  document.getElementById("finalSize").innerText =
    `Final Size: ${bestSize.toFixed(1)} KB (${(bestSize / 1024).toFixed(2)} MB)`;
}
