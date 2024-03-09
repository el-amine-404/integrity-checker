const output = document.querySelector("output");
const file = document.getElementById("file");
const fileList = document.getElementById("files-list");
const numOfFiles = document.getElementById("num-of-files");
const processingAnimation = document.getElementById("processingAnimation");

let selectedHashFunction = "SHA-1"; // Default hash function

// Run the hashing function when the user selects one or more files or changes the hash function
file.addEventListener("change", hashFilesAndUpdateOutput);
document
  .getElementById("select-hash-function")
  .addEventListener("change", updateHashFunction);


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
    document.getElementById("label_result__file-hash").innerText = "Computed Hashes";
  }
}



function listofFiles() {
  for (f of file.files){
    let listItem = document.createElement("li");
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

    listItem.innerHTML=`<div class="selected-file-icon-name"><i class="fa-solid fa-file-lines"></i><p>${fileName}</p></div><p>${fileSize}</p>`;

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
  selectedHashFunction = document.getElementById("select-hash-function").value;
  // Re-calculate and update the hash for the existing files
  hashFilesAndUpdateOutput();
}
