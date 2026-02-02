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

  // Mobile-safe limit
  const MAX = 1800;
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

  let quality = 0.9;
  let output = "";
  let sizeKB = Infinity;

  while (quality > 0.05) {
    output = canvas.toDataURL("image/jpeg", quality);
    sizeKB = (output.length * 3) / 4 / 1024;
    if (sizeKB <= targetKB) break;
    quality -= 0.03;
  }

  document.getElementById("download").href = output;
  document.getElementById("finalSize").innerText =
    `Final Size: ${Math.round(sizeKB)} KB (${(sizeKB / 1024).toFixed(2)} MB)`;

  document.getElementById("statusMsg").style.display = "none";
}

// Download popup + reset
document.getElementById("download").addEventListener("click", () => {
  setTimeout(() => {
    alert("✅ Image downloaded successfully!");
    resetTool();
  }, 300);
});

function resetTool() {
  document.getElementById("upload").value = "";
  document.getElementById("width").value = "";
  document.getElementById("height").value = "";
  document.getElementById("targetSize").value = "";
  document.getElementById("finalSize").innerText = "";

  const canvas = document.getElementById("canvas");
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

  document.getElementById("statusMsg").style.display = "block";
}
