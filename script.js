document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FORÇAR ZOOM INICIAL NO LIZMAP VIA IFRAME ---
    const mapIframe = document.querySelector('.map-wrapper iframe');
    
    if (mapIframe) {
        mapIframe.addEventListener('load', () => {
            // Envia mensagens de comando para a janela interna do Lizmap/OpenLayers
            // Isso força o mapa a avançar os 2 níveis de zoom automaticamente após o carregamento
            try {
                const iframeWin = mapIframe.contentWindow;
                
                // Tenta disparar o evento de zoom in interno do OpenLayers/Lizmap
                setTimeout(() => {
                    iframeWin.postMessage({ type: 'zoomIn' }, '*');
                    
                    // Segundo pulo de zoom para alcançar a escala necessária
                    setTimeout(() => {
                        iframeWin.postMessage({ type: 'zoomIn' }, '*');
                    }, 300);
                }, 500);
            } catch (e) {
                // Caso haja restrição de cross-origin, o fallback de CSS scale continuará ativo
                console.log('Aguardando inicialização do GIS...');
            }
        });
    }

    // --- 2. ROLAGEM SUAVE COM DESCONTO DO HEADER FIXO ---
    const navLinks = document.querySelectorAll('nav a');
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- 3. TRATAMENTO DE OVERLAY DO MAPA NO MOBILE ---
    const mapWrapper = document.querySelector('.map-wrapper');
    if (mapWrapper) {
        mapWrapper.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                mapWrapper.style.pointerEvents = 'none';
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            mapWrapper.style.pointerEvents = 'auto';
        });
    }
});

// --- 4. SUPORTE A TOQUE NO MENU DROPDOWN MOBILE ---
const dropdownParent = document.querySelector('nav li.dropdown > a');
if (dropdownParent) {
    dropdownParent.addEventListener('click', (e) => {
        // Se for mobile, permite abrir o dropdown ao tocar em vez de seguir link vazio
        const dropdownContent = dropdownParent.nextElementSibling;
        if (dropdownContent) {
            e.preventDefault();
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        }
    });
}
