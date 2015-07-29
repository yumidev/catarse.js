describe('AdminList component', function() {
  var fakeVM = {
    total: m.prop(),
    collection: m.prop([]),
    isLoading: m.prop()
  };

  beforeAll(function() {
    AdminList = m.component(adminApp.AdminList, {vm: fakeVM});
  });

  describe('view', function() {
    beforeAll(function() {
      view = AdminList.view();
      $output = mq(view);
    });

    it('should render fetched contributions cards', function() {
      pending('Build a fake VM');
    });
  });
});
