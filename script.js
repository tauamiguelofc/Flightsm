import firebase from 'firebase/app';
import 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';

// Firebase Configuration 
// (copie a configuração do Firebase do login.js)
const firebaseConfig = {
  // ... sua configuração do Firebase ...
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Funções para interagir com o Twitter em pequena escala

// Função para carregar os tweets do Firebase
function carregarTweets() {
  const feed = document.getElementById('feed');
  feed.innerHTML = ''; 

  const q = query(collection(db, 'tweets'), orderBy('data', 'desc'));

  getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Renderiza cada tweet no feed
        const tweet = doc.data();
        const tweetElement = `
          <div class="tweet">
            <div class="user">
              <img src="https://via.placeholder.com/40" alt="Foto do Usuário" class="profile-pic">
              <div>
                <h3>Nome do Usuário</h3>
                <p>@nome_de_usuario</p>
              </div>
            </div>
            <div class="content">
              <p>${tweet.texto}</p>
            </div>
            <div class="actions">
              <button class="like">Curtir</button>
              <button class="retweet">Retweetar</button>
              <button class="comment">Comentar</button>
              <button class="share">Compartilhar</button>
            </div>
          </div>
        `;
        feed.innerHTML += tweetElement;
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar tweets: ", error);
    });
}

// Adicione eventos para botões e interações
document.getElementById("tweet-button").addEventListener("click", tweetar);

// Carregue os tweets ao iniciar
carregarTweets();

// Adicione eventos para o botão "Perfil" (perfil)
document.getElementById("profile-button").addEventListener("click", () => {
  // Implemente a lógica para exibir o perfil do usuário
  // Por exemplo, você pode redirecionar para outra página ou mostrar um modal
  console.log("Botão de perfil clicado");
});

// Função para tweetar
function tweetar() {
  const tweetText = document.getElementById("tweet-text").value;
  addDoc(collection(db, 'tweets'), {
    texto: tweetText,
    usuario: auth.currentUser.uid, 
    data: serverTimestamp() 
  })
  .then(() => {
    document.getElementById("tweet-text").value = '';
    carregarTweets();
  })
  .catch((error) => {
    console.error("Erro ao salvar tweet: ", error);
  });
}