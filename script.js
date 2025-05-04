// DOM References
const passwordInput = document.getElementById("password");
const copyBtn = document.getElementById("copy-btn");
const generateBtn = document.getElementById("generate-btn");
const lengthInput = document.getElementById("length");
const includeLowercase = document.getElementById("include-lowercase");
const includeUppercase = document.getElementById("include-uppercase");
const includeNumbers = document.getElementById("include-numbers");
const includeSymbols = document.getElementById("include-symbols");

// Function to generate a password
function generatePassword() {
  const length = parseInt(lengthInput.value);
  const useLowercase = includeLowercase.checked;
  const useUppercase = includeUppercase.checked;
  const useNumbers = includeNumbers.checked;
  const useSymbols = includeSymbols.checked;

  // Possible characters
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

  let allChars = "";
  if (useLowercase) allChars += lowercaseChars;
  if (useUppercase) allChars += uppercaseChars;
  if (useNumbers) allChars += numberChars;
  if (useSymbols) allChars += symbolChars;

  if (allChars === "") {
    alert("Please select at least one option.");
    return "";
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password;
}

// Event Listener to Generate Password
generateBtn.addEventListener("click", () => {
  const password = generatePassword();
  passwordInput.value = password;
});

// Event Listener to Copy Password
copyBtn.addEventListener("click", () => {
  passwordInput.select();
  document.execCommand("copy");
  alert("Password copied to clipboard.");
});