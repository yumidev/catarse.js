import m from 'mithril';
import adminNotificationHistory from '../../src/c/admin-notification-history';

describe('AdminNotificationHistory', () => {
    let user, historyBox,
        ctrl, view, $output;

    beforeAll(() => {
        user = m.prop(UserDetailMockery(1));
        $output = mq(adminNotificationHistory, {user: user()[0]});
    });

    describe('view', () => {
        it('should render fetched notifications', () => {
            expect($output.find('.date-event').length).toEqual(1);
        });
    });
});
