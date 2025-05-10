// Referencias al DOM
const passwordInput = document.getElementById("password");
const copyBtn = document.getElementById("copy-btn");
const generateBtn = document.getElementById("generate-btn");
const checkBtn = document.getElementById("check-btn");
const lengthInput = document.getElementById("length");
const includeLowercase = document.getElementById("include-lowercase");
const includeUppercase = document.getElementById("include-uppercase");
const includeNumbers = document.getElementById("include-numbers");
const includeSymbols = document.getElementById("include-symbols");
const apiResult = document.getElementById("api-result");

// Función para generar una contraseña
function generatePassword() {
  const length = parseInt(lengthInput.value);
  const useLowercase = includeLowercase.checked;
  const useUppercase = includeUppercase.checked;
  const useNumbers = includeNumbers.checked;
  const useSymbols = includeSymbols.checked;

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
    alert("Por favor selecciona al menos una opción.");
    return "";
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password;
}

// Evento para generar la contraseña
generateBtn.addEventListener("click", () => {
  const password = generatePassword();
  passwordInput.value = password;
});

// Evento para copiar la contraseña
copyBtn.addEventListener("click", () => {
  passwordInput.select();
  document.execCommand("copy");
  alert("Contraseña copiada al portapapeles.");
});

// Evento para verificar si la contraseña ha sido comprometida
checkBtn.addEventListener("click", async () => {
  const password = passwordInput.value;
  if (!password) {
    alert("Por favor genera una contraseña primero.");
    return;
  }

  // Calcula el hash SHA-1 de la contraseña
  const hashedPassword = await sha1(password);
  const prefix = hashedPassword.slice(0, 5); // Primeros 5 caracteres
  const suffix = hashedPassword.slice(5); // Resto del hash

  // Consulta a la API de "Have I Been Pwned"
  fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
    .then(response => response.text())
    .then(data => {
      const lines = data.split("\n"); // Divide la respuesta en líneas
      const match = lines.find(line => line.startsWith(suffix.toUpperCase())); // Busca el hash
      if (match) {
        const count = match.split(":")[1]; // Obtiene el número de ocurrencias
        apiResult.textContent = `¡Oh no! Tu contraseña ha sido comprometida ${count} veces.`;
      } else {
        apiResult.textContent = "¡Todo bien! Tu contraseña no ha sido encontrada en la base de datos.";
      }
    })
    .catch(error => {
      apiResult.textContent = "Error al verificar la contraseña.";
      console.error(error);
    });
});

// Función para calcular el hash SHA-1
async function sha1(message) {
  const msgBuffer = new TextEncoder().encode(message); // Codifica el mensaje
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer); // Genera el hash
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convierte el buffer en un array
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join(""); // Convierte el array a hexadecimal
}