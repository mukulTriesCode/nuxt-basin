<template>
    <form id="myForm" class="form" method="POST" name="Review_My_Case_Form" ref="ReviewForm"
        action="https://usebasin.com/f/2d02e5938cc2" data-basin-spam-protection='recaptcha'>
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
        <!-- reCaptcha -->
        <input type="hidden" name="g-recaptcha-response" id="g-recaptcha-response">
        <input type="hidden" name="g-recaptcha-version" value="v3">
        <!-- <div class="g-recaptcha" ref="recaptchaRef" :data-sitekey="SITEKEY"></div> -->
        <div class="cta">
            <button type="submit" class="button button--black" ref="submitBtn">{{ data.submitBtnText }}</button>
        </div>
    </form>
</template>
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from 'nuxt/app';

const route = useRoute();
const config = useRuntimeConfig();
const UtmValues = {
    utm_id: route.query?.utm_id,
    utm_source: route.query?.utm_source,
    utm_medium: route.query?.utm_medium,
    utm_campaign: route.query?.utm_campaign,
    utm_content: route.query?.utm_content,
    utm_term: route.query?.utm_term,
};
const targetURL = ref(`${config.public.HOSTNAME}${route.path}`);
const SITEKEY = '6LfzuIYqAAAAAA5cdWDhmrBONdXfOP2ZlKP7vTbZ';
const ReviewForm = ref(null);
const recaptchaRef = ref(null);
const submitBtn = ref(null);
const recaptchaValidation = ref(false);
const data = ref({
    note: 'Secure form. Your information is confidential with us.',
    submitBtnText: 'Review my case'
});

onMounted(() => {
    const myForm = document.getElementById('myForm');
    if (myForm) {
        myForm.addEventListener('submit', function (event) {
            event.preventDefault();

            grecaptcha.ready(function () {
                grecaptcha.execute(SITEKEY, { action: 'submit' }).then(function (token) {
                    document.getElementById('g-recaptcha-response').value = token;
                    myForm.submit();
                });
            });
        });
    }
});
</script>