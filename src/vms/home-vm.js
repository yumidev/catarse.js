import I18n from 'i18n-js';

const homeVM = () => {
    const i18nStart = I18n.translations[I18n.currentLocale()].projects.home,
        banners = i18nStart.banners;

    return {
        banners
    };
};

export default homeVM;
