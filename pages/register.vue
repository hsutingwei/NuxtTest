<template>
    <div>
        帳號<input type="text" v-model="username">
        密碼<input type="password" v-model="password">
        <span class="text-red">{{ message }}</span>
        再次密碼<input type="password" v-model="password2">
        <button @click="register">確定</button>
    </div>
</template>

<script setup lang="ts">
import { PasswordValidationResult } from '~/type'
const username = ref('');
const password = ref('');
const password2 = ref('');
const message = ref('');

function validatePassword(password: string): PasswordValidationResult {
    if (password.length < 8) {
        return {
            valid: false,
            message: 'Password should contain at least 8 characters.'
        };
    }
    if (!/[a-z]/.test(password)) {
        return {
            valid: false,
            message: 'Password should contain at least one lowercase character.'
        };
    }
    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            message: 'Password should contain at least one uppercase character.'
        };
    }
    if (!/\d/.test(password)) {
        return {
            valid: false,
            message: 'Password should contain at least one digit character.'
        };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return {
            valid: false,
            message: 'Password should contain at least one special character.'
        };
    }
    return { valid: true, message: '' };
}

async function register() {
    const validPassword = validatePassword(password.value);
    console.log(password.value);
    console.log(password2.value);
    if (password2.value != password.value) {
        message.value = 'Passwords are not the same';
        return;
    }
    if (!validPassword.valid) {
        message.value = validPassword.message;
        return;
    }
    const valid = await $fetch('/api/register', {
        'method': 'post',
        'body': {
            username: username.value,
            password: password.value
        }
    });

    if (valid.success)
        alert('新增成功');
    else
        alert(valid.data?.message);
}

</script>