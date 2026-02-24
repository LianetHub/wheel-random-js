export const tooltip = () => {
    if (document.querySelectorAll('[data-tooltip]').length == 0) return;
    document.querySelectorAll('[data-tooltip]').forEach(function (element) {
        element.addEventListener('mouseenter', function () {
            var title = element.getAttribute('title');
            var color = element.getAttribute('data-tooltip');

            element.setAttribute('data-title', title);
            element.removeAttribute('title');

            var tooltip = document.createElement('div');
            tooltip.className = 'tooltip ' + color;
            tooltip.textContent = title;
            document.body.appendChild(tooltip);

            var offset = element.getBoundingClientRect();
            var tooltipWidth = tooltip.offsetWidth;
            var tooltipHeight = tooltip.offsetHeight;
            var elementWidth = element.offsetWidth;
            var elementHeight = element.offsetHeight;

            var top = offset.top + elementHeight + 5 + window.scrollY;
            var left = offset.left + (elementWidth / 2) - (tooltipWidth / 2) + window.scrollX;

            if (top + tooltipHeight > window.scrollY + window.innerHeight) {
                top = offset.top - tooltipHeight - 5 + window.scrollY;
                tooltip.classList.add('open-top');
            } else {
                tooltip.classList.add('open-bottom');
            }

            if (left < 0) {
                left = 0;
            } else if (left + tooltipWidth > window.innerWidth) {
                left = window.innerWidth - tooltipWidth;
            }

            tooltip.style.top = top + 'px';
            tooltip.style.left = left + 'px';
        });

        element.addEventListener('mouseleave', function () {
            var tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }

            var title = element.getAttribute('data-title');
            element.setAttribute('title', title);
        });
    });

}