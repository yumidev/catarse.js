import m from 'mithril';

const projectReminderCount = {
    view(ctrl, args) {
        const project = args.resource;
        return m('#project-reminder-count.card.u-radius.u-text-center.medium.u-marginbottom-80', [
            m('.fontsize-large.fontweight-semibold', '내 계정 정보 저장 버튼을 클릭한 사용자 수'),
            //coffee m('.fontsize-large.fontweight-semibold', 'Total de pessoas que clicaram no botão Lembrar-me'),
            m('.fontsize-smaller.u-marginbottom-30', '이메일 알림은 캠페인 종료 48시간 전에 전송됩니다.'),
            //coffee m('.fontsize-smaller.u-marginbottom-30', 'Um lembrete por email é enviado 48 horas antes do término da sua campanha'),
            m('.fontsize-jumbo', project.reminder_count)
        ]);
    }
};

export default projectReminderCount;
