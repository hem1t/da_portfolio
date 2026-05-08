const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const body = document.body;const savedTheme = localStorage.getItem('theme');
if (savedTheme === "dark") {
body.classList.add('dark-theme');
themeIcon.classList.replace('fa-moon', 'fa-sun');
}const bgFrame = document.getElementById('bg-frame');
if (bgFrame) {
bgFrame.onload = () => {
const isDark = body.classList.contains('dark-theme');
bgFrame.contentWindow.postMessage({ type: 'theme-change', isDark }, '*');
};
}themeToggle.addEventListener('click', () => {
const isDark = body.classList.toggle('dark-theme');
themeIcon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
localStorage.setItem('theme', isDark ? 'dark' : 'light');
if (typeof initChart === 'function') initChart(isDark);
if (bgFrame && bgFrame.contentWindow) {
bgFrame.contentWindow.postMessage({ type: 'theme-change', isDark }, '*');
}
});window.addEventListener('mousemove', (e) => {
const bgFrame = document.getElementById('bg-frame');
if (bgFrame && bgFrame.contentWindow) {
bgFrame.contentWindow.postMessage({
type: 'mouse-move',
x: e.clientX,
y: e.clientY
}, '*');
}
});const contactForm = document.querySelector('.contact-form');
if (contactForm) {
contactForm.addEventListener('submit', (e) => {
e.preventDefault();const name = document.getElementById('name').value;
const message = document.getElementById('message').value;
const emailAddress = "sunny10fb@gmail.com";const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
const bodyContent = encodeURIComponent(`Hello hem1t,\n\n${message}\n\nBest regards,\n${name}`);window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${bodyContent}`;
});
}const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const options = {
threshold: 0.7
};const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const id = entry.target.getAttribute('id');
navLinks.forEach(link => {
link.classList.remove('active');
if (link.getAttribute('href') === `#${id}`) {
link.classList.add('active');
}
});
}
});
}, options);sections.forEach(section => observer.observe(section));const ctx = document.getElementById('skillsChart');
let skillsChart;function initChart(isDark = false) {
if (!ctx) return;
const chartCtx = ctx.getContext('2d');
const accentColor = isDark ? '#00d2ff' : '#00a2ff';
const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
const textColor = isDark ? '#a0a0a8' : '#4a4a5e';if (skillsChart) skillsChart.destroy();skillsChart = new Chart(chartCtx, {
type: 'radar',
data: {
labels: ['Python', 'SQL', 'Tableau', 'Power BI', 'Statistics'],
datasets: [{
label: 'Proficiency Level',
data: [70, 10, 0, 0, 0],
backgroundColor: 'rgba(0, 210, 255, 0.2)',
borderColor: accentColor,
borderWidth: 2,
pointBackgroundColor: accentColor,
pointBorderColor: '#fff',
pointHoverBackgroundColor: '#fff',
pointHoverBorderColor: accentColor
}]
},
options: {
scales: {
r: {
angleLines: { color: gridColor },
grid: { color: gridColor },
pointLabels: { color: textColor, font: { size: 12, family: 'Inter' } },
ticks: { display: false, stepSize: 20 },
suggestedMin: 0,
suggestedMax: 100
}
},
plugins: {
legend: { display: false }
}
}
});
}if (ctx) {
initChart(body.classList.contains('dark-theme'));
}