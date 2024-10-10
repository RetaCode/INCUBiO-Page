

document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Función para cambiar el estilo del header al hacer scroll
    function toggleHeaderStyle() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Escuchar el evento de scroll
    window.addEventListener('scroll', toggleHeaderStyle);

    // Scroll suave para los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Resaltar el enlace de navegación activo
    function setActiveLink() {
        const scrollPosition = window.scrollY;

        document.querySelectorAll('main section').forEach(section => {
            if (section.offsetTop <= scrollPosition + 150) {
                const id = section.getAttribute('id');
                document.querySelector(`nav ul li a[href="#${id}"]`).classList.add('active');
            } else {
                const id = section.getAttribute('id');
                document.querySelector(`nav ul li a[href="#${id}"]`).classList.remove('active');
            }
        });
    }

    // Escuchar el evento de scroll para actualizar el enlace activo
    window.addEventListener('scroll', setActiveLink);

    // Inicializar el estado del header y el enlace activo
    toggleHeaderStyle();
    setActiveLink();

    document.addEventListener('DOMContentLoaded', function() {
        const header = document.getElementById('main-header');
        const heroSection = document.querySelector('.hero');
    
        function toggleHeaderStyle() {
            if (window.scrollY > heroSection.offsetHeight - header.offsetHeight) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    
        window.addEventListener('scroll', toggleHeaderStyle);
        toggleHeaderStyle(); // Llamar la función inicialmente para establecer el estado correcto
    
        // Scroll suave para los enlaces internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
    
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    });
});
