<template>
  <div class="flex px-2 item-center justify-end text-slate-700 font-semibold text-sm leading-6">
    <div class="flex items-center gap-x-8">
      <NuxtLink class="text-black hover:text-sky-500 cursor-pointer no-underline" to="/login">Log in</NuxtLink>
      <NuxtLink class="text-black hover:text-sky-500 cursor-pointer no-underline" to="/register">Register</NuxtLink>
      <NuxtLink class="text-black hover:text-sky-500 cursor-pointer no-underline" to="/dashboard">Home</NuxtLink>
      <a class="text-black hover:text-sky-500 cursor-pointer no-underline" href="#" @click="logout">Log out</a>
    </div>
  </div>
</template>

<style scoped></style>
<script lang="ts" setup>
const env_value = useRuntimeConfig();

async function logout() {
  const response = await $fetch('/api/logout', {
    'method': 'post',
  });
  console.log(response)
  if (response.success)
    window.location.href = response.data.url;
} 
</script>