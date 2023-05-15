<script setup lang="ts">
const username = ref('');
const password = ref('');
const password2 = ref('');
const message = ref('');
const message2 = ref('');

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

async function register() {
    const validPassword = validatePassword(password.value);
    if (!validPassword.valid) {
        message.value = validPassword.message;
        return;
    }
    if (password2 != password){
        message2.value = 'Passwords are not the same';
    }
    const valid = await $fetch('/api/register', {
        'method': 'post',
        'body': {
            username: username.value,
            password: password.value
        }
    });

    /*if (valid.success)
        console.log('成功');
    else
        console.log('失敗');*/
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
        <span class="text-red">{{ message }}</span>
        再次密碼<input type="password" v-model="password2">
        <span class="text-red">{{ message2 }}</span>
        <button @click="register">確定</button>
    </div>
</template>
  