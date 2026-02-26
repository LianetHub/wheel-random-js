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
        this.calculateChances();
        this.buildDOM();
        this.renderSectors();
        this.bindEvents();
        this.startIdleRotation();
    }

    calculateChances() {
        const fixedSectors = this.data.filter(item => item.chance !== undefined);
        const totalFixedChance = fixedSectors.reduce((acc, item) => acc + item.chance, 0);
        const remainingChance = Math.max(0, 1 - totalFixedChance);
        const autoSectorsCount = this.sectorsCount - fixedSectors.length;
        const defaultChance = autoSectorsCount > 0 ? remainingChance / autoSectorsCount : 0;

        this.data = this.data.map(item => ({
            ...item,
            calculatedChance: item.chance !== undefined ? item.chance : defaultChance
        }));
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
            const sectorAngle = i * this.step;
            const textAngle = sectorAngle - 90;
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

        const randomVal = Math.random();
        let cumulativeChance = 0;
        let winningIndex = 0;

        for (let i = 0; i < this.data.length; i++) {
            cumulativeChance += this.data[i].calculatedChance;
            if (randomVal <= cumulativeChance) {
                winningIndex = i;
                break;
            }
        }

        const startAngle = this.currentRotation % 360;
        const extraSpins = Math.max(this.config.minSpins, 5);
        const targetSectorAngle = (360 - (winningIndex * this.step)) % 360;

        const randomOffset = (Math.random() - 0.5) * (this.step * 0.7);
        const finalRotation = (this.currentRotation - startAngle) + (extraSpins * 360) + targetSectorAngle + randomOffset;

        const animation = this.wheelBlock.animate([
            { transform: `rotate(${this.currentRotation}deg)` },
            { transform: `rotate(${finalRotation}deg)` }
        ], {
            duration: this.config.spinDuration,
            easing: this.config.easing,
            fill: 'forwards'
        });

        animation.onfinish = () => {
            this.currentRotation = finalRotation;
            const winningSector = this.sectors[winningIndex];
            const resultValue = winningSector.getAttribute('data-sector');
            this.wheel.setAttribute('data-result', resultValue);
            if (this.config.onResult) {
                this.config.onResult({
                    value: resultValue,
                    label: winningSector.innerText
                });
            }


            this.isSpinning = false;
            this.spinBtn.disabled = false;
            this.startIdleRotation();
        };
    }
}