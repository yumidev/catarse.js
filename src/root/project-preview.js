import h from '../h';
import m from 'mithril';
import projectsShow from '../root/projects-show';

const projectPreview = {
    view(ctrl, args) {
        return args.project() ? m('div', [
            m('.u-text-center',
                m('.w-container',
                    m('.w-row', [
                        m('.w-col.w-col-8.w-col-push-2', [
                            m('.fontweight-semibold.fontsize-large.u-margintop-40',
                                '피드백 시간입니다!'
                                //coffee 'É hora dos feedbacks!'
                            ),
                            m('p.fontsize-base',
                                '아래의 링크를 친구와 공유하고 캠페인 조정에 시간을 할애하십시오.'
                                //coffee 'Compartilhe o link abaixo com seus amigos e aproveite o momento para fazer ajustes finos que ajudem na sua campanha.'
                            ),
                            m('.w-row.u-marginbottom-30', [
                                m('.w-col.w-col-3'),
                                m('.w-col.w-col-6',
                                    m(`input.w-input.text-field[type='text'][value='https://www.catarse.me/${args.project().permalink}']`)
                                ),
                                m('.w-col.w-col-3')
                            ])
                        ]),
                        m('.w-col.w-col-2')
                    ])
                )
            ),
            m(projectsShow, args)
        ]) : h.loader();
    }
};

export default projectPreview;