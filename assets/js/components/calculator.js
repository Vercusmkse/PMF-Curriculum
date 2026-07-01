export function initGradingCalculator(updateChartCallback) {
    const container = document.getElementById('grading-calculator-container');
    if (!container) return;

    // Inject calculator UI panel controls
    container.innerHTML = `
        <div class="mt-6 pt-6 border-t border-white/10 text-xs text-emerald-100 space-y-4">
            <h4 class="text-[10px] font-black tracking-widest text-emerald-400 uppercase">Interactive Grading Input</h4>
            
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-[10px] uppercase text-stone-400 mb-1">HTML (20%)</label>
                    <input type="number" id="grade-html" value="0" min="0" max="100" class="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white font-bold focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-[10px] uppercase text-stone-400 mb-1">CSS (20%)</label>
                    <input type="number" id="grade-css" value="0" min="0" max="100" class="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white font-bold focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-[10px] uppercase text-stone-400 mb-1">JS Logic (20%)</label>
                    <input type="number" id="grade-js" value="0" min="0" max="100" class="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white font-bold focus:outline-none focus:border-emerald-500">
                </div>
                <div>
                    <label class="block text-[10px] uppercase text-stone-400 mb-1">Capstone (40%)</label>
                    <input type="number" id="grade-capstone" value="0" min="0" max="100" class="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-white font-bold focus:outline-none focus:border-emerald-500">
                </div>
            </div>

            <div class="p-4 rounded-xl bg-[#064E3B]/40 border border-emerald-500/20 flex justify-between items-center mt-2">
                <div>
                    <span class="block text-[10px] uppercase tracking-wider text-emerald-400">Calculated Outcome</span>
                    <span id="calculated-grade-status" class="text-sm font-black text-white">Awaiting Marks...</span>
                </div>
                <div class="text-right">
                    <span id="calculated-grade-total" class="text-2xl font-black text-emerald-400">0%</span>
                </div>
            </div>
        </div>
    `;

    // Add calculations listeners
    const inputs = ['grade-html', 'grade-css', 'grade-js', 'grade-capstone'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            calculateFinalGrade(updateChartCallback);
        });
    });
}

function calculateFinalGrade(updateChartCallback) {
    const htmlMark = Math.min(100, Math.max(0, parseFloat(document.getElementById('grade-html').value) || 0));
    const cssMark = Math.min(100, Math.max(0, parseFloat(document.getElementById('grade-css').value) || 0));
    const jsMark = Math.min(100, Math.max(0, parseFloat(document.getElementById('grade-js').value) || 0));
    const capstoneMark = Math.min(100, Math.max(0, parseFloat(document.getElementById('grade-capstone').value) || 0));

    // Calculate absolute weighted parameters
    const weightedHtml = htmlMark * 0.20;
    const weightedCss = cssMark * 0.20;
    const weightedJs = jsMark * 0.20;
    const weightedCapstone = capstoneMark * 0.40;

    const totalFinalScore = Math.round(weightedHtml + weightedCss + weightedJs + weightedCapstone);

    // Update Text Interface Nodes
    document.getElementById('calculated-grade-total').innerText = `${totalFinalScore}%`;

    const statusNode = document.getElementById('calculated-grade-status');
    if (totalFinalScore >= 50) {
        statusNode.innerText = "PASSED COHORT";
        statusNode.className = "text-sm font-black text-emerald-400";
    } else {
        statusNode.innerText = "REQUIREMENT UNMET";
        statusNode.className = "text-sm font-black text-amber-500";
    }

    // Pass weights down to update Chart context live
    if (typeof updateChartCallback === 'function') {
        updateChartCallback([weightedHtml, weightedCss, weightedJs, weightedCapstone]);
    }
}