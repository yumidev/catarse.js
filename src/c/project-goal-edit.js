import m from 'mithril';
import _ from 'underscore';
import I18n from 'i18n-js';
import h from '../h';
import railsErrorsVM from '../vms/rails-errors-vm';
import projectGoalVM from '../vms/project-goal-vm';
import popNotification from './pop-notification';
import bigCard from './big-card';
import projectEditSaveBtn from './project-edit-save-btn';

const I18nScope = _.partial(h.i18nScope, 'projects.dashboard_goal');

const projectGoalEdit = {
    controller(args) {
        const vm = projectGoalVM,
            mapErrors = [
                  ['mode', ['mode']],
                  ['goal', ['goal']],
                  ['online_days', ['online_days']]
            ],
            showSuccess = h.toggleProp(false, true),
            showError = h.toggleProp(false, true),
            showModeDiff = h.toggleProp(false, true),
            showTaxesDiff = h.toggleProp(false, true),
            applyGoalMask = _.compose(vm.fields.goal, h.applyMonetaryMask),
            loading = m.prop(false),
            onSubmit = (event) => {
                loading(true);
                m.redraw();
                vm.updateProject(args.projectId).then((data) => {
                    loading(false);
                    vm.e.resetFieldErrors();
                    if (!showSuccess()) { showSuccess.toggle(); }
                    if (showError()) { showError.toggle(); }
                    railsErrorsVM.validatePublish();
                }).catch((err) => {
                    if (err.errors_json) {
                        railsErrorsVM.mapRailsErrors(err.errors_json, mapErrors, vm.e);
                    }
                    loading(false);
                    if (showSuccess()) { showSuccess.toggle(); }
                    if (!showError()) { showError.toggle(); }
                });
                return false;
            };

        if (railsErrorsVM.railsErrors()) {
            railsErrorsVM.mapRailsErrors(railsErrorsVM.railsErrors(), mapErrors, vm.e);
        }
        vm.fillFields(args.project);

        return {
            onSubmit,
            showSuccess,
            showError,
            showModeDiff,
            showTaxesDiff,
            vm,
            applyGoalMask,
            loading
        };
    },
    view(ctrl, args) {
        const vm = ctrl.vm;
        return m('#goal-tab', [
            (ctrl.showSuccess() ? m.component(popNotification, {
                message: I18n.t('shared.successful_update'),
                toggleOpt: ctrl.showSuccess
            }) : ''),
            (ctrl.showError() ? m.component(popNotification, {
                message: I18n.t('shared.failed_update'),
                toggleOpt: ctrl.showError,
                error: true
            }) : ''),

            m('form.w-form', { onsubmit: ctrl.onSubmit }, [
                m('.w-container', [
                    m('.w-row', [
                        m('.w-col.w-col-10.w-col-push-1', [
                            m(bigCard, {
                                label: I18n.t('mode_label', I18nScope()),
                                label_hint: I18n.t('mode_hint', I18nScope()),
                                children: [
                                    m('.flex-row.u-marginbottom-30', [
                                        m('a.choose-mode.choose-aon.w-inline-block.btn-select.flex-column.u-text-center[data-mode="aon"][href="javascript:void(0);"]', {
                                            onclick: vm.genClickChangeMode('aon'),
                                            class: vm.fields.mode() == 'aon' ? 'selected' : false
                                        }, [
                                            m('img[alt="Badge aon"][src="/assets/catarse_bootstrap/badge-aon.png"]')
                                        ]),
                                        m('a.choose-mode.choose-flex.w-inline-block.btn-select.flex-column.u-text-center[data-mode="flex"][href="javascript:void(0);"]', {
                                            onclick: vm.genClickChangeMode('flex'),
                                            class: vm.fields.mode() == 'flex' ? 'selected' : false
                                        }, [
                                            m('img[alt="Badge flex"][src="/assets/catarse_bootstrap/badge-flex.png"]')
                                        ])
                                    ]),
                                    m('.u-text-center.fontsize-smaller', [
                                        m('a.mode-diff-toggle.link-hidden-light.fontweight-semibold[href="javascript:void(0);"]', { onclick: ctrl.showModeDiff.toggle }, [
                                            'Veja a diferença entre os modelos ',
                                            m('span.fa.fa-chevron-down')
                                        ])
                                    ]),
                                    (ctrl.showModeDiff() ? m('.mode-diff.u-margintop-30', [
                                        m('.flex-row', [
                                            m('.w-hidden-small.w-hidden-tiny.fontsize-smaller.flex-column', m.trust(I18n.t('aon_diff_html', I18nScope()))),
                                            m('.w-hidden-small.w-hidden-tiny.fontsize-smaller.flex-column', m.trust(I18n.t('flex_diff_html', I18nScope())))
                                        ]),
                                        m('.u-text-center.u-margintop-30', [
                                            m('.divider.u-marginbottom-20'),
                                            m('.fontsize-base', I18n.t('want_more', I18nScope())),
                                            m.trust(I18n.t('mode_diff_ebook', I18nScope()))
                                        ])
                                    ]) : '')
                                ]
                            }),
                            m(bigCard, {
                                label: I18n.t('goal_label', I18nScope()),
                                label_hint: I18n.t('goal_hint', I18nScope()),
                                children: [
                                    m('.w-row.u-marginbottom-30', [
                                        m('.w-col.w-col-2'),
                                        m('.w-col.w-col-8', [
                                            m('.w-row', [
                                                m('.w-col.w-col-4.w-col-small-6.w-col-tiny-6.text-field.prefix.no-hover.medium.prefix-permalink', [
                                                    m('.fontcolor-secondary.u-text-center.fontsize-base.lineheight-tightest', 'R$')
                                                ]),
                                                m('.w-col.w-col-8.w-col-small-6.w-col-tiny-6.label-hide',
                                                    [
                                                        m('.input.tel.optional.project_goal', [
                                                            m('label.field-label'),
                                                            m('input.string.optional.w-input.text-field.postfix.positive.medium[autocomplete="off"][id="project-goal-input"][name="project[goal]"][type="tel"]', {
                                                                class: vm.e.hasError('goal') ? 'error' : false,
                                                                value: vm.fields.goal(),
                                                                maxlength: 14,
                                                                onkeyup: m.withAttr('value', ctrl.applyGoalMask)
                                                            })
                                                        ])
                                                    ])
                                            ]),
                                            m('.u-text-center', vm.e.inlineError('goal'))
                                        ]),
                                        m('.w-col.w-col-2')
                                    ]),
                                    m('.u-text-center.fontsize-smaller.fontweight-semibold', [
                                        m('a.fee-toggle.link-hidden-light[href="javascript:void(0)"]', {
                                            onclick: ctrl.showTaxesDiff.toggle
                                        }, [
                                            I18n.t('goal_taxes_link', I18nScope()),
                                            m('span.fa.fa-chevron-down')
                                        ])
                                    ]),
                                    (ctrl.showTaxesDiff() ? m('.fee-explanation.u-margintop-30', [
                                        m('.u-marginbottom-30', [
                                            m('.fontsize-small.fontweight-semibold', I18n.t('goal_taxes_label', I18nScope())),
                                            m('.fontsize-smaller', I18n.t(`goal_${vm.fields.mode()}_taxes_hint`, I18nScope()))
                                        ]),
                                        m('.u-text-center.u-margintop-30', [
                                            m('.divider.u-marginbottom-20'),
                                            m('.fontsize-base', I18n.t('want_more', I18nScope())),
                                            m.trust(I18n.t('goal_taxes_watch_video_html', I18nScope()))
                                        ])
                                    ]) : '')
                                ]
                            }),
                            m(bigCard, {
                                label: I18n.t('online_days_label', I18nScope()),
                                label_hint: m.trust(I18n.t(`online_days_${vm.fields.mode()}_hint`, I18nScope())),
                                children: (vm.fields.mode() == 'aon' ? [
                                    m('.w-row', [
                                        m('.w-col.w-col-2'),
                                        m('.w-col.w-col-8', [
                                            m('.w-row', [
                                                m('.w-col.w-col-8.label-hide', [
                                                    m('.input.integer.optional.disabled.project_online_days', [
                                                        m('label.field-label'),
                                                        m('input.numeric.integer.optional.disabled.w-input.text-field.postfix.positive.medium[id="project_online_days"][name="project[online_days]"][type="number"]', {
                                                            onchange: m.withAttr('value', vm.fields.online_days),
                                                            value: vm.fields.online_days(),
                                                            class: vm.e.hasError('online_days') ? 'error' : false
                                                        })
                                                    ])
                                                ]),
                                                m('.w-col.w-col-4', [
                                                    m('.text-field.medium.prefix-permalink.u-text-center', [
                                                        m('', 'dias')])
                                                ])
                                            ]),
                                            vm.e.inlineError('online_days')
                                        ])
                                    ])
                                ] : [
                                    m('.flex-row', [
                                        m('a.choose-time.choose-unlimited.w-inline-block.btn-select.flex-column.u-text-center', {
                                            class: _.isEmpty(vm.fields.online_days().toString()) ? 'selected' : '',
                                            onclick: () => { vm.fields.online_days(''); }
                                        }, [
                                            m('.fontsize-base.fontweight-semibold.u-marginbottom-20', I18n.t('online_days_open', I18nScope())),
                                            m('.w-hidden-tiny', I18n.t('online_days_open_hint', I18nScope()))
                                        ]),
                                        m('a.choose-time.choose-limited.w-inline-block.btn-select.flex-column.u-text-center', {
                                            class: _.isEmpty(vm.fields.online_days().toString()) ? '' : 'selected',
                                            onclick: () => { vm.fields.online_days(1); }
                                        }, [
                                            m('.fontsize-base.fontweight-semibold.u-marginbottom-20', I18n.t('online_days_closed', I18nScope())),
                                            m('.w-hidden-tiny.u-marginbottom-30', I18n.t('online_days_closed_hint', I18nScope())),
                                            m('.w-row', [
                                                m('.w-col.w-col-6.label-hide', [
                                                    m('.input.integer.optional.project_online_days', [
                                                        m('label.field-label'),
                                                        m('input.numeric.integer.optional.w-input.text-field.field.w-input.text-field.medium.prefix[id="project_online_days"][name="project[online_days]"][type="number"]', {
                                                            onchange: m.withAttr('value', vm.fields.online_days),
                                                            value: vm.fields.online_days(),
                                                            class: vm.e.hasError('online_days') ? 'error' : false
                                                        })
                                                    ])
                                                ]),
                                                m('.w-col.w-col-6', [
                                                    m('.text-field.medium.prefix-permalink', {
                                                        class: vm.e.hasError('online_days') ? 'error' : false
                                                    }, [
                                                        m('', 'dias')
                                                    ])
                                                ])
                                            ]),
                                            m('.w-row', vm.e.inlineError('online_days'))
                                        ])
                                    ])
                                ])
                            })
                        ])
                    ])
                ]),
                m(projectEditSaveBtn, { loading: ctrl.loading, onSubmit: ctrl.onSubmit })
            ])

        ]);
    }
};

export default projectGoalEdit;
