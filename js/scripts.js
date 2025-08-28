// Telefone
document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.querySelector('input[type="tel"]');

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            let value = phoneInput.value.replace(/\D/g, "");

            if (value.startsWith("351")) {
                value = value.substring(3);
            }

            let formatted = "+351";
            if (value.length > 0) {
                formatted += " " + value.substring(0, 3);
            }
            if (value.length > 3) {
                formatted += " " + value.substring(3, 6);
            }
            if (value.length > 6) {
                formatted += " " + value.substring(6, 9);
            }

            phoneInput.value = formatted.trim();
        });
    }
});

// Formulário
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxonk9xfxfETSF1Jdyl7FWitL10ROZGbfVs_7ZrtOpmNF9bcHGsBgYeKjF0YNOx-vDi/exec';

const form = document.getElementById('formulario');
const statusModal = new bootstrap.Modal(document.getElementById('statusModal'));
const statusMessage = document.getElementById('statusMessage');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    statusMessage.innerHTML = `
        <div class="spinner-grow mb-3" role="status"></div>
        <p>Enviando sua mensagem...</p>
    `;
    statusModal.show();

    const formData = new FormData(form);
    formData.set("solicitar", document.getElementById('solicitar').checked ? 'Sim' : 'Não');

    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            statusMessage.innerHTML = `
                <div class="success-icon mb-3 fs-1"><img src="imagens/check.png" alt="Success"></div>
                <p>Sua mensagem foi enviada com sucesso!</p>
            `;
            form.reset();
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