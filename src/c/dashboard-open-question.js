import m from 'mithril';
import inlineError from '../c/inline-error';

const dashboardOpenQuestion = {
    view(ctrl, args) {
        const { question, index } = args;
        return m('.card.u-marginbottom-30.u-radius.w-form', [
            m('div', [
                m('.w-row', [
                    m('.w-col.w-col-4',
                        m('label.fontsize-smaller[for="name-3"]',
                            '질문'
                            //coffee 'Pergunta'
                        )
                    ),
                    m('.w-col.w-col-8',
                        m('input.positive.text-field.w-input[name="question"][type="text"]', {
                            class: question.error ? '오류' : null,
                            //coffee class: question.error ? 'error' : null,
                            name: `reward[surveys_attributes][questions][${index}][question]`,
                            onchange: m.withAttr('value', newValue => question.question = newValue),
                            value: question.question,
                            onfocus: () => {
                                question.error = false;
                            }
                        }),
                        question.error ? m(inlineError, { message: '입력란을 작성해 주시길 바랍니다.' }) : null
                        //coffee question.error ? m(inlineError, { message: 'O campo pergunta não pode ser vazio.' }) : null
                    )
                ]),
                m('.w-row', [
                    m('.w-col.w-col-4',
                        m('label.fontsize-smaller[for="name-3"]',
                            '상품 설명'
                        )
                    ),
                    m('.w-col.w-col-8',
                        m('input.positive.text-field.w-input[type="text"]', {
                            name: `reward[surveys_attributes][questions][${index}][description]`,
                            onchange: m.withAttr('value', newValue => question.description = newValue),
                            value: question.description
                        })
                    )
                ])
            ])
        ]);
    }
};

export default dashboardOpenQuestion;
