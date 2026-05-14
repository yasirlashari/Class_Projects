// 1. Typing Effect for Hero
const typingSpan = document.getElementById('typing-text');
const titles = ["a Frontend Developer.", "a MERN Learner.", "a Creative Designer."];
let wordIdx = 0;
let charIdx = 0;

function typeEffect() {
    if (charIdx < titles[wordIdx].length) {
        typingSpan.textContent += titles[wordIdx].charAt(charIdx);
        charIdx++;
        setTimeout(typeEffect, 100);
    } else {
        setTimeout(eraseEffect, 2000);
    }
}

function eraseEffect() {
    if (charIdx > 0) {
        typingSpan.textContent = titles[wordIdx].substring(0, charIdx - 1);
        charIdx--;
        setTimeout(eraseEffect, 50);
    } else {
        wordIdx = (wordIdx + 1) % titles.length;
        setTimeout(typeEffect, 500);
    }
}

// 2. Navbar Scroll Style Change
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// 3. Inject 9 Projects via Loop
const projects = [
    { name: "Taj Institute", type: "Education", img: "https://images.unsplash.com/photo-1547916105-e44d6aa9cc28?w=600", live: "https://tajinstitute.netlify.app", github: "https://github.com/shoaib-ahmed-laghari/Taj-Institute.git" },
    { name: "Personal Portfolio", type: "Personal", img: "https://plus.unsplash.com/premium_photo-1678917651747-5c58fda9e7f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydGZvbGlvfGVufDB8fDB8fHww", live: "https://shoaiblagharibalochsite.edgeone.dev/", github: "https://github.com/shoaib-ahmed-laghari/Personal-porfolio-advance.git" },
    { name: "Typing Website", type: "Computer", img: "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHlwaW5nfGVufDB8fDB8fHww", live: "https://annoyed-salmon-ashsxxpd9b.edgeone.dev/", github: "https://github.com/shoaib-ahmed-laghari/Typing_Web.git" },
    { name: "Photo Editor", type: "Edit", img: "https://plus.unsplash.com/premium_photo-1721225465014-cba692ada75c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGhvdG8lMjBlZGl0b3IlMjB3ZWJ8ZW58MHx8MHx8fDA%3D", live: "https://existing-indigo-8adpucbbsx.edgeone.dev/", github: "https://github.com/shoaib-ahmed-laghari/Typing_Web.git" },
    { name: "Quiz Master", type: "Quiz", img: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cXVpeiUyMGdhbWV8ZW58MHx8MHx8fDA%3D", live: "https://programmingquiz.edgeone.dev/", github: "https://github.com/shoaib-ahmed-laghari/Quiz-Web-Advance.git" },
    { name: "Cards Game", type: "Game", img: "https://images.unsplash.com/photo-1614096602618-38a342f139c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FyZCUyMGdhbWV8ZW58MHx8MHx8fDA%3D", live: "https://sweet-yellow-fbux1s1r5g.edgeone.dev/", github: "https://github.com/shoaib-ahmed-laghari/Cards-Game.git" },
    { name: "Business Web", type: "E-Commerce", img: "https://images.unsplash.com/photo-1664455340023-214c33a9d0bd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZSUyMGNvbW1lcmNlfGVufDB8fDB8fHww", live: "https://businessweb.edgeone.dev/home.html", github: "https://github.com/shoaib-ahmed-laghari/Business-Web.git" },
    { name: "Voting System", type: "Political", img: "https://plus.unsplash.com/premium_photo-1707819128905-0c86cef9a78a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dm90aW5nJTIwc3lzdGVtfGVufDB8fDB8fHww", live: "https://votingsystem.edgeone.dev/", github: "https://github.com/shoaib-ahmed-laghari/Voting-System-Web.git" },
    { name: "Resume Builder", type: "Professional", img: "https://images.unsplash.com/photo-1698047681432-006d2449c631?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UmVzdW1lfGVufDB8fDB8fHww", live: "https://resumebuilder.edgeone.dev/", github: "https://github.com/shoaib-ahmed-laghari/Resume-Builder.git" }
];

const projectWrap = document.getElementById('project-container');
projectWrap.innerHTML = ""; // Container clear karne ke liye

projects.forEach(p => {
    projectWrap.innerHTML += `
        <div class="col-md-4">
            <div class="card project-card border-0 shadow-lg rounded-4 h-100 overflow-hidden">
                <div class="position-relative overflow-hidden">
                    <img src="${p.img}" class="card-img-top project-img" alt="${p.name}">
                </div>
                <div class="card-body p-4">
                    <span class="badge bg-primary-soft text-primary mb-2">${p.type}</span>
                    <h5 class="fw-bold mb-3">${p.name}</h5>
                    <p class="small text-muted mb-4">A modern solution built with clean code and high performance.</p>
                    <div class="d-flex gap-2">
                        <a href="${p.live}" class="btn btn-primary btn-sm rounded-pill px-3 flex-grow-1">
                            <i class="bi bi-box-arrow-up-right me-1"></i> Live Demo
                        </a>
                        <a href="${p.github}" class="btn btn-outline-dark btn-sm rounded-pill px-3 flex-grow-1">
                            <i class="bi bi-github me-1"></i> GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
});

// Run Typing Animation
document.addEventListener('DOMContentLoaded', typeEffect);

const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Form se values lena
    const formData = {
        name: contactForm.querySelector('input[placeholder="John Doe"]').value,
        email: contactForm.querySelector('input[placeholder="name@example.com"]').value,
        subject: contactForm.querySelector('input[placeholder="Project Inquiry"]').value,
        message: contactForm.querySelector('textarea').value
    };

    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            alert("Success: " + result.message);
            contactForm.reset(); // Form khali kar dena
        } else {
            alert("Error: Message nahi bheja ja saka.");
        }
    } catch (error) {
        console.error("Masla aa gaya:", error);
        alert("Server se rabta nahi ho pa raha.");
    }
});