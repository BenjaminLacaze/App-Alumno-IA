/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- MOCK DATA ---
const mockAuthenticatedUser = {
    dni: "12345678",
    password: "password123",
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

const mockExamTables = [
    { id: "FIN01", subject: "Historia Antigua", date: "2024-07-15", description: "Examen Final - 1er llamado", teacher: "Dr. Morales", enrolled: true },
    { id: "FIN02", subject: "Pedagogía General", date: "2024-07-22", description: "Examen Final - 1er llamado", teacher: "Lic. Rivas", enrolled: true },
    { id: "FIN03", subject: "Sociología de la Educación", date: "2024-07-29", description: "Examen Final - 1er llamado", teacher: "Dra. Campos", enrolled: false },
    { id: "FIN04", subject: "Didáctica General", date: "2024-08-01", description: "Examen Final - 1er llamado", teacher: "Mg. Soto", enrolled: false },
    { id: "FIN05", subject: "Psicología Educacional", date: "2024-08-05", description: "Examen Final - 1er llamado", teacher: "Lic. Vega", enrolled: false },
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
let isAuthenticated = false;
let currentUser: typeof mockAuthenticatedUser | null = null;
let currentPage = 'dashboard';
let examPageActiveTab = 'my-exams';
let authPageMode: 'login' | 'forgot-password' = 'login';


// --- RENDER FUNCTIONS ---
const rootContainer = document.getElementById('root')!;

function render() {
    if (isAuthenticated && currentUser) {
        renderAppLayout();
    } else {
        renderAuthScreen();
    }
}

function renderAuthScreen() {
    let content = '';
    if (authPageMode === 'login') {
        content = `
            <h1 class="login-title">Portal Estudiantil ISFDyT 26</h1>
            <form id="login-form">
                <div class="form-group">
                    <label for="dni">DNI</label>
                    <input type="text" id="dni" name="dni" required>
                </div>
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <p id="login-error" class="login-error"></p>
                <button type="submit" class="login-btn">Ingresar</button>
            </form>
            <a href="#" id="forgot-password-link" class="forgot-password-link">¿Olvidaste tu contraseña?</a>
        `;
    } else {
        content = `
            <h1 class="login-title">Recuperar Contraseña</h1>
            <form id="forgot-password-form">
                <p class="form-description">Ingresa tu DNI para recibir instrucciones para recuperar tu contraseña.</p>
                <div class="form-group">
                    <label for="dni-forgot">DNI</label>
                    <input type="text" id="dni-forgot" name="dni" required>
                </div>
                <p id="forgot-message" class="form-message"></p>
                <button type="submit" class="login-btn">Enviar Instrucciones</button>
            </form>
            <a href="#" id="back-to-login-link" class="forgot-password-link">Volver al inicio de sesión</a>
        `;
    }

    rootContainer.innerHTML = `
        <div class="login-container">
            <div class="login-card">
                ${content}
            </div>
        </div>
    `;

    if (authPageMode === 'login') {
        document.getElementById('login-form')?.addEventListener('submit', handleLogin);
        document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            authPageMode = 'forgot-password';
            render();
        });
    } else {
        document.getElementById('forgot-password-form')?.addEventListener('submit', handleForgotPasswordRequest);
        document.getElementById('back-to-login-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            authPageMode = 'login';
            render();
        });
    }
}


function renderAppLayout() {
    if (!currentUser) return;
    rootContainer.innerHTML = `
      <div id="app-container">
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
                    <li><a href="#" data-page="profile">👤 Editar Perfil</a></li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                 <div class="user-profile">
                    <img src="${currentUser.avatar}" alt="Avatar de usuario">
                    <div class="user-profile-info">
                        <p>${currentUser.name}</p>
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
      </div>
    `;
    renderPageContent();
    addAppEventListeners();
}

function renderPageContent() {
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;
    
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
        case 'profile':
            pageContent.innerHTML = renderProfile();
            break;
    }
}

// --- PAGE RENDERERS ---

function renderDashboard() {
    if (!currentUser) return '';
    return `
        <header class="page-header">
            <h2>Dashboard</h2>
            <p>Bienvenida, ${currentUser.name}. Aquí tienes un resumen de tu actividad.</p>
        </header>
        <div class="dashboard-grid">
            <div class="card">
                <h3 class="card-header">Próximos Exámenes</h3>
                <ul>${mockExamTables.filter(e => e.enrolled).map(e => `<li><strong>${e.subject}</strong> - ${e.date}</li>`).join('')}</ul>
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

function switchExamTab(tab: string) {
    examPageActiveTab = tab;
    renderPageContent();
}
(window as any).switchExamTab = switchExamTab;

function enrollInExam(examId: string) {
    const exam = mockExamTables.find(e => e.id === examId);
    if (exam && !exam.enrolled) {
        exam.enrolled = true;
        renderPageContent(); // Re-render to show updated state
        // In a real app, you might want to re-render the dashboard as well if it's visible
    }
}
(window as any).enrollInExam = enrollInExam;

function renderExams() {
    const myExams = mockExamTables.filter(e => e.enrolled);
    
    const myExamsContent = `
        <table class="content-table">
            <thead>
                <tr>
                    <th>Materia</th>
                    <th>Fecha</th>
                    <th>Descripción</th>
                </tr>
            </thead>
            <tbody>
                ${myExams.map(e => `
                    <tr>
                        <td>${e.subject}</td>
                        <td>${e.date}</td>
                        <td>${e.description}</td>
                    </tr>
                `).join('')}
                ${myExams.length === 0 ? `<tr><td colspan="3">No te has inscripto a ningún examen final.</td></tr>` : ''}
            </tbody>
        </table>
    `;

    const availableExamsContent = `
         <table class="content-table">
            <thead>
                <tr>
                    <th>Materia</th>
                    <th>Fecha</th>
                    <th>Docente</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                ${mockExamTables.map(e => `
                    <tr>
                        <td>${e.subject}</td>
                        <td>${e.date}</td>
                        <td>${e.teacher}</td>
                        <td>
                            <button onclick="window.enrollInExam('${e.id}')" class="${e.enrolled ? 'btn-enrolled' : 'btn-enroll'}" ${e.enrolled ? 'disabled' : ''}>
                                ${e.enrolled ? '✔ Inscripto' : 'Inscribirse'}
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    return `
        <header class="page-header">
            <h2>Fechas de Examen</h2>
            <p>Consulta tus inscripciones y las mesas de examen disponibles.</p>
        </header>
        <div class="tabs">
            <button class="tab-link ${examPageActiveTab === 'my-exams' ? 'active' : ''}" onclick="window.switchExamTab('my-exams')">Mis Inscripciones</button>
            <button class="tab-link ${examPageActiveTab === 'available-exams' ? 'active' : ''}" onclick="window.switchExamTab('available-exams')">Inscripción a Mesas</button>
        </div>
        <div id="exam-tab-content">
            ${examPageActiveTab === 'my-exams' ? myExamsContent : availableExamsContent}
        </div>
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

function renderProfile() {
    if (!currentUser) return '';
    const content = `
        <header class="page-header">
            <h2>Editar Perfil</h2>
            <p>Actualiza tu información personal y de seguridad.</p>
        </header>
        <div class="card">
            <form id="profile-form">
                <div id="profile-message"></div>
                <div class="form-group">
                    <label for="profile-name">Nombre Completo</label>
                    <input type="text" id="profile-name" value="${currentUser.name}" required>
                </div>
                <hr class="form-divider">
                <h3 class="form-section-title">Cambiar Contraseña</h3>
                <div class="form-group">
                    <label for="current-password">Contraseña Actual</label>
                    <input type="password" id="current-password" placeholder="Ingresa tu contraseña actual para cambiarla">
                </div>
                <div class="form-group">
                    <label for="new-password">Nueva Contraseña</label>
                    <input type="password" id="new-password">
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirmar Nueva Contraseña</label>
                    <input type="password" id="confirm-password">
                </div>
                <button type="submit" class="login-btn">Guardar Cambios</button>
            </form>
        </div>
    `;
    // Attach listener after rendering
    setTimeout(() => document.getElementById('profile-form')?.addEventListener('submit', handleProfileUpdate), 0);
    return content;
}

// --- EVENT LISTENERS & ROUTING ---
function handleLogin(event: Event) {
    event.preventDefault();
    const dniInput = document.getElementById('dni') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const errorElement = document.getElementById('login-error');

    if (dniInput.value === mockAuthenticatedUser.dni && passwordInput.value === mockAuthenticatedUser.password) {
        isAuthenticated = true;
        currentUser = mockAuthenticatedUser;
        render();
    } else {
        if (errorElement) {
            errorElement.textContent = 'DNI o contraseña incorrectos.';
        }
    }
}

function handleForgotPasswordRequest(event: Event) {
    event.preventDefault();
    const dniInput = document.getElementById('dni-forgot') as HTMLInputElement;
    const messageElement = document.getElementById('forgot-message');
    if (messageElement && dniInput.value) {
        messageElement.textContent = 'Si el DNI está registrado, recibirás un email con instrucciones.';
        messageElement.className = 'form-message success';
    } else if (messageElement) {
        messageElement.textContent = 'Por favor, ingresa tu DNI.';
        messageElement.className = 'form-message error';
    }
}

function handleProfileUpdate(event: Event) {
    event.preventDefault();
    if (!currentUser) return;

    const nameInput = document.getElementById('profile-name') as HTMLInputElement;
    const currentPasswordInput = document.getElementById('current-password') as HTMLInputElement;
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    const messageElement = document.getElementById('profile-message');

    if (!messageElement) return;

    // Update name
    currentUser.name = nameInput.value;
    
    // Update password if fields are filled
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (currentPassword || newPassword || confirmPassword) {
        if (currentPassword !== currentUser.password) {
            messageElement.innerHTML = `<p class="error-message">La contraseña actual es incorrecta.</p>`;
            return;
        }
        if (newPassword.length < 8) {
             messageElement.innerHTML = `<p class="error-message">La nueva contraseña debe tener al menos 8 caracteres.</p>`;
            return;
        }
        if (newPassword !== confirmPassword) {
            messageElement.innerHTML = `<p class="error-message">Las nuevas contraseñas no coinciden.</p>`;
            return;
        }
        currentUser.password = newPassword;
    }

    messageElement.innerHTML = `<p class="success-message">¡Perfil actualizado correctamente!</p>`;
    
    // Rerender the whole app to reflect changes (e.g., name in sidebar)
    renderAppLayout();
    navigateTo('profile'); // Stay on profile page
}

function handleLogout() {
    isAuthenticated = false;
    currentUser = null;
    currentPage = 'dashboard';
    authPageMode = 'login';
    render();
}

function navigateTo(page: string) {
    currentPage = page;
    if (page === 'exams') {
        examPageActiveTab = 'my-exams'; // Reset to default tab when navigating
    }
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


function addAppEventListeners() {
    document.getElementById('nav-links')?.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target as HTMLAnchorElement;
        const page = target.getAttribute('data-page');
        if (page) {
            navigateTo(page);
        }
    });
    
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);

    document.getElementById('menu-toggle')?.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.toggle('open');
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    render();
});