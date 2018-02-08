/**
 * window.c.OwnerMessageContent component
 * Render project owner contact form
 *
 */
import m from 'mithril';
import postgrest from 'mithril-postgrest';
import _ from 'underscore';
import h from '../h';
import models from '../models';
import userVM from '../vms/user-vm';

const ownerMessageContent = {
    controller(args) {
        let l = m.prop(false);
        const sendSuccess = m.prop(false),
            userDetails = args,
            submitDisabled = m.prop(false),
            // sets default values when user is not logged in
            user = h.getUser() || {
                name: '',
                email: ''
            },
            from_name = m.prop(userVM.displayName(user)),
            from_email = m.prop(user.email),
            content = m.prop('');

        const sendMessage = () => {
            if (l()) {
                return false;
            }
            submitDisabled(true);
            content(content().split('\n').join('<br />'));
            const project = h.getCurrentProject() || { project_id: args().project_id };

            const loaderOpts = models.directMessage.postOptions({
                from_name: from_name(),
                from_email: from_email(),
                user_id: h.getUser().user_id,
                content: content(),
                project_id: project ? project.project_id : null,
                to_user_id: userDetails().id
            });

            l = postgrest.loaderWithToken(loaderOpts);

            l.load().then(sendSuccess(true));

            submitDisabled(false);
            return false;
        };

        return {
            sendMessage,
            submitDisabled,
            sendSuccess,
            userDetails: args,
            from_name,
            from_email,
            content,
            l
        };
    },
    view(ctrl, args) {
        const successMessage = m('.modal-dialog-content.u-text-center', [
                m('.fa.fa-check-circle.fa-5x.text-success.u-marginbottom-40'),
                m('p.fontsize-large', `Sua mensagem foi enviada com sucesso para ${ctrl.userDetails().name}. Você vai receber uma cópia no seu email e pode seguir a conversa por lá!`)
            ]),
            contactForm = [
                m('.modal-dialog-content', [
                    m('.w-form', [
                        m('form', {
                            onsubmit: h.validate().submit([{
                                prop: ctrl.from_name,
                                rule: 'text'
                            }, {
                                prop: ctrl.from_email,
                                rule: 'email'
                            }, {
                                prop: ctrl.content,
                                rule: 'text'
                            }], ctrl.sendMessage)
                        }, [
                            m('.w-row', [
                                m('.w-col.w-col-6.w-sub-col', [
                                    m('label.fontsize-smaller', 'Seu nome'),
                                    m(`input.w-input.text-field[value='${ctrl.from_name()}'][type='text'][required='required']`, {
                                        onchange: m.withAttr('value', ctrl.from_name),
                                        class: h.validate().hasError(ctrl.from_name) ? 'error' : ''
                                    })
                                ]),
                                m('.w-col.w-col-6', [
                                    m('label.fontsize-smaller', 'Seu email'),
                                    m(`input.w-input.text-field[value='${ctrl.from_email()}'][type='text'][required='required']`, {
                                        onchange: m.withAttr('value', ctrl.from_email),
                                        class: h.validate().hasError(ctrl.from_email) ? 'error' : ''
                                    })
                                ])
                            ]),
                            m('label', 'Mensagem'),
                            m('textarea.w-input.text-field.height-small[required=\'required\']', {
                                onchange: m.withAttr('value', ctrl.content),
                                class: h.validate().hasError(ctrl.content) ? 'error' : ''
                            }),
                            m('.u-marginbottom-10.fontsize-smallest.fontcolor-terciary', 'Você receberá uma cópia desta mensagem em seu email.'),
                            m('.w-row', h.validationErrors().length ? _.map(h.validationErrors(), errors => m('span.fontsize-smallest.text-error', [
                                m('span.fa.fa-exclamation-triangle'),
                                ` ${errors.message}`,
                                m('br')
                            ])) : ''),
                            m('.modal-dialog-nav-bottom',
                                m('.w-row',
                                    m('.w-col.w-col-6.w-col-push-3', !ctrl.l() ? m('input.w-button.btn.btn-large[type="submit"][value="Enviar mensagem"]', {
                                        disabled: ctrl.submitDisabled()
                                    }) : h.loader())
                                )
                            )
                        ])
                    ])
                ])
            ];

        return m('div', [
            m('.modal-dialog-header',
                m('.fontsize-large.u-text-center', 'Enviar mensagem')
            ),
            ctrl.sendSuccess() ? successMessage : contactForm
        ]);
    }
};

export default ownerMessageContent;
