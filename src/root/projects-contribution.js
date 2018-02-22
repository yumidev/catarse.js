import m from 'mithril';
import _ from 'underscore';
import I18n from 'i18n-js';
import rewardVM from '../vms/reward-vm';
import paymentVM from '../vms/payment-vm';
import projectVM from '../vms/project-vm';
import projectHeaderTitle from '../c/project-header-title';
import rewardSelectCard from '../c/reward-select-card';
import h from '../h';
import faqBox from '../c/faq-box';

const I18nScope = _.partial(h.i18nScope, 'projects.contributions');

const projectsContribution = {
    controller() {
        const rewards = () => _.union(
            [{
                id: null,
                description: '고마워. 나는이 프로젝트를 돕고 싶다..',
                minimum_value: 10,
                shipping_options: null,
                row_order: -9999999
            }],
            projectVM.rewardDetails()
        );

        const submitContribution = () => {
            const valueFloat = h.monetaryToFloat(rewardVM.contributionValue);

            if (valueFloat < rewardVM.selectedReward().minimum_value) {
                rewardVM.error(`이 보상에 대한 지원 금액은 적어도 R$${rewardVM.selectedReward().minimum_value}`);
            } else {
                rewardVM.error('');
                h.navigateTo(`/projects/${projectVM.currentProject().project_id}/contributions/fallback_create?contribution%5Breward_id%5D=${rewardVM.selectedReward().id}&contribution%5Bvalue%5D=${valueFloat}`);
            }

            return false;
        };

        projectVM.getCurrentProject();

        return {
            project: projectVM.currentProject,
            paymentVM: paymentVM(),
            submitContribution,
            sortedRewards: () => _.sortBy(rewards(), reward => Number(reward.row_order))
        };
    },
    view(ctrl, args) {
        const project = ctrl.project;

        return m('#contribution-new',
                 !_.isEmpty(project()) ? [
                     m(`.w-section.section-product.${project().mode}`),
                     m(projectHeaderTitle, {
                         project
                     }),
                     m('.w-section.header-cont-new',
                    m('.w-container',
                        m('.fontweight-semibold.lineheight-tight.text-success.fontsize-large.u-text-center-small-only',
                            '보상을 선택한 다음 지원액을 선택하십시오.'
                            //coffee  'Escolha a recompensa e em seguida o valor do apoio'
                        )
                    )
                ),
                     m('.section', m('.w-container', m('.w-row', [
                         m('.w-col.w-col-8',
                        m('.w-form.back-reward-form',
                            m(`form.simple_form.new_contribution[accept-charset="UTF-8"][action="/pt/projects/${project().id}/contributions/fallback_create"][id="contribution_form"][method="get"][novalidate="novalidate"]`,
                                { onsubmit: ctrl.submitContribution }
                            , [
                                m('input[name="utf8"][type="hidden"][value="✓"]'),
                                _.map(ctrl.sortedRewards(), reward => m(rewardSelectCard, { reward }))
                            ])
                        )
                    ),
                         m('.w-col.w-col-4', [
                             m('.card.u-marginbottom-20.u-radius.w-hidden-small.w-hidden-tiny', [
                                 m('.fontsize-small.fontweight-semibold', I18n.t('contribution_warning.title', I18nScope())),
                                 m('.fontsize-smaller.u-marginbottom-10', I18n.t('contribution_warning.subtitle', I18nScope())),
                                 m('.fontcolor-secondary.fontsize-smallest.u-marginbottom-10', I18n.t('contribution_warning.info', I18nScope())),
                                 m(`a.alt-link.fontsize-smallest[target="__blank"][href="${I18n.t('contribution_warning.link', I18nScope())}"]`, I18n.t('contribution_warning.link_label', I18nScope()))
                             ]),
                             m.component(faqBox, {
                                 mode: project().mode,
                                 vm: ctrl.paymentVM,
                                 faq: ctrl.paymentVM.faq(project().mode),
                                 projectUserId: args.project_user_id
                             })
                         ])
                     ])))
                 ] : h.loader());
    }
};

export default projectsContribution;
