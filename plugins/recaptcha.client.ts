import { install } from "vue3-recaptcha-v2";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(install, {
    sitekey: "6Ley44YqAAAAACGTSLIgfgUqLswCe-tSmkSsYAuN",
    cnDomains: false,
  });
});