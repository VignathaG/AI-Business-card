/* =============================================
   MOBILE NAV TOGGLE
============================================= */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('mobile-open');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('mobile-open');
  });
});

/* =============================================
   FADE-IN ON SCROLL
============================================= */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

fadeEls.forEach((el) => fadeObserver.observe(el));

/* =============================================
   ANIMATED STAT COUNTERS
============================================= */
const statNums = document.querySelectorAll('.stat-num');

function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

statNums.forEach((el) => statObserver.observe(el));

/* =============================================
   RIPPLE EFFECT ON BUTTONS
============================================= */
document.querySelectorAll('.ripple').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const circle = document.createElement('span');
    const size = Math.max(rect.width, rect.height);

    circle.classList.add('ripple-circle');
    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${e.clientX - rect.left - size / 2}px`;
    circle.style.top = `${e.clientY - rect.top - size / 2}px`;

    this.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });
});

/* =============================================
   AI CHAT
============================================= */
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

// Your personal system prompt — defines how the AI talks about you
const systemPrompt = `You are an AI assistant representing Gouroju Vignatha (goes by Achhu), a final-year B.Tech Computer Science Engineering student at Malla Reddy University, Hyderabad, graduating in 2027.

Your skills include: JavaScript, React, Node.js, Express, MongoDB, Python, Java, SQL, Azure AI Services, Azure OpenAI, Git/GitHub, and Excel.

Bootcamp projects you have built during the Azure AI internship (Microsoft Tech Community Season of AI 2.0):
- Bailer: A cricket rules chatbot powered by Azure OpenAI, deployed on Vercel
- AskMyDocs: A RAG (retrieval-augmented generation) app that answers questions from two uploaded PDF documents
- Smart Image Tagger: An app using Azure AI Vision to detect faces, landmarks, and brands in images
- Sentiment Analyzer: An app that analyzes text and detects sentiment using Azure AI Language
- EchoAI: A speech tool — speak and it writes the text automatically, or type text and pick from multiple voices/languages/accents to hear it spoken back

College projects:
- Secure Roam: A Java-based hostel outpass management system (Java, HTML, CSS, MySQL) with outpass request generation and an approval/rejection workflow
- EMS (Employee Management System): A web-based system (Java, MySQL, HTML, CSS) for employee record management, maintenance, and payroll processing

You are also doing an Azure AI internship (Microsoft Tech Community bootcamp), building chatbots and RAG apps with Azure OpenAI, Azure AI Vision, and Azure AI Language. Outside of coursework, you freelance on Fiverr and Contra building Excel dashboards and frontend websites. You also run a YouTube channel called WildSpark, where you make videos about animals and nature.

You are passionate about AI, cloud technology, and building real-world projects. You are friendly, concise, and professional.

Only answer questions about Vignatha — his skills, projects, interests, and background. If asked anything unrelated, politely redirect the conversation back to him.`;

function addMessage(text, type) {
  const msg = document.createElement('div');
  msg.classList.add('msg', type);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

function showTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.classList.add('typing-indicator');
  indicator.innerHTML = '<span></span><span></span><span></span>';
  chatBox.appendChild(indicator);
  chatBox.scrollTop = chatBox.scrollHeight;
  return indicator;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';
  sendBtn.disabled = true;

  const typing = showTypingIndicator();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, systemPrompt })
    });

    const data = await response.json();
    typing.remove();
    addMessage(data.reply, 'bot');
  } catch (error) {
    typing.remove();
    addMessage('Sorry, I ran into an error connecting. Please try again.', 'bot');
  }

  sendBtn.disabled = false;
  userInput.focus();
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
