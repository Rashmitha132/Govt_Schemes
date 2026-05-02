const express = require("express");

const {
  confirmApply,
  getAiAssistance,
  getApplyRequirements,
  prepareDraft,
  uploadDocuments,
} = require("../controllers/applicationController");

const router = express.Router();

router.get("/schemes/:schemeId/apply-requirements", getApplyRequirements);
router.post("/applications/ai-assist", getAiAssistance);
router.post("/applications/prepare-draft", prepareDraft);
router.post("/applications/prepare", prepareDraft);
router.post("/applications/confirm-apply", confirmApply);
router.post("/applications/upload-documents", uploadDocuments);

module.exports = router;
