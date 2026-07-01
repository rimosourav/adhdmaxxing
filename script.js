// --- THE BRAIN: AUTOMATED SYSTEM ENGINE ---

let player = null;
let quests = [];
let dayLogs = {}; 
let slideshowIndex = 0;

const defaultRewards = { main: 50, side: 20, errand: 75, bonus: 15 };

const systemDirectives = [
    "The System monitors your execution variables. Proceed with absolute surgical precision.",
    "Executive latency detected. Isolate your active focus block immediately.",
    "Did you know? Female bedbugs completely lack a vagina. The male uses a sharp, needle-like penis to drill a hole directly into her abdominal cavity to inseminate her.",
    "A continuous matrix streak charges your token bank. Do not yield momentum.",
    "Rest / Sick day logs preserve metrics, but freeze configuration scaling updates.",
    "Did you know? In ancient Rome, crushed regular flies were used as an experimental treatment to attempt to cure baldness.",
    "Do not accumulate task inventory debt. Execution yields absolute clarity.",
    "Did you know? Sloths can hold their breath underwater for up to 40 minutes, which is significantly longer than dolphins can."
];

// 🔊 KINETIC JUICE SYNTHESIZER ENGINE
function triggerAudioFeedback(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === 'complete') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440.00, ctx.currentTime); 
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);  
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            osc.start(); osc.stop(ctx.currentTime + 0.35);
        } else if (type === 'levelup') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15); 
            osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); 
            gain.gain.setValueAtTime(0.07, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
            osc.start(); osc.stop(ctx.currentTime + 0.7);
        }
    } catch (e) { console.log("Audio contexts offline."); }
}

function getLogicalDateStr() {
    if (!player) return new Date().toISOString().split('T')[0];
    const now = new Date();
    const offset = new Date(now.getTime() - (parseInt(player.resetHour) * 60 * 60 * 1000));
    return `${offset.getFullYear()}-${String(offset.getMonth() + 1).padStart(2, '0')}-${String(offset.getDate()).padStart(2, '0')}`;
}

function parseLogicalDate(dateStr) {
    if (!dateStr) return new Date();
    const p = dateStr.split('-');
    return new Date(p[0], p[1] - 1, p[2]);
}

function loadData() {
    // Upgraded isolation version index namespace to flush corrupted storage schemas
    const savedPlayer = localStorage.getItem("adhdPlayerMaxx_v6_final");
    const savedQuests = localStorage.getItem("adhdQuestsMaxx_v6_final");
    const savedLogs = localStorage.getItem("adhdDayLogsMaxx_v6_final");
    const systemInitiated = localStorage.getItem("systemInitiated_v6_final");

    try {
        if (savedPlayer && savedQuests) {
            player = JSON.parse(savedPlayer);
            quests = JSON.parse(savedQuests);
            if (savedLogs) dayLogs = JSON.parse(savedLogs);
            
            // Force-verify core properties to handle legacy data sets safely
            if (player.perfectStreak === undefined) player.perfectStreak = 0;
            if (player.stasisMode === undefined) player.stasisMode = false;
            
            document.getElementById("setup-screen").classList.add("hidden");
            document.getElementById("main-dashboard").classList.remove("hidden");
            
            if (player.avatarDataUrl) {
                document.getElementById("avatar-img").src = player.avatarDataUrl;
            }

            checkTimeLapse(); 
            calculateProgression();
            updateScreen();
            rotateDirectiveMessage();
            checkNightShiftConditions();

            if (!systemInitiated) openInitiationModal(false);
        } else {
            // First Launch Initialization Loop Gateway
            document.getElementById("setup-screen").classList.remove("hidden");
            document.getElementById("main-dashboard").classList.add("hidden");
        }
    } catch (error) {
        console.error("Local schema mismatch detected. Executing backup parameters run.", error);
        localStorage.clear();
        document.getElementById("setup-screen").classList.remove("hidden");
        document.getElementById("main-dashboard").classList.add("hidden");
    }
}

window.initializeSystem = function() {
    const nameInput = document.getElementById("setup-name").value.trim();
    const resetInput = document.getElementById("setup-reset").value;
    const deadlineInput = document.getElementById("setup-deadline").value;

    const r1N = document.getElementById("r1-name").value.trim();
    const r1V = parseInt(document.getElementById("r1-val").value);
    const r2N = document.getElementById("r2-name").value.trim();
    const r2V = parseInt(document.getElementById("r2-val").value);
    const r3N = document.getElementById("r3-name").value.trim();
    const r3V = parseInt(document.getElementById("r3-val").value);
    const r4N = document.getElementById("r4-name").value.trim();
    const r4V = parseInt(document.getElementById("r4-val").value);

    if (!nameInput || !deadlineInput || !r1N || !r2N || !r3N || !r4N || isNaN(r1V) || isNaN(r2V) || isNaN(r3V) || isNaN(r4V)) {
        alert("Configuration Error: Codename and all 4 strategic milestones require explicit validation setup.");
        return;
    }

    player = {
        name: nameInput,
        level: 1,
        rank: "Novice",
        xp: 0,
        postponeTokens: 3,
        perfectStreak: 0,
        stasisMode: false,
        resetHour: resetInput,
        bossDeadline: deadlineInput,
        lastLoginDate: "",
        avatarDataUrl: null,
        customRewards: [
            { id: 1, name: r1N, value: r1V, claimed: false },
            { id: 2, name: r2N, value: r2V, claimed: false },
            { id: 3, name: r3N, value: r3V, claimed: false },
            { id: 4, name: r4N, value: r4V, claimed: false }
        ]
    };

    quests = [
        { id: 'base_m1', type: "main", title: "2 Hours Immersive Focus Block", reward: 50, completed: false, isDaily: true, workdaysOnly: true },
        { id: 'base_b1', type: "bonus", title: "Hydrate Core (2 Liters)", reward: 15, completed: false, isDaily: true },
        { id: 'base_b2', type: "bonus", title: "20 Pushups", reward: 15, completed: false, isDaily: true },
        { id: 'base_b3', type: "bonus", title: "20 Squats", reward: 15, completed: false, isDaily: true }
    ];

    dayLogs = {};
    player.lastLoginDate = getLogicalDateStr();
    saveData(); loadData();
    openInitiationModal(false); 
};

window.triggerAvatarUpload = function() {
    document.getElementById("avatar-file-input").click();
};

window.processAvatarUpload = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            player.avatarDataUrl = e.target.result;
            document.getElementById("avatar-img").src = player.avatarDataUrl;
            saveData();
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.openInitiationModal = function(isManual = false) {
    slideshowIndex = 0;
    renderSlideshow();
    document.getElementById("initiation-modal").classList.remove("modal-hidden");
    if (!isManual) localStorage.setItem("systemInitiated_v6_final", "true");
};

window.closeInitiationModal = function() {
    document.getElementById("initiation-modal").classList.add("modal-hidden");
};

window.changeSlide = function(direction) {
    const slides = document.querySelectorAll(".system-slide");
    slideshowIndex += direction;
    if (slideshowIndex >= slides.length) {
        closeInitiationModal();
        return;
    }
    renderSlideshow();
};

function renderSlideshow() {
    const slides = document.querySelectorAll(".system-slide");
    slides.forEach((slide, idx) => {
        if (idx === slideshowIndex) slide.classList.remove("hidden");
        else slide.classList.add("hidden");
    });
    document.getElementById("slide-prev-btn").disabled = (slideshowIndex === 0);
    document.getElementById("slide-next-btn").innerText = (slideshowIndex === slides.length - 1) ? "Synchronize" : "Next";
}

function checkNightShiftConditions() {
    if (!player) return;
    const now = new Date();
    const currentHour = now.getHours();
    
    const isNightHours = (currentHour >= 20 || currentHour < parseInt(player.resetHour));
    if (!isNightHours) return;

    const pendingMandatory = quests.filter(q => !q.completed && !q.scheduledForTomorrow && (q.type === 'main' || q.type === 'side'));
    const container = document.getElementById("night-hub-list");
    if (!container) return;
    
    container.innerHTML = "";
    
    if (pendingMandatory.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:var(--system-blue); padding:20px; font-family:Georgia, serif;">[DIRECTIVE COMPLETE: Core variables stabilized for the night]</div>`;
    } else {
        pendingMandatory.forEach(q => {
            const div = document.createElement("div");
            div.className = "roster-card";
            div.style.borderColor = "var(--system-red)";
            div.innerHTML = `
                <div><span style="font-weight:bold;">${q.title}</span></div>
                <div style="display:flex; gap:6px;">
                    <button class="gold-btn pt-btn" style="padding:4px 8px; font-size:0.7rem;" onclick="postponeSingleQuest('${q.id}'); checkNightShiftConditions();">PT</button>
                    <button class="gold-btn" style="padding:4px 8px; font-size:0.7rem;" onclick="animateCompleteQuest(this, '${q.id}'); setTimeout(checkNightShiftConditions, 600);">DONE</button>
                </div>
            `;
            container.appendChild(div);
        });
    }
    document.getElementById("night-shift-modal").classList.remove("modal-hidden");
}

window.dismissNightHub = function() {
    document.getElementById("night-shift-modal").classList.add("modal-hidden");
};

function rotateDirectiveMessage() {
    const el = document.getElementById("daily-directive-msg");
    if (el) el.innerText = systemDirectives[Math.floor(Math.random() * systemDirectives.length)];
}

function checkTimeLapse() {
    const todayStr = getLogicalDateStr();
    if (player.lastLoginDate === todayStr) return;

    quests.forEach(q => { if (q.scheduledForTomorrow) q.scheduledForTomorrow = false; });

    if (player.stasisMode) {
        quests.forEach(q => { if (q.isDaily || q.cycle) q.completed = false; });
        player.lastLoginDate = todayStr;
        saveData();
        return;
    }

    const yesterdayDateObj = parseLogicalDate(player.lastLoginDate);
    const isWeekend = (yesterdayDateObj.getDay() === 0 || yesterdayDateObj.getDay() === 6);
    
    let penalty = 0;
    let missedMandatoryCount = 0;
    let totalMandatoryCount = 0;

    quests.forEach(q => {
        if (q.workdaysOnly && isWeekend) {
            if (q.isDaily || q.cycle) q.completed = false;
            return;
        }
        if (q.type === 'main' || q.type === 'side') {
            totalMandatoryCount++;
            if (!q.completed) {
                if (q.cycle && q.lastDone && Math.floor((yesterdayDateObj - parseLogicalDate(q.lastDone)) / 86400000) < q.cycle) return;
                missedMandatoryCount++;
                penalty += Math.floor(q.reward * 1.5);
            }
        }
        if (q.isDaily || q.cycle) q.completed = false;
    });

    if (isWeekend && totalMandatoryCount === 0) {
        // Safe Bridge Weekend Parameters Active
    } else if (missedMandatoryCount === 0 && totalMandatoryCount > 0) {
        player.perfectStreak++;
        if (player.perfectStreak % 3 === 0) player.postponeTokens++;
    } else {
        player.perfectStreak = 0; 
    }

    if (penalty > 0) {
        player.xp = Math.max(0, player.xp - penalty);
        alert(`⚠️ [CIRCADIAN RESET PENALTY] Expired Objectives detected. Metric matrix docked: -${penalty} XP.`);
    }

    quests = quests.filter(q => !q.completed || q.isDaily || q.cycle);
    player.lastLoginDate = todayStr;
    saveData();
}

function calculateProgression() {
    if (!player) return;
    const old = player.level;
    player.level = Math.floor(player.xp / 100) + 1;
    if (player.level > old && old > 0) triggerAudioFeedback('levelup');

    if (player.level >= 10) player.rank = "S-Class";
    else if (player.level >= 6) player.rank = "Elite";
    else if (player.level >= 3) player.rank = "Awakened";
    else player.rank = "Novice";

    document.body.className = `rank-${player.rank.toLowerCase()}`;
    const rankLabel = document.getElementById("avatar-rank-title");
    if (rankLabel) rankLabel.innerText = player.rank;
}

function updateScreen() {
    if (!player) return;
    document.getElementById("username").innerText = player.name;
    document.getElementById("level-display").innerText = player.level;
    document.getElementById("rank-display").innerText = player.rank;
    document.getElementById("xp-display").innerText = player.xp;
    document.getElementById("pt-display").innerText = player.postponeTokens;
    document.getElementById("streak-display").innerText = player.perfectStreak;
    
    const diff = parseLogicalDate(player.bossDeadline).setHours(0,0,0,0) - parseLogicalDate(getLogicalDateStr()).setHours(0,0,0,0);
    const daysLeft = Math.ceil(diff / 86400000);
    document.getElementById("countdown-display").innerText = daysLeft >= 0 ? `${daysLeft}d` : "0d";

    if (player.stasisMode) document.getElementById("stasis-badge").classList.remove("hidden");
    else document.getElementById("stasis-badge").classList.add("hidden");

    const trackerEl = document.getElementById("dashboard-milestone-tracker");
    if (trackerEl) {
        const sorted = [...player.customRewards].sort((a,b) => a.value - b.value);
        const target = sorted.find(r => !r.claimed && player.xp < (r.value * 2));
        if (target) {
            const neededXp = (target.value * 2) - player.xp;
            const daysRemaining = Math.ceil(neededXp / 130); 
            trackerEl.innerText = `🛡️ Locked Target: ${target.name} [Est. ${daysRemaining} Days of Perfect Effort Remaining]`;
        } else {
            const unclaimed = sorted.find(r => !r.claimed);
            trackerEl.innerText = unclaimed ? `🏆 Target Attained: ${unclaimed.name} Ready to Claim` : "All Core System Targets Fully Cleared 🏆";
        }
    }
    renderQuests();
}

function renderQuests() {
    const lists = { main: document.getElementById("main-quest-list"), side: document.getElementById("side-quest-list"), errand: document.getElementById("errand-quest-list"), bonus: document.getElementById("bonus-quest-list"), completed: document.getElementById("completed-quest-list") };
    Object.values(lists).forEach(l => { if (l) l.innerHTML = ""; });
    const todayStr = getLogicalDateStr();
    const isWeekend = (new Date().getDay() === 0 || new Date().getDay() === 6);

    quests.forEach(quest => {
        if (quest.scheduledForTomorrow) return;
        if (quest.workdaysOnly && isWeekend && !quest.completed) return;
        if (quest.cycle && quest.lastDone && !quest.completed && Math.floor((parseLogicalDate(todayStr) - parseLogicalDate(quest.lastDone)) / 86400000) < quest.cycle) return;

        const li = document.createElement("li");
        li.className = "quest-item";
        let freqLabel = quest.isDaily ? "🔄 " : quest.cycle ? `⏳ [${quest.cycle}d] ` : "⚡ ";

        if (quest.completed) {
            li.innerHTML = `
                <span style="text-decoration: line-through; color: var(--text-dark); font-style: italic;">${freqLabel}${quest.title}</span>
                <button class="gold-btn" style="border-color:var(--text-dark); color:var(--text-gray);" onclick="undoQuest('${quest.id}')">UNDO</button>
            `;
            if (lists.completed) lists.completed.appendChild(li);
        } else {
            const isMandatory = (quest.type === 'main' || quest.type === 'side');
            li.innerHTML = `
                <span>${freqLabel}${quest.title} <strong style="color:var(--text-gray); font-weight:normal; font-size:0.8rem;">(+${quest.reward})</strong></span>
                <div style="display: flex; gap: 6px;">
                    ${isMandatory ? `<button class="gold-btn pt-btn" onclick="postponeSingleQuest('${quest.id}')">PT</button>` : ''}
                    <button class="gold-btn" onclick="animateCompleteQuest(this, '${quest.id}')">COMPLETE</button>
                </div>
            `;
            if (lists[quest.type]) lists[quest.type].appendChild(li);
        }
    });
}

window.animateCompleteQuest = function(btn, id) {
    const row = btn.closest('.quest-item');
    if (row) {
        row.classList.add('completed-decay');
        setTimeout(() => { completeQuest(id); }, 500);
    }
};

function completeQuest(id) {
    const q = quests.find(quest => quest.id == id);
    if (!q) return;
    triggerAudioFeedback('complete');
    player.xp += q.reward; q.completed = true;
    if (q.cycle) q.lastDone = getLogicalDateStr();
    logCompletedTaskToArchive(q.title, q.reward);
    calculateProgression(); saveData(); updateScreen();
}

window.undoQuest = function(id) {
    const q = quests.find(quest => quest.id == id);
    if (!q) return;
    player.xp = Math.max(0, player.xp - q.reward); q.completed = false;
    if (q.cycle) q.lastDone = null;
    removeTaskFromArchiveLog(q.title);
    calculateProgression(); saveData(); updateScreen();
};

window.postponeSingleQuest = function(id) {
    if (player.postponeTokens <= 0) return alert("PT tokens fully expended.");
    const q = quests.find(quest => quest.id == id);
    if (q) {
        player.postponeTokens--; q.completed = true;
        if (q.cycle) {
            let yesterday = parseLogicalDate(getLogicalDateStr()); yesterday.setDate(yesterday.getDate() - (q.cycle - 1));
            q.lastDone = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        }
        logCompletedTaskToArchive(`[POSTPONED DEBT]: ${q.title}`, 0);
        saveData(); updateScreen();
    }
};

window.deleteQuest = function(id) {
    if (confirm("SYSTEM DIRECTIVE: Sever objective node configuration?")) {
        quests = quests.filter(q => q.id != id); saveData(); updateScreen();
    }
};

window.toggleStasisMode = function() {
    if (!player) return;
    player.stasisMode = document.getElementById("settings-stasis").checked;
    saveData(); updateScreen();
};

window.switchSettingsTab = function(tabName) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
    document.getElementById(`tab-btn-${tabName}`).classList.add('active');
    document.getElementById(`tab-content-${tabName}`).classList.remove('hidden');
    if (tabName === 'roster') populateRewardShopPanel();
    if (tabName === 'archive') populateArchivePanel();
};

function populateRewardShopPanel() {
    const panel = document.getElementById("milestone-roster-list"); if (!panel) return;
    panel.innerHTML = "";
    player.customRewards.forEach(r => {
        const requiredXp = r.value * 2;
        const isUnlocked = player.xp >= requiredXp;
        let actionBtn = r.claimed ? `<span>Claimed ✅</span>` : isUnlocked ? `<button class="gold-btn" onclick="claimReward(${r.id})">CLAIM</button>` : `<span>LOCKED (Need ${requiredXp - player.xp} XP)</span>`;
        
        panel.innerHTML += `
            <div class="roster-card" style="border-color:${isUnlocked && !r.claimed ? 'var(--text-gray)' : 'var(--border-silver)'}">
                <div>
                    <div style="font-family:Georgia, serif; font-weight:bold; ${r.claimed ? 'text-decoration:line-through; color:var(--text-dark);' : ''}">${r.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-gray); margin-top:2px;">Threshold Node: ${requiredXp} XP (${r.value} Rs Valuation)</div>
                </div>
                <div>${actionBtn}</div>
            </div>
        `;
    });
}

window.addCustomReward = function() {
    const name = document.getElementById("new-reward-name").value.trim();
    const val = parseInt(document.getElementById("new-reward-value").value);
    if (!name || isNaN(val) || val <= 0) return alert("Configuration parameters require accurate entry values.");
    player.customRewards.push({ id: Date.now(), name: name, value: val, claimed: false });
    document.getElementById("new-reward-name").value = ""; document.getElementById("new-reward-value").value = "";
    saveData(); updateScreen(); populateRewardShopPanel();
};

window.claimReward = function(id) {
    const r = player.customRewards.find(target => target.id === id);
    if (!r || player.xp < (r.value * 2)) return;
    r.claimed = true; triggerAudioFeedback('levelup');
    logCompletedTaskToArchive(`[CLAIMED MILESTONE UNLOCK]: ${r.name}`, 0, true, r.id);
    saveData(); updateScreen(); populateRewardShopPanel();
};

window.revokeRewardClaim = function(dayStr, matchIdx, targetId) {
    const target = player.customRewards.find(r => r.id === targetId);
    if (target) target.claimed = false;
    dayLogs[dayStr].itemsLogged.splice(matchIdx, 1);
    
    let net = 0; dayLogs[dayStr].itemsLogged.forEach(i => { net += i.reward; });
    dayLogs[dayStr].totalXPEarned = net;
    saveData(); calculateProgression(); updateScreen(); populateArchivePanel();
};

function populateArchivePanel() {
    const panel = document.getElementById("history-archive-list"); if (!panel) return;
    panel.innerHTML = "";
    const operationalDays = Object.keys(dayLogs).sort().reverse();
    if (operationalDays.length === 0) { panel.innerHTML = `<div style="text-align:center; color:var(--text-dark); padding:20px; font-style:italic;">Logs baseline empty.</div>`; return; }

    operationalDays.forEach(day => {
        const markup = dayLogs[day].itemsLogged.map((i, idx) => {
            const revokeBtn = i.isRewardClaim ? `<button onclick="revokeRewardClaim('${day}', ${idx}, ${i.rewardId})" style="background:transparent; border:1px solid var(--text-dark); color:var(--text-gray); font-size:0.65rem; padding:2px 6px; cursor:pointer; margin-left:8px;">REVOKE</button>` : '';
            return `
                <div style="font-size:0.8rem; display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span>• ${i.title} <span style="font-size:0.7rem; color:var(--text-dark);">(${i.time})</span> ${revokeBtn}</span>
                    <span style="color:${i.isRewardClaim ? 'var(--system-gold)' : 'var(--system-blue)'}; font-weight:bold;">+${i.reward} Pt</span>
                </div>
            `;
        }).join('');

        panel.innerHTML += `
            <div class="archive-card" style="flex-direction:column; align-items:stretch;">
                <div style="display:flex; justify-content:space-between; font-weight:bold; margin-bottom:8px; font-size:0.85rem; border-bottom:1px solid var(--border-silver); padding-bottom:6px;">
                    <span style="color:var(--text-gray); font-family:Georgia, serif;">${day}</span>
                    <span>Net Ledger Delta: ${dayLogs[day].totalXPEarned} Pt</span>
                </div>
                <div>${markup}</div>
            </div>
        `;
    });
}

window.openSettingsModal = function() {
    if (player) {
        document.getElementById("settings-boss-date").value = player.bossDeadline || "";
        document.getElementById("settings-reset-hour").value = player.resetHour || "3";
        document.getElementById("settings-stasis").checked = player.stasisMode || false;
    }
    switchSettingsTab('config');
    document.getElementById("settings-modal").classList.remove("modal-hidden");
};
window.closeSettingsModal = function() { document.getElementById("settings-modal").classList.add("modal-hidden"); };
window.saveSettings = function() {
    if (!player) return closeSettingsModal();
    player.bossDeadline = document.getElementById("settings-boss-date").value;
    player.resetHour = document.getElementById("settings-reset-hour").value;
    saveData(); updateScreen(); closeSettingsModal();
};
window.triggerSystemWipe = function() { if (confirm("Nuclear reset active confirmation profile trace purge?")) { localStorage.clear(); location.reload(); } };
window.toggleCycleInputVisibility = function() {
    document.getElementById("custom-cycle-group").classList.toggle("hidden", document.getElementById("quest-frequency").value !== "cyclic");
};
window.closeModal = function() {
    document.getElementById("quest-modal").classList.add("modal-hidden");
    document.getElementById("quest-title").value = ""; document.getElementById("quest-frequency").value = "daily";
    document.getElementById("custom-cycle-group").classList.add("hidden");
};
window.fillSuggestion = function(t, ty, f, c = 7) {
    document.getElementById("quest-title").value = t; document.getElementById("quest-type").value = ty;
    document.getElementById("quest-frequency").value = f; document.getElementById("quest-cycle-days").value = c;
    window.toggleCycleInputVisibility();
};
window.addNewQuest = function() {
    const title = document.getElementById("quest-title").value.trim();
    const type = document.getElementById("quest-type").value;
    const freq = document.getElementById("quest-frequency").value;
    const sched = document.getElementById("quest-schedule").value;
    if (title === "") return;

    const quest = { id: Date.now(), type: type, title: title, reward: defaultRewards[type], completed: false, scheduledForTomorrow: (sched === "tomorrow") };
    if (freq === "daily") quest.isDaily = true;
    else if (freq === "cyclic") { quest.cycle = parseInt(document.getElementById("quest-cycle-days").value) || 7; quest.lastDone = null; }
    
    quests.push(quest); saveData(); updateScreen(); closeModal();
};

function saveData() {
    localStorage.setItem("adhdPlayerMaxx_v6_final", JSON.stringify(player));
    localStorage.setItem("adhdQuestsMaxx_v6_final", JSON.stringify(quests));
    localStorage.setItem("adhdDayLogsMaxx_v6_final", JSON.stringify(dayLogs));
}

// Guarantee secure setup binding once DOM initialization wraps up completely
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("add-quest-btn");
    if (btn) {
        btn.addEventListener("click", function() {
            document.getElementById("quest-modal").classList.remove("modal-hidden");
        });
    }
    loadData();
});