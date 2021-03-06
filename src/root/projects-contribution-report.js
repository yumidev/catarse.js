import m from 'mithril';
import _ from 'underscore';
import postgrest from 'mithril-postgrest';
import models from '../models';
import h from '../h';
import projectDashboardMenu from '../c/project-dashboard-menu';
import projectContributionReportHeader from '../c/project-contribution-report-header';
import projectContributionReportContent from '../c/project-contribution-report-content';
import projectsContributionReportVM from '../vms/projects-contribution-report-vm';
import FilterMain from '../c/filter-main';
import FilterDropdown from '../c/filter-dropdown';
import downloadReports from '../c/download-reports';
import InfoProjectContributionLegend from '../c/info-project-contribution-legend';
import ProjectContributionStateLegendModal from '../c/project-contribution-state-legend-modal';
import ProjectContributionDeliveryLegendModal from '../c/project-contribution-delivery-legend-modal';

const projectContributionReport = {
    controller(args) {
        const listVM = postgrest.paginationVM(models.projectContribution, 'id.desc', {
                Prefer: 'count=exact'
            }),
            filterVM = projectsContributionReportVM,
            project = m.prop([{}]),
            rewards = m.prop([]),
            showDownloads = m.prop(false),
            contributionStateOptions = m.prop([]),
            reloadSelectOptions = (projectState) => {
                let opts = [{
                    value: '',
                    option: '모두'
                    //coffee option: 'Todos'
                }];

                const optionsMap = {
                    online: [{
                        value: 'paid',
                        option: '확인됨'
                        //coffee option: 'Confirmado'
                    },
                    {
                        value: 'pending',
                        option: '시작됨'
                        //coffee option: 'Iniciado'
                    },
                    {
                        value: 'refunded,chargeback,deleted,pending_refund',
                        option: '답변됨'
                        //coffee option: 'Contestado'
                    }
                    ],
                    waiting_funds: [{
                        value: 'paid',
                        option: '확인됨'
                        //coffee option: 'Confirmado'
                    },
                    {
                        value: 'pending',
                        option: '시작됨'
                        //coffee option: 'Iniciado'
                    },
                    {
                        value: 'refunded,chargeback,deleted,pending_refund',
                        option: '답변됨'
                        //coffee option: 'Contestado'
                    }
                    ],
                    failed: [{
                        value: 'refunded',
                        option: '환불됨'
                        //coffee option: 'Reembolsado'
                    },
                    {
                        value: 'paid',
                        option: '환불이 시작되지 않았습니다.'
                        //coffee option: 'Reembolso não iniciado'
                    }
                    ],
                    successful: [{
                        value: 'paid',
                        option: '확인됨'
                        //coffee option: 'Confirmado'
                    },
                    {
                        value: 'refunded,chargeback,deleted,pending_refund',
                        option: '답변됨'
                        //coffee option: 'Contestado'
                    }
                    ]
                };

                opts = opts.concat(optionsMap[projectState] || []);

                contributionStateOptions(opts);
            },
            submit = () => {
                if (filterVM.reward_id() === 'null') {
                    listVM.firstPage(filterVM.withNullParameters()).then(null);
                } else {
                    listVM.firstPage(filterVM.parameters()).then(null);
                }

                return false;
            },
            filterBuilder = [{
                component: FilterMain,
                data: {
                    inputWrapperClass: '.w-input.text-field',
                    btnClass: '.btn.btn-medium',
                    vm: filterVM.full_text_index,
                    placeholder: '후원자의 이름 또는 이메일로 검색'
                    //coffee placeholder: 'Busque por nome ou email do apoiador'
                }
            },
            {
                label: 'reward_filter',
                component: FilterDropdown,
                data: {
                    label: '보상',
                    //coffee label: 'Recompensa',
                    onchange: submit,
                    name: 'reward_id',
                    vm: filterVM.reward_id,
                    wrapper_class: '.w-sub-col.w-col.w-col-3',
                    options: []
                }
            },
            {
                label: 'delivery_filter',
                component: FilterDropdown,
                data: {
                    custom_label: [InfoProjectContributionLegend, {
                        content: [ProjectContributionDeliveryLegendModal],
                        text: '배송 상태'
                        //coffee text: 'Status da entrega'
                    }],
                    onchange: submit,
                    name: 'delivery_status',
                    vm: filterVM.delivery_status,
                    wrapper_class: '.w-sub-col.w-col.w-col-3',
                    options: [{
                        value: '',
                        option: '모두'
                        //coffee option: 'Todos'
                    },
                    {
                        value: 'undelivered',
                        option: '배달되지 않음'
                        //coffee option: 'Não entregue'
                    },
                    {
                        value: 'delivered',
                        option: '배달됨'
                        //coffee option: 'Entregue'
                    },
                    {
                        value: 'error',
                        option: '발신 오류'
                        //coffee option: 'Erro no envio'
                    },
                    {
                        value: 'received',
                        option: '받은'
                        //coffee option: 'Recebida'
                    }
                    ]
                }
            },
            {
                label: 'survey_filter',
                component: FilterDropdown,
                data: {
                    label: 'Status do questionário',
                    onchange: submit,
                    name: 'survey_status',
                    vm: filterVM.survey_status,
                    wrapper_class: '.w-col.w-col-3',
                    options: [{
                        value: '',
                        option: '모두'
                        //coffee option: 'Todos'
                    },
                    {
                        value: 'not_sent',
                        option: '전송되지 않음'
                        //coffee option: 'Não enviado'
                    },
                    {
                        value: 'sent,answered',
                        option: '전송됨'
                        //coffee option: 'Enviado'
                    },
                    {
                        value: 'sent',
                        option: '대답이 없다.'
                        //coffee option: 'Não Respondido'
                    },
                    {
                        value: 'answered',
                        option: '답변됨'
                        //coffee option: 'Respondido'
                    }
                    ]
                }
            },
            {
                label: 'payment_state',
                component: FilterDropdown,
                data: {
                    custom_label: [InfoProjectContributionLegend, {
                        text: '지원 상태',
                        //coffee text: 'Status do apoio',
                        content: [ProjectContributionStateLegendModal, {
                            project
                        }]
                    }],
                    name: 'state',
                    onchange: submit,
                    vm: filterVM.state,
                    wrapper_class: '.w-sub-col.w-col.w-col-3',
                    options: contributionStateOptions
                }
            }
            ];

        filterVM.project_id(args.project_id);

        const lReward = postgrest.loaderWithToken(models.rewardDetail.getPageOptions({
            project_id: `eq.${filterVM.project_id()}`
        }));
        const lProject = postgrest.loaderWithToken(models.projectDetail.getPageOptions({
            project_id: `eq.${filterVM.project_id()}`
        }));

        lReward.load().then(rewards);
        lProject.load().then((data) => {
            project(data);
            reloadSelectOptions(_.first(data).state);
        });

        const mapRewardsToOptions = () => {
            let options = [];
            if (!lReward()) {
                options = _.map(rewards(), r => ({
                    value: r.id,
                    option: `R$ ${h.formatNumber(r.minimum_value, 2, 3)} - ${(r.title ? r.title : r.description).substring(0, 20)}`
                }));
            }

            options.unshift({
                value: null,
                option: '보상 없음'
                //coffee option: 'Sem recompensa'
            });

            options.unshift({
                value: '',
                option: '모두'
                //coffee option: 'Todas'
            });

            return options;
        };

        if (!listVM.collection().length) {
            if (m.route.param('rewardId')) {
                filterVM.reward_id(m.route.param('rewardId'));
            }
            listVM.firstPage(filterVM.parameters());
        }

        return {
            listVM,
            filterVM,
            filterBuilder,
            submit,
            lProject,
            rewards,
            project,
            showDownloads,
            mapRewardsToOptions
        };
    },
    view(ctrl) {
        const list = ctrl.listVM;

        if (!ctrl.lProject()) {
            return m('', [
                m.component(projectDashboardMenu, {
                    project: m.prop(_.first(ctrl.project()))
                }),
                ctrl.showDownloads() ? m(downloadReports, {
                    project: m.prop(_.first(ctrl.project())),
                    rewards: ctrl.rewards()
                }) : [
                    m(`.w-section.section-product.${_.first(ctrl.project()).mode}`),
                    m.component(projectContributionReportHeader, {
                        submit: ctrl.submit,
                        filterBuilder: ctrl.filterBuilder,
                        form: ctrl.filterVM.formDescriber,
                        mapRewardsToOptions: ctrl.mapRewardsToOptions,
                        filterVM: ctrl.filterVM
                    }),
                    m.component(projectContributionReportContent, {
                        submit: ctrl.submit,
                        list,
                        showDownloads: ctrl.showDownloads,
                        filterVM: ctrl.filterVM,
                        project: m.prop(_.first(ctrl.project()))
                    })]
            ]);
        }
        return m('', h.loader());
    }
};

export default projectContributionReport;
