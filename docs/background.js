const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');let particles = [];
const particleCount = 100;
const connectionDistance = 140;
const mouseRepelRadius = 160;let isDark = false;
const rootStyle = getComputedStyle(document.documentElement);
const colors = {
dark: [
rootStyle.getPropertyValue('--accent-primary').trim(),
rootStyle.getPropertyValue('--accent-secondary').trim(),
'#6a11cb',
'#2575fc'
],
light: [
rootStyle.getPropertyValue('--accent-primary-light').trim(),
rootStyle.getPropertyValue('--accent-secondary-light').trim(),
'#5ac8fa',
'#007aff'
]
};const mouse = {
x: null,
y: null
};window.addEventListener('message', (event) => {
if (event.data.type === 'mouse-move') {
mouse.x = event.data.x;
mouse.y = event.data.y;
} else if (event.data.type === 'theme-change') {
isDark = event.data.isDark;
document.body.classList.toggle('dark-theme', isDark);
updateParticleColors();
}
});class Particle {
constructor() {
this.init();
}init() {
this.x = Math.random() * canvas.width;
this.y = Math.random() * canvas.height;
this.size = Math.random() * 1.5 + 0.5;
this.vx = (Math.random() - 0.5) * 0.5;
this.vy = (Math.random() - 0.5) * 0.5;
this.density = (Math.random() * 20) + 1;
this.assignColor();
}assignColor() {
const palette = isDark ? colors.dark : colors.light;
this.color = palette[Math.floor(Math.random() * palette.length)];
}draw() {
ctx.fillStyle = this.color;
ctx.beginPath();
ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
ctx.fill();
}update() {
this.x += this.vx;
this.y += this.vy;
if (Math.random() > 0.98) {
this.vx += (Math.random() - 0.5) * 0.1;
this.vy += (Math.random() - 0.5) * 0.1;
}
if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
if (mouse.x !== null) {
let dx = mouse.x - this.x;
let dy = mouse.y - this.y;
let distance = Math.sqrt(dx * dx + dy * dy);if (distance < mouseRepelRadius) {
const forceDirectionX = dx / distance;
const forceDirectionY = dy / distance;
const force = (mouseRepelRadius - distance) / mouseRepelRadius;this.x -= forceDirectionX * force * 5;
this.y -= forceDirectionY * force * 5;
}
}
}
}function updateParticleColors() {
particles.forEach(p => p.assignColor());
}function init() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
particles = [];
for (let i = 0; i < particleCount; i++) {
particles.push(new Particle());
}
}function connect() {
for (let a = 0; a < particles.length; a++) {
for (let b = a; b < particles.length; b++) {
let dx = particles[a].x - particles[b].x;
let dy = particles[a].y - particles[b].y;
let distance = Math.sqrt(dx * dx + dy * dy);if (distance < connectionDistance) {
let opacity = 1 - (distance / connectionDistance);
ctx.strokeStyle = isDark ? `rgba(157, 80, 187, ${opacity * 0.15})` : `rgba(191, 90, 242, ${opacity * 0.1})`;
ctx.lineWidth = 0.5;
ctx.beginPath();
ctx.moveTo(particles[a].x, particles[a].y);
ctx.lineTo(particles[b].x, particles[b].y);
ctx.stroke();
}
}
}
}function animate() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
particles.forEach(p => {
p.update();
p.draw();
});
connect();
requestAnimationFrame(animate);
}window.addEventListener('resize', init);
init();
animate();