// ============================================
// BOOTSTRAP AUDIO - Sblocca l'audio al primo click
// ============================================
(function() {
    // Crea un contesto audio "nascosto" che si attiva al click
    let audioCtx = null;
    
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        // Rimuovi il listener dopo il primo click
        document.removeEventListener('click', initAudio);
        document.removeEventListener('touchstart', initAudio);
        console.log('🎵 Audio sbloccato!');
    }

    // Ascolta il primo click o tocco dell'utente
    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);
    
    // Se il gioco ha già un sistema audio, assicurati che riprenda
    window.ensureAudioUnlocked = function() {
        initAudio();
    };
})();