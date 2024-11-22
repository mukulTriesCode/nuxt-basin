<template>
    <form id="myForm" @submit="onSubmit" class="form" method="POST" name="Review_My_Case_Form" ref="ReviewForm"
        data-basin-spam-protection='recaptcha'>
        <!-- Standard Form Fields -->
        <input name="name" type="text" placeholder="Names" />
        <input name="email" type="email" placeholder="Email" />
        <input name="tel" type="tel" placeholder="Phone" />
        <textarea name="message" placeholder="Message" />
        <!-- Hidden Honeypot Field for Spam Prevention -->
        <input name="pageURL" type="hidden" :value="targetURL" />
        <!-- Honeypot -->
        <input type="hidden" name="_gotcha">
        <!-- UTM Parameters -->
        <template v-for="(utm, index) in UtmValues" :key="index">
            <input type="hidden" :name="index" :value="utm" />
        </template>
        <!-- reCaptcha Hidden Field -->
        <RecaptchaV2 />
        <input type="hidden" name="g-recaptcha-response" id="g-recaptcha-response">
        <input type="hidden" name="g-recaptcha-version" value="v2">
        <div class="cta">
            <button type="submit" class="button button--black" ref="submitBtn">{{ data.submitBtnText }}</button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from 'nuxt/app';
import { RecaptchaV2 } from 'vue3-recaptcha-v2';

const route = useRoute();
const config = useRuntimeConfig();
// UTM parameters
const UtmValues = {
    utm_id: route.query?.utm_id,
    utm_source: route.query?.utm_source,
    utm_medium: route.query?.utm_medium,
    utm_campaign: route.query?.utm_campaign,
    utm_content: route.query?.utm_content,
    utm_term: route.query?.utm_term,
};

const targetURL = ref(`${config.public.HOSTNAME}${route.path}`);
// const SITEKEY = '6LfzuIYqAAAAAA5cdWDhmrBONdXfOP2ZlKP7vTbZ'; // reCaptcha v3 site key
const SITEKEY = '6LfR4IYqAAAAAOLgXEXIN1ytBOeJsG3VexonPQ03'; // reCaptcha v2 site key
const data = ref({
    note: 'Secure form. Your information is confidential with us.',
    submitBtnText: 'Review my case'
});

const onSubmit = () => {
    // Add your form submission logic here
    console.log('Form submitted successfully');
    // Reset the form fields
    //...
}

// Load reCaptcha script dynamically
onMounted(() => {
    // Dynamically load reCaptcha script if not already loaded
    if (typeof grecaptcha === 'undefined') {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${SITEKEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            console.log('reCaptcha script loaded successfully');
        };
        document.head.appendChild(script);
    }

    const myForm = document.getElementById('myForm');
    if (myForm) {
        myForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission

            // Ensure grecaptcha is ready before submitting the form
            if (typeof grecaptcha !== 'undefined') {
                grecaptcha.ready(function () {
                    grecaptcha.execute(SITEKEY, { action: 'submit' }).then(function (token) {
                        // Set the token in the hidden field
                        document.getElementById('g-recaptcha-response').value = token;

                        // Now submit the form
                        myForm.submit();
                    }).catch((err) => {
                        console.error('reCaptcha error: ', err);
                        // Handle the error (maybe show a message to the user)
                    });
                });
            } else {
                console.error('reCaptcha is not defined yet!');
            }
        });
    }
});
</script>
