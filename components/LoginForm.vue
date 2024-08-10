<script setup lang="ts">
import { ref } from 'vue';

// Variables pour stocker les valeurs de username et password
const username = ref('');
const password = ref('');

// Fonction pour gérer la soumission du formulaire
const handleLogin = () => {
  console.log('Username:', username.value);
  console.log('Password:', password.value);
  
  // Logique d'authentification à ajouter ici, par exemple appeler une API
};
</script>

<template>
  <div class="login-container">
    <h1 class="title">Connexion</h1>
    
    <!-- Champ pour le nom d'utilisateur -->
    <div class="form-group">
      <label for="username">Nom d'utilisateur</label>
      <UInput v-model="username" id="username" placeholder="Entrez votre nom d'utilisateur" />
    </div>
    
    <!-- Champ pour le mot de passe -->
    <div class="form-group">
      <label for="password">Mot de passe</label>
      <UInput v-model="password" id="password" type="password" placeholder="Entrez votre mot de passe" />
    </div>
    
    <!-- Bouton de soumission -->
    <div class="form-group">
      <UButton @click="handleLogin" class="login-button" color="primary">Se connecter</UButton>
    </div>
  </div>
</template>

<style scoped>
/* Styles globaux */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f4f8;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Container du formulaire de connexion */
.login-container {
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 60px;
}

/* Titre du formulaire */
.title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333333;
}

/* Styles pour chaque groupe de formulaire */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #555555;
}

/* Styles pour les champs d'entrée */
.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.form-group input:focus {
  background-color: #fff;
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
}

/* Bouton de soumission avec effet de survol */
.login-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  background-color: #4CAF50;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #40c644;
}

/* Styles pour les effets de transition */
.form-group input, .login-button {
  transition: all 0.3s ease;
}
</style>
