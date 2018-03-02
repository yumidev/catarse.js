import m from 'mithril';
import _ from 'underscore';
import userVM from '../vms/user-vm';
import h from '../h';
import models from '../models';

const menuProfile = {
    controller(args) {
        const contributedProjects = m.prop(),
            latestProjects = m.prop([]),
            userDetails = m.prop({}),
            user_id = args.user.user_id,
            userBalance = m.prop(0),
            userIdVM = postgrest.filtersVM({ user_id: 'eq' });

        const userName = () => {
            const name = userVM.displayName(userDetails());
            if (name && !_.isEmpty(name)) {
                return _.first(name.split(' '));
            }

            return '';
        };

        userVM.fetchUser(user_id, true, userDetails);

        userIdVM.user_id(user_id);
        models.balance.getRowWithToken(userIdVM.parameters()).then((result) => {
            const data = _.first(result) || { amount: 0, user_id };
            userBalance(data.amount);
        });

        return {
            contributedProjects,
            latestProjects,
            userDetails,
            userName,
            toggleMenu: h.toggleProp(false, true),
            userBalance
        };
    },
    view(ctrl, args) {
        const user = ctrl.userDetails();

        return m('.w-dropdown.user-profile',
            [
                m('.w-dropdown-toggle.dropdown-toggle.w-clearfix[id=\'user-menu\']',
                    {
                        onclick: ctrl.toggleMenu.toggle
                    },
                    [
                        m('.user-name-menu', [
                            m('.fontsize-smaller.lineheight-tightest.text-align-right', ctrl.userName()),
                            (ctrl.userBalance() > 0 ? m('.fontsize-smallest.fontweight-semibold.text-success', `R$ ${h.formatNumber(ctrl.userBalance(), 2, 3)}`) : '')

                        ]),
                        m(`img.user-avatar[alt='Thumbnail - ${user.name}'][height='40'][src='${h.useAvatarOrDefault(user.profile_img_thumbnail)}'][width='40']`)
                    ]
                ),
                ctrl.toggleMenu() ? m('nav.w-dropdown-list.dropdown-list.user-menu.w--open[id=\'user-menu-dropdown\']', { style: 'display:block;' },
                    [
                        m('.w-row',
                            [
                                m('.w-col.w-col-12',
                                    [
                                        m('.fontweight-semibold.fontsize-smaller.u-marginbottom-10',
                                            '내 역사'
                                            //coffee 'Meu histórico'
                                        ),
                                        m('ul.w-list-unstyled.u-marginbottom-20',
                                            [
                                                m('li.lineheight-looser',
                                                  m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#balance']`,
                                                    m('span', [
                                                        '균형 ',
                                                        //coffee 'Saldo ',
                                                        (ctrl.userBalance() > 0 ? m('span.fontcolor-secondary',
                                                          `R$ ${h.formatNumber(ctrl.userBalance(), 2, 3)}`) : '')
                                                    ])
                                                   )
                                                 ),
                                                m('li.lineheight-looser',
                                                    m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#contributions']`,
                                                        '후원 내역'
                                                        //coffee 'Histórico de apoio'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                  m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#projects']`,
                                                    '생성된 프로젝트'
                                                      //coffee 'Projetos criados'
                                                   )
                                                 ),
                                                m('li.w-hidden-main.w-hidden-medium.lineheight-looser',
                                                    m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#projects']`,
                                                        '생성된 프로젝트'
                                                        //coffee 'Projetos criados'
                                                    )
                                                 )
                                            ]
                                        ),
                                        m('.fontweight-semibold.fontsize-smaller.u-marginbottom-10',
                                            '설정'
                                            //coffee 'Configurações'
                                        ),
                                        m('ul.w-list-unstyled.u-marginbottom-20',
                                            [
                                                m('li.lineheight-looser',
                                                  m('a.alt-link.fontsize-smaller[href=\'/connect-facebook/\']',
                                                    '친구 찾기'
                                                      //coffee 'Encontre amigos'
                                                   )
                                                 ),
                                                m('li.lineheight-looser',
                                                    m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#about_me']`,
                                                        '공개 프로필'
                                                        //coffee 'Perfil público'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                    m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#notifications']`,
                                                        '알림'
                                                        //coffee 'Notificações'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                    m(`a.alt-link.fontsize-smaller[href='/pt/users/${user.id}/edit#settings']`,
                                                        '지적 데이터'
                                                        //coffee 'Dados cadastrais'
                                                    )
                                                )
                                            ]
                                        ),
                                        m('.divider.u-marginbottom-20'),
                                        args.user.is_admin_role ? m('.fontweight-semibold.fontsize-smaller.u-marginbottom-10',
                                            '관리자'
                                            //coffee 'Admin'
                                        ) : '',
                                        args.user.is_admin_role ? m('ul.w-list-unstyled.u-marginbottom-20',
                                            [
                                                m('li.lineheight-looser',
                                                    m('a.alt-link.fontsize-smaller[href=\'/pt/new-admin#/users\']',
                                                        '사용자'
                                                        //coffee 'Usuários'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                    m('a.alt-link.fontsize-smaller[href=\'/pt/new-admin\']',
                                                        '후원'
                                                        //coffee 'Apoios'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                  m('a.alt-link.fontsize-smaller[href=\'/pt/new-admin#/balance-transfers\']',
                                                    'Saques'
                                                   )
                                                 ),
                                                m('li.lineheight-looser',
                                                    m('a.alt-link.fontsize-smaller[href=\'/pt/admin/financials\']',
                                                        '재무 관계'
                                                        //coffee 'Rel. Financeiros'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                    m('a.alt-link.fontsize-smaller[href=\'/pt/new-admin#/projects\']',
                                                        '관리 프로젝트'
                                                        //coffee 'Admin projetos'
                                                    )
                                                ),
                                                m('li.lineheight-looser',
                                                    m('a.alt-link.fontsize-smaller[href=\'/pt/dbhero\']',
                                                        '데이터 클립'
                                                        //coffee 'Dataclips'
                                                    )
                                                )
                                            ]
                                        ) : '',
                                        m('.fontsize-mini', '귀하의 이메일 주소 : '),
                                        //coffee m('.fontsize-mini', 'Seu e-mail de cadastro é : '),
                                        m('.fontsize-smallest.u-marginbottom-20', [
                                            m('span.fontweight-semibold', `${user.email} `),
                                            m(`a.alt-link[href='/pt/users/${user.id}/edit#about_me']`, 'alterar e-mail')
                                        ]),
                                        m('.divider.u-marginbottom-20'),
                                        m('a.alt-link[href=\'/pt/logout\']',
                                            '출구'
                                            //coffee 'Sair'
                                        )
                                    ]
                                ),
                                //m(`.w-col.w-col-4.w-hidden-small.w-hidden-tiny`,
                                //    [
                                //        m(`.fontweight-semibold.fontsize-smaller.u-marginbottom-10`,
                                //            `Projetos apoiados`
                                //        ),
                                //        m(`ul.w-list-unstyled.u-marginbottom-20`, ctrl.contributedProjects() ?
                                //            _.isEmpty(ctrl.contributedProjects) ? '프로젝트 없음.' :
                                //            //coffee _.isEmpty(ctrl.contributedProjects) ? 'Nenhum projeto.' :
                                //            m.component(quickProjectList, {
                                //                projects: m.prop(_.map(ctrl.contributedProjects(), (contribution) => {
                                //                    return {
                                //                        project_id: contribution.project_id,
                                //                        project_user_id: contribution.project_user_id,
                                //                        thumb_image: contribution.project_img,
                                //                        video_cover_image: contribution.project_img,
                                //                        permalink: contribution.permalink,
                                //                        name: contribution.project_name
                                //                    };
                                //                })),
                                //                loadMoreHref: '/pt/users/${user.id}/edit#contributions',
                                //                ref: 'user_menu_my_contributions'
                                //            }) : '로딩...'
                                //            //coffee }) : 'carregando...'
                                //        )
                                //    ]
                                //),
                                //m(`.w-col.w-col-4.w-hidden-small.w-hidden-tiny`,
                                //    [
                                //        m(`.fontweight-semibold.fontsize-smaller.u-marginbottom-10`,
                                //            `생성 된 프로젝트`
                                //            //coffee `Projetos criados`
                                //        ),
                                //        m(`ul.w-list-unstyled.u-marginbottom-20`, ctrl.latestProjects() ?
                                //            _.isEmpty(ctrl.latestProjects) ? '프로젝트 없음.' :
                                //            //coffee _.isEmpty(ctrl.latestProjects) ? 'Nenhum projeto.' :
                                //            m.component(quickProjectList, {
                                //                projects: ctrl.latestProjects,
                                //                loadMoreHref: '/pt/users/${user.id}/edit#contributions',
                                //                ref: 'user_menu_my_projects'
                                //            }) : '로딩...'
                                //            //coffee }) : 'carregando...'
                                //        )
                                //    ]
                                //)
                            ]
                        )
                    ]
                ) : ''
            ]
        );
    }
};

export default menuProfile;
