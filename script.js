/* ============================================
   NEXUS AI - JavaScript Core
   ============================================ */

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupListeners();
  }

  applyTheme() {
    document.body.classList.remove('light-mode', 'dark-mode');
    if (this.theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.add('dark-mode');
    }
  }

  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
    this.updateUI();
  }

  setupListeners() {
    const themeButtons = document.querySelectorAll('.theme-option');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedTheme = btn.dataset.theme;
        if (selectedTheme && selectedTheme !== this.theme) {
          this.theme = selectedTheme;
          this.toggle();
        }
      });
    });
  }

  updateUI() {
    const lightBtn = document.querySelector('[data-theme="light"]');
    const darkBtn = document.querySelector('[data-theme="dark"]');
    if (lightBtn && darkBtn) {
      lightBtn.classList.toggle('active', this.theme === 'light');
      darkBtn.classList.toggle('active', this.theme === 'dark');
    }
  }
}

// Navigation
class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupActiveLink();
    this.setupSmoothScroll();
  }

  setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  setupActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// Modal Management
class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    if (this.modal) {
      this.setupListeners();
    }
  }

  setupListeners() {
    const closeBtn = this.modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  open() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Chat Interface
class ChatInterface {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.messagesContainer = this.container?.querySelector('.chat-messages');
    this.inputField = this.container?.querySelector('.chat-input');
    this.sendBtn = this.container?.querySelector('.chat-send-btn');
    
    if (this.container) {
      this.init();
    }
  }

  init() {
    this.setupListeners();
    this.loadChatHistory();
  }

  setupListeners() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.sendMessage());
    }

    if (this.inputField) {
      this.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
  }

  sendMessage() {
    const message = this.inputField.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    this.inputField.value = '';
    this.inputField.focus();

    // Show typing indicator
    this.showTypingIndicator();

    // Simulate AI response with varied replies
    setTimeout(() => {
      const aiResponse = this.generateAIResponse(message);
      this.removeTypingIndicator();
      this.addMessage(aiResponse, 'ai');
    }, 1500 + Math.random() * 1000);
  }

  generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Extract name more accurately (avoid catching "kya", "kay" from questions)
    const namePatterns = [
      /my name is (\w+)/i,
      /mera naam (\w+) hai/i,
      /mara naam (\w+) ha/i,
      /i'm (\w+)/i,
      /main (\w+) hoon/i,
      /میرا نام (\w+) ہے/,
      /my name (\w+)/i
    ];
    
    for (let pattern of namePatterns) {
      const match = userMessage.match(pattern);
      if (match && match[1] && match[1].length > 2) {
        const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
        localStorage.setItem('userName', name);
        return `Bilkul! Khush aaya aapka naam suna, ${name}! 😊 Main NEXUS AI hoon, aapka AI assistant. Kya main aapki kuch madad kar sakta hoon?`;
      }
    }

    // What is your name / Who are you
    if (message.match(/^(what.*your name|your name|tumar name|tumara name|who are you|who r u|tum kaun ho|ap kya ho|what are you|what do you call yourself)/)) {
      const userName = localStorage.getItem('userName') || 'Friend';
      return `I'm NEXUS AI 🤖 - your personal AI super-app! I can help with:\n✨ Smart conversations\n🎨 Image generation\n🎬 Video creation\n👨‍💻 Code writing\n✍️ Content creation\n📚 Learning & tutoring\n💰 Finance management\n\nHow can I help you, ${userName}? 😊`;
    }

    // Greeting responses
    if (message.match(/^(hello|hi|hey|assalam|salam)/)) {
      const userName = localStorage.getItem('userName') || '';
      const greetings = [
        `السلام عليكم! 👋 ${userName ? userName + ',' : ''} خوش آمديد`,
        `Hello${userName ? ', ' + userName : ''}! 👋 How can I help you today?`,
        `Hi${userName ? ' ' + userName : ''} there! 😊 What can I do for you?`,
        `Salam ${userName || 'dost'}! 🤖 Kya madad kar sakta hoon?`
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // How are you
    if (message.match(/how are you|kaisa|kaise ho|tum theek|ap theek|kaise hain/)) {
      const userName = localStorage.getItem('userName') || 'Friend';
      return `I'm perfect${userName ? ', ' + userName : ''}! 🚀 Running at 100% efficiency and ready to help. How can I serve you?`;
    }

    // Thanks
    if (message.match(/thank|thanks|shukriya|dhanyavaad|appreciate|grateful/)) {
      return `You're welcome! 😊 What else can I help with?`;
    }

    // Image generation
    if (message.match(/image|img|generate|create|design|draw|picture|art|painting/)) {
      return `🎨 Perfect! Head to the **Images** tab and describe what you want to create. I can generate:\n• Realistic photos\n• Digital art\n• Paintings\n• Anime\n• 3D renders\n\nJust describe it and I'll create it for you! ✨`;
    }

    // Code
    if (message.match(/code|javascript|python|html|css|programming|dev|website|app|function|variable/)) {
      return `👨‍💻 Great! Go to the **Code** tab where you can:\n• Generate code in any language\n• Get explanations\n• Debug issues\n• Learn programming\n\nWhat do you want to build? 🚀`;
    }

    // Video
    if (message.match(/video|movie|film|youtube|tiktok|create video|animation/)) {
      return `🎬 Awesome! Visit the **Videos** tab to:\n• Create YouTube videos\n• Make TikToks\n• Generate with AI avatars\n• Add voiceovers\n• Auto-subtitles\n\nLet's create something amazing! 🌟`;
    }

    // Content writing
    if (message.match(/write|content|blog|article|email|social|copy|twitter|instagram|facebook|caption/)) {
      return `✍️ Excellent! Go to the **Writer** tab for:\n• Blog posts\n• Social media content\n• Email writing\n• Product descriptions\n• SEO optimization\n\nWhat would you like to write? 📝`;
    }

    // Logo design
    if (message.match(/logo|brand|design|graphic|branding/)) {
      return `🎯 Perfect! The **Logo** tab lets you:\n• Generate logos instantly\n• Create brand kits\n• Design logos\n• Export in HD\n\nLet's build your brand! 🌈`;
    }

    // Learning
    if (message.match(/learn|study|education|quiz|tutorial|padhna|sikhna|exam|course/)) {
      return `📚 Great choice! Visit **Learning** for:\n• AI tutoring\n• Quiz generation\n• Study plans\n• Exam prep\n• Concept explanations\n\nWhat do you want to learn? 🧠`;
    }

    // Finance
    if (message.match(/money|finance|budget|expense|invest|save|spending|bill|payment/)) {
      return `💰 Smart! The **Finance** tab helps you:\n• Track expenses\n• Budget planning\n• AI financial advice\n• Spending analysis\n\nLet's manage your finances! 📊`;
    }

    // Help & Features
    if (message.match(/help|feature|what can you|capabilities|kya kar|abilities/)) {
      return `🎯 I'm NEXUS AI with these features:\n💬 **Chat** - Talk to me!\n🎨 **Images** - Generate art\n🎬 **Videos** - Create videos\n👨‍💻 **Code** - Write code\n✍️ **Writer** - Content creation\n🎯 **Logo** - Logo design\n📚 **Learning** - Education\n💰 **Finance** - Money management\n\nWhat interests you? 😊`;
    }

    // Compliments
    if (message.match(/you.*great|you.*good|you.*awesome|brilliant|amazing|excellent/)) {
      return `Thank you! 😊 That's very kind of you! I'm here to help you achieve amazing things. What can I do next? 🚀`;
    }

    // General smart responses
    const responses = [
      `That's interesting! 🤔 Tell me more - how can I help with that?`,
      `I understand! 💭 Would you like me to help you with that?`,
      `Got it! 👍 What would you like me to do?`,
      `I see what you mean! 🧠 How can I assist?`,
      `That's a great idea! ✨ Want help implementing it?`,
      `Interesting! 👀 What would you like help with?`,
      `Understood! ✅ How can I make it better?`,
      `Nice! 🌟 What would you like next?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'message';
    typingEl.innerHTML = `
      <div class="message-avatar">🤖</div>
      <div class="message-content" style="display: flex; gap: 4px; align-items: center;">
        <span style="animation: bounce 1.4s infinite;">●</span>
        <span style="animation: bounce 1.4s infinite; animation-delay: 0.2s;">●</span>
        <span style="animation: bounce 1.4s infinite; animation-delay: 0.4s;">●</span>
      </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce {
        0%, 60%, 100% { opacity: 0.5; transform: translateY(0); }
        30% { opacity: 1; transform: translateY(-10px); }
      }
    `;
    if (!document.querySelector('style[data-chat-bounce]')) {
      style.setAttribute('data-chat-bounce', 'true');
      document.head.appendChild(style);
    }
    
    typingEl.setAttribute('id', 'typing-indicator');
    this.messagesContainer.appendChild(typingEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  removeTypingIndicator() {
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) typingEl.remove();
  }

  addMessage(text, sender) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? '👤' : '🤖';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;

    messageEl.appendChild(avatar);
    messageEl.appendChild(content);

    this.messagesContainer.appendChild(messageEl);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

    // Save to history
    this.saveChatHistory();
  }

  saveChatHistory() {
    const messages = Array.from(this.messagesContainer.querySelectorAll('.message')).map(msg => ({
      text: msg.querySelector('.message-content').textContent,
      sender: msg.classList.contains('user') ? 'user' : 'ai'
    }));
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }

  loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      const messages = JSON.parse(saved);
      messages.forEach(msg => {
        this.addMessage(msg.text, msg.sender);
      });
    }
  }

  clearHistory() {
    this.messagesContainer.innerHTML = '';
    localStorage.removeItem('chatHistory');
  }
}

// Form Validation
class FormValidator {
  static email(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static password(password) {
    return password.length >= 8;
  }

  static strongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  static validateForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return false;

    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        this.showError(field, 'This field is required');
        isValid = false;
      } else if (field.type === 'email' && !this.email(field.value)) {
        this.showError(field, 'Invalid email address');
        isValid = false;
      } else if (field.name === 'password' && !this.password(field.value)) {
        this.showError(field, 'Password must be at least 8 characters');
        isValid = false;
      }
    });

    return isValid;
  }

  static showError(field, message) {
    field.style.borderColor = 'var(--error)';
    const errorEl = field.nextElementSibling;
    if (errorEl?.classList.contains('error-message')) {
      errorEl.textContent = message;
    } else {
      const error = document.createElement('small');
      error.className = 'error-message';
      error.textContent = message;
      error.style.color = 'var(--error)';
      field.parentNode.insertBefore(error, field.nextSibling);
    }
  }

  static clearError(field) {
    field.style.borderColor = '';
    const errorEl = field.nextElementSibling;
    if (errorEl?.classList.contains('error-message')) {
      errorEl.remove();
    }
  }
}

// Analytics Tracker
class Analytics {
  static trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      ...data
    };
    console.log('Event tracked:', event);
    // In production, send to analytics service
  }

  static trackPageView(pageName) {
    this.trackEvent('page_view', { page: pageName });
  }

  static trackButtonClick(buttonName) {
    this.trackEvent('button_click', { button: buttonName });
  }

  static trackFormSubmit(formName) {
    this.trackEvent('form_submit', { form: formName });
  }
}

// User Management
class UserManager {
  static getUser() {
    return JSON.parse(localStorage.getItem('user')) || null;
  }

  static setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  static logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }

  static isAuthenticated() {
    return !!this.getUser() && !!localStorage.getItem('token');
  }

  static requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
    }
  }
}

// Notification System
class Notification {
  static show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: linear-gradient(135deg, var(--accent), var(--accent-purple));
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      animation: slideInLeft 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    if (duration > 0) {
      setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }

    return notification;
  }

  static success(message, duration) {
    return this.show(message, 'success', duration);
  }

  static error(message, duration) {
    return this.show(message, 'error', duration);
  }

  static warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  static info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// Social Authentication
class SocialAuth {
  static loginGoogle() {
    this.showLoading('Connecting with Google...');
    setTimeout(() => {
      const email = 'user' + Math.floor(Math.random() * 10000) + '@gmail.com';
      UserManager.setUser({
        name: 'Google User',
        email: email,
        avatar: '👤',
        provider: 'google'
      });
      localStorage.setItem('token', 'google_token_' + Date.now());
      Notification.success('✅ Signed up with Google!');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    }, 1500);
  }

  static loginGitHub() {
    this.showLoading('Connecting with GitHub...');
    setTimeout(() => {
      const email = 'developer' + Math.floor(Math.random() * 10000) + '@github.com';
      UserManager.setUser({
        name: 'GitHub Developer',
        email: email,
        avatar: '👨‍💻',
        provider: 'github'
      });
      localStorage.setItem('token', 'github_token_' + Date.now());
      Notification.success('✅ Signed up with GitHub!');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    }, 1500);
  }

  static loginApple() {
    this.showLoading('Connecting with Apple...');
    setTimeout(() => {
      const email = 'user' + Math.floor(Math.random() * 10000) + '@icloud.com';
      UserManager.setUser({
        name: 'Apple User',
        email: email,
        avatar: '🍎',
        provider: 'apple'
      });
      localStorage.setItem('token', 'apple_token_' + Date.now());
      Notification.success('✅ Signed up with Apple!');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    }, 1500);
  }

  static loginFacebook() {
    this.showLoading('Connecting with Facebook...');
    setTimeout(() => {
      const email = 'user' + Math.floor(Math.random() * 10000) + '@facebook.com';
      UserManager.setUser({
        name: 'Facebook User',
        email: email,
        avatar: '👥',
        provider: 'facebook'
      });
      localStorage.setItem('token', 'facebook_token_' + Date.now());
      Notification.success('✅ Signed up with Facebook!');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    }, 1500);
  }

  static showLoading(message) {
    const buttons = document.querySelectorAll('#google-signup, #github-signup, #apple-signup, #facebook-signup');
    buttons.forEach(btn => btn.disabled = true);
    Notification.info(message);
  }
}

// Initialize
const themeManager = new ThemeManager();
const navigation = new Navigation();

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme manager
  new ThemeManager();

  // Initialize navigation
  new Navigation();

  // Add tooltips
  setupTooltips();

  // Add lazy loading for images
  setupLazyLoad();

  // Track page view
  Analytics.trackPageView(window.location.pathname);
});

// Tooltips
function setupTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.dataset.tooltip;
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.875rem;
        white-space: nowrap;
        pointer-events: none;
        z-index: 1000;
      `;
      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';

      this.addEventListener('mouseleave', () => tooltip.remove(), { once: true });
    });
  });
}

// Lazy Loading
function setupLazyLoad() {
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}

// Smooth scroll for anchors
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Export for use in other files
window.ThemeManager = ThemeManager;
window.Navigation = Navigation;
window.Modal = Modal;
window.ChatInterface = ChatInterface;
window.FormValidator = FormValidator;
window.Analytics = Analytics;
window.UserManager = UserManager;
window.Notification = Notification;
