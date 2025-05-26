// module.exports = ({env}) => ({
//     "seo": {
//         "enable": true,
//     }
// });


module.exports = ({ env }) => {
    // Check if GCS environment variables are set
    const gcsEnabled = env('GCS_BUCKET_NAME') && env('GCS_SERVICE_ACCOUNT_BASE64');
  
    if (!gcsEnabled) {
      // If GCS is not configured, Strapi will use the default local provider
      console.warn('Google Cloud Storage environment variables not set. Using default local upload provider.');
      return {
        // Make sure to return an empty object or default config if needed
        upload: {
          config: {
            provider: 'local', // Explicitly use local if GCS is not set up
            providerOptions: {},
          },
        },
      };
    }
  
    // Decode the Base64 service account key
    let serviceAccountJson;
    try {
      const base64String = env('GCS_SERVICE_ACCOUNT_BASE64');
      if (!base64String) throw new Error('GCS_SERVICE_ACCOUNT_BASE64 is not set.');
      const decodedString = Buffer.from(base64String, 'base64').toString('utf-8');
      serviceAccountJson = JSON.parse(decodedString);
    } catch (error) {
      console.error('Error parsing GCS Service Account Key (check GCS_SERVICE_ACCOUNT_BASE64 in .env):', error.message);
      // Fallback to local provider or throw an error if GCS is mandatory
      return {
        upload: {
          config: { provider: 'local', providerOptions: {} },
        },
      };
    }
  
    return {
      upload: {
        config: {
          provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
          providerOptions: {
            bucketName: env('GCS_BUCKET_NAME'),
            publicFiles: true, // Default to true if var not set
            uniform: false,   // Default to true if var not set
            serviceAccount: serviceAccountJson, // Use the parsed JSON object
            baseUrl: env('GCS_BASE_URL', `https://storage.googleapis.com/${env('GCS_BUCKET_NAME')}`), // Default base URL
            // Optional: Set custom host for the GCS API endpoint if needed
            // host: 'https://storage.googleapis.com',
            // Optional: Set parameters to pass to GCS upload stream (e.g., cache control)
            // params: {
            //   cacheControl: 'public, max-age=31536000, immutable',
            // },
          },
        },
      },
      "seo": {
        "enable": true,
      },
      "tinymce": {
        "enable": true,
         config: {
            editor: {
                outputFormat: "html",
                editorConfig: {
                    height: 500,
                    menubar: false,
                    extended_valid_elements: "span, img, small",
                    forced_root_block: "",
                    convert_urls: false,
                    entity_encoding: "raw",
                    plugins:
                        "advlist autolink lists link image charmap preview anchor \
                        searchreplace visualblocks code fullscreen table emoticons nonbreaking \
                        insertdatetime media table code help wordcount",
                    toolbar:
                        "undo redo | styles | bold italic | bullist numlist \
                        alignleft aligncenter alignright alignjustify | \
                        media table emoticons visualblocks code|\
                        nonbreaking outdent indent | removeformat | help",
                    style_formats: [
                        {
                            title: "Headings",
                            items: [
                                { title: "Heading 2", block: "h2" },
                                { title: "Heading 3", block: "h3" },
                                { title: "Heading 4", block: "h4" },
                                { title: "Heading 5", block: "h5" },
                                { title: "Heading 6", block: "h6" },
                            ],
                        },

                        {
                            title: "Text",
                            items: [
                                { title: "Paragraph", block: "p" },
                                {
                                    title: "Paragraph with small letters",
                                    block: "small",
                                },
                            ],
                        },
                    ],
                },
            },
        }
      }
    };
  };