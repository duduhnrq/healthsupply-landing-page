// Telefone
document.addEventListener("input", function (e) {
  if (e.target.matches('input[type="tel"]')) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.startsWith("351")) value = value.substring(3);

    let formatted = "+351";
    if (value.length > 0) formatted += " " + value.substring(0, 3);
    if (value.length > 3) formatted += " " + value.substring(3, 6);
    if (value.length > 6) formatted += " " + value.substring(6, 9);

    e.target.value = formatted.trim();
  }
});

// Codigo Postal
document.addEventListener("DOMContentLoaded", function () {
  const postalInput = document.querySelector('input[name="codigoPostal"]');

  if (postalInput) {
    postalInput.addEventListener("input", function () {
      let value = postalInput.value.replace(/\D/g, "");
      if (value.length > 4) {
        value = value.substring(0, 4) + "-" + value.substring(4, 7);
      }
      postalInput.value = value;
    });
  }
});

// Formulário
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzm0I1mysEcSX9TNnRLvFeNwH0IHwOZ01TxNMBq5lCvAOK4AA6tQqqOVM8n8Op_6PoR/exec";

const contactoForm = document.getElementById("formulario");
const statusModal = new bootstrap.Modal(document.getElementById("statusModal"));
const statusMessage = document.getElementById("statusMessage");

contactoForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  statusMessage.innerHTML = `
        <div class="spinner-grow mb-3" role="status"></div>
        <p>Enviando sua mensagem...</p>
    `;
  statusModal.show();

  const formData = new FormData(contactoForm);
  formData.set(
    "solicitar",
    document.getElementById("solicitar").checked ? "Sim" : "Não",
  );

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      statusMessage.innerHTML = `
                <div class="success-icon mb-3 fs-1"><img src="imagens/check.png" alt="Success"></div>
                <p>Sua mensagem foi enviada com sucesso!</p>
            `;
      setTimeout(() => {
        statusModal.hide();
      }, 3000);
      contactoForm.reset();
    } else {
      statusMessage.innerHTML = `
                <div class="error-icon mb-3 fs-1"><img src="imagens/close.png" alt="Error"></div>
                <p>Erro: ${result.message}</p>
            `;
    }
  } catch (error) {
    statusMessage.innerHTML = `
            <div class="error-icon mb-3 fs-1"><img src="imagens/close.png" alt="Error"></div>
            <p>Erro ao enviar: ${error.message}</p>
        `;
  }
});
