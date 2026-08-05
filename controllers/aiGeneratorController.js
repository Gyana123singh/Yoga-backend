const AICoach = require('../models/AICoach');
const PracticeSequence = require('../models/PracticeSequence');

const DEFAULT_COACHES = [
  { name: 'Guru Ananda AI', specialty: 'Vedic Flow & Kundalini Energy', promptStyle: 'Sacred Sanskrit, spiritual mindfulness, alignment focused', tone: 'Wise & Serene', status: 'Active', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250' },
  { name: 'PhysioBio AI Coach', specialty: 'Anatomical Rehabilitation & Spine Decompression', promptStyle: 'Biomechanics, posture correction, HRV optimization', tone: 'Scientific & Precise', status: 'Active', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250' },
  { name: 'Nidra Sleep Whisperer AI', specialty: 'Parasympathetic Activation & Insomnia Release', promptStyle: 'Deep delta audio, 4-7-8 breath timing, body scan', tone: 'Soothing & Gentle', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250' }
];

const generateAIPractice = async (req, res) => {
  try {
    const { userPrompt, targetFocus, duration, difficulty, energyLevel, connectedDevices } = req.body;

    const posesList = [
      { name: 'Adho Mukha Svanasana (Down Dog)', holdTime: '60s', breathingPattern: 'Inhale through nose, exhale long', notes: 'Keep spine elongated and tailbone lifted.' },
      { name: 'Virabhadrasana II (Warrior II)', holdTime: '45s each side', breathingPattern: 'Ujjayi breath, deep chest expansion', notes: 'Gaze soft over fingertips.' },
      { name: 'Vrksasana (Tree Pose)', holdTime: '60s each side', breathingPattern: 'Rhythmic 4-4 breathing', notes: 'Root down through standing foot.' },
      { name: 'Bhujangasana (Cobra Pose)', holdTime: '30s hold (3 reps)', breathingPattern: 'Inhale lift chest, exhale lower', notes: 'Press tops of feet firmly into mat.' },
      { name: 'Savasana (Corpse Pose)', holdTime: '5 mins', breathingPattern: 'Natural unforced diaphragmatic breath', notes: 'Complete full body scan relaxation.' }
    ];

    const generatedRoutine = {
      title: `AI Generated ${targetFocus || 'Holistic Wellness'} Routine`,
      description: userPrompt || `Customized AI practice optimized for ${energyLevel || 'balanced energy'} and ${difficulty || 'Beginner'} level.`,
      targetFocus: targetFocus || 'Full Body Flexibility',
      duration: duration || '20 Mins',
      difficulty: difficulty || 'Beginner',
      energyLevel: energyLevel || 'Moderate',
      estimatedCalories: Math.floor(120 + Math.random() * 100),
      parasympatheticActivationScore: '94/100',
      connectedDevicesUsed: connectedDevices || ['Apple Watch'],
      poses: posesList,
      aiPromptTemplateUsed: `NeuralFlow v2.4 prompt: ${userPrompt || 'Generate balanced flow'}`,
      generatedAt: new Date().toISOString()
    };

    const savedSequence = new PracticeSequence({
      title: generatedRoutine.title,
      description: generatedRoutine.description,
      duration: generatedRoutine.duration,
      difficulty: generatedRoutine.difficulty,
      targetGoal: generatedRoutine.targetFocus,
      poses: posesList.map(p => ({ name: p.name, holdTime: p.holdTime, breathingPattern: p.breathingPattern, notes: p.notes })),
      isAIGenerated: true,
      tags: ['AI Generated', targetFocus || 'Mindfulness'],
      createdBy: 'AURA Neural Engine v2.4'
    });

    await savedSequence.save();

    res.json({ success: true, routine: generatedRoutine, sequenceId: savedSequence._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAICoaches = async (req, res) => {
  try {
    let coaches = await AICoach.find().sort({ createdAt: -1 });
    if (coaches.length === 0) {
      coaches = DEFAULT_COACHES;
    }
    res.json({ success: true, count: coaches.length, data: coaches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAICoach = async (req, res) => {
  try {
    const { name, specialty, promptStyle, tone, avatar, status } = req.body;
    const coach = new AICoach({
      name,
      specialty,
      promptStyle: promptStyle || 'Personalized wellness prompt tuning',
      tone: tone || 'Empathetic & Calm',
      status: status || 'Active',
      avatar: avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'
    });

    const saved = await coach.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateAIPractice,
  getAICoaches,
  createAICoach
};
