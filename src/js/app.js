"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const CONFIG = {
        idleVelocity: 20,
        spinDuration: 5000,
        minSpins: 5,
        maxSpins: 10,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        sectorsCount: 8
    };

    const wheelBlock = document.querySelector('.widget-wheel-block');
    const spinBtn = document.querySelector('.widget-wheel-center');
    const sectors = document.querySelectorAll('.widget-wheel-text');

    let currentRotation = 0;
    let isSpinning = false;
    let idleAnimation = null;

    function startIdleRotation() {
        let lastTime = performance.now();

        function update(currentTime) {
            if (isSpinning) return;

            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            currentRotation += CONFIG.idleVelocity * deltaTime;
            wheelBlock.style.transform = `rotate(${currentRotation % 360}deg)`;

            idleAnimation = requestAnimationFrame(update);
        }

        idleAnimation = requestAnimationFrame(update);
    }

    function spin() {
        if (isSpinning) return;
        isSpinning = true;
        spinBtn.disabled = true;

        cancelAnimationFrame(idleAnimation);

        const extraSpins = Math.floor(Math.random() * (CONFIG.maxSpins - CONFIG.minSpins + 1) + CONFIG.minSpins);
        const randomDegree = Math.floor(Math.random() * 360);
        const finalRotation = currentRotation + (extraSpins * 360) + randomDegree;

        const animation = wheelBlock.animate([
            { transform: `rotate(${currentRotation % 360}deg)` },
            { transform: `rotate(${finalRotation}deg)` }
        ], {
            duration: CONFIG.spinDuration,
            easing: CONFIG.easing,
            fill: 'forwards'
        });

        animation.onfinish = () => {
            currentRotation = finalRotation;
            const normalizedDegree = (360 - (currentRotation % 360)) % 360;
            const sectorAngle = 360 / CONFIG.sectorsCount;

            const winningIndex = Math.floor(normalizedDegree / sectorAngle);
            const winningSector = sectors[winningIndex];

            console.log('Выпавший сектор:', winningSector.getAttribute('data-sector'));
            alert('Ваш приз: ' + winningSector.innerText);
        };
    }

    spinBtn.addEventListener('click', spin);

    startIdleRotation();
});