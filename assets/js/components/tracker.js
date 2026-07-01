import { getSavedProgress, saveProgress } from '../utils/storage.js';
import { syllabusData } from '../../../core/curriculum/syllabusData.js';
import { fnbTrackData } from '../../../core/resources/fnbTrackData.js';

export function calculateProgress() {
    const savedProgress = getSavedProgress();
    let completedCount = Object.values(savedProgress).filter(Boolean).length;
    const percent = Math.round((completedCount / 16) * 100);

    document.getElementById('progress-bar').style.width = `${percent}%`;
    document.getElementById('progress-text').innerText = `${completedCount} / 16 Weeks Completed`;
    document.getElementById('progress-percentage').innerText = `${percent}% Done`;
}

export function toggleWeekProgress(weekNum) {
    let savedProgress = getSavedProgress();
    savedProgress[weekNum] = !savedProgress[weekNum];
    saveProgress(savedProgress);
    calculateProgress();
}

export function renderSyllabusMonth(monthNum) {
    const displayArea = document.getElementById('syllabus-content-area');
    const dataBlocks = syllabusData[monthNum] || [];
    const savedProgress = getSavedProgress();
    let htmlString = "";

    dataBlocks.forEach(item => {
        const numericWeeks = item.week.match(/\d+/g);
        let checkBoxesHtml = "";

        if (numericWeeks) {
            const startWeek = parseInt(numericWeeks[0]);
            const endWeek = numericWeeks[1] ? parseInt(numericWeeks[1]) : startWeek;

            for (let w = startWeek; w <= endWeek; w++) {
                const isChecked = savedProgress[w] === true ? 'checked' : '';
                checkBoxesHtml += `
                    <label class="inline-flex items-center gap-2 bg-[#064E3B]/20 border border-emerald-500/20 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-emerald-500/20 transition-all select-none">
                        <input type="checkbox" id="chk-week-${w}" onchange="toggleWeekProgress(${w})" ${isChecked} class="accent-emerald-400 rounded w-4 h-4 cursor-pointer">
                        <span class="text-xs font-bold text-emerald-300">Week ${w} Complete</span>
                    </label>
                `;
            }
        }

        let linksHtml = "";
        item.lessons.forEach(link => {
            linksHtml += `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all group">
                    <span class="text-xs font-medium text-emerald-200 group-hover:text-emerald-400 transition-colors">${link.name}</span>
                    <span class="text-xs text-stone-500 group-hover:text-emerald-400 transition-colors">➔</span>
                </a>
            `;
        });

        htmlString += `
            <div class="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:border-emerald-500/20">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                        <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">${item.week}</span>
                        <h3 class="text-lg font-extrabold text-white mt-2">${item.title}</h3>
                    </div>
                    <div class="flex gap-2 flex-wrap">${checkBoxesHtml}</div>
                </div>
                <p class="text-xs text-emerald-100/80 leading-relaxed mb-6">${item.objective}</p>
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3">Topic Core Links</h4>
                        <div class="space-y-2">${linksHtml}</div>
                    </div>
                    <div class="p-5 rounded-2xl bg-[#064E3B]/30 border border-emerald-500/20 flex flex-col justify-between">
                        <div>
                            <h4 class="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Weekly Assessment Objective</h4>
                            <p class="text-xs text-emerald-100/95 leading-relaxed font-medium">${item.exam}</p>
                        </div>
                        <div class="mt-4 flex items-center gap-2 text-[10px] text-emerald-400/80 font-mono">
                            <span>✓ Verified Syllabus Target</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    displayArea.innerHTML = htmlString;
}

export function renderFnbTrack(trackNum) {
    const detailsArea = document.getElementById('fnb-track-details');
    const data = fnbTrackData[trackNum];
    if (!data) return;

    let weeksHtml = "";
    data.weeks.forEach(item => {
        let resourcesHtml = "";
        item.links.forEach(link => {
            resourcesHtml += `
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200/60 hover:border-emerald-300 transition-all group">
                    <span class="text-xs font-semibold text-stone-700 group-hover:text-emerald-700 transition-colors">${link.name}</span>
                    <span class="text-[10px] text-stone-400 group-hover:text-emerald-600 transition-colors">➔</span>
                </a>
            `;
        });

        weeksHtml += `
            <div class="p-5 rounded-2xl border border-stone-150 bg-[#FAFDFB] hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-stretch">
                <div class="space-y-3 flex-1">
                    <div class="flex items-center gap-2">
                        <span class="bg-emerald-100 text-[#064E3B] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">${item.weekNum} Scope</span>
                    </div>
                    <h4 class="font-extrabold text-stone-800 text-sm md:text-base leading-tight">${item.topic}</h4>
                    <p class="text-xs text-stone-500 leading-relaxed">${item.detail}</p>
                    <div class="pt-2">
                        <h5 class="text-[9px] font-black text-[#064E3B] uppercase tracking-widest mb-2">Required Course Material</h5>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${resourcesHtml}</div>
                    </div>
                </div>
                <div class="w-full md:w-60 bg-stone-900 rounded-xl overflow-hidden shadow-sm text-white flex flex-col justify-between shrink-0">
                    <div class="p-3 bg-stone-950 flex justify-between items-center text-[10px] border-b border-stone-800">
                        <span class="font-mono text-emerald-400 font-bold uppercase tracking-wider">Video Lecture</span>
                    </div>
                    <div class="p-4 flex-1 flex flex-col justify-center text-center">
                        <div class="w-10 h-10 bg-red-600/25 rounded-full flex items-center justify-center mx-auto mb-2 text-red-500 text-sm">▶</div>
                        <span class="block text-xs font-bold text-emerald-300 leading-tight">Weekly Lecture Video</span>
                    </div>
                    <div class="p-3 bg-stone-950 space-y-1.5 border-t border-stone-850">
                        <button onclick="playVideoModal('${item.youtubeId}', '${item.topic}')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-2 px-3 rounded-lg transition-all">🎥 Watch in Hub Overlay</button>
                        <a href="https://www.youtube.com/watch?v=${item.youtubeId}" target="_blank" class="w-full bg-stone-800 text-stone-300 font-bold text-[10px] py-1.5 px-3 rounded-lg text-center">🌐 Open YouTube Tab</a>
                    </div>
                </div>
            </div>
        `;
    });

    detailsArea.innerHTML = `
        <div class="space-y-6">
            <div class="border-b border-stone-100 pb-4">
                <span class="text-[10px] bg-emerald-100 text-[#064E3B] font-black px-3 py-1 rounded-full uppercase tracking-wider">${data.level}</span>
                <h3 class="text-xl font-black text-[#064E3B] mt-2">Core Learning Objectives</h3>
                <p class="text-xs text-stone-500 mt-1">${data.description}</p>
            </div>
            <div class="space-y-6">${weeksHtml}</div>
        </div>
    `;
}