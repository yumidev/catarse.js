/**
 * window.c.errorContributionModalContent component
 * Render deliver error contribution modal
 *
 */
import m from 'mithril';

const errorContributionModalContent = {
    view(ctrl, args) {
        return m('div',

            m('.modal-dialog-header',
                m('.fontsize-large.u-text-center', [
                    m('span.fa.fa-exclamation-triangle',
                        ''
                    ),
                    ' 발신 오류!'
                    //coffee 'Ops. Erro no envio!'
                ])
            ),
            m('.modal-dialog-content', [
                m('p.fontsize-small.u-marginbottom-30', [
                    m('span.fontweight-semibold',
                        `선택한 ${args.amount} 후원.`
                        //coffee `Você selecionou ${args.amount} apoios.`
                    ),
                    ' Após sua confirmação, os apoiadores que efetuaram esses apoios ao seu projeto serão notificados de que houve um problema com o envio de suas recompensas.'
                ]),
                m('.w-form', [
                    m('form', [
                        m('.fontsize-smaller',
                            '이 메시지에 정보를 추가하려면 아래의 공란을 사용해 주시길 바랍니다 (예 : 배달 주소를 확인하거나 오류의 원인을 설명 할 수 있음)'
                            //coffee 'Se quiser adicionar alguma informação nessa mensagem, use o espaço abaixo (ex: você pode pedir confirmação de endereço de entrega ou explicar motivos do erro)'
                        ),
                        m("textarea.height-mini.text-field.w-input[placeholder='메시지 입력 (선택 사항)']", {
                        //coffee m("textarea.height-mini.text-field.w-input[placeholder='Digite sua mensagem (opcional)']", {
                            value: args.message(),
                            onchange: m.withAttr('value', args.message)
                        })
                    ])
                ]),
                m('.w-row', [
                    m('.w-col.w-col-1'),
                    m('.w-col.w-col-10',
                        m('.fontsize-small.fontweight-semibold.u-marginbottom-20.u-text-center',
                            'Você confirma que houve um erro no envio das recompensas dos apoios selecionados?'
                        )
                    ),
                    m('.w-col.w-col-1')
                ]),
                m('.w-row', [
                    m('.w-col.w-col-1'),
                    m('.w-col.w-col-5',
                        m('a.btn.btn-medium.w-button', {
                            onclick: () => args.updateStatus('error')
                        },
                            '네!'
                            //coffee 'Sim!'
                        )
                    ),
                    m('.w-col.w-col-5',
                        m('a.btn.btn-medium.btn-terciary.w-button', {
                            onclick: args.displayModal.toggle
                        },
                            '뒤로'
                            //coffee 'Voltar'
                        )
                    ),
                    m('.w-col.w-col-1')
                ])
            ]));
    }
};

export default errorContributionModalContent;
