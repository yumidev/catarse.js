import m from 'mithril';
import I18n from 'i18n-js';
import h from '../h';

const I18nScope = _.partial(h.i18nScope, 'pages.jobs');

const jobs = {
    view(ctrl, args) {
        return m('.page-jobs', [
            m('.w-section.hero-jobs.hero-medium', [
                m('.w-containe.u-text-center', [
                    m('img.icon-hero[src="/assets/logo-white.png"]'),
                    m('.u-text-center.u-marginbottom-20.fontsize-largest', I18n.t('title', I18nScope()))
                ])
            ]),
            m('.w-section.section', [
                m('.w-container.u-margintop-40', [
                    m('.w-row', [
                        m('.w-col.w-col-8.w-col-push-2.u-text-center', [
                            m('.fontsize-large.u-marginbottom-30', I18n.t('info', I18nScope())),
                            m('a[href="/projects/new"].w-button.btn.btn-large.btn-inline', I18n.t('cta', I18nScope()))
                        ])
                    ])
                ])
            ])
        ]);
    }
};

export default jobs;
