const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx2Z_7ZURWPInSwXQc9F9ir2xA0VnZuzI4HFPjBE3obPlV2U5kPVX95u3XrpT6Fr4rMwg/exec";

// ====== UTILIDADES DE MODAL CUSTOMIZADO ======
const CustomModal = {
  show(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    // Criar backdrop se não existir
    let backdrop = document.getElementById("modal-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "modal-backdrop";
      backdrop.className = "fixed inset-0 bg-black bg-opacity-50 z-40 fade";
      document.body.appendChild(backdrop);
      // Trigger animation
      setTimeout(() => backdrop.classList.add("show"), 10);
    }

    modal.style.display = "flex";
    modal.classList.add("show");
    document.body.classList.add("overflow-hidden");
  },

  hide(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove("show");
    const backdrop = document.getElementById("modal-backdrop");

    setTimeout(() => {
      modal.style.display = "";
      if (backdrop) {
        backdrop.classList.remove("show");
        setTimeout(() => backdrop.remove(), 300);
      }
      document.body.classList.remove("overflow-hidden");
    }, 150);
  },

  toggle(id) {
    const modal = document.getElementById(id);
    if (modal?.style.display === "flex") {
      this.hide(id);
    } else {
      this.show(id);
    }
  },
};

// ====== CARROSSEL CUSTOMIZADO ======
class Carousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.autoPlayDelay = options.autoPlayDelay || 5000;
    this.autoPlay = options.autoPlay !== false;

    this.slides = this.container.querySelectorAll("[data-carousel-item]");
    this.prevBtn = this.container.querySelector("[data-carousel-prev]");
    this.nextBtn = this.container.querySelector("[data-carousel-next]");

    this.init();
  }

  init() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.next());
    }

    this.updateSlides();
    if (this.autoPlay) {
      this.startAutoPlay();
    }

    // Pausar auto-play ao passar mouse
    this.container.addEventListener("mouseenter", () => this.stopAutoPlay());
    this.container.addEventListener("mouseleave", () => {
      if (this.autoPlay) this.startAutoPlay();
    });
  }

  updateSlides() {
    this.slides.forEach((slide, idx) => {
      if (idx === this.currentIndex) {
        slide.classList.remove("opacity-0", "pointer-events-none");
        slide.classList.add("opacity-100");
      } else {
        slide.classList.remove("opacity-100");
        slide.classList.add("opacity-0", "pointer-events-none");
      }
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlides();
    this.resetAutoPlay();
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlides();
    this.resetAutoPlay();
  }

  startAutoPlay() {
    if (this.autoPlayInterval) return;
    this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.autoPlayInterval = null;
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    if (this.autoPlay) this.startAutoPlay();
  }
}

const carousel = new Carousel("funcionalidadesCarousel", {
  autoPlay: true,
  autoPlayDelay: 5000,
});

// ====== INQUÉRITO DE SATISFAÇÃO ======
(function initSurvey() {
  // ── Estado NPS ──
  let selectedScore = null;

  // ── Elementos ──
  const openBtn = document.getElementById("open-survey-btn");
  const closeBtn = document.getElementById("survey-close-btn");
  const cancelBtn = document.getElementById("survey-cancel-btn");
  const backdrop = document.getElementById("survey-backdrop");
  const dialog = document.getElementById("survey-dialog");
  const surveyForm = document.getElementById("survey-form");
  const submitBtn = document.getElementById("survey-submit-btn");
  const errorBanner = document.getElementById("survey-error-banner");
  const nameInput = document.getElementById("survey-name");
  const emailInput = document.getElementById("survey-email");
  const reasonInput = document.getElementById("survey-reason");
  const feedbackInput = document.getElementById("survey-feedback");
  const scoreGrid = document.getElementById("survey-score-grid");
  const toast = document.getElementById("survey-toast");
  const toastInner = document.getElementById("survey-toast-inner");
  const toastTitle = document.getElementById("survey-toast-title");
  const toastDesc = document.getElementById("survey-toast-desc");

  if (!openBtn || !surveyForm) return;

  // ── Criar botões NPS ──
  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = i;
    btn.dataset.score = i;
    btn.setAttribute("aria-label", `Pontuação ${i}`);
    btn.className =
      "score-btn h-10 rounded-md font-semibold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all";
    btn.addEventListener("click", () => selectScore(i));
    scoreGrid.appendChild(btn);
  }

  function selectScore(n) {
    selectedScore = n;
    scoreGrid.querySelectorAll(".score-btn").forEach((btn) => {
      btn.classList.remove("active-green");
      btn.classList.add("bg-gray-100", "text-gray-600");
    });
    const active = scoreGrid.querySelector(`[data-score="${n}"]`);
    active.classList.remove(
      "bg-gray-100",
      "text-gray-600",
      "hover:bg-gray-200",
    );
    active.classList.add("active-green");
  }

  // ── Abrir / Fechar ──
  function openDialog() {
    backdrop.classList.remove("hidden");
    dialog.classList.remove("hidden");
    requestAnimationFrame(() => {
      backdrop.style.opacity = "1";
      dialog.style.opacity = "1";
      dialog.style.transform = "translateY(0)";
    });
    nameInput?.focus();
  }

  function closeDialog() {
    backdrop.classList.add("hidden");
    dialog.classList.add("hidden");
  }

  function resetSurveyForm() {
    selectedScore = null;
    surveyForm.reset();
    errorBanner.classList.add("hidden");
    scoreGrid.querySelectorAll(".score-btn").forEach((btn) => {
      btn.classList.remove("active-red", "active-amber", "active-green");
      btn.classList.add("bg-gray-100", "text-gray-600");
    });
  }

  // ── Inicializar survey ──
  window.addEventListener("load", function () {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("feedback") === "true") {
      if (typeof openDialog === "function") {
        openDialog();
      }
    }
  });

  openBtn.addEventListener("click", openDialog);
  closeBtn?.addEventListener("click", () => {
    closeDialog();
    resetSurveyForm();
  });
  cancelBtn?.addEventListener("click", () => {
    closeDialog();
    resetSurveyForm();
  });
  backdrop?.addEventListener("click", () => {
    closeDialog();
    resetSurveyForm();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dialog.classList.contains("hidden")) {
      closeDialog();
      resetSurveyForm();
    }
  });

  // ── Validação ──
  function validateSurvey() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const reason = reasonInput.value.trim();
    const feedback = feedbackInput.value.trim();

    // Nome obrigatório
    if (!name || name.length < 2)
      return "Por favor, preencha o nome corretamente.";

    // Email obrigatório + formato válido
    if (!email) return "Por favor, preencha o email.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Por favor, insira um email válido.";

    // Pontuação obrigatória
    if (selectedScore === null)
      return "Por favor, selecione uma pontuação de 0 a 10.";

    // Motivo obrigatório
    if (!reason || reason.length < 3)
      return "Por favor, indique o motivo da sua classificação.";

    // Feedback obrigatório
    if (!feedback || feedback.length < 3)
      return "Por favor, partilhe a sua opinião sobre a plataforma.";

    return null;
  }

  // ── Toast ──
  let toastTimeout;
  function showSurveyToast(title, desc, success = true) {
    toastTitle.textContent = title;
    toastDesc.textContent = desc;
    toastInner.className = success
      ? "rounded-xl px-4 py-3 shadow-lg text-sm font-medium flex items-start gap-3 bg-white border border-gray-200 text-gray-800"
      : "rounded-xl px-4 py-3 shadow-lg text-sm font-medium flex items-start gap-3 bg-red-50 border border-red-200 text-red-800";

    const iconEl = toastInner.querySelector(".toast-icon");
    if (iconEl) {
      iconEl.innerHTML = success
        ? `<svg class="w-5 h-5 text-teal-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
             <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
           </svg>`
        : `<svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
             <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
           </svg>`;
    }

    toast.classList.remove("hidden");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.add("hidden"), 4500);
  }

  // ── Submit → Google Apps Script ──
  surveyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBanner.classList.add("hidden");

    const err = validateSurvey();
    if (err) {
      errorBanner.textContent = err;
      errorBanner.classList.remove("hidden");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "A enviar...";

    const feedbackData = new FormData();

    feedbackData.append("email", emailInput.value.trim());
    feedbackData.append("satisfacao", selectedScore);
    feedbackData.append("nome", nameInput.value.trim());
    feedbackData.append("motivo", reasonInput.value.trim());
    feedbackData.append("feedback", feedbackInput.value.trim());

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: feedbackData,
      });
      const result = await response.json();

      if (result.success) {
        showSurveyToast(
          "Obrigado pelo seu feedback!",
          "A sua opinião ajuda-nos a melhorar a HealthSupply.",
        );
        resetSurveyForm();
        closeDialog();
      } else {
        showSurveyToast(
          "Não foi possível enviar",
          result.message || "Tente novamente em instantes.",
          false,
        );
      }
    } catch (error) {
      showSurveyToast(
        "Erro de ligação",
        "Verifique a sua ligação à internet e tente novamente.",
        false,
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar resposta";
    }
  });
})();

// ====== FORMULÁRIO DE CONTACTO ======
document.addEventListener("DOMContentLoaded", function () {
  // Telefone
  const inputTel = document.querySelector("#telefone");
  if (inputTel) {
    window.intlTelInput(inputTel, {
      initialCountry: "pt",
      preferredCountries: ["pt", "br", "es"],
      separateDialCode: true,
    });
  }

  // Código Postal
  const postalInput = document.querySelector('input[name="codigoPostal"]');
  if (postalInput) {
    postalInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length > 4) {
        value = value.substring(0, 4) + "-" + value.substring(4, 7);
      }
      this.value = value;
    });
  }

  // Formulário de contacto
  const contactForm = document.getElementById("formulario");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      CustomModal.show("statusModal");
      document.body.classList.add("overflow-hidden");

      const statusMsg = document.getElementById("statusMessage");
      statusMsg.innerHTML = `
        <div class="flex justify-center mb-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-[--color001]"
          ></div>
        </div>
        <p class="text-gray-800 font-medium">Enviando sua mensagem...</p>
      `;

      const closeModal = (delay = 3000) => {
        setTimeout(() => {
          CustomModal.hide("statusModal");
          document.body.classList.remove("overflow-hidden");
          contactForm.reset();
        }, delay);
      };

      const formData = new FormData(contactForm);
      formData.append("formType", "contacto");

      formData.set(
        "solicitar",
        document.getElementById("solicitar")?.checked ? "Sim" : "Não",
      );

      try {
        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          statusMsg.innerHTML = `
          <div class="flex justify-center mb-4">
            <svg class="w-16 h-16 text-[--color001]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <p class="text-gray-800 font-medium">Mensagem enviada com sucesso!</p>
        `;
          closeModal(3000);
        } else {
          statusMsg.innerHTML = `
          <div class="flex justify-center mb-4">
            <svg class="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <p class="text-red-700">Erro: ${result.message}</p>
        `;
          closeModal(4000);
        }
      } catch (error) {
        statusMsg.innerHTML = `
        <div class="flex justify-center mb-4">
          <svg class="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <p class="text-red-700">Erro ao enviar: ${error.message}</p>
      `;
        closeModal(4000);
      }
    });
  }

  // Carrossel de funcionalidades
  const carouselContainer = document.getElementById("carouselContainer");
  if (carouselContainer) {
    new Carousel("carouselContainer", { autoPlay: true, autoPlayDelay: 5000 });
  }

  // Fechar modais ao clicar no backdrop
  document.addEventListener("click", function (e) {
    if (e.target.id === "modal-backdrop") {
      const modal = document.querySelector('[role="dialog"].show');
      if (modal) {
        const id = modal.id;
        CustomModal.hide(id);
      }
    }
  });

  // Fechar modais com botões close
  document.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest('[role="dialog"]');
      if (modal) {
        CustomModal.hide(modal.id);
      }
    });
  });
});

// Menu mobile
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// Contador de utilizadores
window.changeUsers = function (delta) {
  const countEl = document.getElementById("user-count");
  const priceEl = document.getElementById("user-price");
  let count = parseInt(countEl.textContent) || 1;
  count = Math.max(1, count + delta);
  countEl.textContent = count;
  priceEl.textContent = "€" + 95 * count;
};
