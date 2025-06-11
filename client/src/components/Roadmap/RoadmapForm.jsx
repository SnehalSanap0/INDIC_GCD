import React, { useState, useEffect } from "react";
import mermaid from "mermaid";

// Initialize mermaid configuration
mermaid.initialize({
  theme: "default",
  themeVariables: {
    primaryColor: "#3498db",
    primaryTextColor: "#fff",
    primaryBorderColor: "#2980b9",
    lineColor: "#2c3e50",
    secondaryColor: "#16a085",
    tertiaryColor: "#f1c40f",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
  },
});

const RoadmapForm = () => {
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [focus, setFocus] = useState("grammar");
  const [method, setMethod] = useState("self-paced");
  const [learningGoal, setLearningGoal] = useState("");
  const [timeframe, setTimeframe] = useState("3-months");
  const [mermaidCode, setMermaidCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [weeklyHours, setWeeklyHours] = useState("");
  const [learningStyle, setLearningStyle] = useState("balanced");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Function to generate AI roadmap with enhanced AI integration
  const generateAIRoadmap = async () => {
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Prepare user data for AI model
      const userData = {
        language: language || "Target Language",
        level: level || "Beginner",
        focus: focus || "comprehensive",
        method: method || "flexible",
        learningGoal: learningGoal || "general proficiency",
        timeframe: timeframe || "flexible",
        additionalInfo: additionalInfo || "",
        previousExperience: previousExperience || "none",
        weeklyHours: weeklyHours || "5-10",
        learningStyle: learningStyle || "balanced",
      };

      // Generate an adaptive learning path based on user inputs
      const roadmapStructure = generateAdaptiveLearningPath(userData);

      setMermaidCode(roadmapStructure.mermaidCode);
      setRecommendation(roadmapStructure.recommendation);
    } catch (error) {
      console.error("Error generating AI roadmap:", error);
      setRecommendation("Failed to generate roadmap. Please try again later.");
      setMermaidCode("");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced AI-like function to generate personalized learning path
  const generateAdaptiveLearningPath = (userData) => {
    let roadmap = "graph TD\n";
    let nodeCounter = 0;

    const createNodeId = () => {
      nodeCounter++;
      return `N${nodeCounter}`;
    };

    const startNode = createNodeId();
    roadmap += `${startNode}[Start Learning ${userData.language}] --> `;

    const assessNode = createNodeId();
    roadmap += `${assessNode}[Initial ${userData.level} Assessment]\n`;

    const prepNodes = [];
    if (userData.level === "Beginner") {
      const alphabetNode = createNodeId();
      const basicPhraseNode = createNodeId();
      prepNodes.push(alphabetNode, basicPhraseNode);

      roadmap += `${assessNode} --> ${alphabetNode}[Learn Alphabet & Pronunciation]\n`;
      roadmap += `${alphabetNode} --> ${basicPhraseNode}[Master 100 Essential Phrases]\n`;
    } else if (userData.level === "Intermediate") {
      const reviewNode = createNodeId();
      const skillGapNode = createNodeId();
      prepNodes.push(reviewNode, skillGapNode);

      roadmap += `${assessNode} --> ${reviewNode}[Review Fundamentals]\n`;
      roadmap += `${reviewNode} --> ${skillGapNode}[Address Skill Gaps]\n`;
    } else {
      const assessmentNode = createNodeId();
      const specializedNode = createNodeId();
      prepNodes.push(assessmentNode, specializedNode);

      roadmap += `${assessNode} --> ${assessmentNode}[Detailed Proficiency Assessment]\n`;
      roadmap += `${assessmentNode} --> ${specializedNode}[Identify Specialized Focus Areas]\n`;
    }

    const lastPrepNode = prepNodes[prepNodes.length - 1];
    const focusNodes = [];

    if (userData.focus === "grammar") {
      const grammarPlan = generateGrammarPath(userData, createNodeId, lastPrepNode);
      roadmap += grammarPlan.roadmapSection;
      focusNodes.push(...grammarPlan.endNodes);
    } else if (userData.focus === "vocabulary") {
      const vocabPlan = generateVocabularyPath(userData, createNodeId, lastPrepNode);
      roadmap += vocabPlan.roadmapSection;
      focusNodes.push(...vocabPlan.endNodes);
    } else if (userData.focus === "speaking") {
      const speakingPlan = generateSpeakingPath(userData, createNodeId, lastPrepNode);
      roadmap += speakingPlan.roadmapSection;
      focusNodes.push(...speakingPlan.endNodes);
    } else if (userData.focus === "listening") {
      const listeningPlan = generateListeningPath(userData, createNodeId, lastPrepNode);
      roadmap += listeningPlan.roadmapSection;
      focusNodes.push(...listeningPlan.endNodes);
    } else if (userData.focus === "writing") {
      const writingPlan = generateWritingPath(userData, createNodeId, lastPrepNode);
      roadmap += writingPlan.roadmapSection;
      focusNodes.push(...writingPlan.endNodes);
    } else {
      const comprehensivePlan = generateComprehensivePath(userData, createNodeId, lastPrepNode);
      roadmap += comprehensivePlan.roadmapSection;
      focusNodes.push(...comprehensivePlan.endNodes);
    }

    const milestoneNodes = generateMilestones(userData, createNodeId, focusNodes[0]);
    roadmap += milestoneNodes.roadmapSection;

    const finalNode = createNodeId();
    roadmap += `${milestoneNodes.lastNode} --> ${finalNode}[${userData.learningGoal}]\n`;

    roadmap += `class ${startNode},${finalNode} goalNode;\n`;
    roadmap += `class ${assessNode} assessmentNode;\n`;

    const recommendation = generateDetailedRecommendation(userData);

    return {
      mermaidCode: roadmap,
      recommendation: recommendation,
    };
  };

  const generateGrammarPath = (userData, createNodeId, parentNode) => {
    let roadmapSection = "";
    const endNodes = [];
    const grammarNode = createNodeId();
    roadmapSection += `${parentNode} --> ${grammarNode}[Master ${userData.level} Grammar]\n`;

    if (userData.level === "Beginner") {
      const nodes = [createNodeId(), createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${grammarNode} --> ${nodes[0]}[Basic Sentence Structure]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Present Tense Verbs]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Question Formation]\n`;
      roadmapSection += `${nodes[2]} --> ${nodes[3]}[Simple Past Tense]\n`;
      endNodes.push(nodes[3]);
    } else if (userData.level === "Intermediate") {
      const nodes = [createNodeId(), createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${grammarNode} --> ${nodes[0]}[Complex Sentence Structures]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[All Tense Mastery]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Conditional Statements]\n`;
      roadmapSection += `${nodes[2]} --> ${nodes[3]}[Passive Voice Construction]\n`;
      endNodes.push(nodes[3]);
    } else {
      const nodes = [createNodeId(), createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${grammarNode} --> ${nodes[0]}[Advanced Clause Structures]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Subjunctive Mood]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Complex Conditional Forms]\n`;
      roadmapSection += `${nodes[2]} --> ${nodes[3]}[Stylistic Variations]\n`;
      endNodes.push(nodes[3]);
    }

    const practiceNode = createNodeId();
    const lastContentNode = endNodes[endNodes.length - 1];
    roadmapSection += `${lastContentNode} --> ${practiceNode}[Grammar Application Practice]\n`;

    if (userData.method === "self-paced") {
      const selfPracNode = createNodeId();
      roadmapSection += `${practiceNode} --> ${selfPracNode}[Self-correction Exercises]\n`;
      endNodes.push(selfPracNode);
    } else if (userData.method === "tutor-led") {
      const tutorPracNode = createNodeId();
      roadmapSection += `${practiceNode} --> ${tutorPracNode}[Tutor-guided Grammar Drills]\n`;
      endNodes.push(tutorPracNode);
    } else if (userData.method === "immersive") {
      const immersivePracNode = createNodeId();
      roadmapSection += `${practiceNode} --> ${immersivePracNode}[Contextual Grammar in Conversations]\n`;
      endNodes.push(immersivePracNode);
    } else {
      endNodes.push(practiceNode);
    }

    return {
      roadmapSection,
      endNodes,
    };
  };

  const generateVocabularyPath = (userData, createNodeId, parentNode) => {
    let roadmapSection = "";
    const endNodes = [];
    const vocabNode = createNodeId();
    roadmapSection += `${parentNode} --> ${vocabNode}[Build ${userData.level} Vocabulary]\n`;

    if (userData.level === "Beginner") {
      const nodes = [createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${vocabNode} --> ${nodes[0]}[First 500 Most Common Words]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Basic Expressions & Phrases]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Essential Topic Vocabulary]\n`;
      endNodes.push(nodes[2]);
    } else if (userData.level === "Intermediate") {
      const nodes = [createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${vocabNode} --> ${nodes[0]}[2000-3000 Common Words]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Idiomatic Expressions]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Domain-Specific Vocabulary]\n`;
      endNodes.push(nodes[2]);
    } else {
      const nodes = [createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${vocabNode} --> ${nodes[0]}[5000+ Advanced Vocabulary]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Nuanced Synonyms & Collocations]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Cultural & Literary References]\n`;
      endNodes.push(nodes[2]);
    }

    const applicationNode = createNodeId();
    const lastContentNode = endNodes[endNodes.length - 1];
    roadmapSection += `${lastContentNode} --> ${applicationNode}[Vocabulary Application]\n`;

    const weeklyNode = createNodeId();
    let weeklyPlan = "";
    if (userData.weeklyHours === "1-5") {
      weeklyPlan = "Learn 25-50 New Words Weekly";
    } else if (userData.weeklyHours === "5-10") {
      weeklyPlan = "Learn 50-100 New Words Weekly";
    } else if (userData.weeklyHours === "10+") {
      weeklyPlan = "Learn 100-150 New Words Weekly";
    } else {
      weeklyPlan = "Consistent Vocabulary Expansion";
    }
    roadmapSection += `${applicationNode} --> ${weeklyNode}[${weeklyPlan}]\n`;
    endNodes.push(weeklyNode);

    return {
      roadmapSection,
      endNodes,
    };
  };

  const generateSpeakingPath = (userData, createNodeId, parentNode) => {
    let roadmapSection = "";
    const endNodes = [];
    const speakingNode = createNodeId();
    roadmapSection += `${parentNode} --> ${speakingNode}[Develop ${userData.level} Speaking Skills]\n`;

    if (userData.level === "Beginner") {
      const nodes = [createNodeId(), createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${speakingNode} --> ${nodes[0]}[Pronunciation Fundamentals]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Basic Conversation Scripts]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Simple Dialog Practice]\n`;
      roadmapSection += `${nodes[2]} --> ${nodes[3]}[Guided Role Playing]\n`;
      endNodes.push(nodes[3]);
    } else if (userData.level === "Intermediate") {
      const nodes = [createNodeId(), createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${speakingNode} --> ${nodes[0]}[Fluency Building Exercises]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Impromptu Speaking Practice]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Conversation Strategy Training]\n`;
      roadmapSection += `${nodes[2]} --> ${nodes[3]}[Group Discussion Skills]\n`;
      endNodes.push(nodes[3]);
    } else {
      const nodes = [createNodeId(), createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${speakingNode} --> ${nodes[0]}[Advanced Pronunciation Refinement]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Public Speaking in Target Language]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Debate & Persuasive Speech]\n`;
      roadmapSection += `${nodes[2]} --> ${nodes[3]}[Cultural Speaking Nuances]\n`;
      endNodes.push(nodes[3]);
    }

    const practiceNode = createNodeId();
    const lastContentNode = endNodes[endNodes.length - 1];
    if (userData.method === "self-paced") {
      roadmapSection += `${lastContentNode} --> ${practiceNode}[Find Language Exchange Partners]\n`;
    } else if (userData.method === "tutor-led") {
      roadmapSection += `${lastContentNode} --> ${practiceNode}[Structured Speaking Sessions with Tutor]\n`;
    } else if (userData.method === "immersive") {
      roadmapSection += `${lastContentNode} --> ${practiceNode}[Daily Speaking with Native Speakers]\n`;
    } else {
      roadmapSection += `${lastContentNode} --> ${practiceNode}[Regular Speaking Practice]\n`;
    }
    endNodes.push(practiceNode);

    return {
      roadmapSection,
      endNodes,
    };
  };

  const generateListeningPath = (userData, createNodeId, parentNode) => {
    let roadmapSection = "";
    const endNodes = [];
    const listeningNode = createNodeId();
    roadmapSection += `${parentNode} --> ${listeningNode}[Enhance ${userData.level} Listening Comprehension]\n`;

    if (userData.level === "Beginner") {
      const nodes = [createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${listeningNode} --> ${nodes[0]}[Slow & Clear Audio Content]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Structured Listening Exercises]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Simple Content with Transcripts]\n`;
      endNodes.push(nodes[2]);
    } else if (userData.level === "Intermediate") {
      const nodes = [createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${listeningNode} --> ${nodes[0]}[Authentic Media at Moderate Speed]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Podcasts & Shows with Subtitles]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Active Note-Taking During Listening]\n`;
      endNodes.push(nodes[2]);
    } else {
      const nodes = [createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${listeningNode} --> ${nodes[0]}[Native-Speed Content without Aids]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Various Accents & Dialects]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Complex Content Comprehension]\n`;
      endNodes.push(nodes[2]);
    }

    const habitNode = createNodeId();
    const lastContentNode = endNodes[endNodes.length - 1];
    let habitPlan = "";
    if (userData.weeklyHours === "1-5") {
      habitPlan = "15 Minutes Daily Listening";
    } else if (userData.weeklyHours === "5-10") {
      habitPlan = "30 Minutes Daily Listening";
    } else if (userData.weeklyHours === "10+") {
      habitPlan = "60+ Minutes Daily Listening";
    } else {
      habitPlan = "Consistent Listening Practice";
    }
    roadmapSection += `${lastContentNode} --> ${habitNode}[${habitPlan}]\n`;
    endNodes.push(habitNode);

    return {
      roadmapSection,
      endNodes,
    };
  };

  const generateWritingPath = (userData, createNodeId, parentNode) => {
    let roadmapSection = "";
    const endNodes = [];
    const writingNode = createNodeId();
    roadmapSection += `${parentNode} --> ${writingNode}[Build ${userData.level} Writing Skills]\n`;

    if (userData.level === "Beginner") {
      const nodes = [createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${writingNode} --> ${nodes[0]}[Basic Sentence Construction]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Simple Forms & Messages]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Guided Short Paragraphs]\n`;
      endNodes.push(nodes[2]);
    } else if (userData.level === "Intermediate") {
      const nodes = [createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${writingNode} --> ${nodes[0]}[Paragraph Development]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Short Essays & Letters]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Descriptive & Narrative Writing]\n`;
      endNodes.push(nodes[2]);
    } else {
      const nodes = [createNodeId(), createNodeId(), createNodeId()];
      roadmapSection += `${writingNode} --> ${nodes[0]}[Complex Composition Skills]\n`;
      roadmapSection += `${nodes[0]} --> ${nodes[1]}[Persuasive & Analytical Writing]\n`;
      roadmapSection += `${nodes[1]} --> ${nodes[2]}[Professional/Academic Writing]\n`;
      endNodes.push(nodes[2]);
    }

    const feedbackNode = createNodeId();
    const lastContentNode = endNodes[endNodes.length - 1];
    if (userData.method === "self-paced") {
      roadmapSection += `${lastContentNode} --> ${feedbackNode}[Get Writing Feedback via Language Exchanges]\n`;
    } else if (userData.method === "tutor-led") {
      roadmapSection += `${lastContentNode} --> ${feedbackNode}[Regular Writing Correction from Tutor]\n`;
    } else if (userData.method === "immersive") {
      roadmapSection += `${lastContentNode} --> ${feedbackNode}[Native Speaker Writing Review]\n`;
    } else {
      roadmapSection += `${lastContentNode} --> ${feedbackNode}[Regular Writing Practice & Feedback]\n`;
    }
    endNodes.push(feedbackNode);

    return {
      roadmapSection,
      endNodes,
    };
  };

  const generateComprehensivePath = (userData, createNodeId, parentNode) => {
    let roadmapSection = "";
    const endNodes = [];
    const mainNode = createNodeId();
    roadmapSection += `${parentNode} --> ${mainNode}[Integrated Skills Development]\n`;

    const vocabNode = createNodeId();
    const grammarNode = createNodeId();
    const speakingNode = createNodeId();
    const listeningNode = createNodeId();
    const writingNode = createNodeId();

    roadmapSection += `${mainNode} --> ${vocabNode}[Vocabulary Building]\n`;
    roadmapSection += `${mainNode} --> ${grammarNode}[Grammar Mastery]\n`;
    roadmapSection += `${mainNode} --> ${speakingNode}[Speaking Practice]\n`;
    roadmapSection += `${mainNode} --> ${listeningNode}[Listening Training]\n`;
    roadmapSection += `${mainNode} --> ${writingNode}[Writing Development]\n`;

    const integrationNode = createNodeId();
    roadmapSection += `${vocabNode} --> ${integrationNode}[Skills Integration]\n`;
    roadmapSection += `${grammarNode} --> ${integrationNode}\n`;
    roadmapSection += `${speakingNode} --> ${integrationNode}\n`;
    roadmapSection += `${listeningNode} --> ${integrationNode}\n`;
    roadmapSection += `${writingNode} --> ${integrationNode}\n`;

    endNodes.push(integrationNode);

    return {
      roadmapSection,
      endNodes,
    };
  };

  const generateMilestones = (userData, createNodeId, parentNode) => {
    let roadmapSection = "";
    let milestoneNodes = [];

    if (userData.timeframe === "3-months") {
      const month1 = createNodeId();
      const month2 = createNodeId();
      const month3 = createNodeId();
      roadmapSection += `${parentNode} --> ${month1}[Month 1: Foundation]\n`;
      roadmapSection += `${month1} --> ${month2}[Month 2: Practice & Expansion]\n`;
      roadmapSection += `${month2} --> ${month3}[Month 3: Integration & Assessment]\n`;
      milestoneNodes = [month1, month2, month3];
    } else if (userData.timeframe === "6-months") {
      const month1 = createNodeId();
      const month2 = createNodeId();
      const month4 = createNodeId();
      const month6 = createNodeId();
      roadmapSection += `${parentNode} --> ${month1}[Month 1: Foundation]\n`;
      roadmapSection += `${month1} --> ${month2}[Month 2: Core Skills]\n`;
      roadmapSection += `${month2} --> ${month4}[Month 4: Intermediate Practice]\n`;
      roadmapSection += `${month4} --> ${month6}[Month 6: Advanced Application]\n`;
      milestoneNodes = [month1, month2, month4, month6];
    } else if (userData.timeframe === "1-year") {
      const month1 = createNodeId();
      const month3 = createNodeId();
      const month6 = createNodeId();
      const month9 = createNodeId();
      const month12 = createNodeId();
      roadmapSection += `${parentNode} --> ${month1}[Month 1: Foundations]\n`;
      roadmapSection += `${month1} --> ${month3}[Month 3: Core Skills]\n`;
      roadmapSection += `${month3} --> ${month6}[Month 6: Intermediate Milestone]\n`;
      roadmapSection += `${month6} --> ${month9}[Month 9: Advanced Practice]\n`;
      roadmapSection += `${month9} --> ${month12}[Month 12: Proficiency Assessment]\n`;
      milestoneNodes = [month1, month3, month6, month9, month12];
    } else {
      const phase1 = createNodeId();
      const phase2 = createNodeId();
      const phase3 = createNodeId();
      roadmapSection += `${parentNode} --> ${phase1}[Phase 1: Foundations]\n`;
      roadmapSection += `${phase1} --> ${phase2}[Phase 2: Skill Building]\n`;
      roadmapSection += `${phase2} --> ${phase3}[Phase 3: Practical Application]\n`;
      milestoneNodes = [phase1, phase2, phase3];
    }

    return {
      roadmapSection,
      lastNode: milestoneNodes[milestoneNodes.length - 1],
    };
  };

  const generateDetailedRecommendation = (userData) => {
    let recommendation = `Based on your ${userData.level.toLowerCase()} level in ${userData.language} with a focus on ${userData.focus}, here is a personalized recommendation:\n\n`;

    if (userData.level === "Beginner") {
      recommendation += "• Start with high-frequency vocabulary and essential grammar patterns. Focus on building a solid foundation rather than trying to progress too quickly.\n";
      recommendation += "• Use visual aids, flashcards, and simple content designed for beginners.\n";
    } else if (userData.level === "Intermediate") {
      recommendation += "• Expand your skills by consuming authentic content while strategically addressing knowledge gaps.\n";
      recommendation += "• Begin specializing your vocabulary for your specific goals (e.g., travel, business, academic).\n";
    } else {
      recommendation += "• Focus on nuance, cultural context, and specialized language for your specific domains.\n";
      recommendation += "• Engage with complex native content and work on eliminating subtle errors in your production.\n";
    }

    if (userData.method === "self-paced") {
      recommendation += "• With your self-paced approach, establish a consistent daily schedule and use spaced repetition systems.\n";
      recommendation += "• Join language communities online to maintain accountability and motivation.\n";
    } else if (userData.method === "tutor-led") {
      recommendation += "• Maximize your tutor sessions by preparing specific questions and focusing on areas you can't easily practice alone.\n";
      recommendation += "• Do independent work between sessions to apply what you've learned.\n";
    } else if (userData.method === "immersive") {
      recommendation += "• In your immersive approach, don't shy away from making mistakes. Focus on communicative success rather than perfection.\n";
      recommendation += "• Create language boundaries in your environment (e.g., certain activities only in the target language).\n";
    }

    if (userData.timeframe === "3-months") {
      recommendation += "• With your 3-month timeframe, focus on high-impact skills and vocabulary most relevant to your goals.\n";
      recommendation += "• Schedule weekly reviews and adjust your approach based on progress.\n";
    } else if (userData.timeframe === "6-months") {
      recommendation += "• Your 6-month timeline allows for systematic skill building. Aim for measurable monthly progress markers.\n";
      recommendation += "• Include mid-point assessments to recalibrate your focus as needed.\n";
    } else if (userData.timeframe === "1-year") {
      recommendation += "• Your 1-year commitment enables a comprehensive and deep dive into the language. Focus on building all four skills (reading, writing, speaking, listening) systematically.\n";
      recommendation += "• Set quarterly goals to ensure steady progress and adjust your learning plan based on your evolving needs.\n";
    }

    return recommendation;
  };

  useEffect(() => {
    if (mermaidCode) {
      mermaid.contentLoaded();
    }
  }, [mermaidCode]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-300 via-purple-200 to-white p-8 flex justify-center items-center">
      <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Language Learning Roadmap Generator
        </h1>
        <div className="space-y-5">
          <div className="mb-5">
            <label className="block mb-1 font-semibold">Language:</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border border-blue-500 rounded"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-1 font-semibold">Level:</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2 border border-blue-500 rounded"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="block mb-1 font-semibold">Focus Area:</label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full p-2 border border-blue-500 rounded"
            >
              <option value="grammar">Grammar</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="speaking">Speaking</option>
              <option value="listening">Listening</option>
              <option value="writing">Writing</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="block mb-1 font-semibold">Learning Method:</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-2 border border-blue-500 rounded"
            >
              <option value="self-paced">Self-Paced</option>
              <option value="tutor-led">Tutor-Led</option>
              <option value="immersive">Immersive</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="block mb-1 font-semibold">Learning Goal:</label>
            <input
              type="text"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              className="w-full p-2 border border-blue-500 rounded"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-1 font-semibold">Timeframe:</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full p-2 border border-blue-500 rounded"
            >
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="1-year">1 Year</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            {showAdvancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
          </button>
          {showAdvancedOptions && (
            <div className="space-y-5 mt-4">
              <div className="mb-5">
                <label className="block mb-1 font-semibold">Previous Experience:</label>
                <input
                  type="text"
                  value={previousExperience}
                  onChange={(e) => setPreviousExperience(e.target.value)}
                  className="w-full p-2 border border-blue-500 rounded"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-1 font-semibold">Weekly Hours:</label>
                <input
                  type="text"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(e.target.value)}
                  className="w-full p-2 border border-blue-500 rounded"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-1 font-semibold">Learning Style:</label>
                <select
                  value={learningStyle}
                  onChange={(e) => setLearningStyle(e.target.value)}
                  className="w-full p-2 border border-blue-500 rounded"
                >
                  <option value="visual">Visual</option>
                  <option value="auditory">Auditory</option>
                  <option value="kinesthetic">Kinesthetic</option>
                  <option value="balanced">Balanced</option>
                </select>
              </div>
            </div>
          )}
          <button
            onClick={generateAIRoadmap}
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>
        {mermaidCode && (
          <div className="mt-5">
            <div className="mermaid text-center p-4 bg-gray-50 rounded shadow">
              {mermaidCode}
            </div>
            {recommendation && (
              <div className="mt-5 p-4 bg-gray-100 border-l-4 border-blue-500 text-gray-700">
                {recommendation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapForm;