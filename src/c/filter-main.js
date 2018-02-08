import m from 'mithril';

const filterMain = {
    view(ctrl, args) {
        const inputWrapperClass = args.inputWrapperClass || '.w-input.text-field.positive.medium',
            btnClass = args.btnClass || '.btn.btn-large.u-marginbottom-10';

        return m('.w-row', [
            m('.w-col.w-col-8', [
                m(`input${inputWrapperClass}[placeholder="${args.placeholder}"][type="text"]`, {
                    onchange: m.withAttr('value', args.vm),
                    value: args.vm()
                })
            ]),
            m('.w-col.w-col-4', [
                m(`input#filter-btn${btnClass}[type="submit"][value="Buscar"]`)
            ])
        ]);
    }
};

export default filterMain;
