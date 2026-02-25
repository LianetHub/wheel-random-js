"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const CONFIG = {
        idleVelocity: 20,
        spinDuration: 5000,
        minSpins: 5,
        maxSpins: 10,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        sectorsCount: 8,
        pointerAngle: 0
    };

    const wheel = document.querySelector('.widget-wheel');
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

        const startAngle = currentRotation % 360;
        const extraSpins = Math.floor(Math.random() * (CONFIG.maxSpins - CONFIG.minSpins + 1) + CONFIG.minSpins);
        const randomDegree = Math.floor(Math.random() * 360);

        const totalRotation = (extraSpins * 360) + randomDegree;
        const finalRotation = currentRotation + totalRotation;

        const animation = wheelBlock.animate([
            { transform: `rotate(${startAngle}deg)` },
            { transform: `rotate(${startAngle + totalRotation}deg)` }
        ], {
            duration: CONFIG.spinDuration,
            easing: CONFIG.easing,
            fill: 'forwards'
        });

        animation.onfinish = () => {
            currentRotation = startAngle + totalRotation;
            wheelBlock.style.transform = `rotate(${currentRotation % 360}deg)`;

            const sectorAngle = 360 / CONFIG.sectorsCount;
            const actualRotation = currentRotation % 360;

            let winningIndex = Math.floor((CONFIG.pointerAngle - actualRotation + 360) % 360 / sectorAngle);

            winningIndex = (winningIndex + 0) % CONFIG.sectorsCount;

            const winningSector = sectors[winningIndex];
            const resultValue = winningSector.getAttribute('data-sector');

            wheel.setAttribute('data-result', resultValue);

            alert(winningSector.innerText);
        };
    }

    spinBtn.addEventListener('click', spin);

    startIdleRotation();
});