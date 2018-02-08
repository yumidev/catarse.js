import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import I18n from 'i18n-js';
import railsErrorsVM from '../vms/rails-errors-vm';
import projectCardVM from '../vms/project-card-vm';
import popNotification from './pop-notification';
import inputCard from './input-card';
import projectEditSaveBtn from './project-edit-save-btn';
import projectCard from './project-card';

const I18nScope = _.partial(h.i18nScope, 'projects.dashboard_card');

const projectCardEdit = {
    controller(args) {
        const vm = projectCardVM,
            mapErrors = [
                  ['uploaded_image', ['uploaded_image']],
                  ['headline', ['headline']]
            ],
            showSuccess = h.toggleProp(false, true),
            showError = h.toggleProp(false, true),
            loading = m.prop(false),
            onSubmit = (event) => {
                loading(true);
                m.redraw();
                vm.uploadImage(args.projectId).then((uploaded) => {
                    vm.updateProject(args.projectId).then((data) => {
                        loading(false);
                        vm.e.resetFieldErrors();
                        if (!showSuccess()) { showSuccess.toggle(); }
                        if (showError()) { showError.toggle(); }
                        vm.reloadCurrentProject();
                        railsErrorsVM.validatePublish();
                    }).catch((err) => {
                        if (err.errors_json) {
                            railsErrorsVM.mapRailsErrors(err.errors_json, mapErrors, vm.e);
                        }
                        loading(false);
                        if (showSuccess()) { showSuccess.toggle(); }
                        if (!showError()) { showError.toggle(); }
                        m.redraw();
                    });
                }).catch((uploaderr) => {
                    if (uploaderr.errors_json) {
                        railsErrorsVM.mapRailsErrors(uploaderr.errors_json, mapErrors, vm.e);
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
            vm,
            loading
        };
    },
    view(ctrl, args) {
        const vm = ctrl.vm;
        return m('#card-tab', [
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
                m('.w-section.section', [
                    m('.w-container', [
                        m('.w-row', [
                            m('.w-col.w-col-8', [
                                m(inputCard, {
                                    label: I18n.t('uploaded_image_label', I18nScope()),
                                    label_hint: I18n.t('uploaded_image_hint', I18nScope()),
                                    children: [
                                        m('input.file.optional.w-input.text-field[id="project_uploaded_image"][name="project[uploaded_image]"][type="file"]', {
                                            class: vm.e.hasError('uploaded_image') ? 'error' : false,
                                            onchange: vm.prepareForUpload
                                        }),
                                        vm.e.inlineError('uploaded_image')
                                    ]
                                }),
                                m(inputCard, {
                                    label: I18n.t('headline_label', I18nScope()),
                                    label_hint: I18n.t('headline_label_hint', I18nScope()),
                                    children: [
                                        m('textarea.text.optional.w-input.text-field.positive[id="project_headline"][maxlength="100"][name="project[headline]"][rows="3"]', {
                                            onchange: m.withAttr('value', vm.fields.headline),
                                            class: vm.e.hasError('headline') ? 'error' : false
                                        }, vm.fields.headline()),
                                        vm.e.inlineError('headline')
                                    ]
                                })
                            ]),
                            m(projectCard, { project: vm.currentProject(), type: 'small' })
                        ])
                    ])
                ]),
                m(projectEditSaveBtn, { loading: ctrl.loading, onSubmit: ctrl.onSubmit })
            ])

        ]);
    }
};

export default projectCardEdit;
