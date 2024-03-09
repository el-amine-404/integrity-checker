const output = document.getElementById("form__output-file-hash");
const outputLabel = document.getElementById("form__label-output-file-hash")
const file = document.getElementById("form__input-file");
const fileList = document.getElementById("form__wrapper-file-list");
const numOfFiles = document.getElementById("form__number-of-files");
const processingAnimation = document.getElementById("form__svg-animation-loading");
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

  if (numFiles==1){
    numOfFiles.textContent = `${numFiles} File Selected`;
  } else {
    numOfFiles.textContent = `${numFiles} Files Selected`;
    outputLabel.innerText = "Computed Hashes";
  }
}



function listofFiles() {
  for (f of file.files){
    let listItem = document.createElement("li");
    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";
    listItem.style.background = "rgba(255, 255, 255, 0.15)";
    listItem.style.padding = "0 4px";
    listItem.style.marginBottom = ".5rem";

    let fileName = f.name;

    // Approximate to the closest prefixed unit
    const units = [
      "B",
      "KiB",
      "MiB",
      "GiB",
      "TiB",
      "PiB",
      "EiB",
      "ZiB",
      "YiB",
    ];

    const exponent = Math.min(
      Math.floor(Math.log(f.size) / Math.log(1000)),
      units.length - 1,
    );
    const approx = f.size / 1000 ** exponent;
    const fileSize =
      exponent === 0
        ? `${f.size} bytes`
        : `${approx.toFixed(3)} ${
            units[exponent]
          }`;
          // } (${f.size} bytes)`;

    listItem.innerHTML=`<div class="form__wrapper-fileIcon-name"><i class="fa-solid fa-file-lines"></i><p>${fileName}</p></div><p>${fileSize}</p>`;

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
    if ( file.files.length == 1 ){
      outHTML += `${await fileHash(fileItem, selectedHashFunction)}`;
    } else {
      outHTML += `${fileItem.name}    ${await fileHash(fileItem, selectedHashFunction)}<br>`;
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
