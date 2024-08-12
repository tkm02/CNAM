export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useTokenStore();

  console.log("Middleware activated");
  console.log("authStore.getStatus:", authStore.getStatus);
  
  if (!authStore.getStatus) {
    console.log("User is authenticated, redirecting...");
    return navigateTo('/login');
  }
});
