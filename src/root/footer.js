import m from 'mithril';
import h from '../h';

const footer = {
    view() {
        return m('footer.main-footer.main-footer-neg',
            [
                m('section.w-container',
                    m('.w-row',
                        [
                            m('.w-col.w-col-9',
                                m('.w-row',
                                    [
                                        m('.w-col.w-col-4.w-col-small-4.w-col-tiny-4.w-hidden-tiny',
                                            [
                                                m('.footer-full-signature-text.fontsize-small',
                                                    '환영합니다'
                                                    //coffee 'Bem-vindo'
                                                ),
                                                m('a.link-footer[href=\'http://crowdfunding.catarse.me/paratodos?ref=ctrse_footer\']',
                                                    ' 작동 원리'
                                                    //coffee ' Como funciona'
                                                ),
                                                m('a.link-footer[href=\'http://blog.catarse.me\']',
                                                    ' 블로그'
                                                    //coffee ' Blog'
                                                ),
                                                m('a.link-footer[href=\'https://www.catarse.me/pt/team?ref=ctrse_footer\']',
                                                    [
                                                        ' 우리 팀 ',
                                                        //coffee ' Nosso time ',
                                                        m.trust('&lt;'),
                                                        '3'
                                                    ]
                                                ),
                                                m('a.link-footer[href=\'https://www.catarse.me/pt/jobs\']',
                                                    ' 우리와 함께 일하십시오.'
                                                    //coffee ' Trabalhe conosco'
                                                ),
                                                m('a.link-footer[href=\'https://www.catarse.me/pt/press?ref=ctrse_footer\']',
                                                    ' 보도 자료'
                                                    //coffee ' Imprensa'
                                                ),
                                                m('a.u-marginbottom-30.link-footer[href=\'https://ano.catarse.me/2016?ref=ctrse_footer\']',
                                                    ' 2016년 회고전'
                                                    //coffee 'Retrospectiva 2016'
                                                ),
                                                m('.footer-full-signature-text.fontsize-small',
                                                    '소셜 네트워킹'
                                                    //coffee 'Redes Sociais'
                                                ),
                                                m('a.link-footer[href=\'http://facebook.com/catarse.me\']',
                                                    [
                                                        m('span.fa.fa-facebook-square.fa-lg'),
                                                        m.trust('&nbsp;&nbsp;'),
                                                        '페이스북'
                                                        //coffee 'Facebook'
                                                    ]
                                                ), 
                                                m('a.link-footer[href=\'http://twitter.com/catarse\']',
                                                    [
                                                        m('span.fa.fa-twitter-square.fa-lg'),
                                                        m.trust('&nbsp;&nbsp;'),
                                                        '트위터'
                                                        //coffee 'Twitter'
                                                    ]
                                                ), 
                                                m('a.link-footer[href=\'http://instagram.com/catarse\']',
                                                    [
                                                        m('span.fa.fa-instagram.fa-lg'),
                                                        m.trust('&nbsp;&nbsp;'),
                                                        '인스타그램'
                                                        //coffee 'Instagram'
                                                    ]
                                                ),
                                                m('a.link-footer[href=\'http://github.com/catarse/catarse\']',
                                                    [
                                                        m('span.fa.fa-github-square.fa-lg'),
                                                        m.trust('&nbsp;&nbsp;'),
                                                        '깃허브'
                                                        //coffee 'Github'
                                                    ]
                                                )
                                            ]
                                        ),
                                        m('.w-col.w-col-4.w-col-small-4.w-col-tiny-4.footer-full-firstcolumn',
                                            [
                                                m('.footer-full-signature-text.fontsize-small',
                                                    '도움말'
                                                    //coffee 'Ajuda'
                                                ),
                                                m('a.link-footer[href=\'http://suporte.catarse.me?ref=ctrse_footer/\']',
                                                    ' 지원 센터'
                                                    //coffee ' Central de Suporte'
                                                ),
                                                m('a.link-footer[href=\'http://suporte.catarse.me/hc/pt-br/requests/new\'][target="_BLANK"]',
                                                    ' 연락처'
                                                    //coffee ' Contato'
                                                ),
                                                m('a.link-footer[href=\'https://www.ofinanciamentocoletivo.com.br/?ref=ctrse_footer\']',
                                                    [
                                                        'Escola Catarse',
                                                        m.trust('&nbsp;'),
                                                        m('span.badge.badge-success',
                                                            '뉴스'
                                                            //coffee 'Novidade'
                                                        )
                                                    ]
                                                ),                                                
                                                m('a.link-footer[href=\'http://crowdfunding.catarse.me/nossa-taxa?ref=ctrse_footer\']',
                                                    '우리 요금'
                                                    //coffee 'Nossa Taxa'
                                                ),
                                                m('a.link-footer[href=\'http://pesquisa.catarse.me/\']',
                                                    ' Retrato FC Brasil 2013/2014'
                                                ),
                                                m('a.link-footer[href=\'http://suporte.catarse.me/hc/pt-br/articles/115002214043-Responsabilidades-e-Seguran%C3%A7a?ref=ctrse_footer\']',
                                                    ' 책임과 보안'
                                                    //coffee '  Responsabilidades e Segurança'
                                                ),
                                                m('a.link-footer[href=\'/pt/terms-of-use\']',
                                                    ' 이용 약관'
                                                    //coffee ' Termos de uso'
                                                ),
                                                m('a.link-footer[href=\'/pt/privacy-policy\']',
                                                    ' 개인 정보 보호 정책'
                                                    //coffee ' Política de privacidade'
                                                )
                                            ]
                                        ),
                                        m('.w-col.w-col-4.w-col-small-4.w-col-tiny-4.footer-full-lastcolumn',
                                            [
                                                m('.footer-full-signature-text.fontsize-small',
                                                    '캠페인 만들기'
                                                    //coffee 'Faça uma campanha'
                                                ),
                                                m('a.link-footer[href=\'/pt/start?ref=ctrse_footer\']',
                                                    ' 프로젝트 시작'
                                                    //coffee ' Comece seu projeto'
                                                ),
                                                m('a.link-footer[href=\'http://crowdfunding.catarse.me/financiamento-coletivo-musica-independente?ref=ctrse_footer\']',
                                                    [
                                                        '음악이 아닙니다.',
                                                        //coffee 'Música no Catarse',
                                                        m.trust('&nbsp;'),
                                                        m('span.badge.badge-success',
                                                            '뉴스'
                                                            //coffee 'Novidade'
                                                        )
                                                    ]
                                                ),
                                                m('a.u-marginbottom-30.link-footer[href=\'https://crowdfunding.catarse.me/publicacoes-independentes-financiamento-coletivo?ref=ctrse_footer\']',
                                                    [
                                                        '독립 출판물',
                                                        //coffee 'Publicações Independentes',
                                                        m.trust('&nbsp;'),
                                                        m('span.badge.badge-success',
                                                            '뉴스'
                                                            //coffee 'Novidade'
                                                        )
                                                    ]
                                                ),
                                                m('.footer-full-signature-text.fontsize-small',
                                                    'Givingwire에서 지원 프로젝트'
                                                    //coffee 'Apoie projetos no Catarse'
                                                ),
                                                m('a.link-footer[href=\'/pt/explore?ref=ctrse_footer\']',
                                                    '프로젝트 탐색'
                                                    //coffee ' Explore projetos'
                                                ),
                                                m('a.w-hidden-main.w-hidden-medium.w-hidden-small.link-footer[href=\'http://blog.catarse.me?ref=ctrse_footer\']',
                                                    ' 블로그'
                                                    //coffee ' Blog'
                                                ),
                                                m('a.w-hidden-main.w-hidden-medium.w-hidden-small.link-footer[href=\'http://suporte.catarse.me/hc/pt-br/requests/new\']',
                                                    ' 연락처'
                                                    //coffee ' Contato'
                                                ),
                                                m('a.w-hidden-tiny.link-footer[href=\'/pt/explore?filter=score&ref=ctrse_footer\']',
                                                    ' Populares'
                                                ),
                                                m('a.w-hidden-tiny.link-footer[href=\'/pt/explore?filter=online&ref=ctrse_footer\']',
                                                    ' No ar'
                                                ),
                                                m('a.w-hidden-tiny.link-footer[href=\'/pt/explore?filter=finished&ref=ctrse_footer\']',
                                                    ' Finalizados'
                                                )
                                            ]
                                        )
                                    ]
                                )
                            ),
                            m('.w-col.w-col-3.column-social-media-footer',
                                [
                                    m('.footer-full-signature-text.fontsize-small',
                                        '우리의 뉴스를 구독하십시오'
                                        //coffee 'Assine nossa news'
                                    ),
                                    m('.w-form',
                                        m(`form[accept-charset='UTF-8'][action='${h.getNewsletterUrl()}'][id='mailee-form'][method='post']`,
                                            [
                                                m('.w-form.footer-newsletter',
                                                    m('input.w-input.text-field.prefix[id=\'EMAIL\'][label=\'email\'][name=\'EMAIL\'][placeholder=\'이메일을 입력해 주시길 바랍니다.\'][type=\'email\']')
                                                    //coffee m('input.w-input.text-field.prefix[id=\'EMAIL\'][label=\'email\'][name=\'EMAIL\'][placeholder=\'Digite seu email\'][type=\'email\']')
                                                ),
                                                m('button.w-inline-block.btn.btn-edit.postfix.btn-attached[style="padding:0;"]',
                                                    m('img.footer-news-icon[alt=\'Icon newsletter\'][src=\'/assets/catarse_bootstrap/icon-newsletter.png\']')
                                                )
                                            ]
                                        )
                                    ),
                                    m('.footer-full-signature-text.fontsize-small',
                                        '언어 변경'
                                        //coffee 'Change language'
                                    ),
                                    m('[id=\'google_translate_element\']')
                                ]
                            )
                        ]
                    )
                ),
                m('.w-container',
                    m('.footer-full-copyleft',
                        [
                            m('img.u-marginbottom-20[alt=\'Logo footer\'][src=\'/assets/logo-footer.png\']'),
                            m('.lineheight-loose',
                                m('a.link-footer-inline[href=\'http://github.com/catarse/catarse\']',
                                   ` Feito com amor | ${new Date().getFullYear()} | 오픈 소스`
                                    //coffee ` Feito com amor | ${new Date().getFullYear()} | Open source`
                                )
                            )
                        ]
                    )
                )
            ]
        );
    }
};

export default footer;
