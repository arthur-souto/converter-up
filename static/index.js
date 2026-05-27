const button = document.querySelector(".button-action");
const buttonText = document.querySelector(".button-text");
const spinner = document.querySelector(".spinner");
const input = document.querySelector(".input-url");
const formatSelect = document.querySelector(".select-format");

function setLoading(loading) {
  button.disabled = loading;
  spinner.style.display = loading ? "inline-block" : "none";
  buttonText.textContent = loading ? "Convertendo..." : "Converter";
}

async function download() {
  const url = input.value;
  const format = formatSelect.value;

  if (typeof url !== "string" || url.trim() === "") return;

  setLoading(true);

  try {
    const response = await fetch(`/download?url=${encodeURIComponent(url)}&format=${format}`);

    if (!response.ok) {
      const err = await response.json();
      alert(err.error || "Erro ao converter. Tente novamente.");
      return;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;

    const disposition = response.headers.get("Content-Disposition");
    let filename = `download.${format}`;
    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) filename = match[1].replace(/['"]/g, "");
    }

    a.download = filename;
    a.click();
    URL.revokeObjectURL(objectUrl);
    input.value = "";
  } catch {
    alert("Erro ao converter. Verifique o link e tente novamente.");
  } finally {
    setLoading(false);
  }
}

button.addEventListener("click", download);
