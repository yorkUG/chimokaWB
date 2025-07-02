// Script para controlar el audio de los videos de eventos y la opacidad visual
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const eventVideos = document.querySelectorAll('.event-card video');
    let currentIdx = 0;

    function setActiveVideo(idx, unmuteOnClick = false) {
      eventVideos.forEach((video, i) => {
        if (i === idx) {
          video.style.opacity = '1';
          video.muted = !unmuteOnClick;
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else {
          video.style.opacity = '0.5';
          video.muted = true;
          video.pause();
        }
      });
      currentIdx = idx;
    }

    // Inicialmente solo el primer video se reproduce, siempre silenciado
    setActiveVideo(0);

    // Al terminar un video, reproducir el siguiente (en bucle, siempre silenciado)
    eventVideos.forEach((video, idx) => {
      video.addEventListener('ended', function () {
        let nextIdx = (idx + 1) % eventVideos.length;
        setActiveVideo(nextIdx);
      });
    });

    // Al hacer click, activar/desactivar audio y opacidad solo en el video clickeado
    eventVideos.forEach((video, idx) => {
      video.addEventListener('click', function () {
        if (currentIdx !== idx) {
          setActiveVideo(idx, true); // Al hacer click, activar sonido
        } else {
          // Si ya es el activo, alternar mute/opacidad
          if (video.muted) {
            video.muted = false;
            video.style.opacity = '1';
            if (video.paused) {
              video.play().catch(() => {});
            }
          } else {
            video.muted = true;
            video.style.opacity = '0.5';
          }
        }
      });
    });
  });
})(); 