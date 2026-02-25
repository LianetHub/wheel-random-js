"use strict";

class WheelWidget {
    constructor(selector, data, config = {}) {
        this.container = document.querySelector(selector);
        this.data = data;
        this.sectorsCount = this.data.length;
        this.step = 360 / this.sectorsCount;

        this.config = Object.assign({
            idleVelocity: 20,
            spinDuration: 5000,
            minSpins: 5,
            maxSpins: 10,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            colorEven: 'var(--slice-color-even, #76071f)',
            colorOdd: 'var(--slice-color-odd, #a61635)',
            colorThird: 'var(--slice-color-third, #c81d40)',
            btnText: "Крутить"
        }, config);

        this.currentRotation = 0;
        this.isSpinning = false;
        this.idleAnimation = null;
        this.sectors = [];

        this.init();
    }

    init() {
        if (!this.container) return;
        this.buildDOM();
        this.renderSectors();
        this.bindEvents();
        this.startIdleRotation();
    }

    buildDOM() {
        this.container.innerHTML = '';

        this.wheel = document.createElement('div');
        this.wheel.className = 'widget-wheel';

        const wrap = document.createElement('div');
        wrap.className = 'widget-wheel-wrap';

        this.spinBtn = document.createElement('button');
        this.spinBtn.type = 'button';
        this.spinBtn.className = 'widget-wheel-center';
        this.spinBtn.innerText = this.config.btnText;

        const arrow = document.createElement('div');
        arrow.className = 'widget-wheel-arrow';

        this.wheelBlock = document.createElement('div');
        this.wheelBlock.className = 'widget-wheel-block';

        this.wheelInner = document.createElement('div');
        this.wheelInner.className = 'widget-wheel-inner';

        this.wheelBlock.appendChild(this.wheelInner);
        wrap.appendChild(this.spinBtn);
        wrap.appendChild(arrow);
        wrap.appendChild(this.wheelBlock);
        this.wheel.appendChild(wrap);
        this.container.appendChild(this.wheel);
    }

    renderSectors() {
        let gradientParts = [];
        const isOdd = this.sectorsCount % 2 !== 0;

        for (let i = 0; i < this.sectorsCount; i++) {
            let color;
            if (isOdd && i === this.sectorsCount - 1) {
                color = this.config.colorThird;
            } else {
                color = i % 2 === 0 ? this.config.colorOdd : this.config.colorEven;
            }
            gradientParts.push(`${color} ${i * this.step}deg ${(i + 1) * this.step}deg`);
        }

        this.wheelInner.style.background = `conic-gradient(from ${-this.step / 2}deg, ${gradientParts.join(', ')})`;

        this.data.forEach((item, i) => {
            const textAngle = (i * this.step) - 90;
            const textEl = document.createElement('div');
            textEl.className = 'widget-wheel-text';
            textEl.style.transform = `rotate(${textAngle}deg)`;
            textEl.setAttribute('data-sector', item.value);

            const spanEl = document.createElement('span');
            spanEl.innerText = item.label;
            textEl.appendChild(spanEl);

            this.wheelInner.appendChild(textEl);
            this.sectors.push(textEl);
        });
    }

    bindEvents() {
        this.spinBtn.addEventListener('click', () => this.spin());
    }

    startIdleRotation() {
        let lastTime = performance.now();

        const update = (currentTime) => {
            if (this.isSpinning) return;

            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            this.currentRotation += this.config.idleVelocity * deltaTime;
            this.wheelBlock.style.transform = `rotate(${this.currentRotation % 360}deg)`;

            this.idleAnimation = requestAnimationFrame(update);
        };

        this.idleAnimation = requestAnimationFrame(update);
    }

    spin() {
        if (this.isSpinning) return;

        this.isSpinning = true;
        this.spinBtn.disabled = true;

        cancelAnimationFrame(this.idleAnimation);

        const startAngle = this.currentRotation % 360;

        const spinsPerSecond = 1.5;
        const autoSpins = Math.ceil((this.config.spinDuration / 1000) * spinsPerSecond);

        const extraSpins = Math.max(autoSpins, this.config.minSpins);
        const randomDegree = Math.floor(Math.random() * 360);

        const totalRotation = (extraSpins * 360) + randomDegree;
        const finalRotation = startAngle + totalRotation;

        const animation = this.wheelBlock.animate([
            { transform: `rotate(${startAngle}deg)` },
            { transform: `rotate(${finalRotation}deg)` }
        ], {
            duration: this.config.spinDuration,
            easing: this.config.easing,
            fill: 'forwards'
        });

        animation.onfinish = () => {
            this.currentRotation = finalRotation;
            this.wheelBlock.style.transform = `rotate(${this.currentRotation % 360}deg)`;

            const actualRotation = this.currentRotation % 360;
            const relAngle = (360 - actualRotation) % 360;
            let winningIndex = Math.floor(((relAngle + this.step / 2) % 360) / this.step);

            if (winningIndex >= this.sectorsCount) winningIndex = 0;

            const winningSector = this.sectors[winningIndex];
            const resultValue = winningSector.getAttribute('data-sector');

            this.wheel.setAttribute('data-result', resultValue);

            if (this.config.onResult) {
                this.config.onResult({
                    value: resultValue,
                    label: winningSector.innerText
                });
            } else {
                alert(winningSector.innerText);
            }

            this.isSpinning = false;
            this.spinBtn.disabled = false;
            this.startIdleRotation();
        };
    }
}