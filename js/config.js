/* ==========================================================
   CUP2EAT – Editable site settings
   Change values here; no other file needs editing for contact info.
   ========================================================== */
window.CUP2EAT_CONFIG = {
  brandName: "CUP2EAT",
  tagline: "Eat Your Drink.",
  founder: "Varun Khera",

  // DEMO VALUES: phone and email below are fake placeholders for the client demo.
  // Replace with CUP2EAT's real details before going live.
  contact: {
    phoneDisplay: "+91 00000 00000",
    phoneTel: "+910000000000",
    // WhatsApp number: country code + number, digits only, no "+"
    whatsappNumber: "910000000000",
    email: "demo@example.com",
    instagramUrl: "https://www.instagram.com/cup2eat/",
    instagramHandle: "@cup2eat"
  },

  // Prefilled text for the WhatsApp buttons
  whatsappMessage:
    "Hello CUP2EAT! I found your website and would like to enquire about your edible cups.",

  // Enquiry form delivery.
  // Leave "" until connected. Paste a Formspree endpoint such as
  // "https://formspree.io/f/xxxxxxx" to receive submissions by email.
  // While empty, the form does NOT claim to have sent anything:
  // it opens WhatsApp with the filled-in details instead.
  formEndpoint: "",

  // Intro popup. Only shown when enabled = true AND a real offer is written.
  offer: {
    // Welcome popup (no discount or offer is claimed). Edit the text, or set enabled:false to hide it.
    enabled: true,
    title: "Welcome to CUP2EAT",
    text: "Eat Your Drink. Looking for edible cups for your café, event or brand? Send us an enquiry and we'll get back to you.",
    buttonLabel: "Enquire Now",
    delayMs: 4000
  },

  // Set to an array of { quote, name } objects ONLY with genuine, permitted reviews.
  // While empty, the site shows the "Have You Tried CUP2EAT?" section instead.
  testimonials: []
};
