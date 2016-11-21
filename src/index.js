#!/usr/bin/env node

const fs = require('fs-extra')
const jimp = require('jimp')
const dyeDescriptors = require('./dye-descriptors.js').dyeDescriptors
const wigDescriptors = require('./wig-descriptors.js').wigDescriptors

function clearBuild() {
  fs.removeSync('./build');
}

function createMetadata() {
  return {
    name: `${process.env.npm_package_name}`,
    version: `${process.env.npm_package_version}`,
    description: `${process.env.npm_package_description}`,
    friendlyName: `${process.env.npm_package_name}-${process.env.npm_package_version}`,
  	author: `${process.env.npm_package_author_name}`,
    steamContentId: "",
    link: ""
  };
}

function writeMetadataFile(modName, metadata) {
  const fileName = `./build/${modName}/.metadata`;
  writeFile(fileName, metadata);
}

function createDye(modName, index, descriptor) {
  return {
    itemName: `${modName}${descriptor.color.toLowerCase().replace(/ /g, '')}dye`,
    price: 25,
    rarity: "Common",
    category: "clothingDye",
    inventoryIcon: `/items/generic/dyes/bluedye.png?replace;5588d4=${descriptor.shades[0]};344495=${descriptor.shades[1]};1a1c51=${descriptor.shades[2]}`,
    description: "This coloured dye can be applied to a piece of armour or clothing with a right-click.",
    shortdescription: `${descriptor.color} Dye`,
    dyeColorIndex: index,
    radioMessagesOnPickup: [ "pickupdye" ],
    scripts: [ "/scripts/augments/dye.lua" ]
  }
}

function writeDyeFiles(modName, dyeDescriptors) {
  const offset = 12;  // these are the preexisting colors
  dyeDescriptors.forEach((dyeDescriptor, index) => {
    const dye = createDye(modName, index + offset, dyeDescriptor);
    const fileName = `./build/${modName}/items/generic/dyes/${modName}/${dye.itemName}.augment`;

    writeFile(fileName, dye);
  })
}

function createWig(modName, wigDescriptor) {
  return {
    itemName: `${modName}${wigDescriptor.name.toLowerCase().replace(/ /g, '')}`,
    price: 5000,
    inventoryIcon: "icons.png:head",
    maxStack: 1,
    rarity: "Legendary",
    category: "headwear",
    description: `${wigDescriptor.description}`,
    shortdescription: `${wigDescriptor.name}`,
    tooltipKind: "armor",

    maleFrames: `${wigDescriptor.image}`,
    femaleFrames: `${wigDescriptor.image}`,
    mask: "mask.png",

    colorOptions: [
      // dye remover
      { "d9c189" : "d9c189", "a38d59" : "a38d59", "735e3a" : "735e3a" },
      // BLACK - DARK GREY
      { "d9c189" : "525252", "a38d59" : "363636", "735e3a" : "161616" },
      // GREY
      { "d9c189" : "74726f", "a38d59" : "53504d", "735e3a" : "2a251e" },
      // WHITE
      { "d9c189" : "eaeaea", "a38d59" : "b8b8b8", "735e3a" : "828282" },
      // RED
      { "d9c189" : "CD1C38", "a38d59" : "982441", "735e3a" : "69243F" },
      // ORANGE
      { "d9c189" : "efa838", "a38d59" : "be6d1d", "735e3a" : "834012" },
      // YELLOW
      { "d9c189" : "e6e756", "a38d59" : "c7ac3f", "735e3a" : "a9882f" },
      // GREEN
      { "d9c189" : "4ece61", "a38d59" : "34ae47", "735e3a" : "228a38" },
      // BLUE
      { "d9c189" : "5d8bc7", "a38d59" : "4d55b0", "735e3a" : "2e2a73" },
      // PURPLE
      { "d9c189" : "653b7f", "a38d59" : "562e6a", "735e3a" : "3f1d4b" },
      // PINK
      { "d9c189" : "D26BA4", "a38d59" : "A54669", "735e3a" : "89334D" },
      // BROWN
      { "d9c189" : "7d3c1c", "a38d59" : "4d240b", "735e3a" : "2d1606" },
      // LIGHT RED
      { "d9c189" : "E86D46", "a38d59" : "D1422E", "735e3a" : "96201B" },
      // DARK RED
      { "d9c189" : "ad2716", "a38d59" : "8f1f1b", "735e3a" : "731a1a" },
      // RUSTY RED
      { "d9c189" : "BE471B", "a38d59" : "9B2F0C", "735e3a" : "702710" },
      // LIGHT BROWN
      { "d9c189" : "7f5a39", "a38d59" : "5b3523", "735e3a" : "3b1f15" },
      // DIRTY ORANGE
      { "d9c189" : "a6671d", "a38d59" : "915622", "735e3a" : "743e1d" },
      // DIRTY BLONDE
      { "d9c189" : "eaa758", "a38d59" : "cd8b3d", "735e3a" : "93682c" },
      // BLONDE
      { "d9c189" : "f1d992", "a38d59" : "daba5e", "735e3a" : "b59a4d" },
      // LIGHT YELLOW
      { "d9c189" : "f2eba3", "a38d59" : "dcd28c", "735e3a" : "c2b677" },
      // LIGHT GREEN
      { "d9c189" : "A7D13D", "a38d59" : "83AD22", "735e3a" : "6B880B" },
      // DARK GREEN
      { "d9c189" : "3b7f44", "a38d59" : "2e6a38", "735e3a" : "1d4b28" },
      // TORQUOISE
      { "d9c189" : "5BD5B6", "a38d59" : "4AA9AD", "735e3a" : "237082" },
      // LIGHT TURQUOISE
      { "d9c189" : "49E193", "a38d59" : "3BA380", "735e3a" : "197C81" },
      // LIGHT BLUE
      { "d9c189" : "61BCDE", "a38d59" : "5381CC", "735e3a" : "2C489E" },
      // DARK BLUE
      { "d9c189" : "425879", "a38d59" : "343965", "735e3a" : "242247" },
      // DARK PURPLE
      { "d9c189" : "7f3b6d", "a38d59" : "6a2e53", "735e3a" : "4b1d30" },
      // HOT PINK
      { "d9c189" : "cd72d9", "a38d59" : "ac4da6", "735e3a" : "913b86" },
      // LIGHT PURPLE
      { "d9c189" : "ad68e2", "a38d59" : "8d41b0", "735e3a" : "6a2980" },
      // BROWN GREY
      { "d9c189" : "50422f", "a38d59" : "36261e", "735e3a" : "170f0d" },
      // GREY BLUE
      { "d9c189" : "6f6d85", "a38d59" : "525269", "735e3a" : "3e4352" },
      // LIGHT GREY
      { "d9c189" : "b8b8b8", "a38d59" : "828282", "735e3a" : "555555" }
    ]
  }
}

function writeWigFiles(modName, wigDescriptors) {
  wigDescriptors.forEach((wigDescriptor, index) => {
    const wig = createWig(modName, wigDescriptor);
    const dir = `./build/${modName}/items/armors/decorative/hats/${modName}/${wig.itemName}`;
    const fileName = `${dir}/${wig.itemName}.head`;

    writeFile(fileName, wig);
    writeIconFile(wigDescriptor.iconSource, `${dir}/icons.png`);
  })
}

function writeIconFile(imageSource, iconTarget) {
  jimp.read(imageSource, (err, image) => {
    if (err) {
      throw err;
    }

    const icon = image.clone();
    icon.crop(55, 9, 16, 16);

    icon.write(iconTarget, (err) => {
      console.log(`file created: ${iconTarget}`);
    });
    // console.log(`image read ${image.bitmap.width}, ${image.bitmap.height}`);
  })
}

function createIconData(image, dataHandler) {
  jimp.read(image).then(function (image) {
    console.log(`image read ${image.bitmap.width}, ${image.bitmap.height}`);
    return `image read ${image.bitmap.width}, ${image.bitmap.height}`;
    // do stuff with the image
  }).catch(function (err) {
    // handle an exception
    throw err;
  });
}

function writeFile(fileName, data) {
  const dirs = fileName.split('/');
  let path = "";

  dirs.forEach((dir, index) => {
    path += dir;

    // skip last entry, assume it is the file name
    if (index < dirs.length-1) {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
    }

    path += '/';
  })

  // 'pretty' print the json
  fs.writeFileSync(fileName, JSON.stringify(data, null, '\t'));

  console.log(`file created: ${fileName}`);
}

const metadata = createMetadata();
const modName = metadata.name;

clearBuild();
writeMetadataFile(modName, metadata);
writeDyeFiles(modName, dyeDescriptors);
writeWigFiles(modName, wigDescriptors);

// for (var key in process.env) {
  // console.log(`${key} : ${process.env[key]}`)
// }
