const { transformEntities } = require('../../../../libs/transformCards.js');
const { transformTour } = require('../../../../libs/transformTour.js');
const { transformDestination } = require('../../../../libs/transformDestination.js');
const { transformMonth } = require('../../../../libs/transformMonth.js');
const { destination } = require('../controllers/apihome.js');
const { transformExperience } = require('../../../../libs/transformExperience.js');
const { transformDestinationList, transformExperienceList, transformTourList, transformMonthList, transformBlogList } = require('../../../../libs/transformLists.js');
const { serchCardBlog, serchCardDestination, serchCardExperience, serchCardTour } = require('../../../../libs/transformSearch.js');
const { transformCampaign } = require('../../../../libs/transformCampaign.js');
const { transformBlog } = require('../../../../libs/transformBlog.js');

const DEFAULT_IMAGE = '/uploads/failed_bc13306774.png';

module.exports = {
    async getHero() {
        // Fetch hero documents with heroSlide populated
        const heroDocuments = await strapi.documents("api::hero.hero").findMany({
            populate: {
                heroSlide: {
                    fields: ['title', 'description', 'CTA'],
                    populate: {
                        destination: {
                            fields: ['slug']
                        },
                        tour: {
                            fields: ['slug']
                        },
                        experience: {
                            fields: ['slug']
                        },
                        blog: {
                            fields: ['slug']
                        },
                        month: {
                            fields: ['month']
                        },
                        heroImg: "*",
                    }
                }
            },
        });

        // Flatten all heroSlide arrays into a single array, defaulting to empty array if heroSlide is missing
        const allSlides = heroDocuments.flatMap(hero => hero.heroSlide || []);
        const getUrl = (slide) => {

            if (slide.tour?.slug) {
                return `/tours/${slide.tour.slug}`;
            } else if (slide.destination?.slug) {
                return `/destinations/${slide.destination.slug}`;
            } else if (slide.experience?.slug) {
                return `/experiences/${slide.experience?.slug}`;
            } else if (slide.blog?.slug) {
                return `/blogs/${slide.blog?.slug}`;
            } else if (slide.month?.month) {
                const lowerCaseMonth = slide.month.month;
                return `/calendar/${lowerCaseMonth.charAt(0).toUpperCase() + lowerCaseMonth.slice(1)}`;
            } else {
                return '/';
            }

        }

        // Map each slide to the desired format
        const result = allSlides.map(slide => ({
            title: slide.title,
            description: slide.description,
            imgUrl: slide.heroImg?.url || DEFAULT_IMAGE,
            url: getUrl(slide),
            CTA: slide.CTA || 'Explore'
        }));

        return result;
    },

    async getFeatured() {

        const featured = await strapi.documents("api::featured.featured").findMany({
            populate: {
                blogs: {
                    populate: "*"
                },
                destinations: {
                    populate: "*"
                },
                experiences: {
                    populate: "*"
                },
                tours: {
                    populate: "*"
                },
                traveller: {
                    populate: "*"
                }
            },
        });
    
        if (!featured) {
            throw new Error("Featured document not found.");
        }
    
        const response = {
            blogs: featured[0]?.blogs ? transformEntities(featured[0].blogs, 'blogs') : [],
            destinations: featured[0]?.destinations ? transformEntities(featured[0].destinations, 'destinations') : [],
            experiences: featured[0]?.experiences ? transformEntities(featured[0].experiences, 'experiences') : [],
            tours: featured[0]?.tours ? transformEntities(featured[0].tours, 'tours') : [],
            traveller: featured[0]?.traveller ? transformEntities(featured[0].traveller, 'experiences') : [],
        };

        return response;
    },

    async getMonths() {
        const months = await strapi.documents("api::month.month").findMany({
            populate: "*",
        });

        const response = {
            months: transformEntities(months, 'months')
        };

        // sort months like january, february, march ans so on
        response.months.sort((a, b) => {
            const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
        });

        return response;
    },

    async getReviews() {
        // const reviews = await strapi.documents("api::review.review").findMany({
        //     populate: "*",
        // });

        // const response = {
        //     reviews: reviews[0]?.review ? transformEntities(reviews[0].review, 'reviews') : []
        // };

        const testimonials = await strapi.documents("api::testimonial.testimonial").findMany({
            populate: {
                review: {
                    populate: "*"
                }
            },
        });

        console.log(testimonials[0].review, "testimonials");
        

        // const response = testimonials[0]?.review ? transformEntities(testimonials[0].review, 'reviews') : [];

        const response = {
            reviews: testimonials[0]?.review ? transformEntities(testimonials[0].review, 'reviews') : []
        };
        

        return response;
    },

    async getMoments() {
        const moments = await strapi.documents("api::moment.moment").findMany({
            populate: {
                moments: {
                    populate: {
                        img: {
                            populate: "*"
                        }
                    }
                },
            },
        });

        const response = {
            moments: moments[0]?.moments ? transformEntities(moments[0].moments, 'moments') : []
        };
        

        return response;
    },

    //Tours API
    async getTour(slug) {
        
        const tour = await strapi.documents("api::tour.tour").findFirst({
            populate: {
            displayImg: {
                populate: "*"
            },
            feturedPlaces: {
                populate: "*"
            },
            priceTime: {
                populate: "*"
            },
            days: {
                populate: "*"
            },
            inclusions: {
                populate: "*"
            },
            moments: {
                populate: "*"
            },
            blogs: {
                populate: "*"
            },
            experiences: {
                populate: "*"
            },
            tagMonths: {
                populate: "*"
            },
            spotlights: {
                populate: "*"
            },
            tours: {
                populate: "*"
            },
         },

            filters: {
                slug: slug
            }
        });

        if (!tour) {
            throw new Error("Tour not found.");
        }

        
        return {
            ...transformTour(tour),
            blogs: transformEntities(tour.blogs, 'blogs'),
            tours: transformEntities(tour.tours, 'tours'),
        };
    },

    //Destinations API
    async getDestination(slug) {
        const destination = await strapi.documents("api::destination.destination").findFirst({
            
            populate: {

                highlight: {
                    populate: "*"
                },
                heroImg: {
                    populate: "*"
                },
                experiences: {
                    populate: "*"
                },
                spotlights: {
                    populate: "*"
                },
                blogs: {
                    populate: "*"
                },
                tours: {
                    populate: "*"
                },
                displayImg: {
                    fields: ["url"]
                }

            },

            filters: {
                slug: slug
            },
        });

        if (!destination) {
            throw new Error("Destination not found.");
        }

        return {
            ...transformDestination(destination),
            tours: transformEntities(destination.tours, 'tours'),
            spotlights: transformEntities(destination.spotlights, 'spotlights'),
            blogs: transformEntities(destination.blogs, 'blogs'),
            experiences: transformEntities(destination.experiences, 'experiences')
        };
    },

    //Month API
    async getMonth(month) {
        
        const monthDoc = await strapi.documents("api::month.month").findFirst({
            populate: {
                heroImg: {
                    populate: "*"
                },
                tagExperiences: {
                    populate: "*"
                },
                tagBlogs: {
                    populate: "*"
                },
                tagTours: {
                    populate: "*"
                },
                highlight: {
                    populate: "*"
                },
                tagDestinations: {
                    populate: "*"
                },
            },
            filters: {
                month: month
            }
        });

        if (!monthDoc) {
            throw new Error("Month not found.");
        }

        return {
            ...transformMonth(monthDoc),
            tours: transformEntities(monthDoc.tagTours, 'tours'),
            experiences: transformEntities(monthDoc.tagExperiences, 'experiences'),
            blogs: transformEntities(monthDoc.tagBlogs, 'blogs'),
            destinations: transformEntities(monthDoc.tagDestinations, 'destinations')
        };
    },

    //Experience API
    async getExperience(slug) {
        const experienceDoc = await strapi.documents("api::experience.experience").findFirst({
            populate: {
                heroImg: {
                    populate: "*"
                },
                blogs: {
                    populate: "*"
                },
                destinations: {
                    populate: "*"
                },
                spotlights: {
                    populate: "*"
                },
                highlight: {
                    populate: "*"
                },
            },
            filters: {
                slug: slug
            }
        });
        if (!experienceDoc){
            throw new Error("Experience not found.");
        }
        return {
            ...transformExperience(experienceDoc),
            destinations: transformEntities(experienceDoc.destinations, 'destinations'),
            spotlights: transformEntities(experienceDoc.spotlights, 'spotlights'),
            blogs: transformEntities(experienceDoc.blogs, 'blogs'),
        }
    },

    async getSlugs(type) {
        const allowedTypes = ['destination', 'tour', 'experience', 'month', 'blog'];
        if (!allowedTypes.includes(type)) {
            throw new Error(`Invalid type provided: "${type}"`);
        }
    
        let docs; 
        const fieldToFetch = type === 'month' ? 'month' : 'slug'; // Determine the field name
    
        try {
            // Single API call using the determined field
            docs = await strapi.documents(`api::${type}.${type}`).findMany({
                fields: [fieldToFetch, 'updatedAt'],
            });
    

            if (!docs) {
               console.warn(`No documents found for type: ${type}`);
               return []; // Return empty array if nothing found
            }
    

            const slugs = docs.map((doc) => ({
                slug: doc[fieldToFetch],
                updatedAt: doc.updatedAt
            }));
    
            return slugs;
    
        } catch (error) { 
            console.error(`Failed to load slugs for type: ${type}. Original error:`, error); // Log original error
            // Re-throw a more informative error or handle it as needed
            throw new Error(`Failed to load slugs for type "${type}". Reason: ${error.message}`);
        }
    },

    async getListDestination() {
        const listDestination = await strapi.documents("api::list-destination.list-destination").findMany({
            populate: {
                group: {
                    populate: {
                        destinations: {
                            fields: ["title", "slug"], 
                            populate: {
                                displayImg: "*"
                            }
                        }
                    }
                }
            },
        });

        if (!listDestination) {
            throw new Error("List destination not found.");
        }

        return {
            list: transformDestinationList(listDestination)
        };
    },

    async getListExperience() {
        const listExperience = await strapi.documents("api::list-experience.list-experience").findMany({
            populate: {
                group: {
                    populate: {
                        experiences: {
                            fields: ["title", "slug"], 
                            populate: {
                                heroImg: "*"
                            }
                        }
                    }
                }
            },
        });

        if (!listExperience) {
            throw new Error("List experience not found.");
        }

        return {
            list: transformExperienceList(listExperience)
        };
    },

    async getListTour() {
        const listTour = await strapi.documents("api::list-tour.list-tour").findMany({
            populate: {
                group: {
                    populate: {
                        tours: {
                            fields: ["title", "slug"], 
                            populate: {
                                displayImg: "*"
                            }
                        }
                    }
                }
            },
        });

        if (!listTour) {
            throw new Error("List tour not found.");
        }
        return {
            list: transformTourList(listTour)
        };
    },

    async getListMonths() {
        const listMonths = await strapi.documents('api::month.month').findMany({
            limit: 12,
            populate: {
                displayImg: "*",
                fields: ["month"]
            },
            status: 'published'
        });
        
        if (!listMonths) {
            throw new Error("List months not found.");
        }
        return {
            list: transformMonthList(listMonths)
        };
    },

    async getListBlogs() {
        const listBlogs = await strapi.documents("api::category.category").findMany({
            populate: {
                fields: ["tag", "description"],
                blogs: {
                    populate: {
                        fields: ["title", "slug", "description"],
                        displayImg: "*"
                    }
                }
            },
        });
    
        if (!listBlogs) {
            throw new Error("List blogs not found.");
        }
        return {
            list: transformBlogList(listBlogs),
        };
    },



    async getSearch(query) {

        // regex to validate query
        const queryRegex = /^[a-zA-Z0-9\s]+$/;
        if (!query || typeof query !== 'string' || !queryRegex.test(query)) {
            ctx.throw(400, "Search query is required and must be a string.");
        }

        const searchFilter = { title: { $containsi: query } };

        try {
            const rawBlogs = await strapi.documents("api::blog.blog").findMany({
                filters: searchFilter,
                fields: ["title", "slug"],
                populate: { displayImg: {
                    fields: ["url"]
                } },
                limit: 8
            });

            const rawDestinations = await strapi.documents("api::destination.destination").findMany({
                filters: searchFilter,
                fields: ["title", "slug"],
                populate: { displayImg: {
                    fields: ["url"]
                } },
                limit: 8
            });

            const rawExperiences = await strapi.documents("api::experience.experience").findMany({
                filters: searchFilter,
                fields: ["title", "slug"],
                populate: { heroImg: {
                    fields: ["url"]
                } },
                limit: 8
            });

            const rawTours = await strapi.documents("api::tour.tour").findMany({
                filters: searchFilter,
                fields: ["title", "slug"],
                populate: { displayImg: {
                    fields: ["url"]
                } },
                limit: 8
            });

            const response = {
                blogs: transformEntities(rawBlogs, 'blogs'),
                destinations: transformEntities(rawDestinations, 'destinations'),
                experiences: transformEntities(rawExperiences, 'experiences'),
                tours: transformEntities(rawTours, 'tours'),
            };

            return response;
        } catch (error) {
            ctx.throw(500, "Failed to load search.");
        }
    },

    async createLead(name, email, contact, countryCode, month, year, duration, people, budget, comment, source) {

        try {
            // Create the lead entry in the database
            const lead = await strapi.documents("api::lead.lead").create({
                data: {
                    name,
                    email,
                    contact: contact? parseInt(contact) : 888888888,
                    countryCode,
                    month,
                    year: year? parseInt(year) : 2025,
                    duration,
                    people: parseFloat(people),
                    budget: budget? parseFloat(budget) : 0,
                    comment,
                    source,
                    publishedAt: new Date(),
                }
            });

            // Return the created lead (or just a success message if preferred)
            response = {
                message: "Lead created successfully",
                id: lead.id,
                documentId: lead.documentId
            };


            // --- Build the HTML Content Dynamically ---

            // Helper function to format contact number nicely
            const formatContact = (code, number) => {
                if (!number) return ''; // If no number, return empty string
                return `${code ? code + ' ' : ''}${number}`; // Add code if it exists
            }
            
            // Helper function to format date nicely
            const formatTravelDate = (m, y) => {
                if (!m && !y) return '';
                let parts = [];
                if (m) parts.push(m);
                if (y) parts.push(y);
                return parts.join(' / ');
            }
            
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Website Submission</title>
                <style>
                                /* Basic Reset & Body Styling */
                body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f7f6; }
                /* Container */
                .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;}
                /* Header */
                .header { background-color: #D35400; /* Rich Orange */ color: #ffffff; padding: 25px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 500; }
                /* Content Area */
                .content { padding: 30px; }
                .content h2 { font-size: 20px; color: #D35400; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;}
                /* Data Table */
                .data-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                .data-table th, .data-table td { text-align: left; padding: 12px 0; border-bottom: 1px solid #eeeeee; vertical-align: top; }
                .data-table th { color: #555555; font-weight: 600; width: 120px; /* Fixed width for labels */ }
                .data-table td { color: #333333; }
                /* Comment Section */
                .comment-section { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D35400; border-radius: 4px; }
                .comment-label { font-weight: 600; color: #D35400; margin-bottom: 8px; display: block; font-size: 16px;}
                .comment-text { margin: 0; color: #555; white-space: pre-wrap; /* Preserve line breaks */ word-wrap: break-word;}
                /* Footer */
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f4f7f6;}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Website Enquiry</h1>
                    </div>
                    <div class="content">
                        <h2>Submitter Details</h2>
                        <table class="data-table">
                            ${name ? `<tr><th>Name</th><td>${name}</td></tr>` : ''}
                            ${email ? `<tr><th>Email</th><td><a href="mailto:${email}" style="color: #4A90E2; text-decoration: none;">${email}</a></td></tr>` : ''}
                            ${contact ? `<tr><th>Contact</th><td>${formatContact(countryCode, contact)}</td></tr>` : ''}
                        </table>
            
                        ${month || year || duration || people || budget ? `<h2>Request Details</h2>` : ''}
                        <table class="data-table">
                            ${month || year ? `<tr><th>Travel Time</th><td>${formatTravelDate(month, year)}</td></tr>` : ''}
                            ${duration ? `<tr><th>Duration</th><td>${duration}</td></tr>` : ''}
                            ${people ? `<tr><th>People</th><td>${people}</td></tr>` : ''}
                            ${budget ? `<tr><th>Budget</th><td>${budget}</td></tr>` : ''}
                            ${source ? `<tr><th>Source</th><td>${source}</td></tr>` : ''}
                        </table>
            
                        ${comment ? `
                        <div class="comment-section">
                            <span class="comment-label">Message/Details:</span>
                            <p class="comment-text">${comment}</p>
                        </div>
                        ` : ''}
                    </div>
                    <div class="footer">
                        This is an automated notification from your website.
                    </div>
                </div>
            </body>
            </html>
            `;
            

            const sendEmail = await fetch(`${process.env.MAIL_API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.MAIL_API_KEY,
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    "sender":{  
                        "name":"Travel Tailore",
                        "email": process.env.MAIL_SENDER || 'traveltailor.dev@gmail.com'
                     },
                    "to":[  
                        {  
                            "email": process.env.MAIL_RECEIVER || 'traveltailor.dev@gmail.com',
                            "name": process.env.MAIL_RECEIVER_NAME || 'Travel Tailore'
                        }
                    ],
                    "subject":"Website Contact Form | New Enquiry | " + name,
                    "htmlContent": htmlContent
                })
            });

            if (!sendEmail.ok) {
                throw new Error("Failed to send email");
            }

            return response;
        } catch (error) {
            throw(error.status || 500, error.message);
        }

    },

    async createContact(name, email, contactNumber, requirement) {

        try {
            // Create the contact entry in the database
            const contact = await strapi.documents("api::contact.contact").create({
                data: {
                    name,
                    email,
                    contactNumber,
                    requirement,
                    publishedAt: new Date(),
                }
            });

            
            let response = {
                message: "Contact created successfully",
                id: contact.id,
                documentId: contact.documentId
            };

            const formatContact = (code, number) => {
                if (!number) return ''; // If no number, return empty string
                return `${code ? code + ' ' : ''}${number}`; // Add code if it exists
            }
            
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Website Submission</title>
                <style>
                                /* Basic Reset & Body Styling */
                body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f7f6; }
                /* Container */
                .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;}
                /* Header */
                .header { background-color: #D35400; /* Rich Orange */ color: #ffffff; padding: 25px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 500; }
                /* Content Area */
                .content { padding: 30px; }
                .content h2 { font-size: 20px; color: #D35400; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;}
                /* Data Table */
                .data-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                .data-table th, .data-table td { text-align: left; padding: 12px 0; border-bottom: 1px solid #eeeeee; vertical-align: top; }
                .data-table th { color: #555555; font-weight: 600; width: 120px; /* Fixed width for labels */ }
                .data-table td { color: #333333; }
                /* Comment Section */
                .comment-section { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D35400; border-radius: 4px; }
                .comment-label { font-weight: 600; color: #D35400; margin-bottom: 8px; display: block; font-size: 16px;}
                .comment-text { margin: 0; color: #555; white-space: pre-wrap; /* Preserve line breaks */ word-wrap: break-word;}
                /* Footer */
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f4f7f6;}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>New Website Enquiry</h1>
                    </div>
                    <div class="content">
                        <h2>Submitter Details</h2>
                        <table class="data-table">
                            ${name ? `<tr><th>Name</th><td>${name}</td></tr>` : ''}
                            ${email ? `<tr><th>Email</th><td><a href="mailto:${email}" style="color: #4A90E2; text-decoration: none;">${email}</a></td></tr>` : ''}
                            ${contactNumber ? `<tr><th>Contact</th><td>${contactNumber}</td></tr>` : ''}
                        </table>
            
                        ${requirement ? `<h2>Requirement</h2>` : ''}
                        <table class="data-table">
                            ${requirement ? `<tr><th>Requirement</th><td>${requirement}</td></tr>` : ''}
                        </table>
                    </div>
                    <div class="footer">
                        This is an automated notification from your website.
                    </div>
                </div>
            </body>
            </html>
            `;
            

            const sendEmail = await fetch(`${process.env.MAIL_API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.MAIL_API_KEY,
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    "sender":{  
                        "name":"Travel Tailore",
                        "email": process.env.MAIL_SENDER || 'traveltailor.dev@gmail.com'
                     },
                    "to":[  
                        {  
                            "email": process.env.MAIL_RECEIVER || 'traveltailor.dev@gmail.com',
                            "name": process.env.MAIL_RECEIVER_NAME || 'Travel Tailore'
                        }
                    ],
                    "subject":"Website Contact Form | New Enquiry | " + name,
                    "htmlContent": htmlContent
                })
            });        
        } catch (e) {
            ctx.status = 500;
            ctx.body = {error: "Failed to create contact."};
        }
    },

    async getBlog(slug) {
        const blog = await strapi.documents("api::blog.blog").findFirst({
            filters: { slug },
            populate: {
                displayImg: {
                    fields: ["url"]
                }, 
                seo: {
                    populate: {
                        shareImage: {
                            fields: ["url"]
                        }
                    },
                    fields: ["metaTitle", "metaDescription"]
                },
                blogs: {
                    populate: {
                        displayImg: {
                            fields: ["url"]
                        }
                    },
                    fields: ["title", "description", "slug"]
                },
                tours: {
                    populate: {
                        displayImg: {
                            fields: ["url"]
                        },
                        priceTime: "*",
                    },
                    fields: ["title", "description", "slug"]
                },
                createdBy: {
                    fields: ["firstname", "lastname", "createdAt", "updatedAt"]
                },
            }
        });
        if (!blog) {
            throw new Error("Blog not found.");
        }
        return {
            ...transformBlog(blog),
            blogs: transformEntities(blog.blogs, 'blogs'),
            tours: transformEntities(blog.tours, 'tours')
        };
    },

    async getCampaign(slug) {
        const campaign = await strapi.documents("api::campaign.campaign").findFirst({
            filters: { slug },
            populate: { 
                destinations: {
                    populate: {
                        displayImg: {
                            fields: ["url"]
                        }
                    },
                    fields: ["title", "description", "slug", "startingPrice"]
                },
                hero: {
                    populate: {
                        img: {
                            fields: ["url"]
                        }
                    },
                    fields: ["title"]
                },
                moments: {
                    populate: {
                        img: {
                            fields: ["url"]
                        }
                    },
                    fields: ["title", "description"]
                },
                plans: {
                    populate: {
                        img: {
                            fields: ["url"]
                        }
                    },
                    fields: ["title"]
                },
                testimonials: {
                    populate: {
                        img: {
                            fields: ["url"]
                        }
                    },
                    fields: ["name", "place", "travelType", "date", "review"]
                }
            },
            fields: ["title", "slug"]
        });
        if (!campaign) {
            throw new Error("Campaign not found.");
        }
        return {
            ...transformCampaign(campaign),
        };
    },

    async postCampaignForm(name, email, contact, travelDate, destinations, needsHelp) {
        try {
            // Create the campaign entry in the database
            const campaignForm = await strapi.documents("api::campaign-form.campaign-form").create({
                data: {
                    name,
                    email,
                    contact,
                    travelDate,
                    destinations,
                    needsHelp,
                    publishedAt: new Date(),
                }
            });
            
            let response = {
                message: "Campaign created successfully",
                id: campaignForm.id,
                documentId: campaignForm.documentId
            };


            const htmlContent = `
                <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>New Travel Enquiry</title>
                        <style>
                            /* Basic Reset & Body Styling */
                            body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333; background-color: #f4f7f6; }
                            /* Container */
                            .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;}
                            /* Header */
                            .header { background-color: #ED5628; /* Travel Blue */ color: #ffffff; padding: 25px; text-align: center; }
                            .header h1 { margin: 0; font-size: 24px; font-weight: 500; }
                            /* Content Area */
                            .content { padding: 30px; }
                            .content h2 { font-size: 20px; color: #ED5628; margin-top: 0; margin-bottom: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;}
                            /* Data Table */
                            .data-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                            .data-table th, .data-table td { text-align: left; padding: 12px 0; border-bottom: 1px solid #eeeeee; vertical-align: top; }
                            .data-table th { color: #555555; font-weight: 600; width: 120px; /* Fixed width for labels */ }
                            .data-table td { color: #333333; }
                            /* Help Section */
                            .help-section { margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #ED5628; border-radius: 4px; }
                            .help-label { font-weight: 600; color: #ED5628; margin-bottom: 8px; display: block; font-size: 16px;}
                            .help-text { margin: 0; color: #555; white-space: pre-wrap; /* Preserve line breaks */ word-wrap: break-word;}
                            /* Footer */
                            .footer { text-align: center; padding: 20px; font-size: 12px; color: #999999; background-color: #f4f7f6;}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>New Travel Enquiry</h1>
                            </div>
                            <div class="content">
                                <h2>Customer Details</h2>
                                <table class="data-table">
                                    ${name ? `<tr><th>Name</th><td>${name}</td></tr>` : ''}
                                    ${email ? `<tr><th>Email</th><td><a href="mailto:${email}" style="color: #4A90E2; text-decoration: none;">${email}</a></td></tr>` : ''}
                                    ${contact ? `<tr><th>Contact</th><td>${contact}</td></tr>` : ''}
                                </table>
                                
                                <h2>Travel Information</h2>
                                <table class="data-table">
                                    ${travelDate ? `<tr><th>Travel Date</th><td>${travelDate}</td></tr>` : ''}
                                    ${destinations ? `<tr><th>Destinations</th><td>${destinations}</td></tr>` : ''}
                                </table>
                                
                                ${needsHelp ? `
                                <div class="help-section">
                                    <span class="help-label">Needs Help Deciding Destinations?</span>
                                    <p class="help-text">${needsHelp}</p>
                                </div>
                                ` : ''}
                            </div>
                            <div class="footer">
                                This is an automated notification from your travel website.
                            </div>
                        </div>
                    </body>
                    </html>
        `;

        const sendEmail = await fetch(`${process.env.MAIL_API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.MAIL_API_KEY,
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    "sender":{  
                        "name":"Travel Tailore",
                        "email": process.env.MAIL_SENDER || 'traveltailor.dev@gmail.com'
                     },
                    "to":[  
                        {  
                            "email": process.env.MAIL_RECEIVER || 'traveltailor.dev@gmail.com',
                            "name": process.env.MAIL_RECEIVER_NAME || 'Travel Tailore'
                        }
                    ],
                    "subject":"Website Contact Form | New Enquiry | " + name,
                    "htmlContent": htmlContent
                })
            });

            return response;
        } catch (error) {
            throw(error.status || 500, error.message);
        }
    },




}