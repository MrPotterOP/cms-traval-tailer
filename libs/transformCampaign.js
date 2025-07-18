const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;

const transformCampaign = (campaign) => {
    if (!campaign) return null;
    return {
        title: campaign.title,
        slug: campaign.slug,
        destinations: campaign.destinations ? campaign.destinations.map(destination => {
            return {
                title: destination.title,
                description: destination.description,
                imgUrl: destination.displayImg?.formats?.large?.url || destination.displayImg?.url || DEFAULT_IMAGE,
                slug: destination.slug,
                tag: destination.startingPrice ? destination.startingPrice : 10000
            }
        }) : null,
        hero: campaign.hero ? campaign.hero.map(hero => {
            return {
                title: hero.title,
                imgUrl: hero.img?.formats?.large?.url || hero.img?.url || DEFAULT_IMAGE
            }
        }) : null,
        moments: campaign.moments ? campaign.moments.map(moment => {
            return {
                title: moment.title,
                description: moment.description,
                img: moment.img?.formats?.large?.url || moment.img?.url || DEFAULT_IMAGE
            }
        }) : null,
        plans: campaign.plans ? campaign.plans.map(plan => {
            return {
                title: plan.title,
                img: plan.img?.formats?.large?.url || plan.img?.url || DEFAULT_IMAGE
            }
        }) : null,
        testimonials: campaign.testimonials ? campaign.testimonials.map(testimonial => {
            return {
                name: testimonial.name,
                place: testimonial.place,
                travelType: testimonial.travelType,
                date: testimonial.date,
                review: testimonial.review,
                imgUrl: testimonial.img?.formats?.large?.url || testimonial.img?.url || DEFAULT_IMAGE
            }
        }) : null
    }
}


module.exports = {
    transformCampaign
}