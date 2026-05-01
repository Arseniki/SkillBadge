// ============ DONNÉES BLOCKCHAIN ============
let blockchainData = {
    badges: [
        { id: 1, name: "React.js Avancé", skill: "Développement Web", level: "Avancé", issuer: "Koanda Tinga", date: "12 avr. 2026", tx: "0xa83f7d_c91b4e" },
        { id: 2, name: "Flutter Débutant", skill: "Développement Mobile", level: "Débutant", issuer: "Koanda Tinga", date: "10 mars 2026", tx: "0x9d2c_b4e" },
        { id: 3, name: "UI/UX Design", skill: "UI/UX Design", level: "Intermédiaire", issuer: "Koanda Tinga", date: "05 fév. 2026", tx: "0x3e8a_c7" },
        { id: 4, name: "Data Python", skill: "Data & IA", level: "Débutant", issuer: "Koanda Tinga", date: "20 jan. 2026", tx: "0x1f4d_e9" }
    ],
    students: [
        { name: "Oumar Sawadogo", avatar: "OS", wallet: "0xOumar...3f2a", city: "Ouaga", badges: ["React.js Avancé", "Flutter Débutant", "UI/UX Design"], score: 86 },
        { name: "Aminata Koné", avatar: "AK", wallet: "0xAminata...7b4e", city: "Bobo", badges: ["Flutter Débutant", "UI/UX Design"], score: 74 },
        { name: "Yannick Dabiré", avatar: "YD", wallet: "0xYannick...9d2c", city: "Ouaga", badges: ["React.js Avancé"], score: 68 },
        { name: "Fatou B.", avatar: "FB", wallet: "0xFatou...8e3a", city: "Ouaga", badges: ["Data Python"], score: 62 }
    ],
    activities: [
        "Badge React.js attribué à Oumar S. Il y a 2h",
        "Nouveau badge Flutter créé Hier",
        "3 vérifications de portfolio aujourd'hui"
    ],
    notifications: [
        { text: "Nouveau badge reçu ! React.js Avancé certifié par Koanda Tinga - CodeLab BF", time: "il y a 21h", type: "badge" },
        { text: "Votre portfolio a été consulté - Une entreprise a vérifié vos badges aujourd'hui", time: "il y a 5h", type: "view" },
        { text: "Badge disponible - CodeLab BF propose un nouveau badge Data / Python", time: "Hier", type: "info" }
    ]
};

let users = JSON.parse(localStorage.getItem('skillbadge_users')) || [
    { id: 1, name: "Oumar Sawadogo", email: "oumar@skillbadge.bf", phone: "+226 70 00 00 01", password: "123456", role: "apprenant", avatar: "OS" },
    { id: 2, name: "Koanda Tinga", email: "koanda@codelab.bf", phone: "+226 70 00 00 02", password: "123456", role: "formateur", avatar: "KT" }
];

let currentUser = null;
let shortlist = JSON.parse(localStorage.getItem('skillbadge_shortlist')) || ["Oumar Sawadogo", "Aminata Koné"];
let selectedLevel = "intermediaire";
let selectedCandidate = null;

// ============ SAUVEGARDE ============
function saveUsers() { localStorage.setItem('skillbadge_users', JSON.stringify(users)); }
function saveBlockchainData() { localStorage.setItem('skillbadge_blockchain', JSON.stringify(blockchainData)); }
function saveShortlist() { localStorage.setItem('skillbadge_shortlist', JSON.stringify(shortlist)); }

function loadBlockchainData() {
    const saved = localStorage.getItem('skillbadge_blockchain');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.badges) blockchainData.badges = data.badges;
            if (data.students) blockchainData.students = data.students;
            if (data.activities) blockchainData.activities = data.activities;
            if (data.notifications) blockchainData.notifications = data.notifications;
        } catch(e) {}
    }
}
loadBlockchainData();

// ============ THÈME ============
function toggleTheme() {
    if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        localStorage.setItem('skillbadge_theme', 'light');
    } else {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        localStorage.setItem('skillbadge_theme', 'dark');
    }
}

// ============ AUTHENTIFICATION ============
function handleLogin() {
    const identifier = document.getElementById('loginIdentifier').value;
    const password = document.getElementById('loginPassword').value;
    const user = users.find(u => (u.email === identifier || u.phone === identifier) && u.password === password && u.role === 'apprenant');
    if (user) {
        currentUser = user;
        localStorage.setItem('skillbadge_current_user', JSON.stringify(user));
        window.location.href = 'apprenant.html';
    } else {
        showToast('Identifiants incorrects');
    }
}

function handleRegister() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;
    
    if (!name || !email || !phone || !password) { showToast('Tous les champs sont requis'); return; }
    if (password !== confirm) { showToast('Les mots de passe ne correspondent pas'); return; }
    if (users.find(u => u.email === email)) { showToast('Email déjà utilisé'); return; }
    
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const newUser = { id: users.length + 1, name, email, phone, password, role: 'apprenant', avatar: initials };
    users.push(newUser);
    saveUsers();
    currentUser = newUser;
    localStorage.setItem('skillbadge_current_user', JSON.stringify(newUser));
    window.location.href = 'apprenant.html';
}

function handleFormateurLogin() {
    const identifier = document.getElementById('formateurLoginIdentifier').value;
    const password = document.getElementById('formateurLoginPassword').value;
    const user = users.find(u => (u.email === identifier || u.phone === identifier) && u.password === password && u.role === 'formateur');
    if (user) {
        currentUser = user;
        localStorage.setItem('skillbadge_current_user', JSON.stringify(user));
        window.location.href = 'formateur.html';
    } else {
        showToast('Identifiants formateur incorrects');
    }
    // Vérification au chargement
console.log('Script.js chargé');
console.log('handleFormateurLogin existe :', typeof handleFormateurLogin);
}

function logout() {
    localStorage.removeItem('skillbadge_current_user');
    window.location.href = 'index.html';
}

function checkAuth() {
    const savedUser = localStorage.getItem('skillbadge_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (window.location.pathname.includes('apprenant.html') && currentUser.role !== 'apprenant') window.location.href = 'index.html';
        if (window.location.pathname.includes('formateur.html') && currentUser.role !== 'formateur') window.location.href = 'index.html';
    } else {
        if (window.location.pathname.includes('apprenant.html') || window.location.pathname.includes('formateur.html')) {
            window.location.href = 'index.html';
        }
    }
}

// ============ FORMATEUR ============
function createBadge() {
    const name = document.getElementById('badgeName').value;
    if (!name) { showToast('Entrez un nom de badge'); return; }
    const skill = document.getElementById('badgeSkill').value;
    const desc = document.getElementById('badgeDesc').value;
    const levelMap = { debutant: 'Débutant', intermediaire: 'Intermédiaire', avance: 'Avancé' };
    const newBadge = {
        id: Date.now(),
        name: name,
        skill: skill,
        level: levelMap[selectedLevel],
        desc: desc,
        issuer: currentUser?.name || "Koanda Tinga",
        date: new Date().toLocaleDateString(),
        tx: '0x' + Math.random().toString(36).substring(2, 14)
    };
    blockchainData.badges.push(newBadge);
    blockchainData.activities.unshift(`✅ Badge "${name}" créé sur Polygon · TX: ${newBadge.tx}`);
    saveBlockchainData();
    showToast(`Badge "${name}" créé !`);
    document.getElementById('badgeName').value = '';
    updateFormateurUI();
}

function assignBadge() {
    const badgeName = document.getElementById('assignBadgeSelect').value;
    const studentName = document.getElementById('assignStudentSelect').value;
    const comment = document.getElementById('assignComment').value;
    const badge = blockchainData.badges.find(b => b.name === badgeName);
    if (!badge) { showToast('Badge introuvable'); return; }
    const student = blockchainData.students.find(s => s.name === studentName);
    if (student) {
        student.badges.push(badgeName);
        student.score = Math.min(100, student.score + 5);
    }
    blockchainData.activities.unshift(`🏅 Badge "${badgeName}" attribué à ${studentName} · TX: ${badge.tx}`);
    blockchainData.notifications.unshift({ text: `Nouveau badge "${badgeName}" reçu !`, time: "À l'instant", type: "badge" });
    saveBlockchainData();
    showToast(`✅ Badge attribué à ${studentName} !`);
    updateFormateurUI();
}

function selectLevel(el, level) {
    document.querySelectorAll('.level-option').forEach(opt => opt.classList.remove('selected'));
    el.classList.add('selected');
    selectedLevel = level;
}

// ============ APPRENANT ============
function updateApprenantUI() {
    const student = blockchainData.students[0];
    if (!student) return;
    const progress = Math.min(100, student.badges.length * 18 + 30);
    document.getElementById('progressPercent').innerText = progress;
    document.getElementById('apprenantBadgesList').innerHTML = student.badges.map(b => {
        const badgeInfo = blockchainData.badges.find(bd => bd.name === b);
        return `<div class="badge-item"><span><i class="fas fa-certificate"></i> ${b}</span><span class="badge-success">✓ Vérifié</span></div>`;
    }).join('');
    document.getElementById('apprenantNotifications').innerHTML = blockchainData.notifications.slice(0,3).map(n => 
        `<div class="notification-item"><i class="fas fa-bell"></i> ${n.text}<br><span class="blockchain-tag">${n.time}</span></div>`
    ).join('');
    document.getElementById('portfolioLink').innerHTML = `https://skillbadge.bf/${student.wallet}`;
    if (student.badges.length > 0) {
        const firstBadge = blockchainData.badges.find(b => b.name === student.badges[0]);
        if (firstBadge) {
            document.getElementById('detailTx').innerText = firstBadge.tx;
            document.getElementById('detailDate').innerText = firstBadge.date;
        }
    }
    if (document.getElementById('apprenantAvatar')) document.getElementById('apprenantAvatar').innerText = student.avatar;
    if (document.getElementById('apprenantNameDisplay')) document.getElementById('apprenantNameDisplay').innerText = student.name;
    if (document.getElementById('welcomeApprenant')) document.getElementById('welcomeApprenant').innerText = student.name;
}

function shareBadge() { showToast('Badge partagé !'); }
function copyLink() {
    const student = blockchainData.students[0];
    navigator.clipboard.writeText(`https://skillbadge.bf/${student?.wallet || '0xOumar...3f2a'}`);
    showToast('Lien copié !');
}
function requestBadge() { showToast('Demande envoyée au formateur'); }
function exportApprenantPDF() {
    const element = document.getElementById('apprenantDashboard') || document.body;
    html2pdf().from(element).set({ margin: 1, filename: 'skillbadge_portfolio.pdf' }).save();
}

// ============ RECRUTEUR ============
function updateRecruteurUI() {
    const filter = document.getElementById('candidateFilter')?.value.toLowerCase() || '';
    const filtered = blockchainData.students.filter(s => s.name.toLowerCase().includes(filter));
    document.getElementById('resultCount').innerText = filtered.length;
    document.getElementById('candidatesList').innerHTML = filtered.map(s => `
        <div class="student-item" onclick="showCandidateProfile('${s.name}')">
            <div style="display:flex; align-items:center; gap:12px;">
                <div class="avatar" style="width:32px;height:32px;font-size:12px;">${s.avatar}</div>
                <span>${s.name}</span>
            </div>
            <span>${s.badges.length} badges · ${s.city}</span>
            <span class="badge-success">Score ${s.score}</span>
        </div>
    `).join('');
    updateShortlist();
}

function filterCandidates() { updateRecruteurUI(); }
function filterBySkill(skill) { showToast(`Filtre: ${skill}`); }

function showCandidateProfile(name) {
    const student = blockchainData.students.find(s => s.name === name);
    if (!student) return;
    const badgesHtml = student.badges.map(b => {
        const badgeInfo = blockchainData.badges.find(bd => bd.name === b);
        return `<div class="badge-item"><span><i class="fas fa-certificate"></i> ${b}</span><span class="badge-success">✓ Valide</span></div>`;
    }).join('');
    document.getElementById('profileContent').innerHTML = `
        <div style="display:flex; align-items:center; gap:16px; margin-bottom:20px; flex-wrap:wrap;">
            <div class="avatar" style="width:56px;height:56px;font-size:20px;">${student.avatar}</div>
            <div><h3>${student.name}</h3><p style="color:var(--text-secondary);">Développeur - ${student.city}</p></div>
            <div class="badge-success" style="margin-left:auto;">${student.badges.length} badges vérifiés</div>
        </div>
        <div class="kpi-number" style="font-size:28px; text-align:center;">${student.score}</div>
        <p style="text-align:center; color:var(--text-secondary);">Score de compétences</p>
        <div style="display:flex; gap:12px; justify-content:center; margin:16px 0; flex-wrap:wrap;">
            ${student.badges.slice(0,3).map(b => `<span class="badge-success"><i class="fas fa-certificate"></i> ${b.split(' ')[0]}</span>`).join('')}
        </div>
        <h4 style="margin:16px 0 8px;">Badges certifiés (${student.badges.length})</h4>
        ${badgesHtml}
        <div class="blockchain-tag" style="margin-top:16px; padding:12px; background:var(--bg-primary); border-radius:12px;">
            <i class="fas fa-cube"></i> ${student.badges.length}/${student.badges.length} badges blockchain confirmés · Polygon
        </div>
    `;
    document.getElementById('candidateProfile').style.display = 'block';
    selectedCandidate = name;
}

function verifyCandidate() {
    const search = document.getElementById('candidateSearch').value;
    if (search) {
        const student = blockchainData.students.find(s => s.name.toLowerCase().includes(search.toLowerCase()));
        if (student) showCandidateProfile(student.name);
        else showToast('Candidat non trouvé');
    } else showToast('Entrez un nom ou une adresse');
}

function contactCandidate() { showToast('Message envoyé au candidat'); }
function shortlistCandidate() { 
    if (selectedCandidate && !shortlist.includes(selectedCandidate)) {
        shortlist.push(selectedCandidate);
        saveShortlist();
        updateShortlist();
        showToast('Ajouté à la shortlist');
    }
}
function updateShortlist() {
    document.getElementById('shortlistCount').innerText = shortlist.length;
    document.getElementById('shortlistContainer').innerHTML = shortlist.map(s => {
        const student = blockchainData.students.find(st => st.name === s);
        return `<div class="student-item" style="cursor:pointer;" onclick="showCandidateProfile('${s}')">
            <span><i class="fas fa-user"></i> ${s}</span>
            <span class="badge-success">Score ${student?.score || 0}</span>
        </div>`;
    }).join('');
}
function postOffer() { showToast('Formulaire de publication d\'offre'); }
function exportCandidatePDF() { showToast('Export PDF du profil'); }

// ============ FORMATEUR UI ============
function updateFormateurUI() {
    document.getElementById('badgesCount').innerText = blockchainData.badges.length;
    document.getElementById('studentsCount').innerText = blockchainData.students.length;
    document.getElementById('badgeTypesCount').innerText = [...new Set(blockchainData.badges.map(b=>b.skill))].length;
    document.getElementById('pendingCount').innerText = "3";
    
    const selectBadge = document.getElementById('assignBadgeSelect');
    if (selectBadge) selectBadge.innerHTML = blockchainData.badges.map(b => `<option>${b.name}</option>`).join('');
    const selectStudent = document.getElementById('assignStudentSelect');
    if (selectStudent) selectStudent.innerHTML = blockchainData.students.map(s => `<option>${s.name}</option>`).join('');
    
    document.getElementById('formateurBadgesList').innerHTML = blockchainData.badges.map(b => 
        `<div class="badge-item"><span><i class="fas fa-tag"></i> ${b.name}</span><span class="badge-success">${b.level} · ${b.skill}</span></div>`
    ).join('');
    
    document.getElementById('recentActivity').innerHTML = blockchainData.activities.slice(0,5).map(a => 
        `<div class="notification-item"><i class="fas fa-history"></i> ${a}</div>`
    ).join('');
    
    if (document.getElementById('formateurAvatar')) document.getElementById('formateurAvatar').innerText = currentUser?.avatar || "KT";
    if (document.getElementById('formateurNameDisplay')) document.getElementById('formateurNameDisplay').innerText = currentUser?.name || "Koanda Tinga";
    if (document.getElementById('welcomeFormateur')) document.getElementById('welcomeFormateur').innerText = currentUser?.name || "Koanda Tinga";
}

// ============ TOAST ============
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('skillbadge_theme');
    if (savedTheme === 'dark') document.body.classList.add('dark');
    else document.body.classList.add('light');
    
    checkAuth();
    
    if (window.location.pathname.includes('apprenant.html')) updateApprenantUI();
    if (window.location.pathname.includes('formateur.html')) updateFormateurUI();
    if (window.location.pathname.includes('recruteur.html')) updateRecruteurUI();
});