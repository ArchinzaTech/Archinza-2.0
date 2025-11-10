const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {
  sendResponse,
  sendError,
  validator,
  deleteMedia,
  getBusinessTypeId,
} = require("../../../helpers/api");
const BusinessAccountOptions = require("../../../models/businessAccountOptions");
const Services = require("../../../models/services");
const BusinessCustomOptions = require("../../../models/businessCustomOptions");
const { uploadSingle } = require("../../../middlewares/upload");
const path = require("path");
const fs = require("fs");
const BusinessAccount = require("../../../models/businessAccount");

const optionsMapping = {
  services: "services",
};

router.get(
  "/banners",
  asyncHandler(async (req, res) => {
    const data = await BusinessAccountOptions.findOne().select(
      "business_types.banner business_types.category"
    );

    res.send(sendResponse(data.business_types));
  })
);

router.get(
  "/services",
  asyncHandler(async (req, res) => {
    const services = await Services.findOne();

    return res.send(sendResponse(services.services));
  })
);

router.put(
  "/services",
  asyncHandler(async (req, res) => {
    const service = await Services.findOne();
    if (service) {
      service.services = req.body.services;
      await service.save();
      return res.send(sendResponse(service));
    } else {
      return res.send(sendResponse(null, "Service not found", false));
    }
  })
);

router.put(
  "/:id/sort-services",
  asyncHandler(async (req, res) => {
    const services = await Services.updateOne(
      { _id: req.params.id },
      {
        services: req.body.services,
      }
    );

    return res.send(sendResponse(services));
  })
);

router.put(
  "/sort-options/:option",
  asyncHandler(async (req, res) => {
    const sortedOptions = req.body;
    const { option } = req.params;

    const data = await BusinessAccountOptions.findOne();
    if (!data) {
      res.send(sendError("Not Found", 404));
    }

    data[option] = sortedOptions;
    await data.save();
    res.send(sendResponse("Options Sorted"));
  })
);

router.put(
  "/:option",
  asyncHandler(async (req, res) => {
    const data = await BusinessAccountOptions.findOne();
    if (!data) {
      res.send(sendError("Not Found", 400));
    }
    data[req.params.option] = req.body;
    await data.save();
    res.send(sendResponse("Options Saved"));
  })
);

//update business category banners
router.put(
  "/:business_type/banners",
  uploadSingle,
  asyncHandler(async (req, res) => {
    const category = req.params.business_type;
    const file = req.file;
    let uploadFiles = [];
    console.log(category);
    console.log(req.file);

    const uniqueFileName = `${Date.now()}${file.originalname}`;
    const savePath = path.join(
      __dirname,
      "../../../public/uploads/business",
      uniqueFileName
    );
    fs.writeFile(savePath, file.buffer, (err) => {
      if (err) {
        console.error("Error saving file:", err);
      }
      console.log(`File uploaded and saved as ${file.originalname}`);
    });
    const body = {
      name: uniqueFileName,
      url: uniqueFileName,
      mimetype: file.mimetype,
      status: "done",
    };
    // uploadFiles.push(body);

    const businessAccount = await BusinessAccountOptions.updateOne(
      {
        "business_types.category": category,
      },
      {
        $set: {
          "business_types.$.banner": body,
        },
      },
      { new: true }
    );
    // data[req.params.business_type]["banner"] = req.body;
    // await data.save();
    res.send(sendResponse("Options Saved"));
  })
);

router.get(
  "/custom-options",
  asyncHandler(async (req, res) => {
    const records = await BusinessCustomOptions.find().sort({ updatedAt: -1 });

    return res.send(sendResponse(records));
  })
);
router.put(
  "/custom-options/:id",
  asyncHandler(async (req, res) => {
    const { updates, approvedOptions, rejectedOptions, previouslyApproved } =
      req.body;
    const record = await BusinessCustomOptions.findOne({ _id: req.params.id });
    if (!record) {
      return res.status(400).send(sendResponse([], "Record not found"));
    }
    updates.forEach((update, index) => {
      if (record.options[update.index]) {
        record.options[update.index] = {
          value: update.value,
          status: update.status,
        };
      }
    });

    const allStatuses = record.options.map((opt) => opt.status);
    const hasApproved = allStatuses.includes("approved");
    const hasRejected = allStatuses.includes("rejected");
    const hasPending = allStatuses.includes("pending");
    const allApproved = allStatuses.every((status) => status === "approved");
    const allRejected = allStatuses.every((status) => status === "rejected");

    // New status logic
    if (hasPending) {
      if (hasApproved || hasRejected) {
        record.status = "in_progress"; // Some options processed, but at least one is pending
      } else {
        record.status = "pending"; // All options are pending
      }
    } else if (hasApproved && hasRejected) {
      record.status = "partially_processed"; // Mix of approved and rejected, no pending
    } else if (allApproved) {
      record.status = "approved"; // All options are approved
    } else if (allRejected) {
      record.status = "rejected"; // All options are rejected
    }
    const options = await Services.findOne();
    const businessUser = await BusinessAccount.findOne({
      _id: record.user,
    });

    if (options && businessUser) {
      const optionsToRemove = rejectedOptions.filter(
        (opt) => previouslyApproved[opt]
      );
      if (optionsToRemove.length > 0) {
        if (options.services) {
          options.services = options.services.filter(
            (opt) => !optionsToRemove.includes(opt.value)
          );
          await options.save();
        }

        if (businessUser.services) {
          businessUser.services = businessUser.services.filter(
            (opt) => !optionsToRemove.includes(opt)
          );
          await businessUser.save();
        }
      }

      if (approvedOptions.length > 0) {
        if (options.services) {
          const updatedApprovedOptions = approvedOptions.map((opt) => ({
            value: opt,
            tag: "",
          }));
          options.services = [
            ...new Set([...options.services, ...updatedApprovedOptions]),
          ];
          await options.save();
        }

        if (businessUser.services) {
          businessUser.services = [
            ...new Set([...businessUser.services, ...approvedOptions]),
          ];
          await businessUser.save();
        }
      }
    }
    await record.save();

    return res.send(sendResponse([], "Options updated successfully"));
  })
);

module.exports = router;
