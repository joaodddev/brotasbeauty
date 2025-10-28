// Dados do aplicativo
const appData = {
  currentStep: "service-selection",
  selectedService: null,
  selectedProfessional: null,
  selectedDate: null,
  selectedTime: null,

  services: {
    unhas: {
      name: "Unhas",
      professionals: ["Clau", "Leticia", "Gislaine", "Raquel"],
      specialties: {
        Clau: ["Manicure", "Pedicure", "Esmaltação em Gel"],
        Leticia: ["Alongamento", "Manutenção", "Unhas Artísticas"],
        Gislaine: ["Manicure", "Pedicure", "SPA das Mãos"],
        Raquel: ["Alongamento", "Francesinha", "Decorações"],
      },
    },
    sobrancelhas: {
      name: "Sobrancelhas",
      professionals: ["Clau", "Leticia", "Gislaine"],
      specialties: {
        Clau: ["Design", "Henna", "Aplicação de Cera"],
        Leticia: ["Design", "Micropigmentação", "Reconstrução"],
        Gislaine: ["Design", "Henna", "Limpeza de Pele"],
      },
    },
    cilios: {
      name: "Cílios",
      professionals: ["Leticia", "Raquel"],
      specialties: {
        Leticia: ["Volume Brasileiro", "Fio a Fio", "Lifting"],
        Raquel: ["Volume Russo", "Híbrido", "Mega Volume"],
      },
    },
    skincare: {
      name: "Skincare",
      professionals: ["Gislaine", "Raquel"],
      specialties: {
        Gislaine: ["Limpeza de Pele", "Hidratação", "Peeling"],
        Raquel: ["Tratamentos Faciais", "Drenagem", "Massagem Relaxante"],
      },
    },
  },

  // Horário de funcionamento
  businessHours: {
    start: 7, // 7:00
    end: 17.5, // 17:30 (17.5 horas)
    interval: 0.5, // 30 minutos
  },

  // Datas indisponíveis (simulação)
  unavailableDates: ["2023-12-25", "2023-12-31", "2024-01-01"],
};

// Inicialização do aplicativo
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  // Configurar navegação de serviços
  setupServiceNavigation();

  // Configurar seleção de serviços
  setupServiceSelection();

  // Configurar botões de voltar
  setupBackButtons();

  // Configurar formulário de agendamento
  setupBookingForm();

  // Inicializar calendário
  initializeCalendar();
}

// Navegação entre serviços
function setupServiceNavigation() {
  const serviceLinks = document.querySelectorAll(".service-link");

  serviceLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remover classe active de todos os links
      serviceLinks.forEach((l) => l.classList.remove("active"));

      // Adicionar classe active ao link clicado
      this.classList.add("active");

      // Atualizar serviço selecionado
      const service = this.getAttribute("data-service");
      appData.selectedService = service;

      // Ir para seleção de profissional
      showSection("professional-selection");

      // Carregar profissionais do serviço selecionado
      loadProfessionals(service);
    });
  });
}

// Seleção de serviços pelos cards
function setupServiceSelection() {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    card.addEventListener("click", function () {
      const service = this.getAttribute("data-service");
      appData.selectedService = service;

      // Atualizar navegação ativa
      const serviceLinks = document.querySelectorAll(".service-link");
      serviceLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("data-service") === service) {
          link.classList.add("active");
        }
      });

      // Ir para seleção de profissional
      showSection("professional-selection");

      // Carregar profissionais do serviço selecionado
      loadProfessionals(service);
    });
  });
}

// Carregar profissionais para o serviço selecionado
function loadProfessionals(service) {
  const professionalsGrid = document.querySelector(".professionals-grid");
  professionalsGrid.innerHTML = "";

  const serviceData = appData.services[service];
  const emojis = {
    Clau: "💅",
    Leticia: "✨",
    Gislaine: "🌸",
    Raquel: "🌟",
  };

  serviceData.professionals.forEach((professional) => {
    const professionalCard = document.createElement("div");
    professionalCard.className = "professional-card";
    professionalCard.setAttribute("data-professional", professional);

    const specialties = serviceData.specialties[professional];
    const specialtiesHTML = specialties
      .map((spec) => `<span class="specialty-tag">${spec}</span>`)
      .join("");

    professionalCard.innerHTML = `
            <div class="professional-photo">${emojis[professional]}</div>
            <h3>${professional}</h3>
            <p>Especialista em ${serviceData.name.toLowerCase()}</p>
            <div class="professional-specialties">
                ${specialtiesHTML}
            </div>
        `;

    professionalCard.addEventListener("click", function () {
      // Remover seleção anterior
      document.querySelectorAll(".professional-card").forEach((card) => {
        card.classList.remove("selected");
      });

      // Adicionar seleção atual
      this.classList.add("selected");

      // Salvar profissional selecionado
      appData.selectedProfessional = professional;

      // Ir para seleção de data e horário
      showSection("datetime-selection");

      // Atualizar calendário
      initializeCalendar();
    });

    professionalsGrid.appendChild(professionalCard);
  });
}

// Inicializar calendário
function initializeCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  // Configurar data atual
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Criar cabeçalho do calendário
  const calendarHeader = document.createElement("div");
  calendarHeader.className = "calendar-header";

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  calendarHeader.innerHTML = `
        <button id="prev-month">&larr;</button>
        <div class="calendar-month">${monthNames[currentMonth]} ${currentYear}</div>
        <button id="next-month">&rarr;</button>
    `;

  calendar.appendChild(calendarHeader);

  // Adicionar dias da semana
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  weekdays.forEach((weekday) => {
    const weekdayElement = document.createElement("div");
    weekdayElement.className = "calendar-weekday";
    weekdayElement.textContent = weekday;
    calendar.appendChild(weekdayElement);
  });

  // Calcular primeiro dia do mês
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Calcular último dia do mês
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Adicionar dias vazios no início
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day empty";
    calendar.appendChild(emptyDay);
  }

  // Adicionar dias do mês
  for (let day = 1; day <= lastDay; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";
    dayElement.textContent = day;

    // Formatar data para comparação
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    // Verificar se a data está disponível
    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();
    const isPast =
      new Date(currentYear, currentMonth, day) <
      new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isUnavailable = appData.unavailableDates.includes(dateString);
    const isSunday = new Date(currentYear, currentMonth, day).getDay() === 0;

    if (isToday) {
      dayElement.classList.add("today");
    }

    if (isPast || isUnavailable || isSunday) {
      dayElement.classList.add("disabled");
    } else {
      dayElement.addEventListener("click", function () {
        // Remover seleção anterior
        document.querySelectorAll(".calendar-day").forEach((dayEl) => {
          dayEl.classList.remove("selected");
        });

        // Adicionar seleção atual
        this.classList.add("selected");

        // Salvar data selecionada
        appData.selectedDate = dateString;

        // Carregar horários disponíveis
        loadTimeSlots();
      });
    }

    calendar.appendChild(dayElement);
  }

  // Configurar navegação do calendário
  document.getElementById("prev-month").addEventListener("click", function () {
    // Navegar para mês anterior (simulação)
    alert(
      "Funcionalidade de navegação entre meses será implementada na versão completa."
    );
  });

  document.getElementById("next-month").addEventListener("click", function () {
    // Navegar para próximo mês (simulação)
    alert(
      "Funcionalidade de navegação entre meses será implementada na versão completa."
    );
  });
}

// Carregar horários disponíveis
function loadTimeSlots() {
  const timeSlotsContainer = document.getElementById("time-slots");
  timeSlotsContainer.innerHTML = "";

  // Gerar horários baseados no horário de funcionamento
  const slots = generateTimeSlots();

  // Simular alguns horários indisponíveis
  const unavailableSlots = ["10:00", "14:30", "16:00"];

  slots.forEach((slot) => {
    const timeSlot = document.createElement("div");
    timeSlot.className = "time-slot";

    if (unavailableSlots.includes(slot)) {
      timeSlot.classList.add("disabled");
      timeSlot.textContent = slot;
    } else {
      timeSlot.textContent = slot;
      timeSlot.addEventListener("click", function () {
        // Remover seleção anterior
        document.querySelectorAll(".time-slot").forEach((slotEl) => {
          slotEl.classList.remove("selected");
        });

        // Adicionar seleção atual
        this.classList.add("selected");

        // Salvar horário selecionado
        appData.selectedTime = slot;

        // Atualizar resumo
        updateBookingSummary();

        // Ir para formulário de agendamento
        showSection("booking-form");
      });
    }

    timeSlotsContainer.appendChild(timeSlot);
  });
}

// Gerar horários baseados no horário de funcionamento
function generateTimeSlots() {
  const slots = [];
  const start = appData.businessHours.start;
  const end = appData.businessHours.end;
  const interval = appData.businessHours.interval;

  for (let hour = start; hour < end; hour += interval) {
    const hourInt = Math.floor(hour);
    const minutes = (hour % 1) * 60;
    const timeString = `${hourInt.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    slots.push(timeString);
  }

  return slots;
}

// Atualizar resumo do agendamento
function updateBookingSummary() {
  document.getElementById("summary-service").textContent =
    appData.services[appData.selectedService].name;
  document.getElementById("summary-professional").textContent =
    appData.selectedProfessional;

  // Formatar data
  const date = new Date(appData.selectedDate);
  const formattedDate = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("summary-date").textContent = formattedDate;
  document.getElementById("summary-time").textContent = appData.selectedTime;
}

// Configurar formulário de agendamento
function setupBookingForm() {
  const bookingForm = document.getElementById("client-form");

  bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validar formulário
    const name = document.getElementById("client-name").value;
    const phone = document.getElementById("client-phone").value;

    if (!name || !phone) {
      alert("Por favor, preencha pelo menos o nome e telefone.");
      return;
    }

    // Enviar para WhatsApp
    sendToWhatsApp();
  });
}

// Enviar agendamento para WhatsApp
function sendToWhatsApp() {
  const name = document.getElementById("client-name").value;
  const phone = document.getElementById("client-phone").value;
  const email = document.getElementById("client-email").value;
  const notes = document.getElementById("client-notes").value;

  // Formatar data
  const date = new Date(appData.selectedDate);
  const formattedDate = date.toLocaleDateString("pt-BR");

  // Criar mensagem
  let message = `🌸 *NOVO AGENDAMENTO - BROTAS BEAUTY* 🌸\n\n`;
  message += `*Cliente:* ${name}\n`;
  message += `*Telefone:* ${phone}\n`;
  if (email) message += `*E-mail:* ${email}\n`;
  message += `\n*📋 DETALHES DO AGENDAMENTO:*\n`;
  message += `• Serviço: ${appData.services[appData.selectedService].name}\n`;
  message += `• Profissional: ${appData.selectedProfessional}\n`;
  message += `• Data: ${formattedDate}\n`;
  message += `• Horário: ${appData.selectedTime}\n`;
  if (notes) message += `• Observações: ${notes}\n`;
  message += `\n_Agendamento realizado via site_`;

  // Codificar mensagem para URL
  const encodedMessage = encodeURIComponent(message);

  // Número do WhatsApp do salão
  const whatsappNumber = "5514991244578";

  // Criar URL do WhatsApp
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Abrir WhatsApp
  window.open(whatsappURL, "_blank");

  // Mostrar confirmação
  showConfirmation();
}

// Mostrar confirmação
function showConfirmation() {
  // Atualizar confirmação
  document.getElementById("confirm-service").textContent =
    appData.services[appData.selectedService].name;
  document.getElementById("confirm-professional").textContent =
    appData.selectedProfessional;

  // Formatar data
  const date = new Date(appData.selectedDate);
  const formattedDate = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("confirm-date").textContent = formattedDate;
  document.getElementById("confirm-time").textContent = appData.selectedTime;

  // Mostrar confirmação
  showSection("booking-confirmation");
}

// Configurar botões de voltar
function setupBackButtons() {
  // Voltar para serviços
  document
    .getElementById("back-to-services")
    .addEventListener("click", function () {
      showSection("service-selection");
    });

  // Voltar para profissionais
  document
    .getElementById("back-to-professionals")
    .addEventListener("click", function () {
      showSection("professional-selection");
    });

  // Voltar para data/horário
  document
    .getElementById("back-to-datetime")
    .addEventListener("click", function () {
      showSection("datetime-selection");
    });

  // Novo agendamento
  document.getElementById("new-booking").addEventListener("click", function () {
    // Resetar dados
    appData.selectedService = null;
    appData.selectedProfessional = null;
    appData.selectedDate = null;
    appData.selectedTime = null;

    // Resetar formulário
    document.getElementById("client-form").reset();

    // Voltar para início
    showSection("service-selection");

    // Resetar navegação
    document.querySelectorAll(".service-link").forEach((link) => {
      link.classList.remove("active");
    });

    document
      .querySelector('.service-link[data-service="unhas"]')
      .classList.add("active");
  });
}

// Mostrar seção específica
function showSection(sectionId) {
  // Esconder todas as seções
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active");
  });

  // Mostrar seção desejada
  document.getElementById(sectionId).classList.add("active");

  // Atualizar passo atual
  appData.currentStep = sectionId;

  // Rolagem para o topo
  window.scrollTo(0, 0);
}
// Enviar agendamento para WhatsApp
function sendToWhatsApp() {
  const name = document.getElementById("client-name").value;
  const phone = document.getElementById("client-phone").value;
  const email = document.getElementById("client-email").value;
  const notes = document.getElementById("client-notes").value;

  // Formatar data
  const date = new Date(appData.selectedDate);
  const formattedDate = date.toLocaleDateString("pt-BR");

  // Criar mensagem
  let message = `🌸 *NOVO AGENDAMENTO - BROTAS BEAUTY* 🌸\n\n`;
  message += `*Cliente:* ${name}\n`;
  message += `*Telefone:* ${phone}\n`;
  if (email) message += `*E-mail:* ${email}\n`;
  message += `\n*📋 DETALHES DO AGENDAMENTO:*\n`;
  message += `• Serviço: ${appData.services[appData.selectedService].name}\n`;
  message += `• Profissional: ${appData.selectedProfessional}\n`;
  message += `• Data: ${formattedDate}\n`;
  message += `• Horário: ${appData.selectedTime}\n`;
  if (notes) message += `• Observações: ${notes}\n`;
  message += `\n_Agendamento realizado via site_`;

  // Codificar mensagem para URL
  const encodedMessage = encodeURIComponent(message);

  // Número do WhatsApp do salão
  const whatsappNumber = "5514991244578";

  // Criar URL do WhatsApp
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Abrir WhatsApp em nova aba
  window.open(whatsappURL, "_blank");

  // Mostrar confirmação
  showConfirmation();
}

// Mostrar confirmação
function showConfirmation() {
  // Atualizar confirmação
  document.getElementById("confirm-service").textContent =
    appData.services[appData.selectedService].name;
  document.getElementById("confirm-professional").textContent =
    appData.selectedProfessional;

  // Formatar data
  const date = new Date(appData.selectedDate);
  const formattedDate = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("confirm-date").textContent = formattedDate;
  document.getElementById("confirm-time").textContent = appData.selectedTime;

  // Adicionar links de contato na confirmação
  addContactLinksToConfirmation();

  // Mostrar confirmação
  showSection("booking-confirmation");
}

// Adicionar links de contato na página de confirmação
function addContactLinksToConfirmation() {
  const confirmationDetails = document.querySelector(".confirmation-details");

  // Verificar se os links já existem
  if (!document.querySelector(".confirmation-links")) {
    const linksHTML = `
            <div class="confirmation-links">
                <a href="https://wa.me/5514991244578" target="_blank" class="confirmation-link whatsapp">
                    <i class="fab fa-whatsapp"></i> Falar no WhatsApp
                </a>
                <a href="https://maps.google.com/?q=Brotas,SP" target="_blank" class="confirmation-link maps">
                    <i class="fas fa-map-marker-alt"></i> Ver Localização
                </a>
            </div>
        `;

    // Inserir antes do botão de novo agendamento
    const newBookingBtn = document.getElementById("new-booking");
    newBookingBtn.insertAdjacentHTML("beforebegin", linksHTML);
  }
}

// Configurar links de contato no rodapé
function setupContactLinks() {
  // Os links no rodapé já estão configurados no HTML
  // Esta função é para garantir que funcionem corretamente
  const contactLinks = document.querySelectorAll(".contact-link");
  contactLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // O target="_blank" no HTML já cuida de abrir em nova aba
      // Não precisamos prevenir o comportamento padrão
    });
  });
}

// Inicialização do aplicativo (atualizada)
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupContactLinks(); // Configurar links de contato
});
