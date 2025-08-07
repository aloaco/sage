const express = require('express');
const router = express.Router();
const openRouterService = require('../services/openRouterService');

router.post('/extract-features', async (req, res) => {
  const startTime = Date.now();
  console.log('🚀 [API] Starting feature extraction request');
  
  try {
    const { transcript, pdfFiles } = req.body;
    
    if (!transcript) {
      console.log('❌ [API] Feature extraction failed: Missing transcript');
      return res.status(400).json({ error: 'Transcript is required' });
    }

    console.log(`📄 [API] Processing transcript (${transcript.length} characters) with ${pdfFiles?.length || 0} PDF files`);
    
    const result = await openRouterService.extractFeatures(transcript, pdfFiles);
    
    const duration = Date.now() - startTime;
    console.log(`✅ [API] Feature extraction completed successfully in ${duration}ms`);
    
    res.json({ data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [API] Feature extraction error after ${duration}ms:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/analyze-priorities', async (req, res) => {
  const startTime = Date.now();
  console.log('🎯 [API] Starting priority analysis request');
  
  try {
    const { featuresJson, transcript } = req.body;
    
    if (!featuresJson || !transcript) {
      console.log('❌ [API] Priority analysis failed: Missing required data');
      return res.status(400).json({ error: 'Features and transcript are required' });
    }

    console.log(`📊 [API] Analyzing priorities for ${JSON.parse(featuresJson).length || 0} features`);
    
    const result = await openRouterService.analyzePriorities(featuresJson, transcript);
    
    const duration = Date.now() - startTime;
    console.log(`✅ [API] Priority analysis completed successfully in ${duration}ms`);
    
    res.json({ data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [API] Priority analysis error after ${duration}ms:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/analyze-risks', async (req, res) => {
  const startTime = Date.now();
  console.log('🛡️ [API] Starting risk analysis request');
  
  try {
    const { featuresJson, prioritiesJson, transcript } = req.body;
    
    if (!featuresJson || !prioritiesJson || !transcript) {
      console.log('❌ [API] Risk analysis failed: Missing required data');
      return res.status(400).json({ error: 'Features, priorities, and transcript are required' });
    }

    console.log(`🔍 [API] Analyzing risks for ${JSON.parse(featuresJson).length || 0} features and ${JSON.parse(prioritiesJson).length || 0} priorities`);
    
    const result = await openRouterService.analyzeRisks(featuresJson, prioritiesJson, transcript);
    
    const duration = Date.now() - startTime;
    console.log(`✅ [API] Risk analysis completed successfully in ${duration}ms`);
    
    res.json({ data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [API] Risk analysis error after ${duration}ms:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-pocs', async (req, res) => {
  const startTime = Date.now();
  console.log('🚀 [API] Starting POC generation request');
  
  try {
    const { featuresJson, prioritiesJson, risksJson, hourlyRate } = req.body;
    
    if (!featuresJson || !prioritiesJson || !risksJson || !hourlyRate) {
      console.log('❌ [API] POC generation failed: Missing required data');
      return res.status(400).json({ 
        error: 'Features, priorities, risks, and hourly rate are required' 
      });
    }

    console.log(`💼 [API] Generating POCs with hourly rate $${hourlyRate} for ${JSON.parse(featuresJson).length || 0} features`);
    
    const result = await openRouterService.generatePOCs(
      featuresJson, 
      prioritiesJson, 
      risksJson, 
      hourlyRate
    );
    
    const duration = Date.now() - startTime;
    console.log(`✅ [API] POC generation completed successfully in ${duration}ms`);
    
    res.json({ data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [API] POC generation error after ${duration}ms:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate-mvp', async (req, res) => {
  const startTime = Date.now();
  console.log('🏗️ [API] Starting MVP generation request');
  
  try {
    const { selectedPOCJson, featuresJson, prioritiesJson, risksJson, hourlyRate } = req.body;
    
    if (!selectedPOCJson || !featuresJson || !prioritiesJson || !risksJson || !hourlyRate) {
      console.log('❌ [API] MVP generation failed: Missing required data');
      return res.status(400).json({ 
        error: 'All parameters are required: selectedPOC, features, priorities, risks, and hourly rate' 
      });
    }

    const selectedPOC = JSON.parse(selectedPOCJson);
    console.log(`🎯 [API] Generating MVP for POC "${selectedPOC.title || 'Unknown'}" with hourly rate $${hourlyRate}`);
    
    const result = await openRouterService.generateMVP(
      selectedPOCJson,
      featuresJson, 
      prioritiesJson, 
      risksJson, 
      hourlyRate
    );
    
    const duration = Date.now() - startTime;
    console.log(`✅ [API] MVP generation completed successfully in ${duration}ms`);
    
    res.json({ data: result });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [API] MVP generation error after ${duration}ms:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat', async (req, res) => {
  const startTime = Date.now();
  console.log('💬 [API] Starting chat request');
  
  try {
    const { messages, model } = req.body;
    
    if (!messages) {
      console.log('❌ [API] Chat failed: Missing messages');
      return res.status(400).json({ error: 'Messages are required' });
    }

    console.log(`📝 [API] Processing chat with ${messages.length} messages using model ${model || 'default'}`);
    
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