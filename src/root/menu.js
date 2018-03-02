import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import menuSearch from '../c/menu-search';
import menuProfile from '../c/menu-profile';

const menu = {
    controller(args) {
        const user = h.getUser(),
            menuCss = () => {
                let dynamicClasses;

                return `${args.menuTransparency ? 'overlayer' : ''} ${(args.withAlert || args.withFixedAlert) ? 'with-global-alert' : ''}`;
            },
            homeAttrs = () => {
                if (args.absoluteHome) {
                    return {
                        href: h.rootUrl()
                    };
                }
                return {
                    config: m.route
                };
            };

        return {
            user,
            menuCss,
            homeAttrs
        };
    },
    view(ctrl, args) {
        return m('header.main-header', {
            class: ctrl.menuCss()
        }, [
            m('.w-row', [
                m('.w-clearfix.w-col.w-col-8.w-col-small-8.w-col-tiny-8',
                    [
                        m('a.header-logo.w-inline-block[href=\'/?ref=ctrse_header\'][title=\'GivingWire\']',
                            ctrl.homeAttrs(),
                            m('img[alt=\'Logo big\'][src=\'/assets/catarse_bootstrap/logo_big.png\']')
                        ),
                        args.menuShort ? '' : m('div#menu-components', [
                            m('a.w-hidden-small.w-hidden-tiny.header-link.w-nav-link[href=\'/start?ref=ctrse_header\']', { config: m.route }, '새 프로젝트 시작하기'),
                            //coffee m('a.w-hidden-small.w-hidden-tiny.header-link.w-nav-link[href=\'/start?ref=ctrse_header\']', { config: m.route }, '새 프로젝트 시작하기'),
                            m('a.w-hidden-small.w-hidden-tiny.header-link.w-nav-link[href=\'/explore?ref=ctrse_header\']', { config: m.route }, '프로젝트 검색'),
                            //coffee m('a.w-hidden-small.w-hidden-tiny.header-link.w-nav-link[href=\'/explore?ref=ctrse_header\']', { config: m.route }, '프로젝트 검색'),
                            m.component(menuSearch)
                        ])
                    ]
                ),
                m('.text-align-right.w-col.w-col-4.w-col-small-4.w-col-tiny-4', [
                    ctrl.user ? m.component(menuProfile, { user: ctrl.user }) : m('a.w-nav-link.header-link.w-nav-link.btn-edit.u-right[href=\'/en/login?ref=ctrse_header\']', '로그인')
                    //coffee ctrl.user ? m.component(menuProfile, { user: ctrl.user }) : m('a.w-nav-link.header-link.w-nav-link.btn-edit.u-right[href=\'/en/login?ref=ctrse_header\']', '로그인')
                ])

            ]),
            args.menuShort ? '' : m('.header-controls-mobile.w-hidden-main.w-hidden-medium',
                [
                    m('a.header-link.w-nav-link[href=\'/en/start?ref=ctrse_header\']',
                        { onclick: () => m.route('/start') },
                        '새 프로젝트 시작하기'
                        //coffee '새 프로젝트 시작하기'
                    ),
                    m('a.header-link.w-nav-link[href=\'/en/explore?ref=ctrse_header\']',
                        { onclick: () => m.route('/explore') },
                        '프로젝트 검색'
                        //coffee '프로젝트 검색'
                    )
                ]
            )
        ]);
    }
};

export default menu;
