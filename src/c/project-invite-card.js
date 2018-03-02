import m from 'mithril';
import h from '../h';
import _ from 'underscore';
import facebookButton from '../c/facebook-button';
import copyTextInput from '../c/copy-text-input';

const projectInviteCard = {
    view(ctrl, args) {
        const project = args.project;

        return m('.card.card-secondary.u-marginbottom-20.u-radius.w-clearfix', [
            m('.fontsize-base.fontweight-semibold.u-marginbottom-30.u-text-center', '친구를 초대하여 캠페인에 동참에 주세요.'),
            //coffee m('.fontsize-base.fontweight-semibold.u-marginbottom-30.u-text-center', 'Convide seus amigos para apoiar sua campanha'),
            m('.w-row', [
                m('.w-sub-col.u-marginbottom-20.w-col.w-col-4', [
                    m.component(facebookButton, { url: `${h.projectFullPermalink(project)}?ref=facebook&utm_source=facebook.com&utm_medium=social&utm_campaign=project_share_insights`, medium: true })
                ]),
                m('.w-sub-col.u-marginbottom-20.w-col.w-col-4', [
                    m.component(facebookButton, { messenger: true, url: `${h.projectFullPermalink(project)}?ref=facebook&utm_source=facebook.com&utm_medium=messenger&utm_campaign=project_share_insights`, medium: true })
                ]),
                m('.w-col.w-col-4', [
                    m('.w-form', [
                        m('form[data-name=\'Email Form 2\'][id=\'email-form-2\'][name=\'email-form-2\']', [
                            m.component(copyTextInput, { value: `${h.projectFullPermalink(project)}?ref=project_link` })
                        ])
                    ])
                ])
            ])
        ]);
    }
};

export default projectInviteCard;
