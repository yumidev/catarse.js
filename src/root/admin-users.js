import m from 'mithril';
import h from '../h';
import userListVM from '../vms/user-list-vm';
import userFilterVM from '../vms/user-filter-vm';
import adminFilter from '../c/admin-filter';
import adminList from '../c/admin-list';
import adminUserItem from '../c/admin-user-item';
import adminUserDetail from '../c/admin-user-detail';
import adminUser from '../c/admin-user';
import filterMain from '../c/filter-main';
import filterDropdown from '../c/filter-dropdown';

const adminUsers = {
    controller() {
        const listVM = userListVM,
            filterVM = userFilterVM,
            error = m.prop(''),
            itemBuilder = [{
                component: adminUser,
                wrapperClass: '.w-col.w-col-4'
            }],
            filterBuilder = [{ // name
                component: filterMain,
                data: {
                    vm: filterVM.full_text_index,
                    placeholder: '이름, 이메일, 사용자 ID 별로 검색...',
                },
            }, { // status
                component: filterDropdown,
                data: {
                    label: '누구나',
                    index: 'status',
                    name: 'deactivated_at',
                    vm: filterVM.deactivated_at,
                    options: [{
                        value: '',
                        option: '누구나'
                    }, {
                        value: null,
                        option: '활동적인'
                    }, {
                        value: !null,
                        option: '장애인'
                    }]
                }
            }],
            submit = () => {
                listVM.firstPage(filterVM.parameters()).then(null, (serverError) => {
                    error(serverError.message);
                });
                return false;
            };

        return {
            filterVM,
            filterBuilder,
            listVM: {
                list: listVM,
                error
            },
            submit
        };
    },
    view(ctrl) {
        const label = '사용자';

        return m('', [
            m.component(adminFilter, {
                form: ctrl.filterVM.formDescriber,
                filterBuilder: ctrl.filterBuilder,
                label,
                submit: ctrl.submit
            }),
            m.component(adminList, {
                vm: ctrl.listVM,
                label,
                listItem: adminUserItem,
                listDetail: adminUserDetail
            })
        ]);
    }
};

export default adminUsers;
