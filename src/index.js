'use strict';

const slugify = require('slugify');


module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({strapi}) {
    strapi.documents.use(
      async (context, next) => {

        const pageTypes = ["api::blog.blog", "api::destination.destination", "api::experience.experience", "api::tour.tour"];
        const pageActions = ["create", "update"];

        if(!pageTypes.includes(context.uid) || !pageActions.includes(context.action)) {
          return next();
        }

        const { data } = context.params;

        context.params.data.slug = slugify(data.title, {lower: true});

        const ctx = strapi.requestContext.get();
        const user = ctx?.state?.user;

        if(context.uid === "api::blog.blog" && context.action === "create") {
          context.params.data.author = context.params.data.author || `${user.firstname || ""} ${user.lastname || ""}`;
        }

        return next();
      }
    );


  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};