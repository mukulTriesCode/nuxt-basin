<template>


    <form action="https://usebasin.com/f/2d02e5938cc2" method="POST" enctype="multipart/form-data" id="form">
        <label for="name">Name</label>
        <input type="text" name="name" />
        <label for="email">Email</label>
        <input type="email" name="email" required />
        <label for="message">Message</label>
        <textarea name="message"></textarea>
        <label for="checkbox1">Checkbox</label>
        <input type="checkbox" name="checkbox1" />
        <label for="checkbox2">Checkbox</label>
        <input type="checkbox" name="checkbox2" />
        <label for="radio1">Radio1</label>
        <input id="radio1" type="radio" name="radio" value="radio1" checked />
        <label for="radio2">Radio2</label>
        <input id="radio2" type="radio" name="radio" value="radio2" />
        <label for="file-upload">File Upload</label>
        <input type="file" name="file-upload" />
        <button type="submit">Send</button>
    </form>


</template>