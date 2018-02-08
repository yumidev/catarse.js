/**
 * window.c.landingSignup component
 * A visual component that displays signup email typically used on landing pages.
 * It accepts a custom form action to attach to third-party services like Mailchimp
 *
 * Example:
 * view: () => {
 *      ...
 *      m.component(c.landingSignup, {
 *          builder: {
 *              customAction: 'http://formendpoint.com'
 *          }
 *      })
 *      ...
 *  }
 */
import m from 'mithril';
import h from '../h';

const landingSignup = {
    controller(args) {
        const builder = args.builder,
            email = m.prop(''),
            error = m.prop(false),
            submit = () => {
                if (h.validateEmail(email())) {
                    return true;
                }
                error(true);
                return false;
            };
        return {
            email,
            submit,
            error
        };
    },
    view(ctrl, args) {
        const errorClasses = (!ctrl.error) ? '.positive.error' : '';
        return m(`form.w-form[id="email-form"][method="post"][action="${args.builder.customAction}"]`, {
            onsubmit: ctrl.submit
        }, [
            m('.w-col.w-col-5', [
                m(`input${errorClasses}.w-input.text-field.medium[name="EMAIL"][placeholder="Digite seu email"][type="text"]`, {
                    config: h.RDTracker('landing-flex'),
                    onchange: m.withAttr('value', ctrl.email),
                    value: ctrl.email()
                }),
                (ctrl.error() ? m('span.fontsize-smaller.text-error', 'E-mail inválido') : '')
            ]),
            m('.w-col.w-col-3', [
                m('input.w-button.btn.btn-large[type="submit"][value="Cadastrar"]')
            ])
        ]);
    }
};

export default landingSignup;
