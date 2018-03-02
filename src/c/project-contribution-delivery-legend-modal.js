import m from 'mithril';
import h from '../h';

const ProjectContributionDeliveryLegendModal = {
    view(ctrl, args) {
        return m('div', [
            m('.modal-dialog-header', [
                m('.fontsize-large.u-text-center',
                    '배송 상태')
                    //coffee 'Status da entrega')
            ]),
            m('.modal-dialog-content', [
                m('.fontsize-smaller.u-marginbottom-30',
                    'Todo apoio tem, por padrão, o status de entrega \'Não enviada\'. Para ajudar no seu controle da entrega de recompensas, você pode alterar esses status e filtrar a pesquisa de apoios com os seguintes rótulos:'
                ),
                m('.u-marginbottom-20', [
                    m('.fontsize-smaller.fontweight-semibold', [
                        '전송되지 않음',
                        //coffee 'Não enviada',
                        m.trust('&nbsp;')
                    ]),
                    m('.fontsize-smaller',
                        '후원자에게 아직 보상을 보내지 않았습니다.'
                        //coffee 'Você ainda não enviou a recompensa para o apoiado.'
                    )
                ]),
                m('div',
                    m('span.fontsize-smaller.badge.badge-success',
                        '배달 됨'
                        //coffee 'Entregue'
                    )
                ),
                m('.u-marginbottom-20',
                    m('.fontsize-smaller',
                        '당신은 이미 후원자에게 보상을 보냈습니다.'
                        //coffee 'Você já enviou a recompensa para o apoiador.'
                    )
                ),
                m('.u-marginbottom-20', [
                    m('div',
                        m('span.fontsize-smaller.badge.badge-attention',
                            '전송 오류'
                            //coffee 'Erro na entrega'
                        )
                    ),
                    m('.fontsize-smaller',
                        'Você enviou a recompensa, mas houve algum problema com o envio (ex: endereço incorreto).'
                    )
                ]),
                m('.u-marginbottom-20', [
                    m('div',
                        m('span.fontsize-smaller.badge.badge-success', [
                            m('span.fa.fa-check-circle',
                                ''
                            ),
                            ' Recebida'
                        ])
                    ),
                    m('.fontsize-smaller',
                        'O apoiador marcou a recompensa como \'Recebida\' no seu painel de controle \o/'
                    )
                ])
            ]),
            m('.divider.u-marginbottom-10'),
            m('.fontcolor-secondary.fontsize-smaller.u-marginbottom-30', [
                '참고 : 보상이 실제가 아닌 경우 (예 : 디지털 사본과 같은 경우)에도 위의 시스템을 사용할 수 있습니다.'
                //coffee 'Obs: mesmo que a recompensa não seja física (como uma cópia digital, por exemplo), você pode mesmo assim usar o sistema acima!'
            ])
        ]);
    }
};

export default ProjectContributionDeliveryLegendModal;
