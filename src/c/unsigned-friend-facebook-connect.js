import m from 'mithril';
import _ from 'underscore';
import h from '../h';

const UnsignedFriendFacebookConnect = {
    controller(args) {
        return {
            largeBg: (() => {
                if (_.isUndefined(args)) {
                    return false;
                }
                return (_.isUndefined(args.largeBg) ? false : args.largeBg);
            })()
        };
    },
    view(ctrl, args) {
        return m(`.w-section.section${(ctrl.largeBg ? '.bg-backs-carrosel.section-large' : '')}`, [
            m('.w-container', [
                m('.card.card-big', [
                    m('.w-row', [
                        m('.w-col.w-col-8', [
                            m('.fontsize-largest.u-marginbottom-20', '친구와 함께 놀라운 프로젝트를 찾아보십시오.'),
                            //coffee m('.fontsize-largest.u-marginbottom-20', 'Encontre projetos incríveis junto com seus amigos'),
                            m('.fontsize-small', 'Givingwire의 우주는 Facebook 네트워크와 함께 놀라운 프로젝트를 발견하게합니다.!')
                            //coffee m('.fontsize-small', 'O universo do Catarse junto com a sua rede do Facebook te farão descobrir projetos incríveis!')
                        ]),
                        m('.w-col.w-col-4', [
                            m('a.w-button.btn.btn-fb.btn-large.u-margintop-30.u-marginbottom-10[href="/connect-facebook"]', '페이스북 연결'),
                            //coffee m('a.w-button.btn.btn-fb.btn-large.u-margintop-30.u-marginbottom-10[href="/connect-facebook"]', 'Conecte seu facebook'),
                            m('.fontsize-smallest.fontcolor-secondary.u-text-center', '우리는 당신의 허락 없이는 아무 것도 페이스북에 게시하지 않을 것입니다.')
                            //coffee m('.fontsize-smallest.fontcolor-secondary.u-text-center', 'Nós nunca postaremos nada no facebook sem sua permissão')
                        ])
                    ])
                ])
            ])
        ]);
    }
};

export default UnsignedFriendFacebookConnect;
