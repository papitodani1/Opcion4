// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const loader = document.getElementById('loader');
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const backToTopBtn = document.getElementById('backToTop');
    const faqItems = document.querySelectorAll('.faq-item');
    const contactForm = document.getElementById('contactForm');
    
    // Hide loader after page loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
        }, 1000);
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Show/hide back to top button
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking a link
    mobileNavLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close mobile menu when clicking buttons that go to contact section
    document.querySelectorAll('a[href*="#contacto"], a[href*="index.html#contacto"]').forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Back to top button
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // FAQ accordion
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(function(faqItem) {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Manejo del formulario con Email.js
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Mostrar indicador de carga
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Preparar parámetros para Email.js
        const templateParams = {
            nombre: document.getElementById('nombre').value,
            empresa: document.getElementById('empresa').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            mensaje: document.getElementById('mensaje').value
        };
        
        // Enviar formulario con Email.js
        // Reemplaza "TU_SERVICE_ID" y "TU_TEMPLATE_ID" con tus IDs de Email.js
        emailjs.send('service_rzqb3vh', 'template_mithqlh', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById('form-status').innerHTML = 
                    '<div class="alert alert-success">¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.</div>';
                document.getElementById('contactForm').reset();
            }, function(error) {
                console.log('FAILED...', error);
                document.getElementById('form-status').innerHTML = 
                    '<div class="alert alert-error">Error al enviar el mensaje. Por favor intenta nuevamente.</div>';
            })
            .finally(function() {
                // Restaurar el botón
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
    
    // Validación del formulario de contacto
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtener referencias a los campos
        const nombre = document.getElementById('nombre');
        const empresa = document.getElementById('empresa');
        const email = document.getElementById('email');
        const telefono = document.getElementById('telefono');
        const mensaje = document.getElementById('mensaje');
        const formStatus = document.getElementById('form-status');
        
        // Limpiar mensajes de error previos
        formStatus.innerHTML = '';
        resetErrorStyles();
        
        // Validar campos
        let isValid = true;
        
        // Validar nombre (no vacío y solo letras)
        if (!nombre.value.trim()) {
            showError(nombre, 'Por favor ingresa tu nombre completo');
            isValid = false;
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombre.value.trim())) {
            showError(nombre, 'El nombre debe contener solo letras');
            isValid = false;
        }
        
        // Validar empresa (no vacío)
        if (!empresa.value.trim()) {
            showError(empresa, 'Por favor ingresa el nombre de tu empresa');
            isValid = false;
        }
        
        // Validar email (formato correcto)
        if (!email.value.trim()) {
            showError(email, 'Por favor ingresa tu correo electrónico');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
            showError(email, 'Por favor ingresa un correo electrónico válido');
            isValid = false;
        }
        
        // Validar teléfono (10 dígitos)
        if (!telefono.value.trim()) {
            showError(telefono, 'Por favor ingresa tu número de teléfono');
            isValid = false;
        } else if (!/^\d{10}$/.test(telefono.value.replace(/\D/g, ''))) {
            showError(telefono, 'Por favor ingresa un número de 10 dígitos');
            isValid = false;
        }
        
        // Validar mensaje (no vacío y longitud mínima)
        if (!mensaje.value.trim()) {
            showError(mensaje, 'Por favor ingresa tu mensaje');
            isValid = false;
        } else if (mensaje.value.trim().length < 10) {
            showError(mensaje, 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        }
        
        // Si todo es válido, enviar el formulario
        if (isValid) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Preparar parámetros para Email.js
            const templateParams = {
                nombre: nombre.value,
                empresa: empresa.value,
                email: email.value,
                telefono: telefono.value,
                mensaje: mensaje.value
            };
            
            // Enviar formulario con Email.js
            emailjs.send('service_g53vht9', 'template_sabht9r', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    formStatus.innerHTML = 
                        '<div class="alert alert-success">¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.</div>';
                    document.getElementById('contactForm').reset();
                }, function(error) {
                    console.log('FAILED...', error);
                    formStatus.innerHTML = 
                        '<div class="alert alert-error">Error al enviar el mensaje. Por favor intenta nuevamente.</div>';
                })
                .finally(function() {
                    // Restaurar el botón
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        }
        
        // Función para mostrar mensajes de error
        function showError(input, message) {
            // Crear elemento para el mensaje de error
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            
            // Agregar clase de error al input
            input.classList.add('error');
            
            // Insertar el mensaje después del input
            input.parentNode.appendChild(errorDiv);
            
            // Enfocar el primer campo con error
            if (isValid) {
                input.focus();
            }
        }
        
        // Función para limpiar estilos de error
        function resetErrorStyles() {
            document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            document.querySelectorAll('.error-message').forEach(el => el.remove());
        }
    });
    
    // Smooth scrolling for anchor links (solo para la misma página)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo interceptar si es un anchor de la misma página (no contiene .html)
            if (href.includes('.html')) {
                return; // Permitir navegación normal entre páginas
            }
            
            e.preventDefault();
            
            const targetId = href;
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Initialize
    highlightNavLink();
});
