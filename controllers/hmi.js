// Below is used to direct to the main HMI landing page for the application

exports.getIndex = (req, res, next) => {
        res.render('hmi/index', {
        pageTitle: 'HMI Landing Page',
        path: '/'
        });
    
};