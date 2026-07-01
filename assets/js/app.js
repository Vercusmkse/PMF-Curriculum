import { resetProgressData } from './utils/storage.js';
import { calculateProgress, toggleWeekProgress, renderSyllabusMonth, renderFnbTrack } from './components/tracker.js';
import { initGradingCalculator } from './components/calculator.js';

// Retain global visibility state reference for the application Chart.js target
let assessmentChartInstance = null;

window.addEventListener('DOMContentLoaded', () => {
    // 1. Map modular scope routines to the top global windows pointer object.
    // This allows browser interpreters processing raw dynamic innerHTML templates
    // to discover tracking toggles and video functions smoothly.
    window.toggleWeekProgress = toggleWeekProgress;
    window.playVideoModal = playVideoModal;
    window.closeVideoModal = closeVideoModal;

    // 2. Fire default views & visual component configurations
    calculateProgress();
    renderSyllabusMonth(1);
    renderFnbTrack(1);
    initAssessmentChart();

    // 3. Fire the Interactive Calculation Interface module
    // This injects the missing layout nodes into your card sidebar and registers live inputs listeners.
    initGradingCalculator((newCalculatedWeights) => {
        if (assessmentChartInstance) {
            // Hot-swap dataset array variables and re-paint canvas
            assessmentChartInstance.data.datasets[0].data = newCalculatedWeights;
            assessmentChartInstance.update();
        }
    });

    // 4. Set Tab Context Layout Switchers bindings
    document.getElementById('month-tabs-container').addEventListener('click', (e) => {
        const btn = e.target.closest('.month-tab');
        if (!btn) return;

        document.querySelectorAll('.month-tab').forEach(b => b.classList.remove('tab-active'));
        btn.classList.add('tab-active');
        renderSyllabusMonth(parseInt(btn.dataset.month));
    });

    document.getElementById('fnb-tabs-container').addEventListener('click', (e) => {
        const btn = e.target.closest('.fnb-tab');
        if (!btn) return;

        document.querySelectorAll('.fnb-tab').forEach(b => b.classList.remove('tab-active'));
        btn.classList.add('tab-active');
        renderFnbTrack(parseInt(btn.dataset.track));
    });

    // 5. Wire the Progress Reset Actions Button
    document.getElementById('btn-reset-metrics').addEventListener('click', () => {
        resetProgressData();
        calculateProgress();

        // Return view state to Month 1 standard parameters
        const firstTab = document.querySelector('.month-tab');
        if (firstTab) firstTab.click();
    });

    // Close Modals events links
    document.getElementById('close-modal-btn').addEventListener('click', closeVideoModal);
});

// Modal Overlay Control Handlers
function playVideoModal(youtubeId, title) {
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&showinfo=0`;
    const directUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

    document.getElementById('modalIframe').src = embedUrl;
    document.getElementById('modalVideoTitle').innerText = title;
    document.getElementById('modalDirectLink').href = directUrl;

    const modal = document.getElementById('videoModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = "hidden";
}

function closeVideoModal() {
    document.getElementById('modalIframe').src = "";
    const modal = document.getElementById('videoModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = "";
}

// ChartJS Blueprint Initialization
function initAssessmentChart() {
    const canvas = document.getElementById('assessmentDoughnutChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    assessmentChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['HTML Project Weight', 'CSS Project Weight', 'JS Logic Weight', 'Capstone Weight'],
            datasets: [{
                data: [20, 20, 20, 40], // Base configurations parameters matching default breakdown weights
                backgroundColor: [
                    'rgba(52, 211, 153, 0.85)',
                    'rgba(210, 180, 140, 0.85)',
                    'rgba(245, 158, 11, 0.85)',
                    'rgba(255, 255, 255, 0.95)'
                ],
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)'
            }]
        },
        options: {
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: { display: false }
            }
        }
    });
}