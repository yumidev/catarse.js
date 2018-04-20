/**
 * window.c.projectReport component
 * Render project report form
 *
 */
import m from 'mithril';
import _ from 'underscore';
import postgrest from 'mithril-postgrest';
import models from '../models';
import h from '../h';
import projectVM from '../vms/project-vm';
import inlineError from './inline-error';

const projectReport = {
    controller(args) {
        const displayForm = h.toggleProp(false, true),
            sendSuccess = m.prop(false),
            submitDisabled = m.prop(false),
            user = h.getUser() || {},
            email = m.prop(user.email),
            details = m.prop(''),
            reason = m.prop(''),
            reasonError = m.prop(false),
            detailsError = m.prop(false),
            storeReport = 'report',
            project = projectVM.currentProject(),
            hasPendingAction = project && (h.callStoredAction(storeReport) == project.project_id),
            checkLogin = () => {
                if (!_.isEmpty(user)) {
                    displayForm.toggle();
                } else {
                    h.storeAction(storeReport, project.project_id);
                    return h.navigateToDevise();
                }
            },
            validate = () => {
                let ok = true;
                detailsError(false);
                reasonError(false);
                if (_.isEmpty(reason())) {
                    reasonError(true);
                    ok = false;
                }
                if (_.isEmpty(details())) {
                    detailsError(true);
                    ok = false;
                }
                return ok;
            },
            sendReport = () => {
                if (!validate()) {
                    return false;
                }
                submitDisabled(true);
                const loaderOpts = models.projectReport.postOptions({
                    email: email(),
                    details: details(),
                    reason: reason(),
                    project_id: project.project_id
                });
                const l = postgrest.loaderWithToken(loaderOpts);

                l.load().then(sendSuccess(true));
                submitDisabled(false);
                return false;
            },
            checkScroll = (el, isInit) => {
                if (!isInit && hasPendingAction) {
                    h.animateScrollTo(el);
                }
            };


        if (!_.isEmpty(user) && hasPendingAction) {
            displayForm(true);
        }

        return {
            checkScroll,
            checkLogin,
            displayForm,
            sendSuccess,
            submitDisabled,
            sendReport,
            user,
            detailsError,
            reasonError,
            details,
            reason
        };
    },

    view(ctrl, args) {
        return m('.card.card-terciary.u-radius',
            [
                m('.fontsize-small.u-marginbottom-20',
                    [
                        'Este projeto desrespeita',
                        m.trust('&nbsp;'),
                        m('a.alt-link[href=\'http://suporte.catarse.me/hc/pt-br/articles/202387638\'][target=\'_blank\']',
                            'nossas regras? '
                          )
                    ]
                      ),
                ctrl.sendSuccess() ?
                       m('.w-form',
                        m('p',
                          '신고가 접수되었습니다.'
                          //coffee 'Obrigado! A sua denúncia foi recebida.(고마워요! 귀하의 불만이 접수되었습니다.)'
                        )
                      ) :
                [
                    m('.a.w-button.btn.btn-medium.btn-terciary.btn-inline[href=\'javascript:void(0);\']', { onclick: ctrl.checkLogin },
                        '프로젝트 신고'
                        //coffee 'Denunciar este projeto'
                      ),
                    ctrl.displayForm() ? m('#report-form.u-margintop-30',
                        m('.w-form',
                          m('form', { onsubmit: ctrl.sendReport, config: ctrl.checkScroll },
                              [
                                  m('.fontsize-small.fontweight-semibold.u-marginbottom-10',
                                '이 프로젝트를 신고하시는 이유가 무엇인가요?'
                                 //coffee 'Por que você está denunciando este projeto?(왜 이 프로젝트를 비난하고 있니?)'
                              ),
                                  m('select.w-select.text-field.positive[required=\'required\']', { onchange: m.withAttr('value', ctrl.reason) },
                                      [
                                          m('option[value=\'\']',
                                    '이유 선택'
                                     //coffee 'Selecione um motivo'
                                  ),
                                          m('option[value=\'지적 재산권 침해\']',
                                          //coffee m('option[value=\'Violação de propriedade intelectual\']',
                                    '지적 재산권 침해'
                                     //coffee 'Violação de propriedade intelectual'
                                  ),
                                          m('option[value=\'중상, 명예 훼손, 명예 훼손 또는 차별\']',
                                              //coffee m('option[value=\'Calúnia, injúria, difamação ou discriminação\']',
                                    '중상, 명예 훼손, 명예 훼손 또는 차별'
                                     //coffee 'Calúnia, injúria, difamação ou discriminação'
                                  ),
                                          m('option[value=\'금지 된 프로젝트의 범위\']',
                                              //coffee m('option[value=\'Escopo de projeto proibido\']',
                                    '금지 된 프로젝트의 범위'
                                    //coffee 'Escopo de projeto proibido'
                                  ),
                                          m('option[value=\'Recompensas proibidas\']',
                                    'Recompensas proibidas'
                                  ),
                                          m('option[value=\'Cenas de sexo explícitas e gratuitas\']',
                                    'Cenas de sexo explícitas e gratuitas'
                                  ),
                                          m('option[value=\'Abuso de SPAM\']',
                                              //coffee m('option[value=\'스팸 남용']',
                                    '스팸 남용'
                                    //coffee 'Abuso de SPAM용'
                                  ),
                                          m('option[value=\'Outros\']',
                                              //coffee m('option[value=\'기타\']',
                                    '기타'
                                     //coffee 'Outros'
                                  )
                                      ]
                              ),
                                  (ctrl.reasonError() ? m(inlineError, { message: '이유 선택' }) : ''),
                                  //coffee (ctrl.reasonError() ? m(inlineError, { message: 'Selecione um motivo' }) : ''),
                                  m('textarea.w-input.text-field.positive.u-marginbottom-30', { placeholder: 'Por favor, dê mais detalhes que nos ajudem a identificar o problema.', onchange: m.withAttr('value', ctrl.details) }),
                                  //coffee m('textarea.w-input.text-field.positive.u-marginbottom-30', { placeholder: '문제를 파악하는 데 도움이되는 세부 정보를 제공해주세요.', onchange: m.withAttr('value', ctrl.details) }),
                                  m('.w-row',
                                  (ctrl.detailsError() ? m(inlineError, { message: '불만 사항을 신고하십시오.' }) : '')),
                                  //coffee (ctrl.detailsError() ? m(inlineError, { message: 'Informe os detalhes da denúncia.' }) : '')),
                                  m('input.w-button.btn.btn-medium.btn-inline.btn-dark[type=\'submit\'][value=\'불만 신고\']', { disabled: ctrl.submitDisabled() })
                                  //coffee m('input.w-button.btn.btn-medium.btn-inline.btn-dark[type=\'submit\'][value=\'Enviar denúncia\']', { disabled: ctrl.submitDisabled() })
                              ]
                          )
                        )
                      ) : '']

            ]
                  );
    }
};

export default projectReport;
