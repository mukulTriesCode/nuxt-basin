<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from 'nuxt/app';
import { RecaptchaV2 } from 'vue3-recaptcha-v2';
import * as Yup from 'yup';

const route = useRoute();
const config = useRuntimeConfig();

const recaptchaRef = ref(null);

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
const SITEKEY = '6Ley44YqAAAAACGTSLIgfgUqLswCe-tSmkSsYAuN'; // reCaptcha v2 site key
const data = ref({
    note: 'Secure form. Your information is confidential with us.',
    submitBtnText: 'Review my case'
});

const formSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    tel: Yup.string().required('Phone is required'),
    message: Yup.string().required('Message is required'),
});

const onSubmit = async (e) => {
    // Add your form submission logic here
    e.preventDefault();
    const captchaResponse = recaptchaRef.value?.value;
    if (!captchaResponse) {
        console.error('Captcha is required');
        return;
    }
    try {
        const formData = new FormData(document.getElementById('myForm'));
        const formValues = Object.fromEntries(formData.entries());
        const isValid = await formSchema.validate(formValues, { abortEarly: false });
        if (!isValid) {
            console.error('Form validation failed');
            return;
        }
        const response = await fetch('https://usebasin.com/f/2d02e5938cc2', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Failed to submit form');
        }
        console.log('Form submitted successfully');
        // Reset the form fields
        document.getElementById('myForm').reset();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
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
});
</script>


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
        <RecaptchaV2 ref="recaptchaRef" />
        <input type="hidden" name="g-recaptcha-response" id="g-recaptcha-response">
        <input type="hidden" name="g-recaptcha-version" value="v2">
        <div class="cta">
            <button type="submit" class="button button--black" ref="submitBtn">{{ data.submitBtnText }}</button>
        </div>
    </form>
</template>
