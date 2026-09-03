// ==================== DATA & AUTH ====================
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Premium Lawn 3PC",
        price: 3500,
        oldPrice: null,
        desc: "High quality digital printed lawn",
        badge: "New",
        image: null,
        gradient: "linear-gradient(135deg, #8B0000, #CD5C5C)"
    },
    {
        id: 2,
        name: "Khaddar Winter Suit",
        price: 4200,
        oldPrice: 5500,
        desc: "Warm & soft export quality",
        badge: "Sale",
        image: null,
        gradient: "linear-gradient(135deg, #2C3E50, #4CA1AF)"
    },
    {
        id: 3,
        name: "Gents Wash & Wear",
        price: 2800,
        oldPrice: null,
        desc: "Premium quality kurta shalwar",
        badge: "",
        image: null,
        gradient: "linear-gradient(135deg, #1a1a2e, #16213e)"
    },
    {
        id: 4,
        name: "Embroidered Fancy Suit",
        price: 6500,
        oldPrice: null,
        desc: "Heavy embroidery with net dupatta",
        badge: "Hot",
        image: null,
        gradient: "linear-gradient(135deg, #4a0e0e, #8B4513)"
    },
    {
        id: 5,
        name: "Linen 3 Piece",
        price: 3900,
        oldPrice: null,
        desc: "Soft linen for all seasons",
        badge: "",
        image: null,
        gradient: "linear-gradient(135deg, #3d1c02, #a0522d)"
    },
    {
        id: 6,
        name: "Kids Fancy Dress",
        price: 1800,
        oldPrice: 2400,
        desc: "Comfortable & stylish",
        badge: "Sale",
        image: null,
        gradient: "linear-gradient(135deg, #0f2027, #203a43)"
    }
];

function initData() {
    if (!localStorage.getItem('kcs_users')) {
        const users = [
            { username: 'admin', password: 'admin123', name: 'Admin', role: 'admin' }
        ];
        localStorage.setItem('kcs_users', JSON.stringify(users));
    }
    if (!localStorage.getItem('kcs_products')) {
        localStorage.setItem('kcs_products', JSON.stringify(DEFAULT_PRODUCTS));
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem('kcs_users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('kcs_users', JSON.stringify(users));
}

function getProducts() {
    return JSON.parse(localStorage.getItem('kcs_products') || '[]');
}

function saveProducts(products) {
    localStorage.setItem('kcs_products', JSON.stringify(products));
}

function getCurrentUser() {
    const data = localStorage.getItem('kcs_currentUser');
    return data ? JSON.parse(data) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('kcs_currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('kcs_currentUser');
    }
}

// ==================== UI HELPERS ====================
function updateNavbar() {
    const user = getCurrentUser();
    const authNavItem = document.getElementById('authNavItem');
    const adminNavItem = document.getElementById('adminNavItem');
    const adminSection = document.getElementById('admin');

    if (user) {
        authNavItem.innerHTML = `
            <div class="user-info">
                <span>${user.name}</span>
                <span class="user-badge">${user.role === 'admin' ? 'Admin' : 'Customer'}</span>
                <button class="logout-btn" id="logoutBtn">Logout</button>
            </div>
        `;
        document.getElementById('logoutBtn').addEventListener('click', logout);

        if (user.role === 'admin') {
            adminNavItem.style.display = 'list-item';
            adminSection.style.display = 'block';
        } else {
            adminNavItem.style.display = 'none';
            adminSection.style.display = 'none';
        }
    } else {
        authNavItem.innerHTML = `<a href="#" id="loginBtn"><i class="fas fa-user"></i> Login</a>`;
        document.getElementById('loginBtn').addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal('login');
        });
        adminNavItem.style.display = 'none';
        adminSection.style.display = 'none';
    }
}

function renderProducts() {
    const user = getCurrentUser();
    const grid = document.getElementById('productGrid');
    const loginMsg = document.getElementById('loginRequiredMsg');
    const products = getProducts();

    if (!user) {
        grid.style.display = 'none';
        loginMsg.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    loginMsg.style.display = 'none';

    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#666;">Abhi koi product nahi hai. Admin se upload karwayein.</p>';
        return;
    }

    grid.innerHTML = products.map(p => {
        const badgeClass = p.badge === 'Sale' ? 'badge sale' : 'badge';
        const badgeHtml = p.badge ? `<span class="${badgeClass}">${p.badge}</span>` : '';
        const priceHtml = p.oldPrice
            ? `Rs. ${p.price.toLocaleString()} <del>Rs. ${p.oldPrice.toLocaleString()}</del>`
            : `Rs. ${p.price.toLocaleString()}`;

        let imgContent = '';
        if (p.image) {
            imgContent = `<img src="${p.image}" alt="${p.name}">`;
        }

        const bgStyle = p.image ? '' : `style="background: ${p.gradient || 'linear-gradient(135deg,#8B0000,#CD5C5C)'}"`;

        return `
            <div class="product-card">
                <div class="product-img" ${bgStyle}>
                    ${imgContent}
                    ${badgeHtml}
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p class="price">${priceHtml}</p>
                    <p class="desc">${p.desc}</p>
                    <a href="#contact" class="btn-sm">Order Now</a>
                </div>
            </div>
        `;
    }).join('');
}

function renderAdminProducts() {
    const list = document.getElementById('adminProductList');
    const products = getProducts();

    if (products.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#666;">Koi product nahi. Pehle Add Product se add karein.</p>';
        return;
    }

    list.innerHTML = products.map(p => {
        const priceHtml = p.oldPrice
            ? `Rs. ${p.price.toLocaleString()} <del>Rs. ${p.oldPrice.toLocaleString()}</del>`
            : `Rs. ${p.price.toLocaleString()}`;

        let imgHtml = '';
        if (p.image) {
            imgHtml = `<img src="${p.image}" alt="${p.name}">`;
        } else {
            imgHtml = `<div style="width:100%;height:100%;background:${p.gradient || '#8B0000'}"></div>`;
        }

        return `
            <div class="admin-product-card">
                <div class="img-wrap">${imgHtml}</div>
                <div class="info">
                    <h4>${p.name}</h4>
                    <p class="price">${priceHtml}</p>
                    <p style="font-size:0.85rem;color:#666;margin-bottom:10px;">${p.desc}</p>
                    <div class="actions">
                        <button class="btn-danger" onclick="deleteProduct(${p.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== AUTH ====================
function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');
    switchAuthTab(mode);
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(mode) {
    document.querySelectorAll('.modal-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.mode === mode);
    });
    document.getElementById('loginForm').classList.toggle('active', mode === 'login');
    document.getElementById('registerForm').classList.toggle('active', mode === 'register');
}

function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (user) {
        setCurrentUser({ username: user.username, name: user.name, role: user.role });
        closeAuthModal();
        updateNavbar();
        renderProducts();
        if (user.role === 'admin') {
            renderAdminProducts();
        }
        alert(`Welcome ${user.name}! (${user.role === 'admin' ? 'Admin' : 'Customer'})`);
        return true;
    }
    alert('Invalid username or password!');
    return false;
}

function register(name, username, password) {
    const users = getUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        alert('Yeh username pehle se maujood hai. Koi aur choose karein.');
        return false;
    }
    users.push({ username, password, name, role: 'customer' });
    saveUsers(users);
    setCurrentUser({ username, name, role: 'customer' });
    closeAuthModal();
    updateNavbar();
    renderProducts();
    alert(`Account ban gaya! Welcome ${name}`);
    return true;
}

function logout() {
    setCurrentUser(null);
    updateNavbar();
    renderProducts();
    document.getElementById('admin').style.display = 'none';
    alert('Logout ho gaya.');
}

// ==================== PRODUCT MANAGEMENT (ADMIN) ====================
let currentImageBase64 = null;

function handleImageUpload(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        alert('Image 2MB se chhoti honi chahiye.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        currentImageBase64 = e.target.result;
        const preview = document.getElementById('imagePreview');
        const placeholder = document.querySelector('.upload-placeholder');
        preview.src = currentImageBase64;
        preview.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function addProduct(e) {
    e.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = parseInt(document.getElementById('productPrice').value);
    const oldPriceVal = document.getElementById('productOldPrice').value;
    const oldPrice = oldPriceVal ? parseInt(oldPriceVal) : null;
    const badge = document.getElementById('productBadge').value;
    const desc = document.getElementById('productDesc').value.trim();

    if (!name || !price || !desc) {
        alert('Please fill all required fields.');
        return;
    }
    if (!currentImageBase64) {
        alert('Please upload a product image.');
        return;
    }

    const products = getProducts();
    const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;

    products.push({
        id: newId,
        name,
        price,
        oldPrice,
        desc,
        badge,
        image: currentImageBase64,
        gradient: null
    });
    saveProducts(products);

    document.getElementById('addProductForm').reset();
    currentImageBase64 = null;
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imagePreview').src = '';
    const placeholder = document.querySelector('.upload-placeholder');
    if (placeholder) placeholder.style.display = 'block';

    renderProducts();
    renderAdminProducts();
    alert('Product successfully add ho gaya!');
}

function deleteProduct(id) {
    if (!confirm('Kya aap yeh product delete karna chahte hain?')) return;
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    renderProducts();
    renderAdminProducts();
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    initData();
    updateNavbar();
    renderProducts();

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 70;
                const top = target.offsetTop - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Shukriya! Aapka message receive ho gaya hai. Hum jald aapse contact karenge.\n\nThank you! We will contact you soon.');
            orderForm.reset();
        });
    }

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
            navbar.style.background = 'var(--dark)';
        }
    });

    document.getElementById('closeAuthModal').addEventListener('click', closeAuthModal);
    document.getElementById('authModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('authModal')) closeAuthModal();
    });

    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => switchAuthTab(tab.dataset.mode));
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        login(username, password);
    });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        register(name, username, password);
    });

    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            if (tab.dataset.tab === 'add') {
                document.getElementById('addProductTab').classList.add('active');
            } else {
                document.getElementById('manageProductTab').classList.add('active');
                renderAdminProducts();
            }
        });
    });

    document.getElementById('productImage').addEventListener('change', (e) => {
        handleImageUpload(e.target.files[0]);
    });

    document.getElementById('addProductForm').addEventListener('submit', addProduct);

    const user = getCurrentUser();
    if (user && user.role === 'admin') {
        renderAdminProducts();
    }
});
