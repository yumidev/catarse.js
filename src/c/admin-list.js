import m from 'mithril';
import h from '../h';
import adminItem from './admin-item';

const adminList = {
    controller(args) {
        const list = args.vm.list;

        if (!list.collection().length && list.firstPage) {
            list.firstPage(args.filterVM ? args.filterVM.parameters() : null).then(null, (serverError) => {
                args.vm.error(serverError.message);
            });
        }
    },
    view(ctrl, args) {
        const list = args.vm.list,
            error = args.vm.error,
            label = args.label || '',
            itemComponent = args.itemComponent || adminItem;

        return m('.w-section.section', [
            m('.w-container',
                error() ?
                m('.card.card-error.u-radius.fontweight-bold', error()) : [
                    m('.w-row.u-marginbottom-20', [
                        m('.w-col.w-col-9', [
                            m('.fontsize-base',
                                list.isLoading() ?
                              `Carregando ${label.toLowerCase()}...` : [
                                  m('.w-row', [
                                      m('.w-col.w-col-3', [
                                          m('.fontweight-semibold', list.total()),
                                          ` ${label.toLowerCase()} encontrados`
                                      ]),
                                      (args.vm && args.vm.hasInputAction ? m('.w-col-9.w-col', args.vm.inputActions()) : '')
                                  ])
                              ]
                            )
                        ])
                    ]),
                    m('#admin-contributions-list.w-container', [
                        list.collection().map(item => m.component(itemComponent, {
                            listItem: args.listItem,
                            listDetail: args.listDetail,
                            listWrapper: args.vm,
                            item,
                            key: item.id
                        })),
                        m('.w-section.section', [
                            m('.w-container', [
                                m('.w-row', [
                                    m('.w-col.w-col-2.w-col-push-5', [
                                        list.isLoading() ?
                                        h.loader() :
                                        m('button#load-more.btn.btn-medium.btn-terciary', {
                                            onclick: list.nextPage
                                        }, 'Carregar mais')
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]
            )
        ]);
    }
};

export default adminList;
