/* eslint-disable linebreak-style */
// renderer used to setup the symbolizaton of the housing layers
// const dPixelSize = '6px';
// const transparency = 1;

const outlineWidth = 1;
const outlineColor = [40, 40, 40];
const parcelTransparency = 0.2;

// Households
const hhRenderer = {
  type: 'class-breaks',
  valueExpression: '$feature.N_2023 / $feature.ACRES',
  valueExpressionTitle: 'HH per Acre',
  classBreakInfos: [
    // Class 1
    {
      minValue: 0,
      maxValue: 2.5,
      label: '< 2.5 units / acre',
      symbol: {
        type: 'simple-fill',
        color: [72, 23, 147, parcelTransparency],
        size: dPixelSize,
        outline: {
          color: outlineColor,
          width: outlineWidth,
        },
      },
    },
    // Class 2
    {
      minValue: 2.5,
      maxValue: 5,
      symbol: {
        type: 'simple-fill',
        color: [178, 51, 185, parcelTransparency],
        size: dPixelSize,
        outline: {
          color: outlineColor,
          width: outlineWidth,
        },
      },
      label: '2.5 - 5 HH / acre',
    },
    // Class 3
    {
      minValue: 5,
      maxValue: 10,
      symbol: {
        type: 'simple-fill',
        color: [255, 87, 165, parcelTransparency],
        size: dPixelSize,
        outline: {
          color: outlineColor,
          width: outlineWidth,
        },
      },
      label: '2 - 3 HH / acre',
    },
    // Class 4
    {
      minValue: 10,
      maxValue: 25,
      symbol: {
        type: 'simple-fill',
        color: [255, 174, 133, parcelTransparency],
        size: dPixelSize,
        outline: {
          color: outlineColor,
          width: outlineWidth,
        },
      },
      label: '10 - 25 HH / acre',
    },
    // Class 5
    {
      minValue: 25,
      maxValue: Infinity,
      symbol: {
        type: 'simple-fill',
        color: [255, 236, 161, parcelTransparency],
        size: dPixelSize,
        outline: {
          color: outlineColor,
          width: outlineWidth,
        },
      },
      label: '> 25 HH / acre',
    },
  ],
};

// Population
// Total Jobs
// Office Jobs
// Retail Jobs
// Industrial Jobs

// 3D versions

// export renders for use in main.js
export default hhRenderer;
