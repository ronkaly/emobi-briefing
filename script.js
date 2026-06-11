/* ═══════════════════════════════════════════════
   EMOBI BRIEFING — JavaScript Controller
   Premium Motion Design Interactions
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── CURSOR GLOW (Desktop) ───
  const cursorGlow = document.getElementById('cursorGlow');
  if (window.innerWidth > 1024 && cursorGlow) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.classList.add('active');
    });

    function animateCursor() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('active');
    });
  }

  // ─── PROGRESS BAR & NAV ───
  const progressBar = document.getElementById('progressBar');
  const nav = document.getElementById('nav');

  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = progress + '%';
    }

    if (nav) {
      if (scrollTop > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── REVEAL ON SCROLL (Intersection Observer) ───
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // ─── SMOOTH SCROLL ───
  document.querySelectorAll('.scroll-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── HERO PARTICLES ───
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.setProperty('--duration', (4 + Math.random() * 6) + 's');
      particle.style.setProperty('--delay', (Math.random() * 5) + 's');
      particle.style.setProperty('--tx', (Math.random() * 100 - 50) + 'px');
      particle.style.setProperty('--ty', (Math.random() * -150 - 50) + 'px');
      particle.style.width = (2 + Math.random() * 3) + 'px';
      particle.style.height = particle.style.width;
      particleContainer.appendChild(particle);
    }
  }

  // ─── COUNTER ANIMATION (Hero Stats) ───
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ─── TIMELINE TRACK FILL ───
  const timeline = document.getElementById('timeline');
  const trackFill = document.getElementById('timelineTrackFill');

  if (timeline && trackFill) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rect = timeline.getBoundingClientRect();
          const timelineTop = rect.top;
          const timelineHeight = rect.height;
          const viewportMiddle = window.innerHeight / 2;

          const progress = Math.min(
            Math.max((viewportMiddle - timelineTop) / timelineHeight, 0),
            1
          );

          trackFill.style.height = (progress * 100) + '%';
        }
      });
    }, {
      threshold: Array.from({ length: 100 }, (_, i) => i / 100),
      rootMargin: '0px'
    });

    // Use scroll for smoother tracking
    window.addEventListener('scroll', () => {
      if (!timeline) return;
      const rect = timeline.getBoundingClientRect();
      const timelineTop = rect.top;
      const timelineHeight = rect.height;
      const viewportMiddle = window.innerHeight * 0.6;

      const progress = Math.min(
        Math.max((viewportMiddle - timelineTop) / timelineHeight, 0),
        1
      );

      trackFill.style.height = (progress * 100) + '%';
    }, { passive: true });
  }

  // ─── WHATSAPP CHAT SIMULATOR (driven by card clicks) ───
  const chatConversations = {
    cadastro: [
      { type: 'out', text: 'Oi, ACORI! Captei um apartamento novo no Barro Vermelho. Vou mandar as fotos e um áudio rapidinho.' },
      { type: 'out', text: '📷 [6 fotos enviadas]' },
      { type: 'out', text: '🎤 [Áudio 0:32] "É um 3 quartos, 120m², condomínio com piscina, vaga de garagem coberta, valor R$ 450 mil, aceita financiamento..."' },
      { type: 'typing' },
      { type: 'in', text: '✅ Pronto! Criei o anúncio do apartamento:\n\n🏠 Apt 3/4 • 120m² • Barro Vermelho\n💰 R$ 450.000 | Financiamento\n🏊 Piscina • 🚗 Vaga coberta\n\nDeseja publicar nos portais agora?' },
      { type: 'out', text: 'Publica em tudo! ZAP, Viva Real e OLX.' },
      { type: 'typing' },
      { type: 'in', text: '🚀 Publicado com sucesso nos 3 portais! Links:\n• ZAP Imóveis ✔️\n• Viva Real ✔️\n• OLX ✔️\n\nTempo total: 1min 48seg 🎯' },
    ],
    marketing: [
      { type: 'in', text: '🎉 Parabéns! O apartamento no Tirol foi marcado como VENDIDO no sistema!' },
      { type: 'in', text: '📱 Preparei 3 opções de post para seu Instagram:\n\n1️⃣ Estilo "Conquista" com foto do imóvel\n2️⃣ Estilo "Depoimento" do comprador\n3️⃣ Estilo "Números" com dados do negócio' },
      { type: 'out', text: 'Manda a opção 1, gostei mais!' },
      { type: 'typing' },
      { type: 'in', text: '✅ Pronto! Post gerado com:\n📸 Imagem profissional\n📝 Legenda otimizada\n#️⃣ 15 hashtags relevantes\n\nJá enviei pro seu WhatsApp para postar direto. 🚀' },
      { type: 'in', text: '📊 Também atualizei os portais: o anúncio foi removido do ZAP, Viva Real e OLX automaticamente.' },
    ],
    recepcionista: [
      { type: 'in', text: '🔔 Novo lead recebido!\n\nNome: Ana Carolina\nTelefone: (84) 98765-xxxx\nInteresse: Apt 3/4 Petrópolis\nOrçamento: até R$ 500k\n\nEstou qualificando...' },
      { type: 'typing' },
      { type: 'in', text: '✅ Lead QUALIFICADO!\n\n• Tem pré-aprovação bancária\n• Procura para moradia própria\n• Prazo: próximos 60 dias\n• Disponível: terça e quinta à tarde\n\n⭐ Score: 9/10 — Alta probabilidade de conversão' },
      { type: 'in', text: '📅 Agendei visita:\n\n🗓️ Terça-feira, 15h\n📍 Rua Apodi, 1200 - Petrópolis\n👤 Ana Carolina → Seu nome\n\nConfirmação enviada para ela por WhatsApp. Boa venda! 🏆' },
      { type: 'out', text: 'Perfeito! Vou me preparar para a visita. Valeu, ACORI! 💪' },
    ],
  };

  // Intern labels per chat type
  const internLabels = {
    cadastro:      { icon: '🎙️', text: 'Estagiário de Cadastro em ação' },
    marketing:     { icon: '📢', text: 'Estagiário de Marketing em ação' },
    recepcionista: { icon: '💬', text: 'Recepcionista 24/7 em ação' },
  };

  const wppDemo = document.getElementById('wppDemo');
  const wppChatBody = document.getElementById('wppChatBody');
  const wppDemoLabel = document.getElementById('wppDemoLabel');
  const wppCloseBtn = document.getElementById('wppCloseBtn');
  const allInternCards = document.querySelectorAll('.intern-card[data-chat]');
  let currentChat = null;
  let chatTimeouts = [];

  function clearChatTimeouts() {
    chatTimeouts.forEach(t => clearTimeout(t));
    chatTimeouts = [];
  }

  function loadChat(tab) {
    currentChat = tab;
    clearChatTimeouts();

    if (!wppChatBody) return;
    wppChatBody.innerHTML = '';

    // Update label
    if (wppDemoLabel && internLabels[tab]) {
      const labelIcon = wppDemoLabel.querySelector('.wpp-demo-label-icon');
      const labelText = wppDemoLabel.querySelector('.wpp-demo-label-text');
      if (labelIcon) labelIcon.textContent = internLabels[tab].icon;
      if (labelText) labelText.textContent = internLabels[tab].text;
    }

    // Render messages with stagger
    const messages = chatConversations[tab] || [];
    let delay = 0;

    messages.forEach((msg) => {
      delay += msg.type === 'typing' ? 800 : 400;

      const tid = setTimeout(() => {
        if (currentChat !== tab) return;

        if (msg.type === 'typing') {
          const typingEl = document.createElement('div');
          typingEl.classList.add('wpp-typing');
          typingEl.innerHTML = '<span></span><span></span><span></span>';
          wppChatBody.appendChild(typingEl);
          wppChatBody.scrollTop = wppChatBody.scrollHeight;

          const removeTid = setTimeout(() => {
            if (typingEl.parentNode === wppChatBody) {
              wppChatBody.removeChild(typingEl);
            }
          }, 1200);
          chatTimeouts.push(removeTid);
        } else {
          const msgEl = document.createElement('div');
          msgEl.classList.add('wpp-msg', msg.type === 'in' ? 'wpp-msg-in' : 'wpp-msg-out');
          msgEl.textContent = msg.text;
          wppChatBody.appendChild(msgEl);
          wppChatBody.scrollTop = wppChatBody.scrollHeight;
        }
      }, delay);
      chatTimeouts.push(tid);
    });
  }

  function showPhoneDemo(chatTab) {
    // Activate the clicked card, deactivate others
    allInternCards.forEach(c => c.classList.remove('active'));
    const targetCard = document.querySelector(`[data-chat="${chatTab}"]`);
    if (targetCard) targetCard.classList.add('active');

    // Show the phone demo
    if (wppDemo) {
      wppDemo.classList.add('visible');
    }

    // Load the chat
    loadChat(chatTab);

    // Smooth scroll the phone into view after animation
    setTimeout(() => {
      if (wppDemo) {
        wppDemo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 350);
  }

  function hidePhoneDemo() {
    if (wppDemo) {
      wppDemo.classList.remove('visible');
    }
    allInternCards.forEach(c => c.classList.remove('active'));
    currentChat = null;
    clearChatTimeouts();
  }

  // Card click handlers
  allInternCards.forEach(card => {
    card.addEventListener('click', () => {
      const chatTab = card.dataset.chat;
      if (!chatTab) return;

      // If clicking the already-active card, toggle off
      if (card.classList.contains('active')) {
        hidePhoneDemo();
        return;
      }

      showPhoneDemo(chatTab);
    });
  });

  // Close button
  if (wppCloseBtn) {
    wppCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hidePhoneDemo();
    });
  }

  // ─── IDEA TAGS TOGGLE ───
  const ideaTags = document.querySelectorAll('.idea-tag');
  ideaTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');

      // Haptic-like micro animation
      tag.style.transform = 'scale(0.95)';
      setTimeout(() => {
        tag.style.transform = '';
      }, 150);
    });
  });

  // ─── RSVP FORM HANDLER ───
  const rsvpForm = document.getElementById('rsvpForm');
  const successState = document.getElementById('successState');

  if (rsvpForm && successState) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const phone = document.getElementById('whatsapp').value;
      const cargo = document.getElementById('cargo').value;
      const feedback = document.getElementById('feedback').value;
      const checkDemo = document.getElementById('checkDemo').checked;
      const checkZap = document.getElementById('checkZap').checked;

      // Collect selected idea tags
      const selectedIdeas = [];
      document.querySelectorAll('.idea-tag.selected').forEach(tag => {
        selectedIdeas.push(tag.textContent.trim());
      });

      console.log('%c📝 CONFIRMAÇÃO DE PRESENÇA REGISTRADA:', 'color: #22C55E; font-weight: bold; font-size: 14px;');
      console.log(`Nome: ${name}`);
      console.log(`WhatsApp: ${phone}`);
      console.log(`Função na EMOBI: ${cargo}`);
      console.log(`Dúvida/Sugestão: ${feedback || 'Nenhuma'}`);
      console.log(`Deseja simulação com próprios imóveis: ${checkDemo ? 'Sim' : 'Não'}`);
      console.log(`Deseja testar estagiário WhatsApp: ${checkZap ? 'Sim' : 'Não'}`);
      console.log(`Habilidades sugeridas: ${selectedIdeas.join(', ') || 'Nenhuma'}`);

      // Transition out form
      rsvpForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      rsvpForm.style.opacity = '0';
      rsvpForm.style.transform = 'translateY(10px)';

      setTimeout(() => {
        rsvpForm.style.display = 'none';
        successState.style.display = 'flex';
      }, 400);
    });
  }

  // ─── PARALLAX on Hero Elements ───
  if (window.innerWidth > 768) {
    const portalImage = document.getElementById('portalImage');
    const floatingBadge = document.getElementById('floatingBadge');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        if (portalImage) {
          portalImage.style.transform = `translateY(${scrollY * 0.08}px)`;
        }
        if (floatingBadge) {
          floatingBadge.style.transform = `translateY(${scrollY * -0.05}px)`;
        }
      }
    }, { passive: true });
  }

  // ─── INTERN CARDS STAGGER ───
  const internCards = document.querySelectorAll('.intern-card');
  const internObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 100);
        internObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  internCards.forEach(card => internObserver.observe(card));

  // ─── CARD HOVER GLOW EFFECT ───
  document.querySelectorAll('.intern-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const glow = card.querySelector('.intern-card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(245, 197, 24, 0.08) 0%, transparent 50%)`;
        glow.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      const glow = card.querySelector('.intern-card-glow');
      if (glow) {
        glow.style.opacity = '0';
      }
    });
  });

});
