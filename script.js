// Função para registrar usuário

function registerUser() {
    const username = document.getElementById('username').value;
    if (username) {
        auth.createUserWithEmailAndPassword(username + '@example.com', 'password')
            .then(userCredential => {
                const user = userCredential.user;
                return db.collection('users').doc(user.uid).set({
                    username: username,
                    xp: 0,
                    rank: 'Novato'
                });
            })
            .then(() => {
                alert('Usuário registrado!');
                window.location.href = "agency.html"; // Redireciona para a criação de agência
            })
            .catch(error => {
                console.error('Erro ao registrar usuário: ', error);
            });
    } else {
        alert('Por favor, insira um nome de usuário.');
    }
}

// Função para criar agência
function createAgency() {
    const agencyName = document.getElementById('agency-name').value;
    const agencyDescription = document.getElementById('agency-description').value;
    const user = auth.currentUser;

    if (agencyName && agencyDescription && user) {
        db.collection('agencies').add({
            name: agencyName,
            description: agencyDescription,
            userId: user.uid
        }).then(() => {
            alert('Agência criada!');
            window.location.href = "forum.html"; // Redireciona para o fórum
        }).catch(error => {
            console.error('Erro ao criar agência: ', error);
        });
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para fazer upload de projeto
function uploadProject() {
    const projectName = document.getElementById('project-name').value;
    const projectCost = document.getElementById('project-cost').value;
    const projectDate = document.getElementById('project-date').value;
    const projectCapacity = document.getElementById('project-capacity').value;
    const projectDescription = document.getElementById('project-description').value;
    const projectPhoto = document.getElementById('project-photo').files[0];
    const user = auth.currentUser;

    if (projectName && projectCost && projectDate && projectCapacity && projectDescription && projectPhoto && user) {
        const reader = new FileReader();
        reader.onloadend = () => {
            db.collection('projects').add({
                name: projectName,
                cost: projectCost,
                date: projectDate,
                capacity: projectCapacity,
                description: projectDescription,
                photo: reader.result,
                userId: user.uid,
                likes: 0,
                comments: []
            }).then(() => {
                alert('Projeto enviado!');
                addXP(user.uid, 10); // Adiciona XP ao usuário
                displayProjects();
            }).catch(error => {
                console.error('Erro ao enviar projeto: ', error);
            });
        };
        reader.readAsDataURL(projectPhoto);
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}


const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
});



// Função para exibir projetos
function displayProjects() {
    const projectsDiv = document.getElementById('projects');
    projectsDiv.innerHTML = ''; // Limpa os projetos atuais

    db.collection('projects').get().then(snapshot => {
        snapshot.forEach(doc => {
            const project = doc.data();
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project';
            projectDiv.innerHTML = `
                <h3>${project.name}</h3>
                <p><strong>Cost:</strong> ${project.cost}</p>
                <p><strong>Date:</strong> ${project.date}</p>
                <p><strong>Capacity:</strong> ${project.capacity}</p>
                <p>${project.description}</p>
                <img src="${project.photo}" alt="${project.name}">
                <button onclick="likeProject('${doc.id}')">Like (${project.likes})</button>
                <div class="comments">
                    <h4>Comments</h4>
                    ${project.comments.map(comment => `<p>${comment}</p>`).join('')}
                    <input type="text" placeholder="Add a comment" id="comment-${doc.id}">
                    <button onclick="addComment('${doc.id}')">Comment</button>
                </div>
            `;
            projectsDiv.appendChild(projectDiv);
        });
    });
}

// Função para adicionar comentário
function addComment(projectId) {
    const commentInput = document.getElementById(`comment-${projectId}`);
    const comment = commentInput.value;
    if (comment) {
        db.collection('projects').doc(projectId).update({
            comments: firebase.firestore.FieldValue.arrayUnion(comment)
        }).then(() => {
            alert('Comentário adicionado!');
            displayProjects();
        }).catch(error => {
            console.error('Erro ao adicionar comentário: ', error);
        });
    }
}

// Função para dar like no projeto
function likeProject(projectId) {
    const user = auth.currentUser;
    if (user) {
        db.collection('projects').doc(projectId).update({
            likes: firebase.firestore.FieldValue.increment(1)
        }).then(() => {
            alert('Você curtiu este projeto!');
            addXP(user.uid, 5); // Adiciona XP ao usuário por curtir
            displayProjects();
        }).catch(error => {
            console.error('Erro ao curtir projeto: ', error);
        });
    }
}

// Função para adicionar XP ao usuário
function addXP(userId, xp) {
    db.collection('users').doc(userId).update({
        xp: firebase.firestore.FieldValue.increment(xp)
    }).then(() => {
        updateRank(userId);
    }).catch(error => {
        console.error('Erro ao adicionar XP: ', error);
    });
}

// Função para atualizar o rank do usuário
function updateRank(userId) {
    db.collection('users').doc(userId).get().then(doc => {
        if (doc.exists) {
            const user = doc.data();
            let newRank = user.rank;
            if (user.xp >= 100) {
                newRank = 'Engenheiro';
            } else if (user.xp >= 200) {
                newRank = 'Cientista';
            } else if (user.xp >= 300) {
                newRank = 'Especialista';
            } else if (user.xp >= 400) {
                newRank = 'Comandante';
            }

            if (newRank !== user.rank) {
                db.collection('users').doc(userId).update({
                    rank: newRank
                }).then(() => {
                    alert(`Você subiu de rank para: ${newRank}`);
                    loadUserProfile(); // Atualiza o perfil do usuário
                }).catch(error => {
                    console.error('Erro ao atualizar rank: ', error);
                });
            }
        }
    });
}

// Função para carregar o perfil do usuário
function loadUserProfile() {
    const user = auth.currentUser;
    if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const userProfile = doc.data();
                document.getElementById('user-profile').innerHTML = `
                    <h3>${userProfile.username}</h3>
                    <p><strong>XP:</strong> ${userProfile.xp}</p>
                    <p><strong>Rank:</strong> ${userProfile.rank}</p>
                `;
            }
        });
    }
}

// Função para abrir o formulário de postagem
function openPostForm() {
    document.getElementById('post-form').style.display = 'block';
}

// Função para alternar o menu lateral
function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    if (sideMenu.style.left === '0px') {
        sideMenu.style.left = '-250px';
    } else {
        sideMenu.style.left = '0px';
    }
}

// Função para logout
function logout() {
    auth.signOut().then(() => {
        alert('Você saiu!');
        window.location.href = "index.html"; // Redireciona para a página inicial
    }).catch(error => {
        console.error('Erro ao sair: ', error);
    });
}