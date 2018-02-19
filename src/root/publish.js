import m from 'mithril';
import _ from 'underscore';
import moment from 'moment';
import postgrest from 'mithril-postgrest';
import I18n from 'i18n-js';
import models from '../models';
import h from '../h';
import projectDashboardMenu from '../c/project-dashboard-menu';

const I18nScope = _.partial(h.i18nScope, 'projects.publish');

const publish = {
    controller(args) {
        const filtersVM = postgrest.filtersVM({
                project_id: 'eq'
            }),
            projectAccount = m.prop([]),
            projectDetails = m.prop([]),
            acceptTerm = m.prop([true, true, true, true, true, true, true, true, true]),
            flexAcceptTerm = m.prop([true, true, true, true, true, true, true, true, true]),
            showNextTerm = (index, acceptTerms) => {
                const terms = acceptTerms();
                if (terms[index]) {
                    terms[index] = false;
                    acceptTerms(terms);
                    const nextTerm = document.getElementsByClassName('w-hidden publish-rules');
                    if (nextTerm[0] !== undefined) {
                        nextTerm[0].classList.remove('w-hidden');
                    }
                }
                // show publish button after accepting all rules
                if (index === terms.length - 1) {
                    document.getElementsByClassName('publish-btn-section')[0].classList.remove('w-hidden');
                }
            },
            loader = postgrest.loaderWithToken;

        filtersVM.project_id(args.root.getAttribute('data-id'));

        const l = loader(models.projectDetail.getRowOptions(filtersVM.parameters())),
            accountL = loader(models.projectAccount.getRowOptions(filtersVM.parameters()));
        l.load().then(projectDetails);
        accountL.load().then(projectAccount);

        const expiresAt = () => {
            const project = _.first(projectDetails());
            return moment().add(project.online_days, 'days');
        };

        return {
            l,
            accountL,
            expiresAt,
            filtersVM,
            acceptTerm,
            flexAcceptTerm,
            showNextTerm,
            projectAccount,
            projectDetails
        };
    },
    view(ctrl, args) {
        const project = _.first(ctrl.projectDetails()),
            account = _.first(ctrl.projectAccount()),
            flexTerms = project => [
                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '1/9'),
                        ' ',
                        m('span.fontweight-semibold', '출판물의 프로젝트 페이지에서 무엇을 바꿀 수 있고 바꿀 수 없습니까?')
                    ]),
                    m('div', [
                        m('span.fontweight-semibold', '변경할 수 없습니다.'),
                        ': a identidade do responsável pelo projeto (Nome / CPF ou Razão Social / CNPJ), a Modalidade de financiamento, o título do projeto, a URL (link) do projeto, a categoria do projeto, a meta de arrecadação,  o prazo (caso já tenha definido), e as recompensas onde existirem apoios já efetuados.',
                        m('br'), m('br'),
                        m('span.fontweight-semibold', 'Você poderá alterar'),
                        ': 캠페인의 주요 비디오, 설명의 내용, 프로젝트 이미지, 효과 문구, 지원이없는 경우의 보상, 컬렉션 중 새로운 보상 추가하기'
                    ])
                ]),

                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '2/9'),
                        ' ',
                        m('span.fontweight-semibold', '플렉스 규칙')
                    ]),
                    m('div', 'Você escolheu a campanha flexível. Dessa maneira, você irá receber todos os recursos arrecadados junto aos apoiadores ao final do prazo da campanha (descontando a taxa do Catarse) e deverá cumprir com a execução do projeto e com a entrega das recompensas oferecidas independente do quanto arrecadar.')
                ]),
                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '3/9'),
                        ' ',
                        m('span.fontweight-semibold', '컬렉션의 목표')
                    ]),
                    m('div', '프로젝트가 게시된 후 목표를 변경할 수 없습니다.')
                ]),
                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '4/9'),
                        ' ',
                        m('span.fontweight-semibold', '요금')
                    ]),
                    m('div', [
                        'Ao final da campanha, cobraremos 13% sobre o ',
                        m('span.fontweight-semibold', '징수 된 총 금액.')
                    ])
                ]),
                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '5/9'),
                        ' ',
                        m('span.fontweight-semibold', '캠페인 마감')
                    ]),
                    m('div', '일단 설정되면 마감 기한을 변경할 수 없습니다. 기한이 지난 캠페인을 시작한 경우 캠페인 기간 중에 캠페인을 설정해야하며 최대 12 개월 동안 캠페인을 열어 둘 수 있습니다.')
                ]),
                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '6/9'),
                        ' ',
                        m('span.fontweight-semibold', '양도 기한')
                    ]),
                    m('div', m.trust('프로젝트 기한이 끝나면 은행 정보를 입력하고 확인해야합니다. 은행, 계좌 및 대행사를 변경할 수 있습니다. <strong>귀하가 새로 등록 된 계정을 소유 한 경우에만</strong>. 확인시, Givingwire는 영업일 기준 10 일 이내에 당좌 계좌에 입금됩니다. 기탁 된 금액은 이미 요금의 13 % 할인을 고려할 것입니다.'))
                ]),
                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '7/9'),
                        ' ',
                        m('span.fontweight-semibold', 'Responsabilidade do Catarse')
                    ]),
                      [m('div', [m('span.fontweight-semibold'), m('span.fontweight-semibold', 'Givingwire는 책임이있다.:'), ' pelo desenvolvimento tecnológico da plataforma, atendimento de dúvidas e problemas (tanto de apoiadores quanto de realizadores), por hospedar o projeto na plataforma e por garantir a segurança das transações financeiras.\ ', m('br'), m('br'), m('span.fontweight-semibold', 'O Catarse não é responsável:'), ' pelo financiamento, divulgação e execução, nem pela entrega de recompensas dos projetos inscritos.'])]
                ]),
                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '8/9'),
                        ' ',
                        m('span.fontweight-semibold', '당신의 책임')
                    ]),
                    m('div', '캠페인 및 기금 모금 캠페인에 대한 기금 모금 캠페인 계획 및 공개, 후원자 동원, 프로젝트 실행, 후원자와의 커뮤니케이션, 예상 시간 내에 보상 생성 및 제공과 관련된 모든 금액을 캠페인에서 수령하는 것은 귀하의 책임입니다.')
                ]),
                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '9/9'),
                        ' ',
                        m('span', { style: { 'font-weight': ' 600' } }, 'Retiradas de projetos no ar')
                    ]),
                    m('div', [m('span.fontweight-semibold'), 'Givingwire는 단독 재량에 따라 통지를 받은 후 프로젝트를 취소하고 당사의 프로젝트를 위반한 프로젝트 생성자의 계정을 해지 할 권한을 보유합니다. ', m('a.alt-link[href=\'http://suporte.catarse.me/hc/pt-br/articles/202387638-Diretrizes-para-cria%C3%A7%C3%A3o-de-projetos\'][target=\'_blank\']', '게임 규칙'), ' e ', m('a.alt-link[href=\'http://www.catarse.me/terms-of-use\'][target=\'_blank\']', '이용 약관'), '.'])
                ])

            ],

            terms = project => [

                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '1/9'),
                        ' ',
                        m('span', { style: { 'font-weight': ' 600' } }, '출판물의 프로젝트 페이지에서 무엇을 바꿀 수 있고 바꿀 수 없습니까?')
                    ]),
                    m('div', [
                        m('span.fontweight-semibold', '변경할 수 없습니다.'), ': 프로젝트 책임자 이름 (이름 / CPF 또는 사회 이성 / CNPJ), 자금 모달, 프로젝트 제목, 프로젝트의 URL, 프로젝트 카테고리, 수금 목표, 선택한 기한 및 보상 이미 지원이있는 곳. ',
                        m('br'), m('br'),
                        m('span.fontweight-semibold', 'Você poderá alterar'), ': o vídeo principal da campanha, o conteúdo da descrição, a imagem do projeto, a frase de efeito, as recompensas onde não existirem apoios efetuados, além de adicionar novas recompensas durante a arrecadação'
                    ])
                ]),

                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '2/9'),
                        ' ',
                        m('span.fontweight-semibold', '전부 또는 일부 규칙')
                    ]),
                    m('div', ['당신은 all-or-nothing 캠페인을 선택했습니다. 이 방법으로, 당신은 수집 된 자금만을 받을 것입니다 ', m('span.fontweight-semibold', '수집 목표에 도달하거나 초과하면'), '. 그렇지 않으면 모든 후원자가 상환됩니다. 프로젝트가 수집 목표에 도달하면 제공되는 보상 제공에 대한 책임은 귀하에게 있습니다.'])
                ]),

                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '3/9'),
                        ' ',
                        m('span', { style: { 'font-weight': ' 600' } }, '컬렉션의 목표')
                    ]),
                    m('div', '프로젝트가 게시 된 후 목표를 변경할 수 없습니다.')

                ]),

                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '4/9'),
                        ' ',
                        m('span', { style: { 'font-weight': ' 600' } }, '요금')
                    ]),
                    m('div', [
                        'Cobramos 13% sobre o ',
                        m('span.fontweight-semibold', '징수 된 총 금액'),
                        ' 캠페인 기한 내에 목표를 초과하거나 초과하는 경우 귀하의 프로젝트에 의해 프로젝트가 목표를 달성하지 못하면 수수료가 부과되지 않습니다..',
                        m('span.fontweight-semibold')
                    ])
                ]),

                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '5/9'),
                        ' ',
                        m('span', { style: { 'font-weight': ' 600' } }, '캠페인 마감')
                    ]),
                    m('div', `귀하의 프로젝트는 당일까지 Givingwire에서 수집됩니다. ${h.momentify(ctrl.expiresAt())} às 23h59min59s. Este prazo não poderá ser alterado após a publicação do projeto.`)
                ]),

                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '6/9'),
                        ' ',
                        m('span', { style: { 'font-weight': ' 600' } }, '이체 및 환불 규칙'),
                        m('div', [
                            m.trust('프로젝트 기한이 끝나면 은행 정보를 입력하고 확인해야합니다. 은행, 계좌 및 대행사를 변경할 수 있습니다. <strong>귀하가 새로 등록된 계정을 소유 한 경우에만</strong>. 이 확인 후, Givingwire는 수집된 금액을 영업일 기준 10일 내에 계좌에 입금합니다. 프로젝트가 기한까지 목표의 100%에 도달하지 못하면 Givingwire는 지원자에게 배상금을 지급합니다.. <a href="http://suporte.catarse.me/hc/pt-br/articles/202365507" target="blank">상환 절차에 대해 자세히 알아보기</a>')
                        ])
                    ]),
                    m('div', '')
                ]),


                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '7/9'),
                        ' ',
                        m('span', { style: { 'font-weight': ' 600' } }, 'Responsabilidade do Catarse')
                    ]),
                      [m('div', [m('span.fontweight-semibold'), m('span.fontweight-semibold', 'O Catarse é responsável:'), ' 플랫폼의 기술적 발전, 의심과 문제의 출석 (후원자와 감독 모두), 플랫폼에서 프로젝트를 주최하고 금융 거래의 보안을 보장하기위한 것.\ ', m('br'), m('br'), m('span.fontweight-semibold', 'Givingwire는 책임지지 않습니다.:'), ' 자금 조달, 보급 및 집행, 등록 된 프로젝트의 보상금 납부.'])]]),

                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '8/9'),
                        ' ',
                        m('span', { style: { 'font-weight': ' 600' } }, '당신의 책임')
                    ]),
                    m('div', 'É sua responsabilidade o recebimento do dinheiro da campanha e tudo aquilo que diz respeito a formatação do projeto, planejamento e divulgação da campanha de arrecadação, mobilização de apoiadores, execução do projeto, comunicação com apoiadores e produção e entrega de recompensas dentro do prazo estimado.')
                ]),

                m('.w-col.w-col-11', [
                    m('div', [
                        m('span.fontsize-smallest.fontcolor-secondary', '9/9'),
                        ' ',
                        m('span', { style: { 'font-weight': ' 600' } }, 'Retiradas de projetos no ar')
                    ]),
                    m('div', [m('span.fontweight-semibold'), 'Givingwire는 단독 재량에 따라 통지를받은 후 프로젝트를 취소하고 당사의 프로젝트를 위반 한 프로젝트 생성자의 계정을 해지 할 권한을 보유합니다. ', m('a.alt-link[href=\'http://suporte.catarse.me/hc/pt-br/articles/202387638-Diretrizes-para-cria%C3%A7%C3%A3o-de-projetos\'][target=\'_blank\']', '게임 규칙'), ' e ', m('a.alt-link[href=\'http://www.catarse.me/terms-of-use\'][target=\'_blank\']', '이용 약관'), '.'])
                ])

            ];

        return [project && account ? [
            (project.is_owner_or_admin ? m.component(projectDashboardMenu, {
                project: m.prop(project),
                hidePublish: true
            }) : ''),
            m(`.w-section.section-product.${project.mode}`),
            m('.w-section.section', [
                m('.w-container', [
                    m('.w-row', [
                        m('.w-col.w-col-3'),
                        m('.w-col.w-col-6', [
                            m('.u-text-center', [
                                m('img.u-marginbottom-20[src=\'/assets/catarse_bootstrap/launch-icon.png\'][width=\'94\']'),
                                m('.fontsize-large.fontweight-semibold.u-marginbottom-20', '캠페인을 시작할 준비가 되셨습니까?'),
                                m('.fontsize-base.u-marginbottom-30', '프로젝트를 진행하기 전에 확인해야 할 중요한 정보 목록을 준비했습니다!')
                            ])
                        ]),
                        m('.w-col.w-col-3')
                    ])
                ])
            ]),
            m('.divider'),
            m('.w-section.section-one-column.bg-gray.section.before-footer', [
                m('.w-container', [
                    m('.card.medium.u-marginbottom-60.card-terciary', [
                        m('.w-row', [
                            m('.w-col.w-col-6.w-clearfix', [
                                m(`img.card-project-thumb.u-right[src=${project.large_image}]`)
                            ]),
                            m('.w-col.w-col-6', [
                                m('.u-marginbottom-30.fontsize-base', [
                                    m('div', [m('span.fontweight-semibold', '제목: '), project.name]),
                                    m('div', [m('span.fontweight-semibold', '링크: '), `www.catarse.me/${project.permalink}`]),
                                    m('div', [m('span.fontweight-semibold', 'Modalidade de financiamento: '), I18n.t(project.mode, I18nScope())]),
                                    m('div', [m('span.fontweight-semibold', '컬렉션의 목표: '), `R$ ${h.formatNumber(project.goal, 2, 3)}`]),
                                    (project.online_days !== null) ? m('div', [m('span.fontweight-semibold', `마감일: ${project.online_days} ${(project.online_days > 1) ? 'dias' : 'dia'}`)]) : '',
                                    m('div', [m('span.fontweight-semibold', 'Responsável: '), account.owner_name]),
                                    m('div', [m('span.fontweight-semibold', 'CPF/CNPJ: '), account.owner_document])
                                ])
                            ])
                        ]),
                        m('.u-text-center', [
                            m('.w-row', [
                                m('.w-col.w-col-1'),
                                m('.w-col.w-col-10', [
                                    m('.divider.u-marginbottom-10'),
                                    m('.fontsize-small.fontcolor-secondary', '프로젝트가 시작된 후 위의 데이터를 변경할 수 없습니다. 변경해야 할 경우 사이드 바를 탐색하고 완료되면 여기로 돌아와주세요.')
                                ]),
                                m('.w-col.w-col-1')
                            ])
                        ])
                    ]),
                    m('.card.medium.u-radius.u-marginbottom-60', [
                        m('.u-text-center.u-marginbottom-60', [
                            m('.fontsize-large.fontweight-semibold', '우리 규칙을 기억해'),
                            m('.w-row', [
                                m('.w-col.w-col-2'),
                                m('.w-col.w-col-8', [
                                    m('.fontsize-small', ['Antes de publicar, clique nos círculos abaixo e confirme que você está ciente de como funciona o Catarse. Qualquer dúvida, ', m('a.alt-link[href="http://suporte.catarse.me/hc/pt-br/requests/new"][target="_blank"]', '문의하기'), '!'])
                                ]),
                                m('.w-col.w-col-2')
                            ])
                        ]),

                        _.map(project.mode === 'flex' ? flexTerms(project) : terms(project), (term, index) => m(`.u-marginbottom-30.fontsize-base${index === 0 ? '' : '.w-hidden.publish-rules'}`, [
                            m(`.w-row[id='rule-${index}']`, [
                                m('.w-col.w-col-1.u-text-center', [
                                    m('div', [
                                        m((project.mode === 'flex' ? ctrl.flexAcceptTerm() : ctrl.acceptTerm())[index] ? `a.w-inline-block.checkbox-big[href='#rule-${index + 1}']` : `a.w-inline-block.checkbox-big.checkbox--selected.fa.fa-check.fa-lg[href='#rule-${index + 1}']`, { onclick: () => ctrl.showNextTerm(index, (project.mode === 'flex' ? ctrl.flexAcceptTerm : ctrl.acceptTerm)) })
                                    ])
                                ]),
                                term
                            ])
                        ]))

                    ]),
                    m('.w-row.publish-btn-section.w-hidden', [
                        m('.w-col.w-col-4'),
                        m('.w-col.w-col-4', [
                            m(`a.btn.btn-large.u-marginbottom-20[href=/${project.mode === 'flex' ? 'flexible_projects' : 'projects'}/${project.project_id}/push_to_online]`, '지금 게시하십시오!'),
                            m('.u-text-center.fontsize-smaller', [
                                '프로젝트를 게시하면 ',
                                m('a.alt-link[href=\'/terms-of-use\'][target=\'_blank\']', '이용 약관'),
                                ' e ',
                                m('a.alt-link[href=\'/privacy-policy\'][target=\'_blank\']', '개인 정보 보호 정책')
                            ])
                        ]),
                        m('.w-col.w-col-4')
                    ])
                ])
            ]),
            '\
    '
        ] : h.loader()];
    }
};

export default publish;
