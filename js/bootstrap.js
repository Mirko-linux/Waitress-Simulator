(function() {
    
    let audioCtx = null;
    
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        document.removeEventListener('click', initAudio);
        document.removeEventListener('touchstart', initAudio);
        console.log('🎵 Audio sbloccato!');
    }

    
    document.addEventListener('click', initAudio);
    document.addEventListener('touchstart', initAudio);
    
    
    window.ensureAudioUnlocked = function() {
        initAudio();
    };
})();