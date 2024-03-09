const output = document.getElementById("form__output-file-hash");
const outputLabel = document.getElementById("form__label-output-file-hash");
const file = document.getElementById("form__input-file");
const fileList = document.getElementById("form__wrapper-file-list");
const numOfFiles = document.getElementById("form__number-of-files");
const processingAnimation = document.getElementById(
  "form__svg-animation-loading"
);
const dropbox = document.getElementById("form__wrapper-drop-zone");
const selectHash = document.getElementById("form__select-hash");

let selectedHashFunction = "SHA-1"; // Default hash function

// Run the hashing function when the user selects one or more files or changes the hash function
file.addEventListener("change", hashFilesAndUpdateOutput);
selectHash.addEventListener("change", updateHashFunction);
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  const dt = e.dataTransfer;
  file.files = dt.files;

  hashFilesAndUpdateOutput();
}

async function showProcessingAnimation() {
  processingAnimation.style.display = "block";
}

async function hideProcessingAnimation() {
  processingAnimation.style.display = "none";
}

async function fileHash(file, hashFunction) {
  const arrayBuffer = await file.arrayBuffer();

  // Use the subtle crypto API to perform a hash of the file's Array Buffer
  const hashAsArrayBuffer = await crypto.subtle.digest(
    hashFunction,
    arrayBuffer
  );

  // Convert the hash to a string representation
  const uint8ViewOfHash = new Uint8Array(hashAsArrayBuffer);
  const hashAsString = Array.from(uint8ViewOfHash)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashAsString;
}

function numberOfFiles() {
  const numFiles = file.files.length;

  fileList.innerHTML = "";

  if (numFiles == 1) {
    numOfFiles.textContent = `${numFiles} File Selected`;
  } else {
    numOfFiles.textContent = `${numFiles} Files Selected`;
    outputLabel.innerText = "Computed Hashes";
  }
}

function listofFiles() {
  for (f of file.files) {
    let listItem = document.createElement("li");
    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";
    listItem.style.background = "rgba(255, 255, 255, 0.15)";
    listItem.style.padding = "0 4px";
    listItem.style.marginBottom = ".5rem";

    let fileName = f.name;

    // Approximate to the closest prefixed unit
    const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

    const exponent = Math.min(
      Math.floor(Math.log(f.size) / Math.log(1000)),
      units.length - 1
    );
    const approx = f.size / 1000 ** exponent;
    const fileSize =
      exponent === 0
        ? `${f.size} bytes`
        : `${approx.toFixed(3)} ${units[exponent]}`;
    // } (${f.size} bytes)`;

    listItem.innerHTML = `
    <div class="form__wrapper-fileIcon-name">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 form__icon-file">
        <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" />
        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
      </svg>
      <p>${fileName}</p>
    </div>
    <p>${fileSize}</p>`;

    fileList.appendChild(listItem);
  }
}

async function hashFilesAndUpdateOutput() {
  numberOfFiles();
  listofFiles();

  let outHTML = "";

  showProcessingAnimation();
  // Iterate over each file in the file select input
  for (const fileItem of file.files) {
    // Calculate its hash using the selected hash function
    if (file.files.length == 1) {
      outHTML += `${await fileHash(fileItem, selectedHashFunction)}`;
    } else {
      outHTML += `${fileItem.name}    ${await fileHash(
        fileItem,
        selectedHashFunction
      )}<br>`;
    }
  }
  output.innerHTML = outHTML;

  hideProcessingAnimation();
}

function updateHashFunction() {
  // Update the selected hash function based on the user's choice
  selectedHashFunction = selectHash.value;
  // Re-calculate and update the hash for the existing files
  hashFilesAndUpdateOutput();
}
