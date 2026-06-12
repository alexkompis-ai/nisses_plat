// Enkel JavaScript för Mobilmeny och UTM-parametrar / Analytics-förberedelse

document.addEventListener('DOMContentLoaded', function() {
    // 1. Hamburgarmeny-funktionalitet
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('open');
        });
    }

    // 2. UTM-parameterfångare (Viktigt för kursen i effektmätning)
    // Sparar UTM-taggar i sessionStorage så att de kan skickas med dolda fält i HubSpot/Mailchimp
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    
    utmParams.forEach(param => {
        if (urlParams.has(param)) {
            sessionStorage.setItem(param, urlParams.get(param));
        }
    });

    // Fyller i dolda fält om de existerar i formulären
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        utmParams.forEach(param => {
            const value = sessionStorage.getItem(param);
            if (value) {
                let hiddenInput = form.querySelector(`input[name="${param}"]`);
                if (!hiddenInput) {
                    hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = param;
                    form.appendChild(hiddenInput);
                }
                hiddenInput.value = value;
            }
        });
    });

    // 3. Spårning av klick på CTA-knappar (GA4 Event Simulation)
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ctaText = this.innerText;
            const ctaHref = this.getAttribute('href');
            
            // Loggar till konsolen för felsökning under labben
            console.log(`GA4 Event: cta_click | Text: ${ctaText} | Destination: ${ctaHref}`);
            
            // Om Google Analytics är laddat på sidan skickas eventet på riktigt:
            if (typeof gtag === 'function') {
                gtag('event', 'cta_click', {
                    'cta_text': ctaText,
                    'destination_url': ctaHref
                });
            }
        });
    });
});
