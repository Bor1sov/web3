document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Форма обратной связи
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Сообщение отправлено! Я свяжусь с вами в ближайшее время.');
            this.reset();
        });
    }

    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            });
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navLinks.style.display = 'flex';
            } else {
                navLinks.style.display = 'none';
            }
        });
    }

    // Изменение стиля шапки при скролле
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(44, 62, 80, 0.9)';
            header.style.padding = '0.5rem 0';
        } else {
            header.style.backgroundColor = 'var(--secondary-color)';
            header.style.padding = '1rem 0';
        }
    });

    // Корзина и модальные окна
    const cart = {
        items: [],
        count: 0,
        load: function() {
            const savedCart = getCookie('cart');
            if (savedCart) {
                this.items = JSON.parse(savedCart);
                this.count = this.items.reduce((sum, item) => sum + item.quantity, 0);
                updateCartUI();
            }
        },
        save: function() {
            setCookie('cart', JSON.stringify(this.items), 7);
        },
        addItem: function(product) {
            const existingItem = this.items.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({...product, quantity: 1});
            }
            this.count += 1;
            this.save();
            updateCartUI();
        },
        clear: function() {
            this.items = [];
            this.count = 0;
            this.save();
            updateCartUI();
        }
    };

    // Инициализация корзины
    cart.load();

    // Модальные окна
    const cartModal = document.getElementById('cart-modal');
    const productModal = document.getElementById('product-modal');
    const cartBtn = document.getElementById('cart-btn');
    const closeButtons = document.querySelectorAll('.close');
    const clearCartBtn = document.getElementById('clear-cart');

    // Открытие корзины
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'block';
    });

    // Очистка корзины
    clearCartBtn.addEventListener('click', function() {
        cart.clear();
    });

    // Закрытие модальных окон
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            cartModal.style.display = 'none';
            productModal.style.display = 'none';
        });
    });

    // Закрытие при клике вне окна
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    // Продукты портфолио
    const products = [
        {
            id: 1,
            title: "Путешествия по России",
            description: "Сайт о путешествиях по России с информацией о достопримечательностях и маршрутах.",
            tech: "HTML + CSS + JS + Node JS",
            img: "./assets/e6f0b476695ccbd8065ca53c5e9a91d9d8f3750d-1733592143.webp"
        },
        {
            id: 2,
            title: "Магазин техники",
            description: "Интернет-магазин электроники с корзиной и фильтрами товаров.",
            tech: "HTML + CSS + TS + Node JS + REACT",
            img: "./assets/Снимок экрана 2025-05-04 134609.png"
        },
        {
            id: 3,
            title: "Argonia",
            description: "Корпоративный сайт компании Argonia с блогом и формой обратной связи.",
            tech: "HTML + CSS + JS + PHP + WordPress",
            img: "./assets/Снимок экрана 2025-05-04 134653.png"
        },
        {
            id: 4,
            title: "SEO",
            description: "Сайт SEO-агентства с услугами и кейсами.",
            tech: "HTML + CSS + JS + PHP + WordPress",
            img: "./assets/Снимок экрана 2025-05-04 134719.png"
        }
    ];

    // Открытие карточки товара
    document.querySelectorAll('.portfolio-item').forEach((item, index) => {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn')) {
                const product = products[index];
                document.getElementById('product-img').src = product.img;
                document.getElementById('product-title').textContent = product.title;
                document.getElementById('product-description').textContent = product.description;
                document.getElementById('product-tech').textContent = product.tech;
                
                const addToCartBtn = document.getElementById('add-to-cart');
                addToCartBtn.onclick = function() {
                    cart.addItem(product);
                    productModal.style.display = 'none';
                };
                
                productModal.style.display = 'block';
            }
        });
    });

    // Обновление UI корзины
    function updateCartUI() {
        document.getElementById('cart-count').textContent = cart.count;
        document.getElementById('total-count').textContent = cart.count;
        
        const cartItemsEl = document.getElementById('cart-items');
        cartItemsEl.innerHTML = '';
        
        if (cart.items.length === 0) {
            cartItemsEl.innerHTML = '<p>Корзина пуста</p>';
            return;
        }
        
        cart.items.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.tech}</p>
                </div>
                <span>${item.quantity} шт.</span>
            `;
            cartItemsEl.appendChild(cartItemEl);
        });
    }

    // Работа с cookies
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Сохранение времени последнего посещения
    function saveLastVisit() {
        const now = new Date();
        setCookie('lastVisit', now.toString(), 30);
        document.getElementById('last-visit').textContent = `Последний визит: ${now.toLocaleString()}`;
    }

    // Восстановление времени последнего посещения
    function loadLastVisit() {
        const lastVisit = getCookie('lastVisit');
        if (lastVisit) {
            const visitDate = new Date(lastVisit);
            document.getElementById('last-visit').textContent = `Последний визит: ${visitDate.toLocaleString()}`;
        } else {
            document.getElementById('last-visit').textContent = 'Это ваш первый визит!';
        }
    }

    // Инициализация времени посещения
    loadLastVisit();
    saveLastVisit();

    // Сохранение позиции скролла
    window.addEventListener('beforeunload', function() {
        setCookie('scrollPosition', window.scrollY, 1);
    });

    // Восстановление позиции скролла
    const scrollPosition = parseInt(getCookie('scrollPosition'));
    if (!isNaN(scrollPosition)) {
        window.scrollTo(0, scrollPosition);
    }
        loadReviews();
});




// Загрузка отзывов
async function loadReviews() {
    try {
        const response = await fetch('http://localhost:3000/api/reviews');
        const data = await response.json();
        
        const reviewsList = document.getElementById('reviews-list');
        reviewsList.innerHTML = '';
        
        if (data.reviews.length === 0) {
            reviewsList.innerHTML = '<p>Пока нет отзывов. Будьте первым!</p>';
            return;
        }
        
        data.reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <span class="review-author">${review.name}</span>
                    <span class="review-rating">★ ${review.rating}/5</span>
                </div>
                <p>${review.comment}</p>
                <div class="review-date">${new Date(review.createdAt).toLocaleDateString()}</div>
            `;
            reviewsList.appendChild(reviewElement);
        });
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
}

// Отправка отзыва
document.getElementById('reviewForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const reviewData = {
        name: formData.get('name'),
        email: formData.get('email'),
        rating: parseInt(formData.get('rating')),
        comment: formData.get('comment')
    };
    
    try {
        const response = await fetch('http://localhost:3000/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Отзыв успешно отправлен на модерацию!');
            this.reset();
            loadReviews();
        } else {
            alert('Ошибка: ' + result.message);
        }
    } catch (error) {
        alert('Ошибка отправки отзыва');
        console.error('Ошибка:', error);
    }
});
