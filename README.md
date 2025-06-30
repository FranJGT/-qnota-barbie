# ✨ qNota Barbie - Calculadora de Notas Mágica 💖

Una hermosa calculadora de notas con temática Barbie, diseñada para calcular la nota mínima necesaria en un examen para aprobar un curso universitario.

![qNota Barbie](https://img.shields.io/badge/Version-1.0.0-pink?style=for-the-badge&logo=heart)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-pink?style=for-the-badge&logo=pwa)
![Responsive](https://img.shields.io/badge/Responsive-Yes-pink?style=for-the-badge&logo=mobile)

## 🎯 Características Principales

- **🎨 Diseño Barbie**: Temática rosa, púrpura y dorado con elementos mágicos
- **📱 PWA Completa**: Instalable como aplicación móvil
- **⚡ Funcionalidad Offline**: Funciona sin conexión a internet
- **🎯 Cálculo Preciso**: Fórmula matemática exacta para notas de examen
- **✨ Efectos Visuales**: Animaciones, confeti y feedback visual
- **📊 Auto-Cálculo**: Opción de cálculo automático mientras escribes
- **🔄 Compartir Resultados**: Compartir resultados por redes sociales
- **💾 Historial Local**: Guarda tus últimos 10 cálculos

## 🚀 Instalación y Uso

### Opción 1: Despliegue Local

1. **Clona o descarga** este repositorio
2. **Abre** el archivo `index.html` en tu navegador
3. **¡Listo!** La calculadora funcionará inmediatamente

### Opción 2: Despliegue en Servidor

#### Netlify (Recomendado)
1. Sube los archivos a GitHub
2. Conecta tu repositorio a Netlify
3. ¡Despliegue automático!

#### Vercel
1. Sube los archivos a GitHub
2. Conecta tu repositorio a Vercel
3. ¡Despliegue automático!

#### Servidor Web Tradicional
1. Sube todos los archivos a tu servidor web
2. Asegúrate de que `index.html` esté en la raíz
3. ¡Listo!

## 📱 Instalación como PWA

1. **Abre** la aplicación en Chrome/Edge
2. **Haz clic** en el ícono de instalación en la barra de direcciones
3. **Confirma** la instalación
4. **¡Disfruta** de tu nueva app!

## 🎮 Cómo Usar

### Paso 1: Seleccionar Ponderación
- Elige entre **30%** o **40%** para la ponderación del examen
- Esta es la importancia que tiene el examen en tu nota final

### Paso 2: Ingresar Notas
- **Nota de Presentación**: Tu nota acumulada hasta ahora (1.0 - 7.0)
- **Nota de Aprobación**: La nota mínima para aprobar (ej: 4.0)

### Paso 3: Calcular
- **Habilita** "Auto-Calcular" para cálculos automáticos
- O **haz clic** en "Calcular Nota de Examen"
- **¡Mira** el resultado mágico!

### Paso 4: Interpretar Resultado
- **🎉 Verde**: ¡Puedes aprobar! (nota necesaria ≤ 7.0)
- **😞 Rojo**: Ya reprobaste (nota necesaria > 7.0)

## 🧮 Fórmula Matemática

La calculadora usa la siguiente fórmula:

```
Nota Examen = (Nota Aprobación - (1 - Ponderación) × Nota Presentación) / Ponderación
```

### Ejemplo:
- Nota de Presentación: 5.5
- Nota de Aprobación: 4.0
- Ponderación: 30% (0.3)

```
Nota Examen = (4.0 - (1 - 0.3) × 5.5) / 0.3
Nota Examen = (4.0 - 0.7 × 5.5) / 0.3
Nota Examen = (4.0 - 3.85) / 0.3
Nota Examen = 0.15 / 0.3
Nota Examen = 0.5
```

## 🎨 Personalización

### Colores Barbie
```css
--barbie-pink: #FF69B4;
--barbie-pink-light: #FFB6C1;
--barbie-purple: #DDA0DD;
--barbie-lavender: #E6E6FA;
--barbie-gold: #FFD700;
```

### Fuentes
- **Título**: Pacifico (cursiva femenina)
- **Texto**: Poppins (moderna y legible)

## 📁 Estructura del Proyecto

```
qnota-barbie/
├── index.html          # Página principal
├── style.css           # Estilos Barbie
├── main.js             # Lógica de la calculadora
├── manifest.json       # Configuración PWA
├── sw.js              # Service Worker
├── assets/            # Iconos y recursos
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
└── README.md          # Este archivo
```

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS
- **JavaScript ES6+**: Lógica funcional y orientada a objetos
- **PWA**: Service Worker, Manifest, instalación
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografías

## 🌟 Características Avanzadas

### PWA Features
- ✅ **Instalable**: Se puede instalar como app móvil
- ✅ **Offline**: Funciona sin conexión
- ✅ **Cache**: Almacena recursos para uso offline
- ✅ **Push Notifications**: Preparado para notificaciones
- ✅ **Background Sync**: Sincronización en segundo plano

### UX/UI Features
- ✅ **Responsive**: Adaptable a todos los dispositivos
- ✅ **Accesible**: Cumple estándares de accesibilidad
- ✅ **Animaciones**: Efectos visuales suaves
- ✅ **Feedback**: Respuesta visual inmediata
- ✅ **Tooltips**: Información contextual

### Funcionalidades
- ✅ **Validación**: Verificación de datos en tiempo real
- ✅ **Historial**: Guardado local de cálculos
- ✅ **Compartir**: Integración con APIs nativas
- ✅ **Auto-cálculo**: Cálculo automático opcional
- ✅ **Confeti**: Celebración visual al aprobar

## 🐛 Solución de Problemas

### La app no se instala
- Verifica que uses Chrome/Edge
- Asegúrate de que el manifest.json esté en la raíz
- Revisa que el Service Worker esté registrado

### Los cálculos no funcionan
- Verifica que los números estén entre 1.0 y 7.0
- Asegúrate de que todos los campos estén completos
- Revisa la consola del navegador para errores

### No funciona offline
- Verifica que el Service Worker esté activo
- Revisa que los archivos estén cacheados
- Limpia el cache del navegador

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! 

1. **Fork** el proyecto
2. **Crea** una rama para tu feature
3. **Commit** tus cambios
4. **Push** a la rama
5. **Abre** un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Francisco González**
- GitHub: [@FranJGT](https://github.com/FranJGT)
- Sitio Web: [franciscogonzalez.cl](https://franciscogonzalez.cl)

## 🙏 Agradecimientos

- **Barbie**: Por la inspiración en el diseño
- **Google Fonts**: Por las hermosas tipografías
- **Font Awesome**: Por los íconos
- **Comunidad PWA**: Por las mejores prácticas

## 📞 Soporte

Si tienes problemas o sugerencias:

1. **Abre** un issue en GitHub
2. **Envía** un email a [tu-email@ejemplo.com]
3. **Comenta** en el sitio web

---

**✨ Hecho con 💖 en Chile ✨**

*¡Que la magia de Barbie te ayude a aprobar todos tus ramos!* 🎓💖 