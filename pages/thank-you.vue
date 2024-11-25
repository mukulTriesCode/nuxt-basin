<template>
    <div class="thankyou">
        <h1>Thank You for <br>Submission</h1>
        <NuxtLink to="/">← Back to home</NuxtLink>
    </div>
</template>

<style lang="scss">
.thankyou {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    h1 {
        text-align: center;
    }

    a {
        font-size: 24px;
        color: black;
        text-decoration: none;
    }
}
</style>