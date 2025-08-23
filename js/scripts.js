// Telefone
document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.querySelector('input[type="tel"]');

    if (phoneInput) {
        phoneInput.addEventListener("input", function () {
            let value = phoneInput.value.replace(/\D/g, ""); // Só números

            // Remove código do país se já foi digitado
            if (value.startsWith("351")) {
                value = value.substring(3);
            }

            // Monta o número formatado
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