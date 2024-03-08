const output = document.querySelector("output");
const file = document.getElementById("file");
let selectedHashFunction = "SHA-1"; // Default hash function

// Run the hashing function when the user selects one or more files or changes the hash function
file.addEventListener("change", hashFilesAndUpdateOutput);
document
  .getElementById("select-hash-function")
  .addEventListener("change", updateHashFunction);

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

async function hashFilesAndUpdateOutput() {
  let outHTML = "";
  // Iterate over each file in the file select input
  for (const fileItem of file.files) {
    // Calculate its hash using the selected hash function
    // outHTML += `${fileItem.name}    ${await fileHash(fileItem, selectedHashFunction)}<br>`;
    outHTML += `${await fileHash(fileItem, selectedHashFunction)}`;
  }
  output.innerHTML = outHTML;
}

function updateHashFunction() {
  // Update the selected hash function based on the user's choice
  selectedHashFunction = document.getElementById("select-hash-function").value;
  // Re-calculate and update the hash for the existing files
  hashFilesAndUpdateOutput();
}
