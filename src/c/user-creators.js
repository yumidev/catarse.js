/**
 * window.c.userCreators component
 * Shows all user creators suggestions cards
 *
 * Example of use:
 * view: () => {
 *   ...
 *   m.component(c.userCreators, {user: user})
 *   ...
 * }
 */
import m from 'mithril';
import postgrest from 'mithril-postgrest';
import _ from 'underscore';
import h from '../h';
import models from '../models';
import UserFollowCard from '../c/user-follow-card';
import loadMoreBtn from '../c/load-more-btn';

const userCreators = {
    controller() {
        models.creatorSuggestion.pageSize(9);
        const creatorsListVM = postgrest.paginationVM(
            models.creatorSuggestion,
            'following.asc, total_published_projects.desc, total_contributed_projects.desc', {
                Prefer: 'count=exact'
            });
        const allLoading = m.prop(false);
        const followAll = () => {
            allLoading(true);
            const l = postgrest.loaderWithToken(models.followAllCreators.postOptions({}));

            l.load().then(() => {
                creatorsListVM.firstPage();
                allLoading(false);
            });
        };

        if (!creatorsListVM.collection().length) {
            creatorsListVM.firstPage();
        }

        return {
            allLoading,
            creatorsListVM,
            followAll
        };
    },
    view(ctrl) {
        const creatorsVM = ctrl.creatorsListVM;

        return m('.w-section.bg-gray.before-footer.section', [
            m('.w-container', [
                m('.w-row.u-marginbottom-40.card.u-radius.card-terciary', [
                    m('.w-col.w-col-7.w-col-small-6.w-col-tiny-6', [
                        m('.fontsize-small', 'Siga os realizadores que você já apoiou e saiba em primeira mão sempre que eles apoiarem projetos ou lançarem novas campanhas!')
                    ]),
                    m('.w-col.w-col-5.w-col-small-6.w-col-tiny-6', [
                        (ctrl.allLoading() ? h.loader()
                         : m('a.w-button.btn.btn-medium', {
                             onclick: ctrl.followAll
                         }, `Siga todos os ${creatorsVM.total() ? creatorsVM.total() : ''} realizadores`))
                    ])
                ]),
                m('.w-row', [
                    _.map(creatorsVM.collection(), friend => m.component(
                            UserFollowCard,
                        {
                            friend: _.extend({}, {
                                friend_id: friend.user_id
                            }, friend)
                        }))
                ]),
                m('.w-section.section.bg-gray', [
                    m('.w-container', [
                        m('.w-row.u-marginbottom-60', [
                            m('.w-col.w-col-5', [
                                m('.u-marginright-20')
                            ]), m.component(loadMoreBtn, { collection: creatorsVM }),
                            m('.w-col.w-col-5')
                        ])
                    ])
                ])

            ])
        ])
        ;
    }
};

export default userCreators;
