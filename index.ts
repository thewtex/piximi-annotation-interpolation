import "./assetPathSetup.js";
import { readImage } from '@itk-wasm/image-io';
import { ZarrMultiscaleSpatialImage } from "@itk-viewer/io/ZarrMultiscaleSpatialImage.js";
import { ItkWasmMultiscaleSpatialImage } from '@itk-viewer/io/ItkWasmMultiscaleSpatialImage.js';

import { Image } from "itk-wasm";

import {
  morphologicalContourInterpolation,
} from "@itk-wasm/morphological-contour-interpolation"

import "@itk-viewer/element/itk-viewer-3d.js";
import "@itk-viewer/element/itk-viewer-2d.js";

// const annotationPath = "64816L_amygdala_int.nii.gz"
// const annotationPath = "ExternalInterpolation.nrrd"
// const annotationPath = "ExternalInterpolationOutput.nrrd"
const annotationPath = "ExternalInterpolation1.nrrd"
// const annotationPath = "ExternalInterpolationOutput1.nrrd"
const doInterpolation = true;

const interpolateAnnotation = async (image: Image) => {
  const result = await morphologicalContourInterpolation(image, {
    axis: 2,
  });
  return result.outputImage;
};

const loadImage = async (imagePath: string, doInterpolation: boolean) => {
  const url = new URL(imagePath, document.location.origin);
  const response = await fetch(url.href);
  const data = new Uint8Array(await response.arrayBuffer());
  const inputFile = { data, path: imagePath };
  let { image: itkimage } = await readImage(inputFile);
  if (doInterpolation) {
    itkimage = await interpolateAnnotation(itkimage);
  }
  const image = new ItkWasmMultiscaleSpatialImage(itkimage);
  return image;
};

document.addEventListener("DOMContentLoaded", async function () {
  const image = await loadImage(annotationPath, doInterpolation)

  const viewerElement = document.querySelector("#viewer");
  if (!viewerElement) throw new Error("Could not find element");
  const viewer = viewerElement.getActor();
  viewer!.send({ type: "setImage", image, name: "image" });
});
