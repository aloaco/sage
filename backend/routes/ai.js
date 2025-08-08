const express = require("express");
const router = express.Router();
const openRouterService = require("../services/openRouterService");

router.post("/extract-features", async (req, res) => {
  const startTime = Date.now();
  console.log("🚀 [API] Starting feature extraction request");

  try {
    const { transcript, pdfFiles, model, local_files, local_transcript } = req.body;

    if (!transcript && !local_transcript) {
      console.log("❌ [API] Feature extraction failed: Missing transcript");
      return res.status(400).json({ error: "Transcript or local_transcript is required" });
    }

    console.log(
      `📄 [API] Processing transcript (${transcript?.length || 'local'} characters) with ${pdfFiles?.length || 0} PDF files and ${local_files?.length || 0} local files${local_transcript ? ` and local transcript: ${local_transcript}` : ''}`
    );

    if (pdfFiles && pdfFiles.length > 0) {
      pdfFiles.forEach((pdf, index) => {
        console.log(
          `  [API] PDF #${index + 1} (first 100 chars): ${pdf.substring(0, 100)}...`
        );
      });
    }

    const result = await openRouterService.extractFeatures(
      transcript,
      pdfFiles,
      model,
      local_files,
      local_transcript
    );

    // Parse the AI response and add auto-generated IDs
    let processedResult = result;
    try {
      const parsed = JSON.parse(result);
      if (parsed.features && Array.isArray(parsed.features)) {
        // Process features with IDs
        const enhancedFeatures = parsed.features.map((feature, index) => {
          const featureId = `feat-${String(index + 1).padStart(3, "0")}`;
          return {
            id: featureId,
            ...feature,
          };
        });

        parsed.features = enhancedFeatures;
        processedResult = JSON.stringify(parsed);
        console.log(
          `🔢 [API] Enhanced ${parsed.features.length} features with IDs`
        );
      }
    } catch (parseError) {
      console.log(
        "⚠️ [API] Could not parse AI response for enhancement, returning raw result"
      );
    }

    const duration = Date.now() - startTime;
    console.log(
      `✅ [API] Feature extraction completed successfully in ${duration}ms`
    );

    // don't uncomment this, only for testing endpoints directly
    // processedResult = JSON.parse(processedResult);

    res.json({ data: processedResult });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `❌ [API] Feature extraction error after ${duration}ms:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

router.post("/analyze-priorities", async (req, res) => {
  const startTime = Date.now();
  console.log("🎯 [API] Starting priority analysis request");

  try {
    const { featuresJson, transcript, model } = req.body;

    if (!featuresJson || !transcript) {
      console.log("❌ [API] Priority analysis failed: Missing required data");
      return res
        .status(400)
        .json({ error: "Features and transcript are required" });
    }

    console.log(
      `📊 [API] Analyzing priorities for ${JSON.parse(featuresJson).length || 0} features`
    );

    const result = await openRouterService.analyzePriorities(
      featuresJson,
      transcript,
      model
    );

    const duration = Date.now() - startTime;
    console.log(
      `✅ [API] Priority analysis completed successfully in ${duration}ms`
    );

    res.json({ data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `❌ [API] Priority analysis error after ${duration}ms:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

router.post("/analyze-risks", async (req, res) => {
  const startTime = Date.now();
  console.log("🛡️ [API] Starting risk analysis request");

  try {
    const { featuresJson, prioritiesJson, transcript, model } = req.body;

    if (!featuresJson || !prioritiesJson || !transcript) {
      console.log("❌ [API] Risk analysis failed: Missing required data");
      return res
        .status(400)
        .json({ error: "Features, priorities, and transcript are required" });
    }

    console.log(
      `🔍 [API] Analyzing risks for ${JSON.parse(featuresJson).length || 0} features and ${JSON.parse(prioritiesJson).length || 0} priorities`
    );

    const result = await openRouterService.analyzeRisks(
      featuresJson,
      prioritiesJson,
      transcript,
      model
    );

    const duration = Date.now() - startTime;
    console.log(
      `✅ [API] Risk analysis completed successfully in ${duration}ms`
    );

    res.json({ data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `❌ [API] Risk analysis error after ${duration}ms:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

router.post("/generate-pocs", async (req, res) => {
  const startTime = Date.now();
  console.log("🚀 [API] Starting POC generation request");

  try {
    const { featuresJson, prioritiesJson, risksJson, hourlyRate, model } = req.body;

    if (!featuresJson || !prioritiesJson || !risksJson || !hourlyRate) {
      console.log("❌ [API] POC generation failed: Missing required data");
      return res.status(400).json({
        error: "Features, priorities, risks, and hourly rate are required",
      });
    }

    console.log(
      `💼 [API] Generating POCs with hourly rate $${hourlyRate} for ${JSON.parse(featuresJson).length || 0} features`
    );

    const result = await openRouterService.generatePOCs(
      featuresJson,
      prioritiesJson,
      risksJson,
      hourlyRate,
      model
    );

    const duration = Date.now() - startTime;
    console.log(
      `✅ [API] POC generation completed successfully in ${duration}ms`
    );

    res.json({ data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `❌ [API] POC generation error after ${duration}ms:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

router.post("/generate-mvp", async (req, res) => {
  const startTime = Date.now();
  console.log("🏗️ [API] Starting MVP generation request");

  try {
    const {
      selectedPOCJson,
      featuresJson,
      prioritiesJson,
      risksJson,
      hourlyRate,
      model,
    } = req.body;

    if (
      !selectedPOCJson ||
      !featuresJson ||
      !prioritiesJson ||
      !risksJson ||
      !hourlyRate
    ) {
      console.log("❌ [API] MVP generation failed: Missing required data");
      return res.status(400).json({
        error:
          "All parameters are required: selectedPOC, features, priorities, risks, and hourly rate",
      });
    }

    const selectedPOC = JSON.parse(selectedPOCJson);
    console.log(
      `🎯 [API] Generating MVP for POC "${selectedPOC.title || "Unknown"}" with hourly rate $${hourlyRate}`
    );

    const result = await openRouterService.generateMVP(
      selectedPOCJson,
      featuresJson,
      prioritiesJson,
      risksJson,
      hourlyRate,
      model
    );

    const duration = Date.now() - startTime;
    console.log(
      `✅ [API] MVP generation completed successfully in ${duration}ms`
    );

    res.json({ data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `❌ [API] MVP generation error after ${duration}ms:`,
      error.message
    );
    res.status(500).json({ error: error.message });
  }
});

router.post("/chat", async (req, res) => {
  const startTime = Date.now();
  console.log("💬 [API] Starting chat request");

  try {
    const { messages, model } = req.body;

    if (!messages) {
      console.log("❌ [API] Chat failed: Missing messages");
      return res.status(400).json({ error: "Messages are required" });
    }

    console.log(
      `📝 [API] Processing chat with ${messages.length} messages using model ${model || "default"}`
    );

    const result = await openRouterService.chat(messages, model);

    const duration = Date.now() - startTime;
    console.log(`✅ [API] Chat completed successfully in ${duration}ms`);

    res.json({ data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [API] Chat error after ${duration}ms:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
