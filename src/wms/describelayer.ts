import { XmlDocument } from '@rgrove/parse-xml';
import {
  findChildElement,
  findChildrenElement,
  getElementAttribute,
  getRootElement,
} from '../shared/xml-utils.js';
import { WmsLayerDescription } from './model.js';

/**
 * Parses a WMS DescribeLayer response document and returns the description
 * for the requested layer.
 * @param describeLayerDoc The parsed XML document from a DescribeLayer response
 * @param layerName The layer name to look for in the response
 * @return The layer description, or null if the layer was not found in the response
 */
export function parseDescribeLayerResponse(
  describeLayerDoc: XmlDocument,
  layerName: string
): WmsLayerDescription | null {
  const root = getRootElement(describeLayerDoc);
  const layerDescriptions = findChildrenElement(root, 'LayerDescription');

  const match = layerDescriptions.find(
    (el) => getElementAttribute(el, 'name') === layerName
  );
  if (!match) return null;

  const owsType = getElementAttribute(match, 'owsType');
  const owsUrl =
    getElementAttribute(match, 'owsURL') || getElementAttribute(match, 'wfs');

  const queryEl = findChildElement(match, 'Query');
  const typeName = queryEl
    ? getElementAttribute(queryEl, 'typeName')
    : undefined;

  return {
    layerName,
    owsType,
    owsUrl,
    ...(typeName ? { typeName } : {}),
  };
}
