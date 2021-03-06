/**
 * window.c.deliverContributionModalContent component
 * Render deliver contribution modal
 *
 */
import m from 'mithril';

const deliverContributionModalContent = {
    view(ctrl, args) {
        return m('div',

            m('.modal-dialog-header',
                m('.fontsize-large.u-text-center', [
                    m('span.fa.fa-check-circle',
                        ''
                    ),
                    ' Recompensas a caminho! Obaaa!!!!'
                ])
            ),
            m('.modal-dialog-content', [
                m('p.fontsize-small.u-marginbottom-30', [
                    m('span.fontweight-semibold',
                        `선택한 ${args.amount} 후원.`
                        //coffee `Você selecionou ${args.amount} apoios.`
                    ),
                    ' Após sua confirmação, os apoiadores que efetuaram esses apoios ao seu projeto serão notificados de que suas recompensas serão entregues em breve.'
                ]),
                m('.w-form', [
                    m('form', [
                        m('.fontsize-smaller',
                            'Se quiser adicionar alguma informação nessa mensagem, use o espaço abaixo! É um ótimo momento para agradecer a essas pessoas que acreditaram em você!'
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
                            '선택한 후원에 대한 보상이 발송되었음을 확인합니까?'
                            //coffee 'Você confirma que a recompensa dos apoios selecionados foram enviadas?'
                        )
                    ),
                    m('.w-col.w-col-1')
                ]),
                m('.w-row', [
                    m('.w-col.w-col-1'),
                    m('.w-col.w-col-5',
                        m('a.btn.btn-medium.w-button', {
                            onclick: () => args.updateStatus('delivered')
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

export default deliverContributionModalContent;
