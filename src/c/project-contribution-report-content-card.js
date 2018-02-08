import m from 'mithril';
import _ from 'underscore';
import moment from 'moment';
import $ from 'jquery';
import I18n from 'i18n-js';
import postgrest from 'mithril-postgrest';
import models from '../models';
import paymentStatus from './payment-status';
import h from '../h';

const I18nScope = _.partial(h.i18nScope, 'projects.reward_fields');
const contributionScope = _.partial(h.i18nScope, 'projects.contributions');

const projectContributionReportContentCard = {
    controller(args) {
        const project = args.project(),
            showDetail = h.toggleProp(false, true),
            currentTab = m.prop('info'),
            checked = contribution => _.contains(args.selectedContributions(), contribution.id),
            selectContribution = (contribution) => {
                const anyChecked = $('input:checkbox').is(':checked');

                args.selectedAny(anyChecked);
                if (!checked(contribution)) {
                    args.selectedContributions().push(contribution.id);
                } else {
                    args.selectedContributions(_.without(args.selectedContributions(), contribution.id));
                }
                return true;
            },
            vm = postgrest.filtersVM({
                contribution_id: 'eq'
            }),
            surveyLoader = () => {
                vm.contribution_id(args.contribution().id);

                return postgrest.loaderWithToken(models.survey.getPageOptions(vm.parameters()));
            },
            survey = m.prop(),
            stateClass = (state) => {
                const classes = {
                    online: {
                        paid: 'text-success.fa-circle',
                        refunded: 'text-error.fa-circle',
                        pending_refund: 'text-error.fa-circle',
                        pending: 'text-waiting.fa-circle',
                        refused: 'text-error.fa-circle'
                    },
                    failed: {
                        paid: 'text-error.fa-circle-o',
                        refunded: 'text-refunded.fa-circle',
                        pending_refund: 'text-refunded.fa-circle-o',
                        pending: 'text-refunded',
                        refused: 'text-refunded'
                    },
                    waiting_funds: {
                        paid: 'text-success.fa-circle',
                        refunded: 'text-error.fa-circle',
                        pending_refund: 'text-error.fa-circle',
                        pending: 'text-waiting.fa-circle',
                        refused: 'text-error.fa-circle'
                    },
                    successful: {
                        paid: 'text-success.fa-circle',
                        refunded: 'text-error.fa-circle',
                        pending_refund: 'text-error.fa-circle',
                        pending: 'text-waiting.fa-circle',
                        refused: 'text-error.fa-circle'
                    }
                };

                return classes[project.state][state];
            };

        surveyLoader().load().then(survey);
        return {
            stateClass,
            survey,
            checked,
            currentTab,
            showDetail,
            selectContribution
        };
    },
    view(ctrl, args) {
        const contribution = args.contribution(),
            project = args.project(),
            survey = _.first(ctrl.survey()),
            profileImg = (_.isEmpty(contribution.profile_img_thumbnail) ? '/assets/catarse_bootstrap/user.jpg' : contribution.profile_img_thumbnail),
            reward = contribution.reward || {
                minimum_value: 0,
                description: I18n.t('contribution.no_reward', contributionScope())
            },
            deliveryBadge = () => (contribution.delivery_status === 'error' ?
                                                m('span.badge.badge-attention.fontsize-smaller',
                                                    I18n.t(`status.${contribution.delivery_status}`, I18nScope())
                                                ) : contribution.delivery_status === 'delivered' ?
                                                m('span.badge.badge-success.fontsize-smaller',
                                                    I18n.t(`status.${contribution.delivery_status}`, I18nScope())
                                                ) : contribution.delivery_status === 'received' ?
                                                m('span.fontsize-smaller.badge.badge-success', [
                                                    m('span.fa.fa-check-circle',
                                                        ''
                                                    ),
                                                    I18n.t(`status.${contribution.delivery_status}`, I18nScope())
                                                ]) : '');

        return m('div', [m(`.w-clearfix.card${ctrl.checked(contribution) ? '.card-alert' : ''}`, [
            m('.w-row', [
                m('.w-col.w-col-1.w-col-small-1.w-col-tiny-1',
                        m('.w-inline-block',
                            m('.w-checkbox.w-clearfix',
                                (contribution.delivery_status !== 'received' && project.state !== 'failed' ?
                                    m('input.w-checkbox-input[type=\'checkbox\']', {
                                        checked: ctrl.checked(contribution),
                                        value: contribution.id,
                                        onclick: () => ctrl.selectContribution(contribution)
                                    }) : '')
                            )
                        )
                    ),
                m('.w-col.w-col-11.w-col-small-11.w-col-tiny-11',
                        m('.w-row', [
                            m('.w-col.w-col-1.w-col-tiny-1', [
                                m(`img.user-avatar.u-marginbottom-10[src='${profileImg}']`)
                            ]),
                            m('.w-col.w-col-11.w-col-tiny-11', [
                                m('.w-row', [
                                    m('.w-col.w-col-3', [
                                        m('.fontcolor-secondary.fontsize-mini.fontweight-semibold', h.momentify(contribution.created_at, 'DD/MM/YYYY, HH:mm')),
                                        m('.fontweight-semibold.fontsize-smaller.lineheight-tighter', contribution.public_user_name || contribution.user_name),
                                        m('.fontsize-smallest.lineheight-looser', [
                                            (contribution.has_another ? [
                                                m('a.link-hidden-light.badge.badge-light', '+1 apoio ')
                                            ] : ''),
                                            (contribution.anonymous ? m('span.fa.fa-eye-slash.fontcolor-secondary', m('span.fontcolor-secondary[style="font-size:11px;"]', ` ${I18n.t('contribution.anonymous_contribution', contributionScope())}`)) : '')
                                        ]),
                                        m('.fontsize-smallest.lineheight-looser', (contribution.email))
                                    ]),
                                    m('.w-col.w-col-3', [
                                        m('.lineheight-tighter', [
                                            m(`span.fa.fontsize-smallest.${ctrl.stateClass(contribution.state)}`),
                                            '   ',
                                            m('span.fontsize-large', `R$ ${h.formatNumber(contribution.value, 2, 3)}`)
                                        ])
                                    ]),
                                    m('.w-col.w-col-3.w-hidden-small.w-hidden-tiny', [
                                        m('div',
                                            deliveryBadge()
                                        ),
                                        m('.fontsize-smallest.fontweight-semibold', `${I18n.t('reward', I18nScope())}: ${reward.minimum_value ? h.formatNumber(reward.minimum_value, 2, 3) : ''}`),
                                        m('.fontsize-smallest.fontweight-semibold',
                                            reward.title
                                        ),
                                        m('.fontsize-smallest.fontcolor-secondary', `${reward.description.substring(0, 80)}...`)
                                    ]),
                                    (survey ?
                                      survey.survey_answered_at ?
                                      m('.w-col.w-col-3.w-col-push-1', [
                                          m('.fontsize-smallest', [
                                              m('a.link-hidden',
                                                'Questionário '
                                            ),
                                              m('span.fontweight-semibold.text-success',
                                                'respondido'
                                            )
                                          ]),
                                          m('.fontcolor-terciary.fontsize-smallest',
                                            `em ${h.momentify(survey.survey_answered_at, 'DD/MM/YYYY')}`
                                        )
                                      ]) : survey.finished_at ?
                                      m('.w-col.w-col-3.w-col-push-1', [
                                          m('.fontsize-smallest', [
                                              m('a.link-hidden',
                                                'Questionário '
                                            ),
                                              m('span.fontweight-semibold.text-fail',
                                                'sem resposta'
                                            )
                                          ]),
                                          m('.fontcolor-terciary.fontsize-smallest',
                                            `finalizado em ${h.momentify(survey.finished_at, 'DD/MM/YYYY')}`
                                        )
                                      ]) :
                                    m('.w-col.w-col-3.w-col-push-1', [
                                        m('.fontsize-smallest', [
                                            m('a.link-hidden',
                                                'Questionário '
                                            ),
                                            m('span.fontweight-semibold.text-waiting',
                                                'enviado'
                                            )
                                        ]),
                                        m('.fontcolor-terciary.fontsize-smallest',
                                            `em ${h.momentify(survey.sent_at, 'DD/MM/YYYY')}`
                                        )
                                    ]) : '')
                                ])
                            ])
                        ])
                    )
            ]),
            m('a.arrow-admin.fa.fa-chevron-down.fontcolor-secondary.w-inline-block', {
                onclick: ctrl.showDetail.toggle
            })
        ]),
            (ctrl.showDetail() ?
                m('.card.details-backed-project.w-tabs', [
                    m('.w-tab-menu', [
                        _.map(['info', 'profile'], tab =>
                        m(`a.dashboard-nav-link.w-inline-block.w-tab-link${ctrl.currentTab() === tab ? '.w--current' : ''}`, { onclick: () => ctrl.currentTab(tab) },
                            m('div',
                                I18n.t(`report.${tab}`, contributionScope())
                            )
                        ))
                    ]),
                    m('.card.card-terciary.w-tab-content', [
                        (ctrl.currentTab() === 'info' ?
                        m('.w-tab-pane.w--tab-active',
                            m('.w-row', [
                                m('.right-divider.w-col.w-col-6', [
                                    m('.u-marginbottom-20', [
                                        m('.fontsize-base.fontweight-semibold.u-marginbottom-10',
                                            `${I18n.t('selected_reward.value', contributionScope())}: R$${contribution.value}`
                                        ),
                                        m(paymentStatus, { item: { payment_method: contribution.payment_method, state: contribution.state } }),
                                        m('.fontcolor-secondary.fontsize-smallest',
                                          h.momentify(contribution.created_at, 'DD/MM/YYYY hh:mm')
                                        )
                                    ]),
                                    m('.fontsize-base.fontweight-semibold',
                                        `${I18n.t('reward', I18nScope())}:`
                                    ),
                                    m('.fontsize-small.fontweight-semibold.u-marginbottom-10', [
                                        `R$${reward.minimum_value} ${reward.title ? `- ${reward.title}` : ''} `,
                                        deliveryBadge()
                                    ]),
                                    m('p.fontsize-smaller',
                                      reward.description
                                    ),
                                    m('.u-marginbottom-10', [
                                        m('.fontsize-smaller', [
                                            m('span.fontweight-semibold',
                                                `${I18n.t('deliver_at', I18nScope())} `
                                            ),
                                            h.momentify(reward.deliver_at, 'MMMM/YYYY')
                                        ]),
                                        (reward.shipping_options ?
                                        m('.fontsize-smaller', [
                                            m('span.fontweight-semibold',
                                                I18n.t('delivery', I18nScope())
                                            ),
                                            I18n.t(`shipping_options.${reward.shipping_options}`, I18nScope())
                                        ]) : '')
                                    ])
                                ]),

                                (survey ?
                                m('.w-col.w-col-6', [
                                    m('.fontsize-base.fontweight-semibold',
                                        I18n.t('survey.survey', contributionScope())
                                    ),
                                    m('.fontsize-smaller.lineheight-tighter.u-marginbottom-20',
                                        I18n.t('survey.answered_at', contributionScope({ date: moment(survey.survey_answered_at).format('DD/MM/YYYY') }))
                                    ),
                                    survey.confirm_address && survey.address ? [
                                        m('.fontsize-small', [
                                            m('.fontweight-semibold.lineheight-looser',
                                            I18n.t('survey.address_title', contributionScope())
                                        ),
                                            m('p', [
                                                contribution.public_user_name,
                                                m('br'),
                                                `${survey.address.address_street}, ${survey.address.address_number} ${survey.address.address_complement}`,
                                                m('br'),
                                                `${I18n.t('survey.address_neighbourhood', contributionScope())} ${survey.address.address_neighbourhood}`,
                                                m('br'),
                                                `${survey.address.address_zip_code} ${survey.address.address_city}-${survey.state_name}`,
                                                m('br'),
                                                survey.country_name
                                            ])
                                        ])] : '',
                                    _.map(survey.multiple_choice_questions, (mcQuestion) => {
                                        const answer = _.find(mcQuestion.question_choices, choice => choice.id === mcQuestion.survey_question_choice_id);
                                        return !answer ? '' : m('.fontsize-small', [
                                            m('.fontweight-semibold.lineheight-looser',
                                              mcQuestion.question
                                          ),
                                            m('p',
                                                  answer.option
                                          )
                                        ]);
                                    }),
                                    _.map(survey.open_questions, openQuestion =>
                                      m('.fontsize-small', [
                                          m('.fontweight-semibold.lineheight-looser',
                                              openQuestion.question
                                          ),
                                          m('p',
                                              openQuestion.answer
                                          )
                                      ]))
                                ]) : '')


                            ])
                        ) :
                        m('.w-tab-pane',
                            m('.fontsize-small',
                                m('p', [
                                    `Nome completo: ${contribution.user_name}`,
                                    m('br'),
                                    `Nome público: ${contribution.public_user_name}`,
                                    m('br'),
                                    contribution.email,
                                    m('br'),
                                    I18n.t('user_since', contributionScope({ date: h.momentify(contribution.user_created_at, 'MMMM YYYY') })),
                                    m('br'),
                                    I18n.t('backed_projects', contributionScope({ count: contribution.total_contributed_projects })),
                                    m('br'),
                                    I18n.t('created_projects', contributionScope({ count: contribution.total_published_projects }))
                                ])
                            )
                        ))
                    ])
                ]) : '')
        ]);
    }
};

export default projectContributionReportContentCard;
