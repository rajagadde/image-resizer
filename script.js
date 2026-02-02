let img = new Image();

document.getElementById("upload").addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = ev => img.src = ev.target.result;
  reader.readAsDataURL(e.target.files[0]);
});

// Convert units to pixels
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

  let targetKB = sizeUnit === "mb" ? target * 1024 : target;

  let quality = 0.9;
  let output;
  let sizeKB;

  do {
    output = canvas.toDataURL("image/jpeg", quality);
    sizeKB = Math.round((output.length * 3) / 4 / 1024);
    quality -= 0.05;
  } while (sizeKB > targetKB && quality > 0.1);

  document.getElementById("download").href = output;
  document.getElementById("finalSize").innerText =
    `Final Size: ${sizeKB} KB (${(sizeKB / 1024).toFixed(2)} MB)`;
}
