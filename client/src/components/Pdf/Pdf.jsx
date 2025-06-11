import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const PDFSyllabusGenerator = () => {
  // Use direct API key (in a real app, use environment variables properly configured for your build system)
  const API_KEY = "AIzaSyDOIZwZW4lnEZlcUGuy6CQS2g_cv2kpzhA";
  
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFolder, setOutputFolder] = useState('syllabus_output');
  const [processingStatus, setProcessingStatus] = useState('');
  const [processingLogs, setProcessingLogs] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('pdf');
  
  // Memoize log function to prevent unnecessary re-renders
  const addProcessingLog = useCallback((log) => {
    setProcessingLogs(prevLogs => [...prevLogs, `[${new Date().toLocaleTimeString()}] ${log}`]);
    setProcessingStatus(log);
  }, []);
  
  // Extract text from PDF with better error handling
  const extractTextFromPDF = useCallback(async (file) => {
    addProcessingLog(`Extracting text from PDF: ${file.name}`);
    
    try {
      // Pre-load PDF.js library to improve performance
      const pdfjsLib = await import('pdfjs-dist/webpack');
      
      // Use FileReader for better compatibility across browsers
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
      
      const typedArray = new Uint8Array(arrayBuffer);
      
      // Load the PDF with better error handling
      const loadingTask = pdfjsLib.getDocument(typedArray);
      const pdf = await loadingTask.promise;
      
      addProcessingLog(`PDF loaded. Total pages: ${pdf.numPages}`);
      
      // Process pages in parallel for better performance
      const maxPages = Math.min(5, pdf.numPages);
      const pagePromises = [];
      
      for (let i = 1; i <= maxPages; i++) {
        pagePromises.push(processPage(pdf, i, maxPages, addProcessingLog));
      }
      
      // Wait for all pages to process
      const pageTexts = await Promise.all(pagePromises);
      const textContent = pageTexts.join("\n\n--- Page Break ---\n\n");
      
      // Display preview of extracted text
      const previewLength = Math.min(300, textContent.length);
      const previewText = textContent.substring(0, previewLength) + (textContent.length > previewLength ? "..." : "");
      addProcessingLog(`Text extraction complete. Preview: "${previewText}"`);
      
      setExtractedText(textContent);
      return textContent;
    } catch (error) {
      addProcessingLog(`Error extracting text from PDF: ${error.message}`);
      throw error;
    }
  }, [addProcessingLog]);
  
  // Process individual PDF pages
  const processPage = async (pdf, pageNum, maxPages, logFn) => {
    logFn(`Extracting text from page ${pageNum}/${maxPages}...`);
    try {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      return strings.join(' ');
    } catch (error) {
      logFn(`Error extracting page ${pageNum}: ${error.message}`);
      return `[Error extracting page ${pageNum}]`;
    }
  };
  
  // Process with Gemini API with improved error handling
  const processWithGemini = useCallback(async (pdfText) => {
    addProcessingLog("Processing text with Gemini...");
    
    // Trim the PDF text to avoid token limits
    const trimmedText = pdfText.substring(0, 100000); // Gemini has token limits
    
    try {
      // Prepare prompt for Gemini
      const prompt = `
      You are an expert at analyzing educational content. I need you to extract the syllabus structure from the PDF text below.
      
      Please analyze the content and extract:
      1. Course title and description
      2. Main units or modules with their numbers and titles
      3. Topics or lessons within each unit, with IDs, titles and descriptions
      
      For each topic, also generate:
      - 3 specific learning objectives
      - 4 suggested learning activities
      - 3 recommended resources (readings, videos, exercises)
      
      Format your output as JSON with this structure:
      {
          "title": "Course title",
          "description": "Course description",
          "units": [
              {
                  "unit_type": "Unit/Module/Section",
                  "unit_number": 1,
                  "unit_title": "Unit title",
                  "topics": [
                      {
                          "topic_id": "1.1",
                          "topic_title": "Topic title",
                          "description": "Topic description",
                          "learning_objectives": ["Objective 1", "Objective 2", "Objective 3"],
                          "suggested_activities": ["Activity 1", "Activity 2", "Activity 3", "Activity 4"],
                          "resources": [
                              {
                                  "type": "Reading/Video/Exercise",
                                  "title": "Resource title",
                                  "description": "Resource description"
                              }
                          ]
                      }
                  ]
              }
          ]
      }
      
      Only respond with the JSON, no other text.
      
      PDF TEXT:
      ${trimmedText}
      `;
      
      // Make request to Gemini API with timeout
      addProcessingLog("Sending request to Gemini API...");
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 1-minute timeout
      
      try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-2.0-pro:generateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.2,
              topP: 0.95,
              topK: 32,
              maxOutputTokens: 8192
            }
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `API Error: ${response.status}`;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage += ` - ${JSON.stringify(errorData)}`;
          } catch {
            errorMessage += ` - ${errorText.substring(0, 100)}`;
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        // Extract JSON from the response with improved parsing
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
          throw new Error("Invalid API response structure");
        }
        
        const jsonResponse = data.candidates[0].content.parts[0].text || "";
        addProcessingLog("Received response from Gemini");
        
        // Find and parse JSON in the response
        const jsonMatch = jsonResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Couldn't find valid JSON in the response");
        }
        
        try {
          const syllabusData = JSON.parse(jsonMatch[0]);
          addProcessingLog("Successfully parsed JSON response");
          return syllabusData;
        } catch (parseError) {
          throw new Error(`JSON parsing error: ${parseError.message}`);
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error("API request timed out after 60 seconds");
        }
        throw fetchError;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      addProcessingLog(`Error processing with Gemini: ${error.message}`);
      throw error;
    }
  }, [addProcessingLog]);
  
  // Save files with improved error handling and batch processing
  const saveFilesLocally = useCallback(async (syllabusData) => {
    addProcessingLog(`Generating syllabus files in folder: ${outputFolder}`);
    
    try {
      // Save main JSON file
      downloadJSON(syllabusData, 'syllabus_overview.json');
      
      // Process units and topics in batches to avoid overwhelming the browser
      if (syllabusData.units && syllabusData.units.length > 0) {
        // Process units in batches
        for (const unit of syllabusData.units) {
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between files
          downloadJSON(unit, `unit_${unit.unit_number}.json`);
          
          // Process topics
          if (unit.topics && unit.topics.length > 0) {
            for (const topic of unit.topics) {
              await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between files
              
              const topicData = {
                unit_number: unit.unit_number,
                unit_title: unit.unit_title,
                topic_id: topic.topic_id,
                topic_title: topic.topic_title,
                description: topic.description,
                learning_objectives: topic.learning_objectives,
                suggested_activities: topic.suggested_activities,
                resources: topic.resources
              };
              
              const topicIdClean = String(topic.topic_id).replace(/[^a-z0-9]/gi, '_');
              downloadJSON(topicData, `lesson_${unit.unit_number}_${topicIdClean}.json`);
            }
          }
        }
      }
      
      addProcessingLog("Syllabus files generated successfully");
      return 'syllabus_overview.json';
    } catch (error) {
      addProcessingLog(`Error saving files: ${error.message}`);
      throw error;
    }
  }, [addProcessingLog, outputFolder]);
  
  // Helper function to download JSON files
  const downloadJSON = (data, filename) => {
    try {
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(jsonBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a); // Append to body to work in Firefox
      a.click();
      
      // Clean up
      setTimeout(() => {
        try {
          document.body.removeChild(a);
        } catch (e) {
          console.log("Element already removed");
        }
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error(`Error downloading ${filename}:`, error);
      throw error;
    }
  };
  
  // File handling with validation
  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }
    
    if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setExtractedText('');
    } else {
      alert('Please select a PDF file');
      e.target.value = ''; // Reset input
    }
  }, []);
  
  // Handle input text change
  const handleTextChange = useCallback((e) => {
    setInputText(e.target.value);
    setExtractedText('');
  }, []);
  
  // Main process handler with better error management
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    let textToProcess = '';
    
    if (activeTab === 'pdf') {
      if (!file) {
        alert('Please select a PDF file');
        return;
      }
      
      setIsProcessing(true);
      setProcessingLogs([]);
      setExtractedText('');
      
      try {
        addProcessingLog(`Starting to process ${file.name}`);
        
        // Extract text from PDF
        textToProcess = await extractTextFromPDF(file);
      } catch (error) {
        addProcessingLog(`Error extracting PDF: ${error.message}`);
        setIsProcessing(false);
        return;
      }
    } else { // text input
      if (!inputText.trim()) {
        alert('Please enter some text to process');
        return;
      }
      
      setIsProcessing(true);
      setProcessingLogs([]);
      setExtractedText('');
      
      addProcessingLog('Processing input text');
      textToProcess = inputText;
      
      // Show preview of the input text
      const previewLength = Math.min(300, textToProcess.length);
      const previewText = textToProcess.substring(0, previewLength) + (textToProcess.length > previewLength ? "..." : "");
      addProcessingLog(`Text to process. Preview: "${previewText}"`);
      setExtractedText(textToProcess);
    }
    
    try {
      // Process with Gemini
      const syllabusData = await processWithGemini(textToProcess);
      
      // Validate JSON structure before saving
      if (!syllabusData || !syllabusData.title || !Array.isArray(syllabusData.units)) {
        throw new Error("Invalid syllabus data structure returned from API");
      }
      
      // Save files locally
      const mainFile = await saveFilesLocally(syllabusData);
      
      addProcessingLog(`Syllabus generation complete! Main overview file: ${mainFile}`);
      
    } catch (error) {
      addProcessingLog(`Error: ${error.message}`);
      console.error("Detailed error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [file, extractTextFromPDF, processWithGemini, saveFilesLocally, addProcessingLog, activeTab, inputText]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 p-6">
      <div className="w-full max-w-2xl">
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-black">
              PDF to Syllabus Generator
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
                  <TabsTrigger value="text">Enter Text</TabsTrigger>
                </TabsList>

                <TabsContent value="pdf" className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="pdf-file" className="block text-sm font-medium mb-2 text-white">
                      Upload PDF File
                    </label>
                    <input
                      type="file"
                      id="pdf-file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="text" className="mt-4">
                  <div className="mb-4">
                    <label htmlFor="input-text" className="block text-sm font-medium mb-2 text-white">
                      Enter Course Text
                    </label>
                    <Textarea
                      id="input-text"
                      value={inputText}
                      onChange={handleTextChange}
                      className="block w-full p-2 border rounded-md h-52"
                      placeholder="Paste or type your course content here..."
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mb-4">
                <label htmlFor="output-folder" className="block text-sm font-medium mb-2 text-white">
                  Output Folder Name
                </label>
                <input
                  type="text"
                  id="output-folder"
                  value={outputFolder}
                  onChange={(e) => setOutputFolder(e.target.value)}
                  className="block w-full p-2 border rounded-md"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isProcessing || (activeTab === 'pdf' && !file) || (activeTab === 'text' && !inputText.trim())}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : "Process Content"}
              </Button>
            </form>

            {processingStatus && (
              <div className="mt-4 text-white">
                <p className="font-semibold">Status: {processingStatus}</p>
              </div>
            )}

            {processingLogs.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-white">Processing Log:</h3>
                <div className="bg-gray-100 p-2 rounded-md h-40 overflow-y-auto">
                  {processingLogs.map((log, index) => (
                    <div key={index} className="text-sm mb-1">{log}</div>
                  ))}
                </div>
              </div>
            )}

            {extractedText && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-white">Extracted Text Preview:</h3>
                <div className="bg-gray-100 p-2 rounded-md h-40 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap">{extractedText}</pre>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center text-sm text-gray-300">
            Powered by PDF.js and Gemini AI
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PDFSyllabusGenerator;