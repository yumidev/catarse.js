import m from 'mithril';
import postgrest from 'mithril-postgrest';
import _ from 'underscore';
import I18n from 'i18n-js';
import h from '../h';
import models from '../models';
import tooltip from '../c/tooltip';
import projectDashboardMenu from '../c/project-dashboard-menu';
import modalBox from '../c/modal-box';
import adminProjectDetailsCard from '../c/admin-project-details-card';
import onlineSuccessModalContent from '../c/online-success-modal-content';
import projectDataStats from '../c/project-data-stats';
import projectDeleteButton from '../c/project-delete-button';
import projectCancelButton from '../c/project-cancel-button';
import projectDataChart from '../c/project-data-chart';
import projectDataTable from '../c/project-data-table';
import projectReminderCount from '../c/project-reminder-count';
import projectSuccessfulOnboard from '../c/project-successful-onboard';
import projectInviteCard from '../c/project-invite-card';

const I18nScope = _.partial(h.i18nScope, 'projects.insights');

const insights = {
    controller(args) {
        const filtersVM = postgrest.filtersVM({
                project_id: 'eq'
            }),
            displayModal = h.toggleProp(false, true),
            projectDetails = m.prop([]),
            contributionsPerDay = m.prop([]),
            visitorsTotal = m.prop(0),
            visitorsPerDay = m.prop([]),
            loader = postgrest.loaderWithToken,
            setProjectId = () => {
                try {
                    const project_id = m.route.param('project_id');

                    filtersVM.project_id(project_id);
                } catch (e) {
                    filtersVM.project_id(args.root.getAttribute('data-id'));
                }
            };

        if (h.paramByName('online_success') === 'true') {
            displayModal.toggle();
        }

        setProjectId();

        const l = loader(models.projectDetail.getRowOptions(filtersVM.parameters()));
        l.load().then(projectDetails);

        const processVisitors = (data) => {
            if (!_.isEmpty(data)) {
                visitorsPerDay(data);
                visitorsTotal(_.first(data).total);
            }
        };

        const lVisitorsPerDay = loader(models.projectVisitorsPerDay.getRowOptions(filtersVM.parameters()));
        lVisitorsPerDay.load().then(processVisitors);

        const lContributionsPerDay = loader(models.projectContributionsPerDay.getRowOptions(filtersVM.parameters()));
        lContributionsPerDay.load().then(contributionsPerDay);

        const contributionsPerLocationTable = [['Estado', 'Apoios', 'R$ apoiados (% do total)']];
        const buildPerLocationTable = contributions => (!_.isEmpty(contributions)) ? _.map(_.first(contributions).source, (contribution) => {
            const column = [];

            column.push(contribution.state_acronym || 'Outro/other');
            column.push(contribution.total_contributions);
            column.push([contribution.total_contributed, [// Adding row with custom comparator => read project-data-table description
                m(`input[type="hidden"][value="${contribution.total_contributed}"`),
                'R$ ',
                h.formatNumber(contribution.total_contributed, 2, 3),
                m('span.w-hidden-small.w-hidden-tiny', ` (${contribution.total_on_percentage.toFixed(2)}%)`)
            ]]);
            return contributionsPerLocationTable.push(column);
        }) : [];

        const lContributionsPerLocation = loader(models.projectContributionsPerLocation.getRowOptions(filtersVM.parameters()));
        lContributionsPerLocation.load().then(buildPerLocationTable);

        const contributionsPerRefTable = [[
            I18n.t('ref_table.header.origin', I18nScope()),
            I18n.t('ref_table.header.contributions', I18nScope()),
            I18n.t('ref_table.header.amount', I18nScope())
        ]];
        const buildPerRefTable = contributions => (!_.isEmpty(contributions)) ? _.map(_.first(contributions).source, (contribution) => {
                // Test if the string matches a word starting with ctrse_ and followed by any non-digit group of characters
                // This allows to remove any versioned referral (i.e.: ctrse_newsletter_123) while still getting ctrse_test_ref
            const re = /(ctrse_[\D]*)/,
                test = re.exec(contribution.referral_link);

            const column = [];

            if (test) {
                    // Removes last underscore if it exists
                contribution.referral_link = test[0].substr(-1) === '_' ? test[0].substr(0, test[0].length - 1) : test[0];
            }

            column.push(contribution.referral_link ? I18n.t(`referral.${contribution.referral_link}`, I18nScope({ defaultValue: contribution.referral_link })) : I18n.t('referral.others', I18nScope()));
            column.push(contribution.total);
            column.push([contribution.total_amount, [
                m(`input[type="hidden"][value="${contribution.total_contributed}"`),
                'R$ ',
                h.formatNumber(contribution.total_amount, 2, 3),
                m('span.w-hidden-small.w-hidden-tiny', ` (${contribution.total_on_percentage.toFixed(2)}%)`)
            ]]);
            return contributionsPerRefTable.push(column);
        }) : [];

        const lContributionsPerRef = loader(models.projectContributionsPerRef.getRowOptions(filtersVM.parameters()));
        lContributionsPerRef.load().then(buildPerRefTable);

        return {
            l,
            lContributionsPerRef,
            lContributionsPerLocation,
            lContributionsPerDay,
            lVisitorsPerDay,
            displayModal,
            filtersVM,
            projectDetails,
            contributionsPerDay,
            contributionsPerLocationTable,
            contributionsPerRefTable,
            visitorsPerDay,
            visitorsTotal
        };
    },
    view(ctrl) {
        const project = _.first(ctrl.projectDetails()) || {
                user: {
                    name: 'Realizador'
                }
            },

            buildTooltip = el => m.component(tooltip, {
                el,
                text: [
                    'Informa de onde vieram os apoios de seu projeto. Saiba como usar essa tabela e planejar melhor suas ações de comunicação ',
                    m(`a[href="${I18n.t('ref_table.help_url', I18nScope())}"][target='_blank']`, 'aqui.')
                ],
                width: 380
            });

        if (!ctrl.l()) {
            project.user.name = project.user.name || 'Realizador';
        }

        return m('.project-insights', !ctrl.l() ? [
            m(`.w-section.section-product.${project.mode}`),
            (project.is_owner_or_admin ? m.component(projectDashboardMenu, {
                project: m.prop(project)
            }) : ''),
            (ctrl.displayModal() ? m.component(modalBox, {
                displayModal: ctrl.displayModal,
                content: [onlineSuccessModalContent]
            }) : ''),

            m('.w-container', (project.state === 'successful' && !project.has_cancelation_request) ? m.component(projectSuccessfulOnboard, { project: m.prop(project) }) : [
                m('.w-row.u-marginbottom-40', [
                    m('.w-col.w-col-8.w-col-push-2', [
                        m('.fontweight-semibold.fontsize-larger.lineheight-looser.u-marginbottom-10.u-text-center.dashboard-header', I18n.t('campaign_title', I18nScope())),

                        (project.state === 'online' && !project.has_cancelation_request ? m.component(projectInviteCard, { project }) : ''),
                        (project.state === 'draft' && !project.has_cancelation_request ? m.component(adminProjectDetailsCard, {
                            resource: project
                        }) : ''),
                        m(`p.${project.state}-project-text.u-text-center.fontsize-small.lineheight-loose`,
                            project.has_cancelation_request ? m.trust(I18n.t('has_cancelation_request_explanation', I18nScope())) :
                            [
                                project.mode === 'flex' && _.isNull(project.expires_at) && project.state !== 'draft' ? m('span', [
                                    m.trust(I18n.t('finish_explanation', I18nScope())),
                                    m('a.alt-link[href="http://suporte.catarse.me/hc/pt-br/articles/213783503-tudo-sobre-Prazo-da-campanha"][target="_blank"]', I18n.t('know_more', I18nScope()))
                                ]) : m.trust(I18n.t(`campaign.${project.mode}.${project.state}`, I18nScope({ username: project.user.name, expires_at: h.momentify(project.zone_expires_at), sent_to_analysis_at: h.momentify(project.sent_to_analysis_at) })))
                            ]
                        )
                    ])
                ])
            ]),
            (project.state === 'draft' ?
               m.component(projectDeleteButton, { project })
            : ''),
            (project.is_published) ? [
                m('.divider'),
                m('.w-section.section-one-column.section.bg-gray.before-footer', [
                    m('.w-container', [
                        m.component(projectDataStats, { project: m.prop(project), visitorsTotal: ctrl.visitorsTotal }),
                        m('.w-row', [
                            m('.w-col.w-col-12.u-text-center', {
                                style: {
                                    'min-height': '300px'
                                }
                            }, [
                                m('.fontweight-semibold.u-marginbottom-10.fontsize-large.u-text-center', [
                                    I18n.t('visitors_per_day_label', I18nScope()),
                                    h.newFeatureBadge()
                                ]),
                                !ctrl.lVisitorsPerDay() ? m.component(projectDataChart, {
                                    collection: ctrl.visitorsPerDay,
                                    dataKey: 'visitors',
                                    xAxis: item => h.momentify(item.day),
                                    emptyState: I18n.t('visitors_per_day_empty', I18nScope())
                                }) : h.loader()
                            ])
                        ]),
                        m('.w-row', [
                            m('.w-col.w-col-12.u-text-center', {
                                style: {
                                    'min-height': '300px'
                                }
                            }, [
                                !ctrl.lContributionsPerDay() ? m.component(projectDataChart, {
                                    collection: ctrl.contributionsPerDay,
                                    label: I18n.t('amount_per_day_label', I18nScope()),
                                    dataKey: 'total_amount',
                                    xAxis: item => h.momentify(item.paid_at),
                                    emptyState: I18n.t('amount_per_day_empty', I18nScope())
                                }) : h.loader()
                            ])
                        ]),
                        m('.w-row', [
                            m('.w-col.w-col-12.u-text-center', {
                                style: {
                                    'min-height': '300px'
                                }
                            }, [
                                !ctrl.lContributionsPerDay() ? m.component(projectDataChart, {
                                    collection: ctrl.contributionsPerDay,
                                    label: I18n.t('contributions_per_day_label', I18nScope()),
                                    dataKey: 'total',
                                    xAxis: item => h.momentify(item.paid_at),
                                    emptyState: I18n.t('contributions_per_day_empty', I18nScope())
                                }) : h.loader()
                            ])
                        ]),
                        m('.w-row', [
                            m('.w-col.w-col-12.u-text-center', [
                                m('.project-contributions-per-ref', [
                                    m('.fontweight-semibold.u-marginbottom-10.fontsize-large.u-text-center', [
                                        I18n.t('ref_origin_title', I18nScope()),
                                        ' ',
                                        buildTooltip('span.fontsize-smallest.tooltip-wrapper.fa.fa-question-circle.fontcolor-secondary')
                                    ]),
                                    !ctrl.lContributionsPerRef() ? !_.isEmpty(_.rest(ctrl.contributionsPerRefTable)) ? m.component(projectDataTable, {
                                        table: ctrl.contributionsPerRefTable,
                                        defaultSortIndex: -2
                                    }) : m('.card.u-radius.medium.u-marginbottom-60',
                                            m('.w-row.u-text-center.u-margintop-40.u-marginbottom-40',
                                                m('.w-col.w-col-8.w-col-push-2',
                                                    m('p.fontsize-base', I18n.t('contributions_per_ref_empty', I18nScope()))
                                                )
                                            )
                                        ) : h.loader()
                                ])
                            ])
                        ]),
                        m('.w-row', [
                            m('.w-col.w-col-12.u-text-center', [
                                m('.project-contributions-per-ref', [
                                    m('.fontweight-semibold.u-marginbottom-10.fontsize-large.u-text-center', I18n.t('location_origin_title', I18nScope())),
                                    !ctrl.lContributionsPerLocation() ? !_.isEmpty(_.rest(ctrl.contributionsPerLocationTable)) ? m.component(projectDataTable, {
                                        table: ctrl.contributionsPerLocationTable,
                                        defaultSortIndex: -2
                                    }) : m('.card.u-radius.medium.u-marginbottom-60',
                                            m('.w-row.u-text-center.u-margintop-40.u-marginbottom-40',
                                                m('.w-col.w-col-8.w-col-push-2',
                                                    m('p.fontsize-base', I18n.t('contributions_per_location_empty', I18nScope()))
                                                )
                                            )
                                        ) : h.loader()
                                ])
                            ])
                        ]),
                        m('.w-row', [
                            m('.w-col.w-col-12.u-text-center', [
                                m.component(projectReminderCount, {
                                    resource: project
                                })
                            ])
                        ])
                    ])
                ]),
            (project.can_cancel ?
                m.component(projectCancelButton, { project })
            : '')

            ] : ''
        ] : h.loader());
    }
};

export default insights;
