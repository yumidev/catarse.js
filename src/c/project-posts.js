import m from 'mithril';
import I18n from 'i18n-js';
import postgrest from 'mithril-postgrest';
import _ from 'underscore';
import models from '../models';
import h from '../h';

const I18nScope = _.partial(h.i18nScope, 'projects.posts');

const projectPosts = {
    controller(args) {
        const listVM = postgrest.paginationVM(models.projectPostDetail),
            filterVM = postgrest.filtersVM({
                project_id: 'eq',
                id: 'eq'
            });
        const scrollTo = (el, isInit) => {
            if (!isInit) {
                h.animateScrollTo(el);
            }
        };

        filterVM.project_id(args.project().project_id);

        if (_.isNumber(args.post_id)) {
            filterVM.id(args.post_id);
        }

        if (!listVM.collection().length) {
            listVM.firstPage(filterVM.parameters());
        }

        return {
            listVM,
            filterVM,
            scrollTo
        };
    },
    view(ctrl, args) {
        const list = ctrl.listVM,
            project = args.project() || {};

        return m('#posts.project-posts.w-section', { config: ctrl.scrollTo }, [
            m('.w-container.u-margintop-20', [
                (project.is_owner_or_admin ? [
                    (!list.isLoading()) ?
                    (_.isEmpty(list.collection()) ? m('.w-hidden-small.w-hidden-tiny', [
                        m('.fontsize-base.u-marginbottom-30.u-margintop-20', 'Givingwire에 게시 된 모든 뉴스는 프로젝트를 이미 후원 한 사람들의 이메일로 직접 전송되며 웹 사이트에서도 볼 수 있습니다. 공개로 하거나 이 탭의 서포터에게만 표시되도록 선택할 수 있습니다.')
                    ]) : '') : '',
                    m('.w-row.u-marginbottom-20', [
                        m('.w-col.w-col-4.w-col-push-4', [
                            m(`a.btn.btn-edit.btn-small[href='/pt/projects/${project.project_id}/posts']`, 'Escrever novidade')
                        ])
                    ])
                ] : ''), (_.map(list.collection(), post => m('.w-row', [
                    m('.w-col.w-col-1'),
                    m('.w-col.w-col-10', [
                        m('.post', [
                            m('.u-marginbottom-60 .w-clearfix', [
                                m('.fontsize-small.fontcolor-secondary.u-text-center', h.momentify(post.created_at)),
                                m('p.fontweight-semibold.fontsize-larger.u-text-center.u-marginbottom-30', [
                                    m(`a.link-hidden[href="/projects/${post.project_id}/posts/${post.id}#posts"]`, post.title)
                                ]),
                                    (!_.isEmpty(post.comment_html) ? m('.fontsize-base', m.trust(post.comment_html)) : m('.fontsize-base', `Post exclusivo para apoiadores${post.reward_id ? ` da recompensa de R$${post.minimum_value}` : ''}.`))
                            ]),
                            m('.divider.u-marginbottom-60')
                        ])
                    ]),
                    m('.w-col.w-col-1')
                ]))),
                m('.w-row', [
                    (!_.isUndefined(args.post_id) ? '' :
                        (!list.isLoading() ?
                            (list.collection().length === 0 && args.projectContributions().length === 0) ?
                                !project.is_owner_or_admin ? m('.w-col.w-col-10.w-col-push-1',
                                    m('p.fontsize-base',
                                        m.trust(
                                            I18n.t('empty',
                                                I18nScope({
                                                    project_user_name: args.userDetails().name,
                                                    project_id: project.project_id
                                                })
                                            )
                                        )
                                    )
                                ) : ''
                            : m('.w-col.w-col-2.w-col-push-5',
                                (list.isLastPage() ?
                                    list.collection().length === 0 ? '뉴스 없음.' : ''
                                 : m('button#load-more.btn.btn-medium.btn-terciary', {
                                     onclick: list.nextPage
                                 }, 'Carregar mais'))
                            ) :
                            m('.w-col.w-col-2.w-col-push-5', h.loader())
                        ))

                ])
            ])
        ]);
    }
};

export default projectPosts;
