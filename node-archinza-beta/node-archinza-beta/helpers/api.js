const fs = require("fs");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const { log } = require("console");
const { default: axios } = require("axios");
const crypto = require("crypto");
const Stats = require("../models/stats");
const Media = require("../models/media");
const { default: mongoose } = require("mongoose");

function sendResponse(data = [], message = "", status = 200) {
  return { status: status, message: message, data: data };
}

function sendError(message = "", status = 404) {
  return { status: status, message: message };
}

function validator(request, rules) {
  const options = {
    errors: {
      wrap: {
        label: "",
      },
    },
  };

  return rules.validate(request, options);
}

function deleteMedia(path) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

function generateToken(payload, auth_type = "personal", remember_me = false) {
  if (remember_me) {
    return jwt.sign({ ...payload, auth_type }, config.secretkey);
  } else {
    return jwt.sign({ ...payload, auth_type }, config.secretkey);
  }
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.secretkey);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function generateOTP() {
  if (!isProduction()) {
    return 111111;
  }

  return Math.floor(100000 + Math.random() * 90000);
}

function generateOTPExpiration(params) {
  const currentTime = new Date();
  const extendedTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
  return extendedTime;
}

function isProduction() {
  if (config.app_mode == "production") {
    return true;
  } else {
    return false;
  }
}

function getBusinessNamePrefix(name) {
  if (!name) return "NA";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.join("_"); // e.g. "Acme_Corp"
}

// async function sendmail(to, subject, message, from = config.mail.username) {
//   let transporter = nodemailer.createTransport({
//     host: config.mail.host,
//     port: config.mail.port,
//     secure: config.mail.ssl, // true for 465, false for other ports
//     auth: {
//       user: config.mail.username, // generated ethereal user
//       pass: config.mail.password, // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   try {
//     let info = await transporter.sendMail({
//       from: from, // sender address
//       to: to, // list of receivers
//       subject: subject, // Subject line

//       html: message, // html body
//     });
//     return info;
//   } catch (error) {
//     return error;
//   }
// }

function validator(request, rules) {
  const options = {
    errors: {
      wrap: {
        label: "",
      },
    },
  };

  return rules.validate(request, options);
}

function getBusinessTypeId(businessType) {
  const types = [
    "Design Firm | Consultancy",
    "Services Design Firm | Consultancy",
    "Design, Supply & Execute Business",
    "Product | Material - Seller | Installer | Contractor | Execution Team",
    "E Commerce | Business for Design & Decor",
    "Curator | Stylist | Gallery",
    "Event & Publishing House",
    "PR | Marketing | Content | Photography",
    "National | International Brand",
    "Education & Courses",
  ];
  const index = types.indexOf(businessType);
  if (index !== -1) {
    return String.fromCharCode(97 + index);
  } else {
    return null;
  }
}

async function fetchLatestrates(base, target) {
  const options = {
    method: "GET",
    url: `https://api.fxratesapi.com/latest?base=${base}&currencies=${target}&resolution=1m&places=3&format=json&api_key=${config.fx_rates_api_key}`,
  };

  const { data } = await axios(options);

  return data;
}

async function fetchUpdatedBudgetRanges(conversionRate, ranges, suffix) {
  const calculateIncrement = (value) => {
    if (value < 100) return 10;
    if (value < 1000) return 100;
    if (value <= 10000) return 1000;
    return 10000;
  };

  const convertAndRound = (minINR, maxINR, previousMaxUSD) => {
    if (minINR === "Anything")
      return { roundedMinUSD: "Anything", roundedMaxUSD: null };

    const minUSD =
      minINR !== "Above" ? Math.ceil(minINR * conversionRate) : "Above";
    let maxUSD =
      maxINR === "Above" ? "Above" : Math.ceil(maxINR * conversionRate);

    let startUSD = previousMaxUSD !== null ? previousMaxUSD + 1 : minUSD;
    const increment = calculateIncrement(
      maxUSD === "Above" ? startUSD : maxUSD
    );

    let roundedMinUSD = Math.floor(startUSD / increment) * increment;

    // Ensure first range is rounded down to nearest tens
    if (previousMaxUSD === null && minUSD > 10 && minUSD < 100) {
      roundedMinUSD = Math.floor(minUSD / 10) * 10;
    }

    if (roundedMinUSD < minUSD && minUSD !== "Above") {
      roundedMinUSD = minUSD;
    }

    let roundedMaxUSD;
    if (maxUSD === "Above") {
      roundedMaxUSD = "Above";
    } else {
      roundedMaxUSD = Math.ceil(maxUSD / increment) * increment;
    }

    return { roundedMinUSD, roundedMaxUSD };
  };

  const usdRanges = [];
  let previousMaxUSD = null;

  ranges.forEach((range, index) => {
    if (range.min === "Above") {
      // Handle the "Above" range
      const minUSD = Math.ceil(range.max * conversionRate);
      const roundedMinUSD = Math.ceil(minUSD / 10) * 10; // Rounding up to tens

      // Use the previous range's max value if it exists and is greater
      if (index > 0 && usdRanges[index - 1]) {
        const prevRange = usdRanges[index - 1].split(" - ");
        const prevMaxUSD = parseInt(prevRange[1]);
        if (prevMaxUSD && prevMaxUSD > roundedMinUSD) {
          usdRanges.push(`Above ${prevMaxUSD} ${suffix}`);
        } else {
          usdRanges.push(`Above ${roundedMinUSD} ${suffix}`);
        }
      } else {
        usdRanges.push(`Above ${roundedMinUSD} ${suffix}`);
      }
    } else if (range.min === "Anything") {
      // Leave "Anything" as it is in the output
      usdRanges.push("Anything");
    } else {
      // Process normal ranges
      const { roundedMinUSD, roundedMaxUSD } = convertAndRound(
        range.min,
        range.max,
        previousMaxUSD
      );
      usdRanges.push(`${roundedMinUSD} - ${roundedMaxUSD} ${suffix}`);
      previousMaxUSD = roundedMaxUSD;
    }
  });

  return usdRanges;
}

async function fetchUpdatedLargeBudgetRanges(conversionRate, ranges, suffix) {
  const convertToUSD = (value) => Math.ceil(value * conversionRate);

  const usdRanges = [];

  ranges.forEach((range) => {
    if (range.min === "Above") {
      const roundedMinUSD = convertToUSD(range.max);
      usdRanges.push(`Above ${roundedMinUSD} ${suffix}`);
    } else {
      const minUSD = convertToUSD(range.min);
      const maxUSD = range.max !== null ? convertToUSD(range.max) : null;
      usdRanges.push(
        `${minUSD} - ${maxUSD !== null ? maxUSD : "Above"} ${suffix}`
      );
    }
  });

  return usdRanges;
}

async function convertINRtoUSDRanges(inrRanges, latestCurrency) {
  const exchangeRate = latestCurrency;

  function convertToUSD(inrStr) {
    const inrValue = parseFloat(inrStr.replace(/,/g, ""));
    let usdValue = inrValue * exchangeRate;
    usdValue = Math.round(usdValue / 100) * 100;
    return usdValue.toLocaleString("en-US", { minimumFractionDigits: 0 });
  }

  const usdRanges = inrRanges.map((range) => {
    if (range.startsWith("Under")) {
      const inrValue = range.match(/[\d,]+/)[0];
      const usdValue = convertToUSD(inrValue);
      return `Under ${usdValue} USD`;
    }
    // Handle "Above" case
    else if (range.startsWith("Above")) {
      const inrValue = range.match(/[\d,]+/)[0];
      const usdValue = convertToUSD(inrValue);
      return `Above ${usdValue} USD`;
    } else {
      const [lower, upper] = range.match(/[\d,]+/g).map(convertToUSD);
      return `${lower}-${upper} USD`;
    }
  });

  return usdRanges;
}

//generate unique token for personall account access URL
async function generatePersonalUserUniqueToken(payload, tokenExpiryTimestamp) {
  const timestamp = Date.now().toString();
  const token = crypto
    .createHash("sha256")
    .update(payload + timestamp)
    .digest("hex");
  const tokenExpiry = tokenExpiryTimestamp;

  return { token, tokenExpiry };
}

//find closes matching city/region
function findClosestMatch(userInput, fuseInstance, threshold = 0.3) {
  return userInput.map((input) => {
    const trimmedInput = input.trim();
    const result = fuseInstance.search(trimmedInput);
    if (result.length > 0 && result[0].score <= threshold) {
      return result[0].item; // Return the closest match within threshold
    } else {
      return `${trimmedInput}`;
    }
  });
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

//update live stats
// const updateStats = async () => {
//   const stats = await Stats.findOne();

//   stats.consultants_registered += Math.floor(Math.random() * (100 - 50) + 50);
//   stats.architects_trusting += Math.floor(Math.random() * (100 - 50) + 50);

//   const now = new Date().getHours();
//   if (now >= 0 && now <= 6) {
//     stats.people_onboarding = Math.max(
//       850 + Math.floor(Math.random() * 200) - 100,
//       0
//     );
//   } else {
//     stats.people_onboarding += Math.floor(Math.random() * 200) - 100;
//   }

//   stats.businesses_registered = Math.floor(stats.businesses_registered * 1.1);
//   stats.people_signed_up += 250;

//   stats.updatedAt = new Date();

//   await stats.save();
// };
const updateStats = async () => {
  const stats = await Stats.findOne();
  const now = new Date().getHours();

  if (stats.consultants_registered < 5000) {
    stats.consultants_registered += Math.floor(Math.random() * 6) + 2; // ~100 daily
  }

  if (stats.architects_trusting < 5000) {
    stats.architects_trusting += Math.floor(Math.random() * 6) + 2; // ~100 daily
  }

  if (now >= 0 && now <= 6) {
    stats.people_onboarding = 850 + Math.floor(Math.random() * 201) - 100; // 750–950
  } else {
    stats.people_onboarding = 1785 + Math.floor(Math.random() * 201) - 100; // 1685–1885
  }

  if (stats.businesses_registered < 5000) {
    stats.businesses_registered += Math.floor(Math.random() * 3) + 1; // ~25 daily
  }

  if (stats.people_signed_up < 10000) {
    stats.people_signed_up += Math.floor(Math.random() * 6) + 2; // ~100 daily
  }

  stats.updatedAt = new Date();
  await stats.save();
};

async function checkAndFixPositions(userId, galleryTitles) {
  const galleryImages = await Media.find({
    userId: userId,
    category: { $in: galleryTitles },
    softDelete: false,
    visibility: true,
  });

  // Group by position to find duplicates
  const positionMap = {};
  const imagesWithoutPosition = [];

  galleryImages.forEach((img) => {
    if (img.masonryPosition !== undefined && img.masonryPosition !== null) {
      if (!positionMap[img.masonryPosition]) {
        positionMap[img.masonryPosition] = [];
      }
      positionMap[img.masonryPosition].push(img);
    } else {
      imagesWithoutPosition.push(img);
    }
  });

  // Check for duplicates
  const hasDuplicates = Object.values(positionMap).some(
    (images) => images.length > 1
  );
  const hasUnpositioned = imagesWithoutPosition.length > 0;

  if (hasDuplicates || hasUnpositioned) {
    console.log(
      `Fixing positions for user ${userId}: duplicates=${hasDuplicates}, unpositioned=${hasUnpositioned}`
    );
    await reassignAllPositions(userId, galleryTitles);
    return { needsFix: true };
  }

  return { needsFix: false };
}

// NEW: Completely reassign all positions from scratch
async function reassignAllPositions(userId, galleryTitles) {
  try {
    // First, clear ALL positions for gallery images
    await Media.updateMany(
      {
        userId: userId,
        category: { $in: galleryTitles },
      },
      { $unset: { masonryPosition: "" } }
    );

    // Get fresh data grouped by category
    const categoryImages = {};

    for (const category of galleryTitles) {
      const images = await Media.find({
        userId: userId,
        category: category,
        softDelete: false,
        visibility: true,
      }).sort({ createdAt: 1 });

      categoryImages[category] = images;
    }

    // Calculate total visible images
    const totalImages = Object.values(categoryImages).reduce(
      (sum, imgs) => sum + imgs.length,
      0
    );

    // Determine if we need masonry (>7 images) or slider (<=7 images)
    const maxPositions = totalImages > 7 ? 14 : 7;

    // Distribute images
    const distributedImages = distributeImagesForMasonry(
      categoryImages,
      maxPositions
    );

    // Assign unique positions
    const updatePromises = distributedImages.map((image, index) => {
      return Media.findByIdAndUpdate(image._id, {
        masonryPosition: index,
        originalPosition: index, // Store original position for reference
      });
    });

    await Promise.all(updatePromises);

    console.log(
      `Successfully reassigned ${distributedImages.length} positions for user ${userId}`
    );
  } catch (error) {
    console.error("Error reassigning positions:", error);
    throw error;
  }
}

function distributeImagesForMasonry(categoryImages, totalNeeded = 14) {
  const categories = Object.keys(categoryImages);
  const availableCounts = categories.map((key) => categoryImages[key].length);
  const totalAvailable = availableCounts.reduce((sum, count) => sum + count, 0);

  if (totalAvailable === 0) return [];

  const actualTotal = Math.min(totalNeeded, totalAvailable);
  const distribution = {};
  const nonEmptyCategories = categories.filter(
    (key) => categoryImages[key].length > 0
  );

  if (nonEmptyCategories.length === 0) return [];

  const basePerCategory = Math.floor(actualTotal / nonEmptyCategories.length);
  let remaining = actualTotal % nonEmptyCategories.length;

  nonEmptyCategories.forEach((key) => {
    const available = categoryImages[key].length;
    const allocated = Math.min(
      available,
      basePerCategory + (remaining > 0 ? 1 : 0)
    );
    distribution[key] = allocated;
    if (remaining > 0) remaining--;
  });

  let redistributionNeeded = true;
  while (redistributionNeeded) {
    redistributionNeeded = false;
    let surplus = 0;

    Object.keys(distribution).forEach((key) => {
      const available = categoryImages[key].length;
      if (distribution[key] > available) {
        surplus += distribution[key] - available;
        distribution[key] = available;
        redistributionNeeded = true;
      }
    });

    if (surplus > 0) {
      const canTakeMore = Object.keys(distribution).filter(
        (key) => distribution[key] < categoryImages[key].length
      );

      if (canTakeMore.length > 0) {
        const additionalPerCategory = Math.floor(surplus / canTakeMore.length);
        let extraRemaining = surplus % canTakeMore.length;

        canTakeMore.forEach((key) => {
          const available = categoryImages[key].length;
          const current = distribution[key];
          const canAdd = Math.min(
            available - current,
            additionalPerCategory + (extraRemaining > 0 ? 1 : 0)
          );
          distribution[key] += canAdd;
          if (extraRemaining > 0) extraRemaining--;
        });
      }
    }
  }

  const distributedImages = [];
  Object.keys(distribution).forEach((key) => {
    const images = categoryImages[key].slice(0, distribution[key]);
    distributedImages.push(...images);
  });

  if (distributedImages.length < actualTotal) {
    const usedIds = new Set(distributedImages.map((img) => img._id.toString()));
    const allAvailableImages = Object.values(categoryImages).flat();

    for (const img of allAvailableImages) {
      if (distributedImages.length >= actualTotal) break;
      if (!usedIds.has(img._id.toString())) {
        distributedImages.push(img);
        usedIds.add(img._id.toString());
      }
    }
  }

  return distributedImages;
}

module.exports = {
  sendResponse,
  sendError,
  validator,
  deleteMedia,
  generateToken,
  verifyToken,
  generateOTP,
  isProduction,
  validator,
  generateOTPExpiration,
  getBusinessTypeId,
  fetchLatestrates,
  fetchUpdatedBudgetRanges,
  fetchUpdatedLargeBudgetRanges,
  generatePersonalUserUniqueToken,
  findClosestMatch,
  updateStats,
  streamToBuffer,
  convertINRtoUSDRanges,
  getBusinessNamePrefix,
  checkAndFixPositions,
  reassignAllPositions,
};
