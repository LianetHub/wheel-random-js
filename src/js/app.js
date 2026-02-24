// "use strict";

// import gsap from "gsap";


// document.addEventListener('DOMContentLoaded', () => {


//     const spinnerBtn = document.querySelector('.main__spinner-btn');
//     const spinnerImage = document.querySelector('.main__spinner-wheel');

//     spinnerBtn.addEventListener('click', () => {
//         spinnerBtn.style.pointerEvents = "none";
//         const turns = 2.5;
//         const duration = 3;

//         const totalDegrees = turns * 360;

//         spinnerImage.style.setProperty('--rotate-degrees', `${totalDegrees}deg`);
//         spinnerImage.style.animation = `spin ${duration}s ease-out forwards`;

//     });

//     const dotAnimation = gsap.timeline();


//     dotAnimation.to(".dot-even", {
//         opacity: 0,
//         scale: 1.2,
//         duration: 0.5,
//         yoyo: true,
//         repeat: -1,
//         ease: "none"
//     });


//     dotAnimation.to(".dot-odd", {
//         opacity: 0,
//         scale: 1.2,
//         duration: 0.5,
//         yoyo: true,
//         repeat: -1,
//         ease: "none"
//     });


//     new Wheel('.wheel-selector', {
//         sectors: [''],

//     })



// })

