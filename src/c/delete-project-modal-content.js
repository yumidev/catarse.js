/**
 * window.c.deleteProjectModalContent component
 * Render delete project modal
 *
 */
import m from 'mithril';
import postgrest from 'mithril-postgrest';
import h from '../h';
import models from '../models';

const deleteProjectModalContent = {
    controller(args) {
        let l = m.prop(false);
        const deleteSuccess = m.prop(false),
            confirmed = m.prop(true),
            error = m.prop(''),
            check = m.prop('');

        const deleteProject = () => {
            if (check() === 'deletar-rascunho') {
                const loaderOpts = models.deleteProject.postOptions({
                    _project_id: args.project.project_id
                });
                l = postgrest.loaderWithToken(loaderOpts);
                l.load().then(() => {
                    deleteSuccess(true);
                }).catch((err) => {
                    confirmed(false);
                    error('프로젝트를 삭제하는 중 오류가 발생했습니다. 다시 시도해 주시길 바랍니다.');
                    m.redraw();
                });
            } else {
                confirmed(false);
                error('다음 오류를 수정해 주시길 바랍니다: 프로젝트를 영구히 삭제하려면 "임시 보관함 삭제".');
            }
            return false;
        };

        return {
            deleteProject,
            confirmed,
            deleteSuccess,
            error,
            check
        };
    },
    view(ctrl, args) {
        return m('div',
                 (ctrl.deleteSuccess() ? '' : m('.modal-dialog-header',
                  m('.fontsize-large.u-text-center',
                      [
                          '확인 ',
                          m('span.fa.fa-trash',
                        ''
                      )
                      ]
                  )
                )),
                m('form.modal-dialog-content', { onsubmit: ctrl.deleteProject },
                  (ctrl.deleteSuccess() ? [m('.fontsize-base.u-margintop-30', '프로젝트를 성공적으로 삭제했습니다. 아래 링크를 클릭하면 홈페이지로 돌아갑니다.'),
                      m(`a.btn.btn-inactive.btn-large.u-margintop-30[href='/pt/users/${h.getUser().user_id}/edit#projects']`, '뒤로')
                  ] :
                  [
                      m('.fontsize-base.u-marginbottom-60',
                          [
                              '프로젝트가 영구적으로 삭제되고 초안에 기입한 모든 데이터가 검색되지 않습니다.'
                          ]
                    ),
                      m('.fontsize-base.u-marginbottom-10',
                          [
                              '편지 쓰기 확인',
                              'no campo abaixo ',
                              m('span.fontweight-semibold.text-error',
                          '초안 삭제'
                        )
                          ]
                    ),
                      m('.w-form',
                      m('.text-error.u-marginbottom-10', ctrl.error()),
                          [
                              m('div',
                          m('input.positive.text-field.u-marginbottom-40.w-input[maxlength=\'256\'][type=\'text\']', { class: ctrl.confirmed() ? false : 'error', placeholder: '초안 삭제', onchange: m.withAttr('value', ctrl.check) })
                        )
                          ]
                    ),
                      m('div',
                      m('.w-row',
                          [
                              m('.w-col.w-col-3'),
                              m('.u-text-center.w-col.w-col-6',
                                  [
                                      m('input.btn.btn-inactive.btn-large.u-marginbottom-20[type=\'submit\'][value=\'Deletar para sempre\']'),
                                      m('a.fontsize-small.link-hidden-light[href=\'#\']', { onclick: args.displayDeleteModal.toggle }, '취소'
                              )
                                  ]
                          ),
                              m('.w-col.w-col-3')
                          ]
                      )
                    )
                  ])
                ));
    }
};

export default deleteProjectModalContent;
