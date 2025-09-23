/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- MOCK DATA ---
const mockAuthenticatedUser = {
    dni: "12345678",
    password: "password123",
    email: "ana.garcia@example.com",
    name: "Ana García",
    career: "Profesorado de Historia",
    avatar: `https://api.dicebear.com/8.x/initials/svg?seed=Ana%20Garcia`,
};

const mockSubjects = [
    {
        id: "HIS01",
        name: "Historia Antigua",
        teacher: "Dr. Morales",
        schedule: "Lunes 18:00 - 20:00, Jueves 19:00 - 21:00",
        syllabus: [
            "Unidad 1: Las primeras civilizaciones de Mesopotamia y Egipto.",
            "Unidad 2: El mundo griego: de la civilización minoica a la helenística.",
            "Unidad 3: Roma: de la República al Imperio.",
            "Unidad 4: La Antigüedad tardía y la transición a la Edad Media."
        ],
        examDates: [
            { description: "1er Parcial", date: "2024-04-15" },
            { description: "Recuperatorio 1er Parcial", date: "2024-04-22" },
            { description: "2do Parcial", date: "2024-06-10" },
            { description: "Recuperatorio 2do Parcial", date: "2024-06-17" }
        ]
    },
    {
        id: "PED02",
        name: "Pedagogía General",
        teacher: "Lic. Rivas",
        schedule: "Martes 20:00 - 22:00, Viernes 18:00 - 20:00",
        syllabus: [
            "Unidad 1: Conceptos fundamentales de la Pedagogía.",
            "Unidad 2: Principales corrientes pedagógicas.",
            "Unidad 3: La relación educador-educando.",
            "Unidad 4: El currículum y la planificación didáctica."
        ],
        examDates: [
            { description: "1er Parcial", date: "2024-04-20" },
            { description: "Recuperatorio 1er Parcial", date: "2024-04-27" },
            { description: "2do Parcial", date: "2024-06-12" },
            { description: "Recuperatorio 2do Parcial", date: "2024-06-19" }
        ]
    },
    {
        id: "SOC03",
        name: "Sociología de la Educación",
        teacher: "Dra. Campos",
        schedule: "Miércoles 19:00 - 21:00",
        syllabus: [
            "Unidad 1: Introducción a la Sociología de la Educación.",
            "Unidad 2: La escuela como institución social.",
            "Unidad 3: Desigualdad social y educación.",
            "Unidad 4: Nuevos desafíos para el sistema educativo."
        ],
        examDates: [
            { description: "Parcial Único", date: "2024-05-22" },
            { description: "Recuperatorio Parcial Único", date: "2024-05-29" },
        ]
    }
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

const mockAttendance = {
    "HIS01": { totalClasses: 20, absences: 2 }, // 10% -> Regular
    "PED02": { totalClasses: 18, absences: 4 }, // 22.2% -> Peligro de quedar libre
    "SOC03": { totalClasses: 16, absences: 5 }, // 31.25% -> Libre
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
    { id: 1, title: "¿Alguien entendió el texto de Foucault?", author: "Juan Pérez", replies: 3, forum: "general" },
    { id: 2, title: "Grupo de estudio para el final de Pedagogía", author: "Laura Gómez", replies: 1, forum: "student_only" },
];

const mockForumReplies: { [key: number]: { author: string, content: string, avatar: string }[] } = {
    1: [
        { author: "Maria Rodriguez", content: "Yo tampoco estoy segura, sobre todo la parte del panóptico.", avatar: `https://api.dicebear.com/8.x/initials/svg?seed=Maria%20Rodriguez` },
        { author: "Carlos Sanchez", content: "Creo que se refiere al poder y la vigilancia en la sociedad moderna. Busqué un resumen en YouTube que me ayudó.", avatar: `https://api.dicebear.com/8.x/initials/svg?seed=Carlos%20Sanchez` },
        { author: "Juan Pérez", content: "¡Gracias! Voy a buscarlo. Si alguien más tiene material, bienvenido sea.", avatar: `https://api.dicebear.com/8.x/initials/svg?seed=Juan%20Perez` },
    ],
    2: [
        { author: "Ana García", content: "¡Me sumo! ¿Cuándo y dónde nos juntamos?", avatar: `https://api.dicebear.com/8.x/initials/svg?seed=Ana%20Garcia` }
    ]
};


// --- APP STATE ---
let isAuthenticated = false;
let currentUser: typeof mockAuthenticatedUser | null = null;
let currentPage = 'dashboard';
let examPageActiveTab = 'my-exams';
let authPageMode: 'login' | 'forgot-password' = 'login';
let forgotPasswordStep: 'request' | 'verify' | 'reset' | 'success' = 'request';
let resetAttempt = { dni: '', email: '' };
let selectedForumThreadId: number | null = null;
let selectedSubjectId: string | null = null;


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
    } else { // 'forgot-password' mode
        switch (forgotPasswordStep) {
            case 'request':
                content = `
                    <h1 class="login-title">Recuperar Contraseña</h1>
                    <form id="forgot-password-form">
                        <p class="form-description">Ingresa tu DNI y tu correo electrónico para recibir un código de verificación.</p>
                        <div class="form-group">
                            <label for="dni-forgot">DNI</label>
                            <input type="text" id="dni-forgot" name="dni" required>
                        </div>
                        <div class="form-group">
                            <label for="email-forgot">Correo Electrónico</label>
                            <input type="email" id="email-forgot" name="email" required>
                        </div>
                        <p id="forgot-message" class="form-message"></p>
                        <button type="submit" class="login-btn">Enviar Código</button>
                    </form>
                    <a href="#" id="back-to-login-link" class="forgot-password-link">Volver al inicio de sesión</a>
                `;
                break;
            case 'verify':
                content = `
                    <h1 class="login-title">Verificar Código</h1>
                    <form id="verify-code-form">
                        <p class="form-description">Hemos enviado un código a tu correo. Ingrésalo a continuación (pista: es 1234).</p>
                        <div class="form-group">
                            <label for="verification-code">Código de Verificación</label>
                            <input type="text" id="verification-code" name="code" required maxlength="4" pattern="\\d{4}" inputmode="numeric">
                        </div>
                        <p id="verify-message" class="form-message"></p>
                        <button type="submit" class="login-btn">Verificar</button>
                    </form>
                    <a href="#" id="back-to-login-link" class="forgot-password-link">Volver al inicio de sesión</a>
                `;
                break;
            case 'reset':
                content = `
                    <h1 class="login-title">Restablecer Contraseña</h1>
                    <form id="reset-password-form">
                        <p class="form-description">Establece una nueva contraseña.</p>
                        <div class="form-group">
                            <label for="new-password-reset">Nueva Contraseña</label>
                            <input type="password" id="new-password-reset" required>
                        </div>
                        <div class="form-group">
                            <label for="confirm-password-reset">Confirmar Nueva Contraseña</label>
                            <input type="password" id="confirm-password-reset" required>
                        </div>
                        <p id="reset-message" class="form-message"></p>
                        <button type="submit" class="login-btn">Guardar Contraseña</button>
                    </form>
                    <a href="#" id="back-to-login-link" class="forgot-password-link">Volver al inicio de sesión</a>
                `;
                break;
            case 'success':
                 content = `
                    <h1 class="login-title">¡Éxito!</h1>
                    <p class="form-description">Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.</p>
                    <a href="#" id="back-to-login-link" class="login-btn" style="text-decoration: none; display: block; text-align: center;">Volver al inicio de sesión</a>
                `;
                break;
        }
    }


    rootContainer.innerHTML = `
        <div class="login-container">
            <div class="login-card">
                ${content}
            </div>
        </div>
    `;

    // Add event listeners
    if (authPageMode === 'login') {
        document.getElementById('login-form')?.addEventListener('submit', handleLogin);
        document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            authPageMode = 'forgot-password';
            forgotPasswordStep = 'request';
            render();
        });
    } else { // 'forgot-password' mode
        switch (forgotPasswordStep) {
            case 'request':
                document.getElementById('forgot-password-form')?.addEventListener('submit', handleForgotPasswordRequest);
                break;
            case 'verify':
                document.getElementById('verify-code-form')?.addEventListener('submit', handleVerifyCode);
                break;
            case 'reset':
                document.getElementById('reset-password-form')?.addEventListener('submit', handleResetPassword);
                break;
        }
        // This link is present on almost all forgot password steps
        document.getElementById('back-to-login-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            authPageMode = 'login';
            forgotPasswordStep = 'request';
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
                    <li><a href="#" data-page="subjects">🏫 Mis Materias</a></li>
                    <li><a href="#" data-page="grades">📚 Mis Notas</a></li>
                    <li><a href="#" data-page="finals">🗓️ Finales</a></li>
                    <li><a href="#" data-page="forums">💬 Foros</a></li>
                    <li><a href="#" data-page="notifications">🔔 Notificaciones</a></li>
                    <li><a href="#" data-page="settings">⚙️ Configuraciones</a></li>
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
        case 'subjects':
            pageContent.innerHTML = renderSubjects();
            break;
        case 'grades':
            pageContent.innerHTML = renderGradesList();
            break;
        case 'finals':
            pageContent.innerHTML = renderFinals();
            break;
        case 'forums':
            pageContent.innerHTML = renderForums();
            break;
        case 'notifications':
            pageContent.innerHTML = renderNotifications();
            break;
        case 'settings':
            renderSettings();
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
                <h3 class="card-header">Próximos Finales</h3>
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

function renderSubjectsList() {
    return `
        <header class="page-header">
            <h2>Mis Materias</h2>
            <p>Aquí encontrarás información sobre las materias que estás cursando actualmente.</p>
        </header>
        <div class="item-list">
        ${mockSubjects.map(subject => `
            <div class="list-item" onclick="window.viewSubjectDetails('${subject.id}')">
                <h3>${subject.name}</h3>
                <p>Docente: ${subject.teacher}</p>
            </div>
        `).join('')}
        </div>
    `;
}

function renderSubjectDetails(subjectId: string) {
    const subject = mockSubjects.find(s => s.id === subjectId);
    if (!subject) {
        return `<p>Error: No se pudo encontrar la materia.</p>`;
    }

    const examDatesHtml = `
        <div class="card">
            <h3 class="card-header">Fechas de Parciales</h3>
            <ul class="syllabus-list">
                ${subject.examDates && subject.examDates.length > 0
                    ? subject.examDates.map(exam => `<li><strong>${exam.description}:</strong> ${exam.date}</li>`).join('')
                    : '<li>No hay fechas de parciales cargadas.</li>'
                }
            </ul>
        </div>
    `;

    return `
        <header class="page-header">
            <a href="#" onclick="window.backToSubjects()">&larr; Volver a Mis Materias</a>
            <h2>${subject.name}</h2>
            <p>Docente: ${subject.teacher}</p>
        </header>
        <div class="subject-details-grid">
            <div class="card">
                <h3 class="card-header">Horarios de Cursada</h3>
                <p>${subject.schedule}</p>
            </div>
            ${examDatesHtml}
            <div class="card">
                <h3 class="card-header">Temario de la Materia</h3>
                <ul class="syllabus-list">
                    ${subject.syllabus.map(topic => `<li>${topic}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
}


function viewSubjectDetails(subjectId: string) {
    selectedSubjectId = subjectId;
    renderPageContent();
}
(window as any).viewSubjectDetails = viewSubjectDetails;

function backToSubjects() {
    selectedSubjectId = null;
    renderPageContent();
}
(window as any).backToSubjects = backToSubjects;


function renderSubjects() {
    if (selectedSubjectId) {
        return renderSubjectDetails(selectedSubjectId);
    }
    return renderSubjectsList();
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
    const attendance = mockAttendance[subjectId];
    const pageContent = document.getElementById('page-content')!;

    let attendanceHtml = `
        <h3>Asistencias</h3>
        <div class="card">
             <p>No hay datos de asistencia disponibles para esta materia.</p>
        </div>
    `;

    if (attendance) {
        const { totalClasses, absences } = attendance;
        const percentage = totalClasses > 0 ? Math.round((absences / totalClasses) * 100) : 0;
        let statusText = '';
        let statusClass = '';

        if (percentage <= 15) {
            statusText = 'Regular';
            statusClass = 'status-acceptable';
        } else if (percentage <= 25) {
            statusText = 'Peligro de quedar libre';
            statusClass = 'status-risky';
        } else {
            statusText = 'Libre';
            statusClass = 'status-final';
        }

        attendanceHtml = `
            <h3>Asistencias</h3>
            <div class="card attendance-card ${statusClass}">
                 <div class="attendance-status">
                    <h4>Estado de Asistencia: <strong>${statusText}</strong></h4>
                 </div>
                 <div class="attendance-details">
                    <p><strong>Total de Clases:</strong> ${totalClasses}</p>
                    <p><strong>Inasistencias:</strong> ${absences} (${percentage}%)</p>
                 </div>
                 <div class="attendance-bar-container">
                    <div class="attendance-bar" style="width: ${percentage}%"></div>
                 </div>
            </div>
        `;
    }

    pageContent.innerHTML = `
         <header class="page-header">
            <a href="#" onclick="window.navigateTo('grades')">&larr; Volver a Mis Notas</a>
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
        ${attendanceHtml}
    `;
}
(window as any).renderGradeDetails = renderGradeDetails;

function switchFinalsTab(tab: string) {
    examPageActiveTab = tab;
    renderPageContent();
}
(window as any).switchFinalsTab = switchFinalsTab;

function enrollInExam(examId: string) {
    const exam = mockExamTables.find(e => e.id === examId);
    if (exam && !exam.enrolled) {
        exam.enrolled = true;
        renderPageContent(); // Re-render to show updated state
    }
}
(window as any).enrollInExam = enrollInExam;

function renderFinals() {
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
            <h2>Finales</h2>
            <p>Consulta tus inscripciones y las mesas de examen final disponibles.</p>
        </header>
        <div class="tabs">
            <button class="tab-link ${examPageActiveTab === 'my-exams' ? 'active' : ''}" onclick="window.switchFinalsTab('my-exams')">Mis Inscripciones</button>
            <button class="tab-link ${examPageActiveTab === 'available-exams' ? 'active' : ''}" onclick="window.switchFinalsTab('available-exams')">Inscripción a Mesas</button>
        </div>
        <div id="exam-tab-content">
            ${examPageActiveTab === 'my-exams' ? myExamsContent : availableExamsContent}
        </div>
    `;
}

function viewForumThread(threadId: number) {
    selectedForumThreadId = threadId;
    renderPageContent();
}
(window as any).viewForumThread = viewForumThread;

function backToForums() {
    selectedForumThreadId = null;
    renderPageContent();
}
(window as any).backToForums = backToForums;

function handleReplySubmit(event: Event, threadId: number) {
    event.preventDefault();
    if (!currentUser) return;

    const replyTextarea = document.getElementById('reply-content') as HTMLTextAreaElement;
    const newReply = replyTextarea.value.trim();

    if (newReply) {
        mockForumReplies[threadId].push({
            author: currentUser.name,
            content: newReply,
            avatar: currentUser.avatar
        });
        
        const thread = mockForumThreads.find(t => t.id === threadId);
        if (thread) {
            thread.replies = mockForumReplies[threadId].length;
        }

        renderPageContent();
    }
}
(window as any).handleReplySubmit = handleReplySubmit;


function renderForumThreadDetails(threadId: number) {
    const thread = mockForumThreads.find(t => t.id === threadId);
    const replies = mockForumReplies[threadId] || [];

    if (!thread || !currentUser) return `<p>Error: No se pudo encontrar el hilo del foro.</p>`;

    return `
        <header class="page-header">
            <a href="#" onclick="window.backToForums()">&larr; Volver a los Foros</a>
            <h2>${thread.title}</h2>
            <p>Iniciado por: <strong>${thread.author}</strong></p>
        </header>

        <div class="forum-thread-container">
            <div class="replies-list">
                ${replies.map(reply => `
                    <div class="reply-card">
                        <div class="reply-author">
                            <img src="${reply.avatar}" alt="Avatar de ${reply.author}">
                            <strong>${reply.author}</strong>
                        </div>
                        <p class="reply-content">${reply.content}</p>
                    </div>
                `).join('')}
            </div>

            <div class="reply-form-container card">
                 <h3 class="card-header">Escribe una respuesta</h3>
                 <form id="reply-form" onsubmit="window.handleReplySubmit(event, ${threadId})">
                    <div class="form-group">
                        <textarea id="reply-content" rows="5" placeholder="Tu respuesta..." required></textarea>
                    </div>
                    <button type="submit" class="login-btn">Publicar Respuesta</button>
                 </form>
            </div>
        </div>
    `;
}


function renderForums() {
    if (selectedForumThreadId) {
        return renderForumThreadDetails(selectedForumThreadId);
    }
    return `
        <header class="page-header">
            <h2>Foros</h2>
            <p>Espacios de debate y consulta.</p>
        </header>
        
        <h3>Foro General (Alumnos y Docentes)</h3>
        <div class="item-list">
             ${mockForumThreads.filter(t => t.forum === 'general').map(thread => `
                <div class="list-item" onclick="window.viewForumThread(${thread.id})">
                    <h3>${thread.title}</h3>
                    <p>Autor: ${thread.author} - Respuestas: ${mockForumReplies[thread.id]?.length || 0}</p>
                </div>
            `).join('')}
        </div>
        <br>
        <h3>Foro de Alumnos</h3>
        <div class="item-list">
            ${mockForumThreads.filter(t => t.forum === 'student_only').map(thread => `
                <div class="list-item" onclick="window.viewForumThread(${thread.id})">
                    <h3>${thread.title}</h3>
                    <p>Autor: ${thread.author} - Respuestas: ${mockForumReplies[thread.id]?.length || 0}</p>
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

function renderSettings() {
    if (!currentUser) return;
    const pageContent = document.getElementById('page-content')!;

    const settingsHTML = `
        <header class="page-header">
            <h2>Configuraciones</h2>
            <p>Gestiona tu perfil, la apariencia de la aplicación y las notificaciones.</p>
        </header>
        <div class="settings-grid">
            
            <!-- Profile Card -->
            <div class="card">
                <h3 class="card-header">Editar Perfil</h3>
                <form id="profile-form">
                    <div id="profile-message"></div>
                    <div class="form-group">
                        <label for="profile-name">Nombre Completo</label>
                        <input type="text" id="profile-name" value="${currentUser.name}" required>
                    </div>
                    <hr class="form-divider">
                    <h3 class="form-section-title">Cambiar Contraseña</h3>
                    <div class="form-group">
                        <label for="new-password">Nueva Contraseña</label>
                        <input type="password" id="new-password" placeholder="Dejar en blanco para no cambiar">
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirmar Nueva Contraseña</label>
                        <input type="password" id="confirm-password">
                    </div>
                    <button type="submit" class="login-btn">Guardar Cambios</button>
                </form>
            </div>

            <!-- Appearance Card -->
            <div class="card">
                <h3 class="card-header">Apariencia</h3>
                <p class="settings-description">Elige un tema de color para la interfaz.</p>
                <div class="theme-selector" id="theme-selector">
                    <button class="theme-button" data-theme="default">Claro</button>
                    <button class="theme-button" data-theme="dark">Oscuro</button>
                </div>
            </div>

            <!-- Notifications Card -->
            <div class="card">
                <h3 class="card-header">Notificaciones</h3>
                <p class="settings-description">Selecciona qué notificaciones deseas recibir.</p>
                <div class="notification-settings">
                    <div class="notification-toggle">
                        <label for="notif-general">Novedades de la institución</label>
                        <label class="switch">
                            <input type="checkbox" id="notif-general" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="notification-toggle">
                        <label for="notif-forums">Actividad en los foros</label>
                         <label class="switch">
                            <input type="checkbox" id="notif-forums" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="notification-toggle">
                        <label for="notif-exams">Recordatorios de exámenes</label>
                         <label class="switch">
                            <input type="checkbox" id="notif-exams">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;
    pageContent.innerHTML = settingsHTML;

    // Set active theme button
    const currentTheme = localStorage.getItem('theme') || 'default';
    const activeBtn = document.querySelector(`#theme-selector [data-theme="${currentTheme}"]`);
    activeBtn?.classList.add('active');

    // Add event listeners
    document.getElementById('profile-form')?.addEventListener('submit', handleProfileUpdate);
    document.getElementById('theme-selector')?.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.matches('.theme-button')) {
            const theme = target.dataset.theme;
            if (theme) setTheme(theme);
        }
    });
}

function setTheme(themeName: string) {
    document.body.className = `theme-${themeName}`;
    localStorage.setItem('theme', themeName);

    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.querySelectorAll('.theme-button').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = themeSelector.querySelector(`[data-theme="${themeName}"]`);
        activeBtn?.classList.add('active');
    }
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
    const emailInput = document.getElementById('email-forgot') as HTMLInputElement;
    const messageElement = document.getElementById('forgot-message');

    if (!messageElement) return;

    if (dniInput.value === mockAuthenticatedUser.dni && emailInput.value === mockAuthenticatedUser.email) {
        resetAttempt.dni = dniInput.value;
        resetAttempt.email = emailInput.value;
        forgotPasswordStep = 'verify';
        render();
    } else {
        messageElement.textContent = 'El DNI o el correo electrónico no se encuentran registrados.';
        messageElement.className = 'form-message error';
    }
}

function handleVerifyCode(event: Event) {
    event.preventDefault();
    const codeInput = document.getElementById('verification-code') as HTMLInputElement;
    const messageElement = document.getElementById('verify-message');
    if (!messageElement) return;

    if (codeInput.value === '1234') {
        forgotPasswordStep = 'reset';
        render();
    } else {
        messageElement.textContent = 'El código de verificación es incorrecto.';
        messageElement.className = 'form-message error';
    }
}

function handleResetPassword(event: Event) {
    event.preventDefault();
    const newPasswordInput = document.getElementById('new-password-reset') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password-reset') as HTMLInputElement;
    const messageElement = document.getElementById('reset-message');

    if (!messageElement) return;

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword.length < 8) {
        messageElement.textContent = 'La nueva contraseña debe tener al menos 8 caracteres.';
        messageElement.className = 'form-message error';
        return;
    }

    if (newPassword !== confirmPassword) {
        messageElement.textContent = 'Las contraseñas no coinciden.';
        messageElement.className = 'form-message error';
        return;
    }

    // In a real app, you'd find the user by DNI/email from `resetAttempt` and update their password.
    // Here we just update the mock user.
    mockAuthenticatedUser.password = newPassword;
    forgotPasswordStep = 'success';
    render();
}

function handleProfileUpdate(event: Event) {
    event.preventDefault();
    if (!currentUser) return;

    const nameInput = document.getElementById('profile-name') as HTMLInputElement;
    const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
    const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;
    const messageElement = document.getElementById('profile-message');

    if (!messageElement) return;

    // Update name
    currentUser.name = nameInput.value;
    
    // Update password logic
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Only process password change if a new password is provided
    if (newPassword !== "") {
        if (newPassword.length < 8) {
             messageElement.innerHTML = `<p class="error-message">La nueva contraseña debe tener al menos 8 caracteres.</p>`;
            return;
        }
        if (newPassword !== confirmPassword) {
            messageElement.innerHTML = `<p class="error-message">Las nuevas contraseñas no coinciden.</p>`;
            return;
        }
        // If all checks pass, update the password
        currentUser.password = newPassword;
    } else if (confirmPassword !== "") {
        // Handle case where only confirm is filled
        messageElement.innerHTML = `<p class="error-message">El campo 'Nueva Contraseña' no puede estar vacío si se desea cambiar.</p>`;
        return;
    }

    messageElement.innerHTML = `<p class="success-message">¡Perfil actualizado correctamente!</p>`;
    
    // Clear password fields for security
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';

    // Rerender the whole app to reflect changes (e.g., name in sidebar)
    renderAppLayout();
    navigateTo('settings'); // Stay on settings page
}

function handleLogout() {
    isAuthenticated = false;
    currentUser = null;
    currentPage = 'dashboard';
    authPageMode = 'login';
    forgotPasswordStep = 'request';
    render();
}

function navigateTo(page: string) {
    currentPage = page;
    if (page === 'finals') {
        examPageActiveTab = 'my-exams'; // Reset to default tab when navigating
    }
    if (page !== 'forums') {
        selectedForumThreadId = null;
    }
    if (page !== 'subjects') {
        selectedSubjectId = null;
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
    const savedTheme = localStorage.getItem('theme') || 'default';
    document.body.className = `theme-${savedTheme}`;
    render();
});