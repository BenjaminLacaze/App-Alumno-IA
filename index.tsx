/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- MOCK DATA ---
const mockUser = {
    name: "Ana García",
    career: "Profesorado de Historia",
    avatar: `https://api.dicebear.com/8.x/initials/svg?seed=Ana%20Garcia`,
};

const mockSubjects = [
    { id: "HIS01", name: "Historia Antigua", teacher: "Dr. Morales" },
    { id: "PED02", name: "Pedagogía General", teacher: "Lic. Rivas" },
    { id: "SOC03", name: "Sociología de la Educación", teacher: "Dra. Campos" },
];

const mockGrades = {
    "HIS01": [
        { description: "1er Parcial", date: "2024-04-15", grade: 8 },
        { description: "Trabajo Práctico N°1", date: "2024-05-10", grade: 9 },
    ],
    "PED02": [
        { description: "1er Parcial", date: "2024-04-20", grade: 7 },
    ],
    "SOC03": [
        { description: "Exposición Grupal", date: "2024-05-22", grade: 10 },
    ]
};

const mockExams = [
    { subject: "Historia Antigua", date: "2024-07-15", description: "Examen Final - 1er llamado" },
    { subject: "Pedagogía General", date: "2024-07-22", description: "Examen Final - 1er llamado" },
];

const mockNotifications = [
    { title: "Inscripción a finales", content: "Se abren las inscripciones a finales el día 10/06." },
    { title: "Suspensión de clases", content: "Se suspenden las clases del turno tarde por desinfección." },
];

const mockForumThreads = [
    { id: 1, title: "¿Alguien entendió el texto de Foucault?", author: "Juan Pérez", replies: 5, forum: "general" },
    { id: 2, title: "Grupo de estudio para el final de Pedagogía", author: "Laura Gómez", replies: 8, forum: "student_only" },
];


// --- APP STATE ---
let currentPage = 'dashboard';

// --- RENDER FUNCTIONS ---
const appContainer = document.getElementById('app-container')!;

function renderAppLayout() {
    appContainer.innerHTML = `
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h1>ISFDyT 26</h1>
            </div>
            <nav>
                <ul id="nav-links">
                    <li><a href="#" data-page="dashboard" class="active">📊 Dashboard</a></li>
                    <li><a href="#" data-page="grades">📚 Mis Notas</a></li>
                    <li><a href="#" data-page="exams">🗓️ Exámenes</a></li>
                    <li><a href="#" data-page="forums">💬 Foros</a></li>
                    <li><a href="#" data-page="notifications">🔔 Notificaciones</a></li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                 <div class="user-profile">
                    <img src="${mockUser.avatar}" alt="Avatar de usuario">
                    <div class="user-profile-info">
                        <p>${mockUser.name}</p>
                    </div>
                </div>
                <button id="logout-btn">Cerrar Sesión</button>
            </div>
        </aside>
        <main class="main-content" id="main-content">
             <header class="main-content-header">
                <h2>Portal Estudiantil</h2>
                <button class="menu-toggle" id="menu-toggle">☰</button>
            </header>
            <div id="page-content"></div>
        </main>
    `;
    addEventListeners();
}

function renderPageContent() {
    const pageContent = document.getElementById('page-content')!;
    pageContent.innerHTML = ''; // Clear previous content

    switch (currentPage) {
        case 'dashboard':
            pageContent.innerHTML = renderDashboard();
            break;
        case 'grades':
            pageContent.innerHTML = renderGradesList();
            break;
        case 'exams':
            pageContent.innerHTML = renderExams();
            break;
        case 'forums':
            pageContent.innerHTML = renderForums();
            break;
        case 'notifications':
            pageContent.innerHTML = renderNotifications();
            break;
    }
}

// --- PAGE RENDERERS ---

function renderDashboard() {
    return `
        <header class="page-header">
            <h2>Dashboard</h2>
            <p>Bienvenida, ${mockUser.name}. Aquí tienes un resumen de tu actividad.</p>
        </header>
        <div class="dashboard-grid">
            <div class="card">
                <h3 class="card-header">Próximos Exámenes</h3>
                <ul>${mockExams.map(e => `<li><strong>${e.subject}</strong> - ${e.date}</li>`).join('')}</ul>
            </div>
            <div class="card">
                <h3 class="card-header">Últimas Notificaciones</h3>
                <ul>${mockNotifications.map(n => `<li><strong>${n.title}</strong>: ${n.content}</li>`).join('')}</ul>
            </div>
            <div class="card">
                <h3 class="card-header">Actividad Reciente en Foros</h3>
                 <ul>${mockForumThreads.map(t => `<li>${t.title} (${t.replies} respuestas)</li>`).join('')}</ul>
            </div>
        </div>
    `;
}

function renderGradesList() {
    return `
        <header class="page-header">
            <h2>Mis Notas</h2>
            <p>Selecciona una materia para ver el detalle de tus calificaciones y asistencias.</p>
        </header>
        <div class="item-list">
        ${mockSubjects.map(subject => `
            <div class="list-item" onclick="window.renderGradeDetails('${subject.id}')">
                <h3>${subject.name}</h3>
                <p>Docente: ${subject.teacher}</p>
            </div>
        `).join('')}
        </div>
    `;
}

function renderGradeDetails(subjectId: string) {
    const subject = mockSubjects.find(s => s.id === subjectId)!;
    const grades = mockGrades[subjectId] || [];
    const pageContent = document.getElementById('page-content')!;
    pageContent.innerHTML = `
         <header class="page-header">
            <a href="#" onclick="window.navigateTo('grades')">&larr; Volver a Mis Materias</a>
            <h2>${subject.name}</h2>
            <p>Docente: ${subject.teacher}</p>
        </header>
        <h3>Calificaciones</h3>
        <table class="content-table">
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Nota</th>
                </tr>
            </thead>
            <tbody>
                ${grades.map(g => `
                    <tr>
                        <td>${g.description}</td>
                        <td>${g.date}</td>
                        <td>${g.grade}</td>
                    </tr>
                `).join('')}
                 ${grades.length === 0 ? `<tr><td colspan="3">No hay calificaciones cargadas.</td></tr>` : ''}
            </tbody>
        </table>
        <br>
        <h3>Asistencias (Ejemplo)</h3>
        <p>Total de clases: 10, Ausencias: 1 (10%)</p>
    `;
}
(window as any).renderGradeDetails = renderGradeDetails;

function renderExams() {
    return `
        <header class="page-header">
            <h2>Fechas de Examen</h2>
            <p>Aquí se listan las próximas fechas de exámenes finales.</p>
        </header>
        <table class="content-table">
            <thead>
                <tr>
                    <th>Materia</th>
                    <th>Fecha</th>
                    <th>Descripción</th>
                </tr>
            </thead>
            <tbody>
                ${mockExams.map(e => `
                    <tr>
                        <td>${e.subject}</td>
                        <td>${e.date}</td>
                        <td>${e.description}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function renderForums() {
    return `
        <header class="page-header">
            <h2>Foros</h2>
            <p>Espacios de debate y consulta.</p>
        </header>
        
        <h3>Foro General (Alumnos y Docentes)</h3>
        <div class="item-list">
             ${mockForumThreads.filter(t => t.forum === 'general').map(thread => `
                <div class="list-item">
                    <h3>${thread.title}</h3>
                    <p>Autor: ${thread.author} - Respuestas: ${thread.replies}</p>
                </div>
            `).join('')}
        </div>
        <br>
        <h3>Foro de Alumnos</h3>
        <div class="item-list">
            ${mockForumThreads.filter(t => t.forum === 'student_only').map(thread => `
                <div class="list-item">
                    <h3>${thread.title}</h3>
                    <p>Autor: ${thread.author} - Respuestas: ${thread.replies}</p>
                </div>
            `).join('')}
        </div>
    `;
}

function renderNotifications() {
     return `
        <header class="page-header">
            <h2>Notificaciones</h2>
            <p>Todos los comunicados importantes de la institución.</p>
        </header>
        <div class="item-list">
        ${mockNotifications.map(n => `
            <div class="list-item">
                <h3>${n.title}</h3>
                <p>${n.content}</p>
            </div>
        `).join('')}
        </div>
    `;
}


// --- EVENT LISTENERS & ROUTING ---
function navigateTo(page: string) {
    currentPage = page;
    document.querySelectorAll('#nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
    renderPageContent();
    
    const sidebar = document.getElementById('sidebar');
    if(sidebar?.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
}
(window as any).navigateTo = navigateTo;


function addEventListeners() {
    document.getElementById('nav-links')?.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target as HTMLAnchorElement;
        const page = target.getAttribute('data-page');
        if (page) {
            navigateTo(page);
        }
    });

    document.getElementById('menu-toggle')?.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.toggle('open');
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderAppLayout();
    renderPageContent();
});
