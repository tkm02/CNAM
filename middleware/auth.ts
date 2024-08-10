export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useTokenStore();

  if (authStore.getStatus) {
    console.log(authStore.getToken);
    return navigateTo("/");
  }
});
