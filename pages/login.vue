<script setup lang="ts">
const username = ref('');
const password = ref('');
let message = 'dfgdsfh';

interface PasswordValidationResult {
    valid: boolean,
    message: string,
}

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

async function Login() {
    const validPassword = validatePassword(password.value);
    if (!validPassword.valid) {
        //message = validPassword.message;
        console.log(message);
        return;
    }
    const valid = await $fetch('/api/login', {
        'method': 'post',
        'body': {
            username: username.value,
            password: password.value
        }
    });

    if (valid.success)
        console.log('成功');
    else
        console.log('失敗');
}

/**Check password legitimacy */
function checkPassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}
</script>

<template>
    <div>
        帳號<input type="text" v-model="username">
        密碼<input type="password" v-model="password">
        <span class="text-red" v-text="message"></span>
        <button @click="Login">登入</button>
    </div>
</template>
  