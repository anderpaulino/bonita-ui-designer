describe('Resolution service', function() {
  var resolutions;

  beforeEach( module('pb.common.services', function(resolutionsProvider){
    resolutionsProvider.addResolutions([
      {
        key: 'foo',
        label: 'bar',
        icon: 'quux',
        width: 1337,
        tooltip: 'foo bar quux'
      }
    ])
  }));

  beforeEach(inject(function ($injector) {
    resolutions = $injector.get('resolutions');
  }));

  it('should give all resolution in the right order', function() {
    // when we load resolution
    var res = resolutions.all();

    // then we should have them in the right order
    expect(res.length).toBe(2);
    expect(res.map(function(resolution) {
      return resolution.key;
    })).toEqual(['xs','foo']);
  });

  it('should get a resolution or return md by default', function() {
    // when we load the default resolution
    var res = resolutions.get('xs');

    // then we should have xs
    expect(res.key).toBe('xs');

    // when we load a wrong key
    resolution = resolutions.get();

    // then we should have desktop
    expect(resolution.key).toBe('xs');
  });

  it('should return the default resolution if no resolution is selected', function() {
    expect(resolutions.selected().key).toBe(resolutions.getDefaultResolution().key);
  });

  it('should return the selected resolution when a resolution is selected', function() {
    var resolution = resolutions.select('xs');
    expect(resolutions.selected().key).toBe('xs');
    expect(resolution).toEqual(resolutions.selected());

    resolution = resolutions.select('foo');
    expect(resolutions.selected().key).toBe('foo');
    expect(resolution).toEqual(resolutions.selected());
  });
});
