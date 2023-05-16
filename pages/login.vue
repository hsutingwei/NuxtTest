<template>
    <div>
        <ClientOnly>
            <GoogleLogin :callback="callback" />
        </ClientOnly>
    </div>
</template>
  
<script setup lang="ts">
const callback = (response) => {
    console.log('sdfsdagadh13221f===========');
    console.log(response);
}
</script>