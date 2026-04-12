// ====== UTILIDADES DE MODAL CUSTOMIZADO ======
const CustomModal = {
  show(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    // Criar backdrop se não existir
    let backdrop = document.getElementById('modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'modal-backdrop';
      backdrop.className = 'fixed inset-0 bg-black bg-opacity-50 z-40 fade';
      document.body.appendChild(backdrop);
      // Trigger animation
      setTimeout(() => backdrop.classList.add('show'), 10);
    }

    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.classList.add('overflow-hidden');
  },

  hide(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove('show');
    const backdrop = document.getElementById('modal-backdrop');

    setTimeout(() => {
      modal.style.display = '';
      if (backdrop) {
        backdrop.classList.remove('show');
        setTimeout(() => backdrop.remove(), 300);
      }
      document.body.classList.remove('overflow-hidden');
    }, 150);
  },

  toggle(id) {
    const modal = document.getElementById(id);
    if (modal?.style.display === 'flex') {
      this.hide(id);
    } else {
      this.show(id);
    }
  }
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

    this.slides = this.container.querySelectorAll('[data-carousel-item]');
    this.prevBtn = this.container.querySelector('[data-carousel-prev]');
    this.nextBtn = this.container.querySelector('[data-carousel-next]');

    this.init();
  }

  init() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    this.updateSlides();
    if (this.autoPlay) {
      this.startAutoPlay();
    }

    // Pausar auto-play ao passar mouse
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => {
      if (this.autoPlay) this.startAutoPlay();
    });
  }

  updateSlides() {
    this.slides.forEach((slide, idx) => {
      slide.classList.toggle('hidden', idx !== this.currentIndex);
      slide.classList.toggle('opacity-100', idx === this.currentIndex);
      slide.classList.toggle('opacity-0', idx !== this.currentIndex);
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlides();
    this.resetAutoPlay();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
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

// ====== FORMULÁRIO DE CONTACTO ======
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzv6efjfy3jbg_JVsb9lv1pdghixDdtTWYyesoH0SJzvvUqQG0jHnw4vI6e8xt6ytX6/exec';

document.addEventListener('DOMContentLoaded', function () {
  // Telefone
  const inputTel = document.querySelector('#telefone');
  if (inputTel) {
    window.intlTelInput(inputTel, {
      initialCountry: 'pt',
      preferredCountries: ['pt', 'br', 'es'],
      separateDialCode: true,
    });
  }

  // Código Postal
  const postalInput = document.querySelector('input[name="codigoPostal"]');
  if (postalInput) {
    postalInput.addEventListener('input', function () {
      let value = this.value.replace(/\D/g, '');
      if (value.length > 4) {
        value = value.substring(0, 4) + '-' + value.substring(4, 7);
      }
      this.value = value;
    });
  }

  // Formulário de contacto
  const contactForm = document.getElementById('formulario');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      CustomModal.show('statusModal');
      const statusMsg = document.getElementById('statusMessage');
      statusMsg.innerHTML = `
        <div class="flex justify-center mb-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p class="text-gray-700">Enviando sua mensagem...</p>
      `;

      const formData = new FormData(contactForm);
      formData.set('solicitar', document.getElementById('solicitar')?.checked ? 'Sim' : 'Não');

      try {
        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          statusMsg.innerHTML = `
            <div class="flex justify-center mb-4">
              <svg class="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="text-green-700 font-semibold">Mensagem enviada com sucesso!</p>
          `;
          setTimeout(() => {
            CustomModal.hide('statusModal');
            contactForm.reset();
          }, 3000);
        } else {
          statusMsg.innerHTML = `
            <div class="flex justify-center mb-4">
              <svg class="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <p class="text-red-700">Erro: ${result.message}</p>
          `;
        }
      } catch (error) {
        statusMsg.innerHTML = `
          <div class="flex justify-center mb-4">
            <svg class="w-16 h-16 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="text-red-700">Erro ao enviar: ${error.message}</p>
        `;
      }
    });
  }

  // Menu mobile
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Carrossel de funcionalidades
  const carouselContainer = document.getElementById('carouselContainer');
  if (carouselContainer) {
    new Carousel('carouselContainer', { autoPlay: true, autoPlayDelay: 5000 });
  }

  // Fechar modais ao clicar no backdrop
  document.addEventListener('click', function (e) {
    if (e.target.id === 'modal-backdrop') {
      const modal = document.querySelector('[role="dialog"].show');
      if (modal) {
        const id = modal.id;
        CustomModal.hide(id);
      }
    }
  });

  // Fechar modais com botões close
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', function () {
      const modal = this.closest('[role="dialog"]');
      if (modal) {
        CustomModal.hide(modal.id);
      }
    });
  });
});

// Contador de utilizadores
window.changeUsers = function (delta) {
  const countEl = document.getElementById('user-count');
  const priceEl = document.getElementById('user-price');
  let count = parseInt(countEl.textContent) || 1;
  count = Math.max(1, count + delta);
  countEl.textContent = count;
  priceEl.textContent = '€' + (95 * count);
};
