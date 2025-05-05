
// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll indicator click
document.querySelector('.scroll-indicator').addEventListener('click', function() {
    document.querySelector('#services').scrollIntoView({
        behavior: 'smooth'
    });
});

// Form submission handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Add animation to service cards on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply initial styles and observe
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Testimonial Slider
const track = document.querySelector('.testimonials-track');
const slides = document.querySelectorAll('.testimonial-slide');
const prevBtn = document.querySelector('.testimonial-nav.prev');
const nextBtn = document.querySelector('.testimonial-nav.next');
const dotsContainer = document.querySelector('.testimonial-dots');

let currentSlide = 0;
const totalSlides = slides.length;
let autoPlayInterval;

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Update buttons
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetAutoPlay();
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlider();
    } else {
        currentSlide = 0;
        updateSlider();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    }
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Event listeners
nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
});

// Touch and mouse swipe support
let startX = 0;
let currentX = 0;
let isDragging = false;

const testimonialsWrapper = document.querySelector('.testimonials-wrapper');

// Mouse events
testimonialsWrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    testimonialsWrapper.style.cursor = 'grabbing';
});

testimonialsWrapper.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.pageX;
    const diff = currentX - startX;
    track.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diff}px))`;
});

testimonialsWrapper.addEventListener('mouseup', handleDragEnd);
testimonialsWrapper.addEventListener('mouseleave', handleDragEnd);

// Touch events
testimonialsWrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX;
});

testimonialsWrapper.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].pageX;
    const diff = currentX - startX;
    track.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diff}px))`;
});

testimonialsWrapper.addEventListener('touchend', handleDragEnd);

function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    testimonialsWrapper.style.cursor = 'grab';
    
    const diff = currentX - startX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentSlide > 0) {
            prevSlide();
        } else if (diff < 0 && currentSlide < totalSlides - 1) {
            nextSlide();
        } else {
            updateSlider();
        }
    } else {
        updateSlider();
    }
    
    resetAutoPlay();
}

// Pause on hover
const testimonialsContainer = document.querySelector('.testimonials-container');
testimonialsContainer.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

testimonialsContainer.addEventListener('mouseleave', () => {
    startAutoPlay();
});

// Start auto-play
startAutoPlay();
updateSlider();

// Add parallax effect to banner (only on desktop)
window.addEventListener('scroll', function() {
    if (window.innerWidth > 768) {
        const banner = document.querySelector('.banner');
        const scrolled = window.pageYOffset;
        banner.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Remove parallax on window resize
window.addEventListener('resize', function() {
    const banner = document.querySelector('.banner');
    if (window.innerWidth <= 768) {
        banner.style.backgroundPositionY = '';
    }
});

// Back to Top Button
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Chatbot functionality
const chatbotButton = document.querySelector('.chatbot-button');
const chatbotWindow = document.querySelector('.chatbot-window');
const closeChat = document.querySelector('.close-chat');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

// Toggle chatbot window
chatbotButton.addEventListener('click', function() {
    chatbotWindow.classList.toggle('active');
    if (chatbotWindow.classList.contains('active')) {
        chatInput.focus();
    }
});

closeChat.addEventListener('click', function() {
    chatbotWindow.classList.remove('active');
});

// Bot responses (you can expand this)
const botResponses = {
    greetings: {
        keywords: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'greetings'],
        response: 'Hello! Welcome to Zilly Works. How can I assist you today?<br><br>Connect with us on Facebook: <a href="https://www.facebook.com/share/1APV3uGLTB/?mibextid=wwXIfr" target="_blank" style="color: #3498db; text-decoration: underline;">Click here</a>'
    },
    pricing: {
        keywords: ['price', 'pricing', 'cost', 'paisa', 'rate', 'charge', 'fee', 'budget', 'expensive', 'cheap', 'affordable', 'quotation', 'quote', 'estimate', 'payment'],
        response: 'Our pricing varies based on your specific needs and project scope. Please contact us for a detailed quote. We offer competitive rates and flexible packages to suit your budget.Our email is zillyworks123@gmail.com and phone number is 9861121588<br>Connect with us on Facebook: <a href="https://www.facebook.com/share/1APV3uGLTB/?mibextid=wwXIfr" target="_blank" style="color: #3498db; text-decoration: underline;">Click here</a>'
    },
    services: {
        keywords: ['service', 'offer', 'provide', 'what do you do', 'help with'],
        response: 'We offer four main services: Film Production, Commercials, Event Management, and IT Services. Which one interests you the most?'
    },
    film: {
        keywords: ['film', 'movie', 'video', 'production', 'shoot', 'camera', 'documentary', 'cinema'],
        response: 'Our film production services include pre-production planning, filming, editing, and post-production. We handle documentaries, short films, and feature films. What type of project are you planning?'
    },
    commercial: {
        keywords: ['commercial', 'advertisement', 'ad', 'marketing', 'promotion', 'brand'],
        response: 'We create compelling commercials that drive results! Our team handles everything from concept development to final delivery. We work with brands of all sizes. What product or service would you like to promote?'
    },
    event: {
        keywords: ['event', 'party', 'wedding', 'conference', 'meeting', 'celebration', 'function', 'ceremony'],
        response: 'We specialize in corporate events, weddings, conferences, and special celebrations. Our team handles planning, coordination, and execution. What type of event are you organizing?'
    },
    it: {
        keywords: ['it', 'website', 'software', 'app', 'technology', 'digital', 'computer', 'development', 'programming'],
        response: 'Our IT services include web development, mobile apps, custom software, and digital solutions. We use the latest technologies to bring your ideas to life. What kind of project do you need help with?'
    },
    contact: {
        keywords: ['contact', 'call', 'email', 'reach', 'phone', 'address', 'location', 'office', 'visit'],
        response: 'You can reach us at:\n📧 Email: info@zillyworks.com\n📞 Phone: +1 (555) 123-4567\n📍 Address: 123 Creative Street, City, Country\nWould you like to schedule a meeting?'
    },
    timeline: {
        keywords: ['time', 'duration', 'how long', 'when', 'deadline', 'delivery', 'schedule', 'timeline'],
        response: 'Project timelines vary: Films (2-6 months), Commercials (2-4 weeks), Events (planning starts 3-6 months prior), IT projects (1-6 months). What\'s your timeline?'
    },
    portfolio: {
        keywords: ['portfolio', 'work', 'sample', 'example', 'previous', 'showcase', 'demo'],
        response: 'We\'d love to show you our portfolio! We\'ve worked with brands like TechCorp, Global Events Inc, and InnovateTech. Would you like to see specific examples in film, commercials, events, or IT?'
    },
    team: {
        keywords: ['team', 'staff', 'who', 'people', 'employee', 'crew'],
        response: 'Our team consists of experienced filmmakers, event planners, IT professionals, and creative directors. We have over 50 talented individuals dedicated to bringing your vision to life!'
    },
    thanks: {
        keywords: ['thank', 'thanks', 'appreciate', 'grateful', 'dhanyabad'],
        response: 'You\'re welcome! Is there anything else I can help you with today?'
    },
    bye: {
        keywords: ['bye', 'goodbye', 'see you', 'later', 'exit', 'quit'],
        response: 'Thank you for chatting with us! Have a great day and feel free to return if you have more questions.'
    }
};

function addMessage(message, isUser = false) {
const messageDiv = document.createElement('div');
messageDiv.classList.add('message');
messageDiv.classList.add(isUser ? 'user' : 'bot');

// Use innerHTML for bot messages, but keep user messages safe
if (isUser) {
messageDiv.textContent = message;
} else {
messageDiv.innerHTML = message;
}

chatMessages.appendChild(messageDiv);
chatMessages.scrollTop = chatMessages.scrollHeight;
}


function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    typingDiv.id = 'typingIndicator';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check each response category
    for (const category of Object.values(botResponses)) {
        for (const keyword of category.keywords) {
            if (lowerMessage.includes(keyword)) {
                return category.response;
            }
        }
    }
    
    // Default response if no keywords match
    return 'I\'d be happy to help! You can ask me about our services, pricing, portfolio, or how we can assist with your project. What would you like to know?';
}


function handleUserMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, true);
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate bot thinking time
        setTimeout(() => {
            removeTypingIndicator();
            const response = getBotResponse(message);
            addMessage(response);
        }, 1000 + Math.random() * 1000);
    }
}

chatSend.addEventListener('click', handleUserMessage);

chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleUserMessage();
    }
});