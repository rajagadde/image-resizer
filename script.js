let img = new Image();

document.getElementById("upload").addEventListener("change", e => {
  const reader = new FileReader();
  reader.onload = ev => img.src = ev.target.result;
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById("quality").addEventListener("input", e => {
  document.getElementById("qVal").innerText = e.target.value;
});

function convertToPx(value, unit) {
  const dpi = 96; // standard screen DPI
  if (unit === "cm") return value * dpi / 2.54;
  if (unit === "inch") return value * dpi;
  if (unit === "feet") return value * dpi * 12;
  return value; // px
}

function resizeImage() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const unit = document.getElementById("unit").value;
  const wInput = document.getElementById("width").value || img.width;
  const hInput = document.getElementById("height").value || img.height;

  const width = convertToPx(wInput, unit);
  const height = convertToPx(hInput, unit);

  const quality = document.getElementById("quality").value / 100;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(img, 0, 0, width, height);

  const output = canvas.toDataURL("image/jpeg", quality);
  document.getElementById("download").href = output;
}
