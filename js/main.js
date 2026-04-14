/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-amd */
/* eslint-disable linebreak-style */

// store the import elements in variables
const mapViewElement = document.querySelector('arcgis-map');
const sceneViewElement = document.querySelector('arcgis-scene');
const switchViewButton = document.querySelector('calcite-button');

// pause script until both the map and scene are loaded
await mapViewElement.viewOnReady();
await sceneViewElement.viewOnReady();

const showAndHide = (elementToShow, elementToHide) => {
  elementToShow.classList.add('visible');
  elementToHide.classList.remove('visible');
};

const switchView = (button) => {
  const is2D = button.id === 'to-3D'; // Check if switching from 2D.
  // Clone the viewpoint from the currently visible view.
  const activeViewpoint = is2D
    ? mapViewElement.viewpoint.clone()
    : sceneViewElement.viewpoint.clone();
  // This adjusts for Web Mercator distortion in 2D maps which causes scale to increase with latitude.
  const scaleConversionFactor = Math.cos(
    (activeViewpoint.targetGeometry.latitude * Math.PI) / 180,
  );

  button.id = is2D ? 'to-2D' : 'to-3D';
  button.textContent = is2D ? 'Switch to 2D' : 'Switch to 3D';

  if (is2D) {
    // 2D → 3D: Remove distortion by shrinking the scale (zoom in to match true ground distance).
    activeViewpoint.scale *= scaleConversionFactor;
    sceneViewElement.viewpoint = activeViewpoint; // Set target viewpoint to current viewpoint.
    showAndHide(sceneViewElement, mapViewElement);
  } else {
    // 3D → 2D: Add distortion by inflating the scale (zoom out to match perceived 2D zoom).
    activeViewpoint.scale /= scaleConversionFactor;
    mapViewElement.viewpoint = activeViewpoint; // Set target viewpoint to current viewpoint.
    showAndHide(mapViewElement, sceneViewElement);
  }
};

switchViewButton.addEventListener('click', (event) => switchView(event.target));

// get the height select as an object
const heightslider2 = document.getElementById('heightSlider2');

// get the year select as an object
const yearSelect1 = document.getElementById('yearSelect1');
const yearSelect2 = document.getElementById('yearSelect2');

// get the current height and year
let currentYear = yearSelect1.value;
let currentHeight = Number(heightslider2.value);

// get the current Category
let currentCategory = document.getElementById('varSelect1').value;
let currentCategory2 = document.getElementById('varSelect2').value;

// Wait for the view to be ready

let lyrFromMap = mapViewElement.map.allLayers.find(
  (lyrFromMap) => lyrFromMap.title === currentCategory,
);

// get the layer from the scene
let lyrFromScene = sceneViewElement.map.allLayers.find(
  (lyrFromScene) => lyrFromScene.title === currentCategory,
);

// print the layers to console
console.log('2D layer', lyrFromMap);
console.log('3D layer', lyrFromScene);

// ======================================
// Update the Category (2d map)
// ======================================

varSelect1.addEventListener('calciteSelectChange', () => {
  // get the user's selection
  const selectionText = varSelect1.value;

  // update the current category
  currentCategory = selectionText;

  // update the selection in the 3d scene
  varSelect2.setAttribute('value', selectionText);

  // hide current layer
  lyrFromMap.visible = false;

  // build the density function
  const densityFunction = `$feature.N_${currentYear} / $feature.ACRES`;
  const densityFactorFunction = `$feature.N_${currentYear} / $feature.ACRES * ${currentHeight}`;

  // find the new layer using the user's selection
  lyrFromMap = mapViewElement.map.allLayers.find(
    (lyrFromMap) => lyrFromMap.title === currentCategory,
  );

  // Update the renderer of the layer in the 2D Map
  if (lyrFromMap) {
    const newRendererMap = lyrFromMap.renderer.clone();
    newRendererMap.valueExpression = densityFunction;
    lyrFromMap.renderer = newRendererMap; // Re-assignment triggers the update

    // show the current layer
    lyrFromMap.visible = true;
  }

  // hide current layer
  lyrFromScene.visible = false;

  // find the new layer using the user's selection
  lyrFromScene = sceneViewElement.map.allLayers.find(
    (lyrFromScene) => lyrFromScene.title === currentCategory,
  );

  // Update the renderer of the layer in the 3D Scene
  if (lyrFromScene) {
    const newRendererScene = lyrFromScene.renderer.clone();
    newRendererScene.visualVariables[0].valueExpression = densityFunction;
    newRendererScene.visualVariables[1].valueExpression = densityFactorFunction;
    lyrFromScene.renderer = newRendererScene;

    // show the current layer
    lyrFromScene.visible = true;
  }

  console.log('Updated category to:', selectionText);
});

// ======================================
// Update the category from the (3d scene)
// ======================================
varSelect2.addEventListener('calciteSelectChange', () => {
  // get the user's selection
  const selectionText = varSelect2.value;

  // update the current category
  currentCategory = selectionText;

  // update the selection in the 2d map
  varSelect1.setAttribute('value', selectionText);

  // hide current layer
  lyrFromScene.visible = false;

  // build the density function
  const densityFunction = `$feature.N_${currentYear} / $feature.ACRES`;
  const densityFactorFunction = `$feature.N_${currentYear} / $feature.ACRES * ${currentHeight}`;

  // find the new layer using the user's selection
  lyrFromScene = sceneViewElement.map.allLayers.find(
    (lyrFromScene) => lyrFromScene.title === currentCategory,
  );

  // Update the renderer of the layer in the 3D Scene
  if (lyrFromScene) {
    const newRendererScene = lyrFromScene.renderer.clone();
    newRendererScene.visualVariables[0].valueExpression = densityFunction;
    newRendererScene.visualVariables[1].valueExpression = densityFactorFunction;
    lyrFromScene.renderer = newRendererScene;

    // show the current layer
    lyrFromScene.visible = true;
  }

  // hide current layer
  lyrFromMap.visible = false;

  // find the new layer using the user's selection
  lyrFromMap = mapViewElement.map.allLayers.find(
    (lyrFromMap) => lyrFromMap.title === currentCategory,
  );

  //  2D Map
  if (lyrFromMap) {
    const newRendererMap = lyrFromMap.renderer.clone();
    newRendererMap.valueExpression = densityFunction;
    lyrFromMap.renderer = newRendererMap;

    // show the current layer
    lyrFromMap.visible = true;
  }

  console.log('Updated category to:', selectionText);
});

// =====================================================
// Update the extrusion using slider in the 3d map
// =====================================================

heightslider2.addEventListener('calciteSliderChange', () => {
  if (lyrFromScene) {
    // get the user's selection as integer
    const selectionText = Number(heightslider2.value);

    // update the current height factor
    currentHeight = selectionText;

    // build the density function
    const densityFactorFunction = `$feature.N_${currentYear} / $feature.ACRES * ${Number(selectionText)}`;

    // Update the renderer of the layer in the 3D Scene
    const newRendererScene = lyrFromScene.renderer.clone();
    newRendererScene.visualVariables[1].valueExpression = densityFactorFunction;
    newRendererScene.visualVariables[1].valueExpressionTitle = `Density_${currentYear}`;
    lyrFromScene.renderer = newRendererScene;

    console.log('Updated the height exaggeration to:', selectionText);
  }
});

// ======================================
// Update the Year (2d map)
// ======================================
yearSelect1.addEventListener('calciteSelectChange', () => {
  const selectionText = yearSelect1.value;

  // set the year in the 3d scene
  yearSelect2.setAttribute('value', selectionText);

  // update the active year
  currentYear = selectionText;

  // build the density function
  const densityFunction = `$feature.N_${currentYear} / $feature.ACRES`;
  const densityFactorFunction = `$feature.N_${currentYear} / $feature.ACRES * ${currentHeight}`;

  // Update the renderer in the 2D Map
  if (lyrFromMap) {
    const newRendererMap = lyrFromMap.renderer.clone();
    newRendererMap.valueExpression = densityFunction;
    lyrFromMap.renderer = newRendererMap;
  }

  // Update the renderer in the 3D Scene
  if (lyrFromScene) {
    const newRendererScene = lyrFromScene.renderer.clone();
    newRendererScene.visualVariables[0].valueExpression = densityFunction;
    newRendererScene.visualVariables[1].valueExpression = densityFactorFunction;
    lyrFromScene.renderer = newRendererScene;
  }

  console.log('Updated year to:', selectionText);
});

// ======================================
// Update the Year (3d scene)
// ======================================

yearSelect2.addEventListener('calciteSelectChange', () => {
  // get the user's selection
  const selectionText = yearSelect2.value;

  // update the selection in the 2d map
  yearSelect1.setAttribute('value', selectionText);

  // update the current Year
  currentYear = selectionText;

  // build the density function
  const densityFunction = `$feature.N_${currentYear} / $feature.ACRES`;

  // Update the renderer of the layer in the 2D Map
  if (lyrFromMap) {
    const newRendererMap = lyrFromMap.renderer.clone();
    newRendererMap.valueExpression = densityFunction;
    lyrFromMap.renderer = newRendererMap; // Re-assignment triggers the update
  }

  // Update the renderer of the layer in the 3D Scene
  if (lyrFromScene) {
    const newRendererScene = lyrFromScene.renderer.clone();
    newRendererScene.visualVariables[0].valueExpression = densityFunction;
    const densityFactorFunction = `$feature.N_${currentYear} / $feature.ACRES * ${currentHeight}`;
    newRendererScene.visualVariables[1].valueExpression = densityFactorFunction;
    lyrFromScene.renderer = newRendererScene;
  }

  console.log('Updated year to:', selectionText);
});
