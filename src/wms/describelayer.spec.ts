import { parseDescribeLayerResponse } from './describelayer.js';
// @ts-expect-error ts-migrate(7016)
import describeLayerResponse from '../../fixtures/wms/describelayer-response.xml';
import { parseXmlString } from '../shared/xml-utils.js';

describe('WMS DescribeLayer', () => {
  describe('parseDescribeLayerResponse', () => {
    it('parses a vector layer description (owsType WFS)', () => {
      const doc = parseXmlString(describeLayerResponse);
      const result = parseDescribeLayerResponse(
        doc,
        'my_workspace:my_vector_layer'
      );
      expect(result).toEqual({
        layerName: 'my_workspace:my_vector_layer',
        owsType: 'WFS',
        owsUrl: 'https://my-server.com/wfs?',
        typeName: 'my_workspace:my_vector_layer',
      });
    });

    it('parses a raster layer description (owsType WCS)', () => {
      const doc = parseXmlString(describeLayerResponse);
      const result = parseDescribeLayerResponse(
        doc,
        'my_workspace:my_raster_layer'
      );
      expect(result).toEqual({
        layerName: 'my_workspace:my_raster_layer',
        owsType: 'WCS',
        owsUrl: 'https://my-server.com/wcs?',
        typeName: 'my_workspace:my_raster_layer',
      });
    });

    it('returns null when the layer is not found in the response', () => {
      const doc = parseXmlString(describeLayerResponse);
      const result = parseDescribeLayerResponse(doc, 'nonexistent:layer');
      expect(result).toBeNull();
    });
  });
});
