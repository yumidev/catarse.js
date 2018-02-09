/**
 * window.c.ProjectReminder component
 * A component that displays a clickable project reminder element.
 * The component can be of two types: a 'link' or a 'button'
 *
 * Example:
 *  view: {
 *      return m.component(c.ProjectReminder, {project: project, type: 'button'})
 *  }
 */
import m from 'mithril';
import postgrest from 'mithril-postgrest';
import models from '../models';
import h from '../h';
import popNotification from './pop-notification';

const projectReminder = {
    controller(args) {
        let l = m.prop(false);
        const project = args.project,
            filterVM = postgrest.filtersVM({
                project_id: 'eq'
            }),
            storeReminderName = 'reminder',
            popNotification = m.prop(false),
            submitReminder = () => {
                if (!h.getUser()) {
                    h.storeAction(storeReminderName, project().project_id);
                    return h.navigateToDevise();
                }
                const loaderOpts = project().in_reminder ? models.projectReminder.deleteOptions(filterVM.parameters()) : models.projectReminder.postOptions({
                    project_id: project().project_id
                });
                l = postgrest.loaderWithToken(loaderOpts);

                l.load().then(() => {
                    project().in_reminder = !project().in_reminder;

                    if (project().in_reminder) {
                        popNotification(true);
                        setTimeout(() => {
                            popNotification(false);
                            m.redraw();
                        }, 5000);
                    } else {
                        popNotification(false);
                    }
                });
            };

        if (h.callStoredAction(storeReminderName) == project().project_id) {
            submitReminder();
        }

        filterVM.project_id(project().project_id);

        return {
            l,
            submitReminder,
            popNotification
        };
    },
    view(ctrl, args) {
        const mainClass = (args.type === 'button') ? '' : '.u-text-center.u-marginbottom-30',
            buttonClass = (args.type === 'button') ? 'w-button btn btn-terciary btn-no-border' : 'btn-link link-hidden fontsize-large',
            hideTextOnMobile = args.hideTextOnMobile || false,
            project = args.project,
            onclickFunc = h.analytics.event({ cat: 'project_view', act: 'project_floatingreminder_click', project: project() }, ctrl.submitReminder);

        return m(`#project-reminder${mainClass}`, [
            m('a.btn.btn-small.btn-terciary.w-hidden-main.w-hidden-medium[data-ix=\'popshare\'][href=\'#\']', {
                onclick: onclickFunc
            },

              (project().in_reminder ? [
                  m('span.fa.fa-heart'),
                  ' 알림 활성'
              ] : [
                  m('span.fa.fa-heart-o'),
                  ' 비밀번호를 잊으셨나요?'
              ])
            ),

            m(`button[class="w-hidden-small w-hidden-tiny ${buttonClass} ${(project().in_reminder ? 'link-hidden-success' : 'fontcolor-secondary')} fontweight-semibold"]`, {
                onclick: onclickFunc
            }, [
                (ctrl.l() ? h.loader() : (project().in_reminder ? m('span.fa.fa-heart') : m('span.fa.fa-heart-o')))
            ]), (ctrl.popNotification() ? m.component(popNotification, {
                message: '캠페인 종료 48시간 전에 알림 이메일을 보내드립니다.'
            }) : '')
        ]);
    }
};

export default projectReminder;
