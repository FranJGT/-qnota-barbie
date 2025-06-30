// ===== Notas de la Princesa - Calculadora de Notas Mágica =====
// Desarrollado con 💖 por Francisco González

class QNotaCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupAutoCalculate();
        this.setupServiceWorker();
    }

    // Inicializar elementos del DOM
    initializeElements() {
        this.elements = {
            // Inputs
            notaPresentacion: document.getElementById('notaPresentacion'),
            notaAprobacion: document.getElementById('notaAprobacion'),
            
            // Radio buttons
            ponderacionInputs: document.querySelectorAll('input[name="ponderacion"]'),
            
            // Checkbox
            autoCalcular: document.getElementById('autoCalcular'),
            
            // Buttons
            calcularBtn: document.getElementById('calcularBtn'),
            shareBtn: document.getElementById('shareBtn'),
            
            // Results
            resultsSection: document.getElementById('resultsSection'),
            resultCard: document.getElementById('resultCard'),
            resultIcon: document.getElementById('resultIcon'),
            resultTitle: document.getElementById('resultTitle'),
            resultMessage: document.getElementById('resultMessage'),
            resultValue: document.getElementById('resultValue')
        };

        this.currentPonderacion = 0.3; // Default 30%
        this.lastResult = null;
    }

    // Vincular eventos
    bindEvents() {
        // Eventos de inputs
        this.elements.notaPresentacion.addEventListener('input', () => this.handleInputChange());
        this.elements.notaAprobacion.addEventListener('input', () => this.handleInputChange());
        
        // Eventos de ponderación
        this.elements.ponderacionInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.currentPonderacion = parseFloat(e.target.value);
                this.handleInputChange();
            });
        });

        // Evento del botón calcular
        this.elements.calcularBtn.addEventListener('click', () => this.calcularNota());

        // Evento del botón compartir
        this.elements.shareBtn.addEventListener('click', () => this.compartirResultado());

        // Eventos de tooltips
        this.setupTooltips();

        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.isFormValid()) {
                this.calcularNota();
            }
        });
    }

    // Configurar auto-cálculo
    setupAutoCalculate() {
        this.elements.autoCalcular.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.handleInputChange(); // Calcular inmediatamente si hay datos
            }
        });
    }

    // Configurar tooltips
    setupTooltips() {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            const icon = tooltip.querySelector('i');
            const text = tooltip.querySelector('.tooltip-text');
            
            if (icon && text) {
                icon.addEventListener('mouseenter', () => {
                    text.style.visibility = 'visible';
                    text.style.opacity = '1';
                });
                
                icon.addEventListener('mouseleave', () => {
                    text.style.visibility = 'hidden';
                    text.style.opacity = '0';
                });
            }
        });
    }

    // Manejar cambios en inputs
    handleInputChange() {
        this.validateForm();
        
        // Auto-calcular si está habilitado
        if (this.elements.autoCalcular.checked && this.isFormValid()) {
            this.calcularNota();
        }
    }

    // Validar formulario
    validateForm() {
        // Convertir comas a puntos y obtener valores
        let notaPresentacionRaw = this.elements.notaPresentacion.value.replace(',', '.');
        let notaAprobacionRaw = this.elements.notaAprobacion.value.replace(',', '.');
        
        // Si es un número entero de 2 dígitos (10-70), convertirlo a decimal
        if (notaPresentacionRaw.length === 2 && /^\d{2}$/.test(notaPresentacionRaw)) {
            const num = parseInt(notaPresentacionRaw);
            if (num >= 10 && num <= 70) {
                notaPresentacionRaw = (num / 10).toString();
            }
        }
        
        if (notaAprobacionRaw.length === 2 && /^\d{2}$/.test(notaAprobacionRaw)) {
            const num = parseInt(notaAprobacionRaw);
            if (num >= 10 && num <= 70) {
                notaAprobacionRaw = (num / 10).toString();
            }
        }
        
        const notaPresentacion = parseFloat(notaPresentacionRaw);
        const notaAprobacion = parseFloat(notaAprobacionRaw);
        
        const isValid = !isNaN(notaPresentacion) && 
                       !isNaN(notaAprobacion) && 
                       notaPresentacion >= 1.0 && notaPresentacion <= 7.0 &&
                       notaAprobacion >= 1.0 && notaAprobacion <= 7.0;

        this.elements.calcularBtn.disabled = !isValid;
        
        // Efectos visuales en inputs
        this.elements.notaPresentacion.style.borderColor = 
            this.elements.notaPresentacion.value && !isNaN(notaPresentacion) && notaPresentacion >= 1.0 && notaPresentacion <= 7.0 
                ? '#28A745' 
                : '#E6E6FA';

        this.elements.notaAprobacion.style.borderColor = 
            this.elements.notaAprobacion.value && !isNaN(notaAprobacion) && notaAprobacion >= 1.0 && notaAprobacion <= 7.0 
                ? '#28A745' 
                : '#E6E6FA';

        return isValid;
    }

    // Verificar si el formulario es válido
    isFormValid() {
        return this.validateForm();
    }

    // Calcular nota de examen
    calcularNota() {
        if (!this.isFormValid()) {
            this.mostrarError('Por favor, completa todos los campos correctamente');
            return;
        }

        // Convertir comas a puntos y obtener valores
        let notaPresentacionRaw = this.elements.notaPresentacion.value.replace(',', '.');
        let notaAprobacionRaw = this.elements.notaAprobacion.value.replace(',', '.');
        
        // Si es un número entero de 2 dígitos (10-70), convertirlo a decimal
        if (notaPresentacionRaw.length === 2 && /^\d{2}$/.test(notaPresentacionRaw)) {
            const num = parseInt(notaPresentacionRaw);
            if (num >= 10 && num <= 70) {
                notaPresentacionRaw = (num / 10).toString();
            }
        }
        
        if (notaAprobacionRaw.length === 2 && /^\d{2}$/.test(notaAprobacionRaw)) {
            const num = parseInt(notaAprobacionRaw);
            if (num >= 10 && num <= 70) {
                notaAprobacionRaw = (num / 10).toString();
            }
        }
        
        const notaPresentacion = parseFloat(notaPresentacionRaw);
        const notaAprobacion = parseFloat(notaAprobacionRaw);
        const ponderacion = this.currentPonderacion;

        // Fórmula: Nota Examen = (Nota Aprobación - (1 - Ponderación) * Nota Presentación) / Ponderación
        const notaExamen = (notaAprobacion - (1 - ponderacion) * notaPresentacion) / ponderacion;

        this.lastResult = {
            notaPresentacion,
            notaAprobacion,
            ponderacion,
            notaExamen
        };

        this.mostrarResultado(notaExamen);
        this.guardarEnHistorial();
    }

    // Mostrar resultado
    mostrarResultado(notaExamen) {
        const isPassable = notaExamen <= 7.0;
        const isImpossible = notaExamen > 7.0;

        // Configurar elementos visuales
        this.elements.resultCard.className = 'result-card';
        this.elements.resultIcon.className = 'fas';
        
        if (isPassable) {
            // Éxito - Puede pasar
            this.elements.resultCard.classList.add('success');
            this.elements.resultIcon.classList.add('fa-star');
            this.elements.resultTitle.textContent = '¡Pasaste el ramo! 🎉';
            this.elements.resultMessage.textContent = '¡Felicidades! Puedes aprobar el curso con esa nota en el examen.';
        } else if (isImpossible) {
            // Imposible - Ya reprobó
            this.elements.resultCard.classList.add('danger');
            this.elements.resultIcon.classList.add('fa-times-circle');
            this.elements.resultTitle.textContent = 'Ya reprobaste 😞';
            this.elements.resultMessage.textContent = 'Lo siento, pero con esas notas ya no es posible aprobar el curso.';
        } else {
            // Caso especial
            this.elements.resultCard.classList.add('warning');
            this.elements.resultIcon.classList.add('fa-exclamation-triangle');
            this.elements.resultTitle.textContent = 'Resultado especial';
            this.elements.resultMessage.textContent = 'Revisa los datos ingresados.';
        }

        // Mostrar nota calculada
        this.elements.resultValue.textContent = notaExamen.toFixed(1);

        // Mostrar sección de resultados
        this.elements.resultsSection.style.display = 'block';
        this.elements.shareBtn.style.display = 'inline-flex';

        // Scroll suave a resultados
        setTimeout(() => {
            this.elements.resultsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);

        // Efecto de confeti si pasa
        if (isPassable) {
            this.lanzarConfeti();
        }
    }

    // Mostrar error
    mostrarError(mensaje) {
        this.elements.resultCard.className = 'result-card danger';
        this.elements.resultIcon.className = 'fas fa-exclamation-triangle';
        this.elements.resultTitle.textContent = 'Error';
        this.elements.resultMessage.textContent = mensaje;
        this.elements.resultValue.textContent = '-';
        this.elements.resultsSection.style.display = 'block';
        this.elements.shareBtn.style.display = 'none';
    }

    // Lanzar confeti (efecto visual)
    lanzarConfeti() {
        const colors = ['#FF69B4', '#DDA0DD', '#FFD700', '#FFB6C1', '#E6E6FA'];
        const emojis = ['✨', '💖', '⭐', '🎉', '🌟'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const confeti = document.createElement('div');
                confeti.style.position = 'fixed';
                confeti.style.left = Math.random() * 100 + 'vw';
                confeti.style.top = '-20px';
                confeti.style.fontSize = '1.5rem';
                confeti.style.pointerEvents = 'none';
                confeti.style.zIndex = '1000';
                confeti.style.animation = 'confetiFall 3s linear forwards';
                confeti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                
                document.body.appendChild(confeti);
                
                setTimeout(() => {
                    document.body.removeChild(confeti);
                }, 3000);
            }, i * 100);
        }
    }

    // Compartir resultado
    async compartirResultado() {
        if (!this.lastResult) return;

        const { notaPresentacion, notaAprobacion, ponderacion, notaExamen } = this.lastResult;
        const ponderacionPorcentaje = Math.round(ponderacion * 100);
        
        const texto = `📊 Calculé mi nota de examen con Notas de la Princesa:
        
📝 Nota de presentación: ${notaPresentacion}
🎯 Nota de aprobación: ${notaAprobacion}
📊 Ponderación examen: ${ponderacionPorcentaje}%
✨ Nota mínima necesaria: ${notaExamen.toFixed(1)}

${notaExamen <= 7.0 ? '🎉 ¡Puedo aprobar!' : '😞 Ya reprobé...'}

💖 Calcula tu nota en: ${window.location.href}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Notas de la Princesa - Mi Resultado',
                    text: texto,
                    url: window.location.href
                });
            } else {
                // Fallback: copiar al portapapeles
                await navigator.clipboard.writeText(texto);
                this.mostrarNotificacion('¡Resultado copiado al portapapeles! 📋');
            }
        } catch (error) {
            console.log('Error al compartir:', error);
            // Fallback manual
            const textArea = document.createElement('textarea');
            textArea.value = texto;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.mostrarNotificacion('¡Resultado copiado al portapapeles! 📋');
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FF69B4, #DDA0DD);
            color: white;
            padding: 15px 20px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(255, 105, 180, 0.3);
            z-index: 10000;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
        `;
        notificacion.textContent = mensaje;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 3000);
    }

    // Guardar en historial local
    guardarEnHistorial() {
        if (!this.lastResult) return;

        const historial = JSON.parse(localStorage.getItem('qnota_historial') || '[]');
        const nuevoCalculo = {
            ...this.lastResult,
            fecha: new Date().toISOString(),
            timestamp: Date.now()
        };

        // Agregar al inicio del historial
        historial.unshift(nuevoCalculo);

        // Mantener solo los últimos 10 cálculos
        if (historial.length > 10) {
            historial.splice(10);
        }

        localStorage.setItem('qnota_historial', JSON.stringify(historial));
    }

    // Configurar Service Worker para PWA
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registrado:', registration);
                    })
                    .catch(error => {
                        console.log('SW error:', error);
                    });
            });
        }
    }
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia de la calculadora
    const calculator = new QNotaCalculator();
    
    // Agregar estilos CSS para animaciones adicionales
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetiFall {
            0% {
                transform: translateY(-20px) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .input-field:valid {
            border-color: #28A745 !important;
        }
        
        .input-field:invalid:not(:placeholder-shown) {
            border-color: #DC3545 !important;
        }
    `;
    document.head.appendChild(style);

    // Exponer la calculadora globalmente para debugging
    window.qNotaCalculator = calculator;
    
    console.log('✨ Notas de la Princesa inicializada con éxito! 💖');
});

// ===== FUNCIONES UTILITARIAS =====

// Función para formatear números
function formatearNumero(numero, decimales = 1) {
    return parseFloat(numero).toFixed(decimales);
}

// Función para validar rango de notas
function validarNota(nota) {
    return !isNaN(nota) && nota >= 1.0 && nota <= 7.0;
}

// Función para calcular porcentaje
function calcularPorcentaje(valor, total) {
    return (valor / total) * 100;
}

// ===== EVENTOS ADICIONALES =====

// Prevenir envío de formulario con Enter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
    }
});

// Mejorar UX en móviles
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
}

// Detectar tema del sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-theme');
}

// ===== ANALYTICS SIMPLE =====
function trackEvent(eventName, data = {}) {
    // Implementación simple de analytics
    console.log('Evento:', eventName, data);
    
    // Aquí se podría integrar Google Analytics, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
    }
}

// ===== MANIFESTO PWA =====
// El archivo manifest.json se creará por separado 