// module.exports = [
//   'strapi::logger',
//   'strapi::errors',
//   'strapi::security',
//   'strapi::cors',
//   'strapi::poweredBy',
//   'strapi::query',
//   'strapi::body',
//   'strapi::session',
//   'strapi::favicon',
//   'strapi::public',
//   {
//     name: 'strapi::security',
//     config: {
//       contentSecurityPolicy: {
//         useDefaults: true,
//         directives: {
//           'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io', 'https://storage.googleapis.com', 'https://storage.googleapis.com/tt-media/', 'https://*.storage.googleapis.com', 'https://storage.googleapis.com/tt-media/*','https://backend.traveltailor.in', 'https://traveltailor.in'],
//         },
//       },
//     },
//     name: 'strapi::cors',
//     config: {
//       origin: ['https://traveltailor.in'],
//     }
//   }
// ];


module.exports = [
  'strapi::logger',
  'strapi::errors',
  { // This object configures the strapi::security middleware
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://market-assets.strapi.io', // Keep if needed for Strapi marketplace assets
            'https://storage.googleapis.com', // Base Google Cloud Storage domain
            'https://*.storage.googleapis.com', // Allows images from any bucket using virtual hosted style URLs
            // If you use path-style URLs (storage.googleapis.com/[BUCKET_NAME]/...),
            // 'https://storage.googleapis.com' should be sufficient, but you can be more specific if needed:
            // 'https://storage.googleapis.com/[YOUR_BUCKET_NAME]/', // Replace with your actual bucket name
            'https://backend.traveltailor.in', // Your backend domain
            'https://traveltailor.in', // Your frontend domain
          ],
          // Add other directives as needed (e.g., 'script-src', 'connect-src')
        },
      },
    },
  },
  { // This object configures the strapi::cors middleware
    name: 'strapi::cors',
    config: {
      origin: ['https://traveltailor.in', 'https://backend.traveltailor.in'], // Include both frontend and backend if necessary
      headers: '*', // Or specify allowed headers
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'], // Or specify allowed methods
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];