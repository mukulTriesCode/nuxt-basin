<template>
    <div class="container">
        <form id="myForm" @submit="onSubmit" class="form" method="POST" name="Review_My_Case_Form" ref="ReviewForm"
            data-basin-spam-protection='recaptcha'>
            <!-- Standard Form Fields -->
            <input name="name" type="text" placeholder="Name" />
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
            <div ref="recaptchaRef" class="g-recaptcha" data-sitekey="6Lew3SMUAAAAAJ82QoS7gqOTkRI_dhYrFy1f7Sqy"></div>
            <div class="cta">
                <button type="submit" class="button button--black" ref="submitBtn">{{ data.submitBtnText }}</button>
            </div>
        </form>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeConfig } from 'nuxt/app';
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
    const captchaResponse = recaptchaRef.value?.querySelector('textarea.g-recaptcha-response');
    if (captchaResponse && captchaResponse.value) {

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
            const redirectionURL = '/thank-you';
            setTimeout(() => location.assign(redirectionURL), 100);
            document.getElementById('myForm').reset();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    } else {
        console.log('captchaResponse is empty or does not exist, not submitting form');
        console.log('captchaResponse.value', captchaResponse.value)
    }
}
</script>
<style lang="scss">
.container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
form {
    background-color: #f2f2f2;
    max-width: 350px;
    padding: 50px;
    margin: 0 auto;

    .inputs {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        label {
            font-weight: bold;
            margin-bottom: 5px;
        }

        input,
        textarea {
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
        }
    }

    input,
    textarea,
    button {
        width: -webkit-fill-available;
        padding: 10px;
        margin-bottom: 10px;
    }

    .g-recaptcha {
        margin-bottom: 10px;
    }
}
</style>