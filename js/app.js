// ===== Menu Toggle =====
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

function openMenu() {
  sideMenu.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSideMenu() {
  sideMenu.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', openMenu);
closeMenu.addEventListener('click', closeSideMenu);
overlay.addEventListener('click', closeSideMenu);

// ===== Order via WhatsApp =====
function orderProduct(name, price) {
  const phone = '923001234567'; // <-- Apna WhatsApp number yahan daalein (country code ke sath)
  const message = `Assalamualaikum!\n\nMain *${name}* order karna chahta/chahti hoon.\nPrice: Rs. ${price.toLocaleString()}\n\nPlease confirm availability.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ===== Image fallback already handled in HTML via onerror =====
// Agar aap images add karna chahte hain to images/ folder mein 
// product1.jpg, product2.jpg, product3.jpg, product4.jpg rakhein.

console.log('Khan Cloth Shop loaded successfully');
