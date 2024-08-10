export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useTokenStore();

  if (!authStore.getStatus) {
    return navigateTo("/login");
  }
});
