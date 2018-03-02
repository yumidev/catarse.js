import m from 'mithril';
import _ from 'underscore';
import h from '../h';
import rewardCardBig from './reward-card-big';

const I18nScope = _.partial(h.i18nScope, 'activerecord.attributes.address');

const surveyCreatePreview = {
    controller(args) {
        const openQuestions = _.filter(args.surveyVM.dashboardQuestions(), { type: 'open' }),
            multipleChoiceQuestions = _.filter(args.surveyVM.dashboardQuestions(), { type: 'multiple' });
        const togglePreview = () => {
            args.showPreview.toggle();
            h.scrollTop();
        };

        return {
            togglePreview,
            multipleChoiceQuestions,
            openQuestions
        };
    },
    view(ctrl, args) {
        return m('.section.u-marginbottom-40',
            m('.section.u-text-center',
                m('.w-container',
                    m('.w-row', [
                        m('.w-col.w-col-2'),
                        m('.w-col.w-col-8', [
                            m('.fontsize-larger.fontweight-semibold.lineheight-looser',
                                '설문지 검토'
                                //coffee 'Revise o questionário'
                            ),
                            m('.fontsize-base',
                                '귀하의 서포터는 이메일로 아래의 설문지에 대한 링크를 받게됩니다. 전송하기 전에 모든 것이 올바른지 확인하십시오!'
                                //coffee 'Os seus apoiadores irão receber um link para o questionário abaixo por email. Veja se está tudo correto antes de enviá-lo!'
                            )
                        ]),
                        m('.w-col.w-col-2')
                    ])
                )
            ),


            m('.section',
                m('.w-container',
                    m('.w-row', [
                        m('.w-col.w-col-1'),
                        m('.w-col.w-col-10',
                            m('.card.card-terciary.medium.u-marginbottom-30', [
                                (args.confirmAddress ?
                                m('.u-marginbottom-30.w-form', [
                                    m('.fontcolor-secondary.fontsize-base.fontweight-semibold',
                                        'Endereço de entrega da recompensa'
                                    ),
                                    m('.fontcolor-secondary.fontsize-smaller.u-marginbottom-30',
                                        'Para onde Nome do Realizador deve enviar sua recompensa quando estiver pronta.'
                                    ),
                                    m('form', [
                                        m('.w-row', [
                                            m('.w-sub-col.w-col.w-col-6', [
                                                m('label.field-label.fontweight-semibold',
                                                    'País / Country'
                                                ),
                                                m('select.positive.text-field.w-select', [
                                                    m("option[value='']",
                                                        '선택...'
                                                        //coffee 'Selecione...'
                                                    )
                                                ])
                                            ]),
                                            m('.w-col.w-col-6',
                                                m('.w-row', [
                                                    m('.w-sub-col-middle.w-col.w-col-6.w-col-small-6.w-col-tiny-6'),
                                                    m('.w-col.w-col-6.w-col-small-6.w-col-tiny-6')
                                                ])
                                            )
                                        ]),
                                        m('div', [
                                            m('label.field-label.fontweight-semibold',
                                                '거리'
                                                //coffee 'Rua'
                                            ),
                                            m("input.positive.text-field.w-input[type='email']")
                                        ]),
                                        m('.w-row', [
                                            m('.w-sub-col.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    '번호'
                                                    //coffee 'Número'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ]),
                                            m('.w-sub-col.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    'Complemento'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ]),
                                            m('.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    '이웃'
                                                    //coffee 'Bairro'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ])
                                        ]),
                                        m('.w-row', [
                                            m('.w-sub-col.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    'CEP'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ]),
                                            m('.w-sub-col.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    '도시'
                                                    //coffee 'Cidade'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ]),
                                            m('.w-col.w-col-4', [
                                                m('label.field-label.fontweight-semibold',
                                                    '주'
                                                    //coffee '주'
                                                ),
                                                m('select.positive.text-field.w-select', [
                                                    m("option[value='']",
                                                        '선택...'
                                                        //coffee '선택...'
                                                    )
                                                ])
                                            ])
                                        ]),
                                        m('.w-row', [
                                            m('.w-sub-col.w-col.w-col-6', [
                                                m('label.field-label.fontweight-semibold',
                                                    '전화'
                                                    //coffee '전화'
                                                ),
                                                m("input.positive.text-field.w-input[type='email']")
                                            ]),
                                            m('.w-col.w-col-6')
                                        ])
                                    ])
                                ]) : ''),

                                _.map(ctrl.multipleChoiceQuestions, question =>
                                m('.u-marginbottom-30.w-form', [
                                    m('.fontcolor-secondary.fontsize-base.fontweight-semibold',
                                      question.question
                                    ),
                                    m('.fontcolor-secondary.fontsize-smaller.u-marginbottom-20',
                                      question.description
                                    ),
                                    m('form', [
                                        _.map(question.survey_question_choices_attributes(), choice =>
                                        m('.fontsize-small.w-radio', [
                                            m("input.w-radio-input[type='radio'][value='Radio']"),
                                            m('label.w-form-label',
                                              choice.option
                                            )
                                        ]))
                                    ])
                                ])),
                                _.map(ctrl.openQuestions, question =>
                                m('.u-marginbottom-30.w-form', [
                                    m('.fontcolor-secondary.fontsize-base.fontweight-semibold',
                                      question.question
                                    ),
                                    m('.fontcolor-secondary.fontsize-smaller.u-marginbottom-20',
                                        question.description
                                    ),
                                    m('form',
                                        m("input.positive.text-field.w-input[placeholder='귀하의 답변'][type='text']")
                                        //coffee m("input.positive.text-field.w-input[placeholder='Sua resposta'][type='text']")
                                    )
                                ]))
                            ])
                        ),
                        m('.w-col.w-col-1')
                    ])
                )
            ),
            m('.section', [
                m('.u-marginbottom-30.w-row', [
                    m('.w-col.w-col-2'),
                    m('.w-col.w-col-8', [
                        m('.u-marginbottom-30.u-text-center', [
                            m('.fontsize-small.fontweight-semibold.u-marginbottom-10',
                                `O questionário acima será enviado para os ${args.reward.paid_count} apoiadores da recompensa`
                            ),
                            m(rewardCardBig, { reward: args.reward })
                        ]),
                        m('.card.card-message.fontsize-small.u-marginbottom-30.u-radius', [
                            m('span.fontweight-semibold',
                                'OBS:'
                            ),
                            m.trust('&nbsp;'),
                            '질문은 자동으로 4일 이내에 응답하지 않는 사람들에게 다시 제출됩니다. 서포터가 응답을 제출하지 않고 계속 진행하면 설문지가 두 번 더 재전송됩니다.'
                            //coffee 'As perguntas serão reenviadas automaticamente para aqueles que não responderem em até 4 dias. Caso os apoiadores continuem sem enviar as respostas, o questionário será reenviado mais duas vezes.'
                        ])
                    ]),
                    m('.w-col.w-col-2')
                ]),
                m('.u-marginbottom-20.w-row', [
                    m('.w-col.w-col-3'),
                    m('.w-sub-col.w-col.w-col-4',
                        m("a.btn.btn-large[href='javascript:void(0);']", { onclick: args.sendQuestions }, [
                            m('span.fa.fa-paper-plane',
                                ''
                            ),
                            ' ',
                            m.trust('&nbsp;'),
                            '보내기'
                            //coffee 'Enviar'
                        ])
                    ),
                    m('.w-col.w-col-2',
                        m("a.btn.btn-large.btn-terciary[href='javascript:void(0);']", { onclick: ctrl.togglePreview },
                            '수정'
                            //coffee 'Editar'
                        )
                    ),
                    m('.w-col.w-col-3')
                ])
            ])
        );
    }
};

export default surveyCreatePreview;
