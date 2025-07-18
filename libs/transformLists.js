
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE;

const transformDestinationList = (listDestination) => {
    if (!listDestination || !Array.isArray(listDestination)) return [];

    // Map over each listDestination entry and extract groups
    return listDestination.flatMap(list => 
        (list.group || []).map(group => ({
            title: group.title,
            destinations: (group.destinations || []).map(destination => ({
                title: destination.title,
                slug: destination.slug,
                imgUrl: destination.displayImg?.formats.medium?.url || destination.displayImg?.url || DEFAULT_IMAGE
            }))
        }))
    );
};

const transformExperienceList = (listExperience) => {
    if (!listExperience || !Array.isArray(listExperience)) return [];

    // Map over each listExperience entry and extract groups
    return listExperience.flatMap(list => 
        (list.group || []).map(group => ({
            title: group.title,
            experiences: (group.experiences || []).map(experience => ({
                title: experience.title,
                slug: experience.slug,
                imgUrl: experience.heroImg?.formats.medium?.url || experience.heroImg?.url || DEFAULT_IMAGE
            }))
        }))
    );
};

const transformTourList = (listTour) => {
    if (!listTour || !Array.isArray(listTour)) return [];

    // Map over each listTour entry and extract groups
    return listTour.flatMap(list => 
        (list.group || []).map(group => ({
            title: group.title,
            tours: (group.tours || []).map(tour => ({
                title: tour.title,
                slug: tour.slug,
                imgUrl: tour.displayImg?.formats.medium?.url || tour.displayImg?.url || DEFAULT_IMAGE
            }))
        }))
    );
};

const transformMonthList = (months) => {
    if (!months || !Array.isArray(months)) return [];

    const rawMonths = months.map(month => ({
        month: month.month.charAt(0).toUpperCase() + month.month.slice(1),
        imgUrl:  month.displayImg?.formats?.medium?.url || month.displayImg?.url || DEFAULT_IMAGE
    }));

    // Sort months like january, february, march ans so on
    return rawMonths.sort((a, b) => {
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
}


const transformBlogList = (listBlog) => {
    if (!listBlog || !Array.isArray(listBlog)) return [];

    return listBlog.map(list => ({
        tag: list.tag,
        description: list.description,
        blogs: list.blogs.map(blog => ({
            title: blog.title,
            description: blog.description,
            slug: blog.slug,
            imgUrl: blog.displayImg?.formats.medium?.url || blog.displayImg?.url || DEFAULT_IMAGE
        }))
    }));
};




module.exports = {
    transformDestinationList,
    transformExperienceList,
    transformTourList,
    transformMonthList,
    transformBlogList
}
