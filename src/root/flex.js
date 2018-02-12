import m from 'mithril';
import postgrest from 'mithril-postgrest';
import h from '../h';
import models from '../models';
import landingSignup from '../c/landing-signup';
import projectRow from '../c/project-row';
import landingQA from '../c/landing-qa';

const Flex = {
    controller() {
        const stats = m.prop([]),
            projects = m.prop([]),
            l = m.prop(),
            sample3 = _.partial(_.sample, _, 3),
            builder = {
                customAction: 'http://fazum.catarse.me/obrigado-landing-catarse-flex'
            },
            addDisqus = (el, isInitialized) => {
                if (!isInitialized) {
                    h.discuss('https://catarse.me/flex', 'flex_page');
                }
            },
            flexVM = postgrest.filtersVM({
                mode: 'eq',
                state: 'eq',
                recommended: 'eq'
            }),
            statsLoader = postgrest.loaderWithToken(models.statistic.getRowOptions());

        flexVM.mode('flex').state('online').recommended(true);

        const projectsLoader = postgrest.loader(models.project.getPageOptions(flexVM.parameters()));

        statsLoader.load().then(stats);

        projectsLoader.load().then(_.compose(projects, sample3));

        return {
            addDisqus,
            builder,
            statsLoader,
            stats,
            projectsLoader,
            projects: {
                loader: projectsLoader,
                collection: projects
            }
        };
    },
    view(ctrl, args) {
        const stats = _.first(ctrl.stats());

        return [
            m('.w-section.hero-full.hero-zelo', [
                m('.w-container.u-text-center', [
                    m('img.logo-flex-home[src=\'/assets/logo-flex.png\'][width=\'359\']'),
                    m('.w-row', [
                        m('.w-col.fontsize-large.u-marginbottom-60.w-col-push-2.w-col-8', '크라우드펀딩의 새로운 모드를 구축합시다! 전자 메일을 등록하고 프로젝트 등록 방법을 익혀주시길 바랍니다!')
                    ]),
                    m('.w-row', [
                        m('.w-col.w-col-2'),
                        m.component(landingSignup, {
                            builder: ctrl.builder
                        }),
                        m('.w-col.w-col-2')
                    ])
                ])
            ]), [
                m('.section', [
                    m('.w-container', [
                        m('.fontsize-largest.u-margintop-40.u-text-center', 'Pra quem será?'), m('.fontsize-base.u-text-center.u-marginbottom-60', '특정 프로젝트 범주로 테스트 단계를 시작합니다.'), m('div', [
                            m('.w-row.u-marginbottom-60', [
                                m('.w-col.w-col-6', [
                                    m('.u-text-center.u-marginbottom-20', [
                                        m('img[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/560e393a01b66e250aca67cb_icon-zelo-com.png\'][width=\'210\']'), m('.fontsize-largest.lineheight-loose', '원인')
                                    ]), m('p.fontsize-base', 'Flexibilidade para causas de impacto! Estaremos abertos a campanhas de organizações ou pessoas físicas para arrecadação de recursos para causas pessoais, projetos assistenciais, saúde, ajudas humanitárias, proteção aos animais, empreendedorismo socioambiental, ativismo ou qualquer coisa que una as pessoas para fazer o bem.')
                                ]), m('.w-col.w-col-6', [
                                    m('.u-text-center.u-marginbottom-20', [
                                        m('img[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/560e3929a0daea230a5f12cd_icon-zelo-pessoal.png\'][width=\'210\']'), m('.fontsize-largest.lineheight-loose', 'Vaquinhas')
                                    ]), m('p.fontsize-base', 'Campanhas simples que precisam de flexibilidade para arrecadar dinheiro com pessoas próximas. Estaremos abertos a uma variedade de campanhas pessoais que podem ir desde cobrir custos de estudos a ajudar quem precisa de tratamento médico. De juntar a grana para fazer aquela festa a comprar presentes para alguém com a ajuda da galera. ')
                                ])
                            ])
                        ])
                    ])
                ]), m('.w-section.section.bg-greenlime.fontcolor-negative', [
                    m('.w-container', [
                        m('.fontsize-largest.u-margintop-40.u-marginbottom-60.u-text-center', '어떻게 작동할까요?'), m('.w-row.u-marginbottom-40', [
                            m('.w-col.w-col-6', [
                                m('.u-text-center', [
                                    m('img[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/560e39c578b284493e2a428a_zelo-money.png\'][width=\'180\']')
                                ]), m('.fontsize-large.u-marginbottom-10.u-text-center.fontweight-semibold', '얼마나 많은 돈을 모아야하는지'), m('p.u-text-center.fontsize-base', 'O flex é para impulsionar campanhas onde todo dinheiro é bem vindo! Você fica com tudo que conseguir arrecadar.')
                            ]), m('.w-col.w-col-6', [
                                m('.u-text-center', [
                                    m('img[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/560e39d37c013d4a3ee687d2_icon-reward.png\'][width=\'180\']')
                                ]), m('.fontsize-large.u-marginbottom-10.u-text-center.fontweight-semibold', '보상이 필요하지 않습니다.'), m('p.u-text-center.fontsize-base', 'No flex oferecer recompensas é opcional. Você escolhe se oferecê-las faz sentido para o seu projeto e campanha.')
                            ])
                        ]), m('.w-row.u-marginbottom-40', [
                            m('.w-col.w-col-6', [
                                m('.u-text-center', [
                                    m('img[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/560e39fb01b66e250aca67e3_icon-curad.png\'][width=\'180\']')
                                ]), m('.fontsize-large.u-marginbottom-10.u-text-center.fontweight-semibold', '프로젝트를 직접 게시합니다.'), m('p.u-text-center.fontsize-base', 'Todos os projetos inscritos no flex entram no ar. Agilidade e facilidade para você captar recursos através da internet.')
                            ]), m('.w-col.w-col-6', [
                                m('.u-text-center', [
                                    m('img[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/560e39e77c013d4a3ee687d4_icon-time.png\'][width=\'180\']')
                                ]), m('.fontsize-large.u-marginbottom-10.u-text-center.fontweight-semibold', '언제든지 캠페인 종료'), m('p.u-text-center.fontsize-base', 'Não há limite de tempo de captação. Você escolhe  quando encerrar sua campanha e receber os valores arrecadados.')
                            ])
                        ])
                    ])
                ]),
                m('.w-section.section', [
                    m('.w-container', [
                        m('.w-editable.fontsize-larger.u-margintop-40.u-margin-bottom-40.u-text-center', '첫 번째 플렉스 프로젝트를 만나십시오.'),
                        ctrl.projectsLoader() ? h.loader() : m.component(projectRow, { collection: ctrl.projects, ref: 'ctrse_flex', wrapper: '.w-row.u-margintop-40' })
                    ])
                ]),
                m('.w-section.divider'),
                m('.w-section.section', [
                    m('.w-container', [
                        m('.fontsize-larger.u-text-center.u-marginbottom-60.u-margintop-40', 'Dúvidas'), m('.w-row.u-marginbottom-60', [
                            m('.w-col.w-col-6', [
                                m.component(landingQA, {
                                    question: '유연한 모드 요금이란 무엇입니까?? ',
                                    answer: 'Givinwire와 마찬가지로 프로젝트를 보내는 데는 비용이 들지 않습니다! 캐럿 플렉스 서비스 이용료는 수집 된 금액의 13 %입니다.'
                                }),
                                m.component(landingQA, {
                                    question: '내 프로젝트에서 나온 돈은 어디에서 왔습니까??',
                                    answer: '귀하가 소속 된 가족, 친구, 팬 및 지역 사회 구성원은 귀하의 가장 큰 공헌자입니다. 그들이 알고있는 사람들에게 선거 운동을 퍼뜨리는 것은 바로 그 사람들입니다. 그래서 서포터들의 서클이 커지고 캠페인의 힘이 생깁니다.'
                                }),
                                m.component(landingQA, {
                                    question: 'Qual a diferença entre o flexível e o "tudo ou nada"?',
                                    answer: '현재 Givinwire는 "all or nothing"모델 만 사용합니다.이 모델에서는 캠페인 기간 내에 수집 목표를 달성하는 경우에만 돈을 얻습니다. 유연한 모델은 캠페인 기간 동안 프로젝트 목표에 도달했는지 여부에 관계없이 감독이 자신이 수집 한 것을 유지할 수 있기 때문에 다릅니다. 캠페인에는 시간 제한이 없습니다. 우리의 유연한 시스템은 현재 시장에 존재하는 모델에 비해 새로운 것입니다.'
                                })
                            ]), m('.w-col.w-col-6', [
                                m.component(landingQA, {
                                    question: '유연한 양식을위한 프로젝트를 이미 등록 할 수 있습니다.?',
                                    answer: '네, 전자 메일을 등록하고 프로젝트를 flex에 등록하는 방법을 배우십시오!'
                                }),
                                m.component(landingQA, {
                                    question: '왜 Givingwire flex를하고 싶습니까?',
                                    answer: 'Acreditamos que o ambiente do crowdfunding brasileiro ainda tem espaço para muitas ações, testes e experimentações para entender de fato o que as pessoas precisam. Sonhamos com tornar o financiamento coletivo um hábito no Brasil. O Catarse flex é mais um passo nessa direção.'
                                }),
                                m.component(landingQA, {
                                    question: 'Givingwire flex는 언제 시작합니까??',
                                    answer: '우리는 일반 대중을 위해 언제 Flex를 열지 모르지만 이 페이지에 이메일을 등록하고 프로젝트 제출 방법에 대한 특별한 자료를 받을 수 있습니다.'
                                })
                            ])
                        ])
                    ])
                ]),
                m('.w-section.section-large.u-text-center.bg-purple', [
                    m('.w-container.fontcolor-negative', [
                        m('.fontsize-largest', 'Inscreva seu projeto!'), m('.fontsize-base.u-marginbottom-60', '이메일을 등록하고 flex에 프로젝트를 등록하는 방법을 배우시길 바랍니다!'), m('.w-row', [
                            m('.w-col.w-col-2'),
                            m.component(landingSignup, {
                                builder: ctrl.builder
                            }),
                            m('.w-col.w-col-2')
                        ])
                    ])
                ]), m('.w-section.section-one-column.bg-catarse-zelo.section-large[style="min-height: 50vh;"]', [
                    m('.w-container.u-text-center', [
                        m('.w-editable.u-marginbottom-40.fontsize-larger.lineheight-tight.fontcolor-negative', 'O flex é um experimento e iniciativa do Catarse, maior plataforma de crowdfunding do Brasil.'),
                        m('.w-row.u-text-center', (ctrl.statsLoader()) ? h.loader() : [
                            m('.w-col.w-col-4', [
                                m('.fontsize-jumbo.text-success.lineheight-loose', h.formatNumber(stats.total_contributors, 0, 3)), m('p.start-stats.fontsize-base.fontcolor-negative', 'Pessoas ja apoiaram pelo menos 01 projeto no Catarse')
                            ]),
                            m('.w-col.w-col-4', [
                                m('.fontsize-jumbo.text-success.lineheight-loose', h.formatNumber(stats.total_projects_success, 0, 3)), m('p.start-stats.fontsize-base.fontcolor-negative', 'Projetos ja foram financiados no Catarse')
                            ]),
                            m('.w-col.w-col-4', [
                                m('.fontsize-jumbo.text-success.lineheight-loose', `${stats.total_contributed.toString().slice(0, 2)} milhões`), m('p.start-stats.fontsize-base.fontcolor-negative', 'Foram investidos em ideias publicadas no Catarse')
                            ])
                        ])
                    ])
                ]),
                m('.w-section.section.bg-blue-one.fontcolor-negative', [
                    m('.w-container', [
                        m('.fontsize-large.u-text-center.u-marginbottom-20', '친구에게 Givingwire Flex를 추천합니다.! '),
                        m('.w-row', [
                            m('.w-col.w-col-2'),
                            m('.w-col.w-col-8', [
                                m('.w-row', [
                                    m('.w-col.w-col-6.w-col-small-6.w-col-tiny-6.w-sub-col-middle', [
                                        m('div', [
                                            m('img.icon-share-mobile[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/53a3f66e05eb6144171d8edb_facebook-xxl.png\']'),
                                            m(`a.w-button.btn.btn-large.btn-fb[href="http://www.facebook.com/sharer/sharer.php?u=https://www.catarse.me/flex?ref=facebook&title=${encodeURIComponent('Conheça o novo Catarse Flex!')}"][target="_blank"]`, '이것을 공유하십시오')
                                        ])
                                    ]),
                                    m('.w-col.w-col-6.w-col-small-6.w-col-tiny-6', [
                                        m('div', [
                                            m('img.icon-share-mobile[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/53a3f65105eb6144171d8eda_twitter-256.png\']'),
                                            m(`a.w-button.btn.btn-large.btn-tweet[href="https://twitter.com/intent/tweet?text=${encodeURIComponent('Givingwire에 대한 새로운 크라우드펀딩 방식을 구축합시다! 가입하여 이메일을 신청하십시오!')}https://www.catarse.me/flex?ref=twitter"][target="_blank"]`, 'Tuitar')
                                        ])
                                    ])
                                ])
                            ]),
                            m('.w-col.w-col-2')
                        ])
                    ])
                ]), m('.w-section.section-large.bg-greenlime', [
                    m('.w-container', [
                        m('#participe-do-debate.u-text-center', { config: h.toAnchor() }, [
                            m('h1.fontsize-largest.fontcolor-negative', 'Construa o flex conosco'), m('.fontsize-base.u-marginbottom-60.fontcolor-negative', 'Inicie uma conversa, pergunte, comente, critique e faça sugestões!')
                        ]),
                        m('#disqus_thread.card.u-radius[style="min-height: 50vh;"]', {
                            config: ctrl.addDisqus
                        })
                    ])
                ])
            ]
        ];
    }
};

export default Flex;
