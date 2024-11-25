<template>
    <h1>Vue Contact Form</h1>
    <!-- <form action="https://usebasin.com/f/a5c44fd9a9f1" method="POST"> -->
    <form action="https://usebasin.com/f/3e479e56bd1f" method="POST">
        <div class="inputs">
            <label for="name">Name </label>
            <input type="text" name="name" id="name" required />
        </div>
        <div class="inputs">
            <label for="email">Email </label>
            <input type="email" name="email" id="email" required />
        </div>
        <div class="inputs">
            <label for="message">Leave a Message </label>
            <textarea id="message" name="message" rows="5" cols="33"></textarea>
        </div>
        <div class="inputs">
            <button type="submit">Submit</button>
        </div>
    </form>
</template>

