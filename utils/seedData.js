const MOCK_USERS = [
  {
    id: 'USR-ADMIN-01',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@aura.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    authProvider: 'admin',
    plan: 'Executive Unlimited',
    planType: 'Premium',
    status: 'Active',
    joinedDate: '2024-01-01',
    streak: 365,
    totalMinutes: 25000,
    primaryGoal: 'Executive Studio Operations',
    devicesConnected: ['Apple Watch Ultra 2'],
    lastSession: 'Now (Admin Portal)',
    hrvAvg: '95 ms',
    sleepScore: '98/100',
    country: 'United States',
    language: 'English',
    aiPromptsCount: 500
  }
];

const MOCK_ASANAS = [
  {
    id: 'ASN-01',
    englishName: 'Downward-Facing Dog',
    sanskritName: 'Adho Mukha Svanasana',
    category: 'Inversion / Stretch',
    difficulty: 'Beginner',
    targetMuscles: ['Hamstrings', 'Calves', 'Shoulders', 'Spine'],
    benefits: 'Calms the nervous system, stretches posterior chain, strengthens wrists & shoulders.',
    contraindications: 'Carpal tunnel syndrome, high blood pressure (late pregnancy).',
    instructions: [
      'Come onto hands and knees with wrists under shoulders.',
      'Exhale, lift knees off floor, pushing hips upward and back.',
      'Lengthen tailbone away from pelvis and press heels toward mat.',
      'Hold for 5 to 10 deep breaths.'
    ],
    equipment: ['Yoga Mat', 'Blocks (optional)'],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
    pose3dAvailable: true,
  },
  {
    id: 'ASN-02',
    englishName: 'Warrior II',
    sanskritName: 'Virabhadrasana II',
    category: 'Standing / Power',
    difficulty: 'Intermediate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Deltoids', 'Adductors'],
    benefits: 'Builds stamina, opens hips and chest, improves concentration and posture.',
    contraindications: 'Recent knee surgery, neck strain (keep gaze forward).',
    instructions: [
      'Step feet wide apart (~4 feet). Turn right foot out 90 degrees.',
      'Bend right knee to 90 degrees directly over ankle.',
      'Extend arms parallel to floor, reach actively through fingertips.',
      'Gaze softly over right front hand.'
    ],
    equipment: ['Yoga Mat'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
    pose3dAvailable: true,
  },
  {
    id: 'ASN-03',
    englishName: 'Tree Pose',
    sanskritName: 'Vrksasana',
    category: 'Balance',
    difficulty: 'Beginner',
    targetMuscles: ['Ankles', 'Core', 'Inner Thighs', 'Stabilizers'],
    benefits: 'Improves proprioception, ankle stability, and mental focus.',
    contraindications: 'Vertigo, severe ankle injury.',
    instructions: [
      'Shift weight onto left foot.',
      'Place right sole against left inner thigh or calf (avoid knee).',
      'Bring hands to Anjali Mudra (heart center).',
      'Fix gaze on a steady focus point for 60 seconds.'
    ],
    equipment: ['Yoga Mat', 'Wall (optional)'],
    imageUrl: 'https://images.unsplash.com/photo-1510894347713-da3ed8f4f94d?auto=format&fit=crop&q=80&w=600',
    pose3dAvailable: true,
  },
  {
    id: 'ASN-04',
    englishName: 'King Pigeon Pose',
    sanskritName: 'Eka Pada Rajakapotasana',
    category: 'Hip Opener / Backbend',
    difficulty: 'Advanced',
    targetMuscles: ['Hip Flexors', 'Psoas', 'Chest', 'Quadriceps'],
    benefits: 'Deeply releases emotional tension in hip flexors, opens thoracic heart space.',
    contraindications: 'Knee ligament damage, sacroiliac joint disorder.',
    instructions: [
      'From Down Dog, bring right knee forward behind right wrist.',
      'Lower left leg straight back onto the floor.',
      'Square hips, lift chest, and reach arms overhead to reach back foot.',
      'Breathe into lumbar curve smoothly.'
    ],
    equipment: ['Yoga Mat', 'Strap', 'Bolster'],
    imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=600',
    pose3dAvailable: true,
  }
];

const MOCK_BREATHING_TECHNIQUES = [
  {
    id: 'BRT-01',
    name: 'Box Breathing (4-4-4-4)',
    category: 'Stress & Focus',
    pattern: 'Inhale 4s • Hold 4s • Exhale 4s • Hold 4s',
    benefits: 'Used by Navy SEALs to lower heart rate and enter peak calm concentration.',
    audioGuide: 'Voice 01 (Calm Female - Maya)',
    defaultDuration: '5 Minutes',
    difficulty: 'Beginner',
    iconColor: 'from-indigo-500 to-cyan-500'
  },
  {
    id: 'BRT-02',
    name: '4-7-8 Relaxing Breath',
    title: 'Kapalbhati Pranayama',
    subtitle: 'Purifying Breath • Energizing Mind',
    badgeTag: 'CLEANSE',
    category: 'Breathing',
    totalRounds: 3,
    durationMinutes: 5,
    heroImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    demoVideoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
    bgImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    inhaleSeconds: 4,
    holdSeconds: 4,
    exhaleSeconds: 4,
    whatIs: 'Kapalbhati is a powerful yogic breathing technique that involves rapid, forceful exhalations and passive inhalations.',
    benefits: 'Improves digestion, boosts energy, detoxifies body, enhances lung capacity, and sharpens mental focus.',
    correctPosture: 'Sit in a comfortable meditative posture such as Sukhasana or Padmasana with spine erect and shoulders relaxed.',
    instructions: 'General instructions and important guidelines you should know before starting your practice.',
    howToDo: 'Step-by-step method to practice Kapalbhati correctly for maximum benefit. Take a deep inhale and exhale forcefully pulling navel inward.',
    whatItDoesntGuarantee: 'Kapalbhati is effective for many conditions but it is not a cure for all chronic ailments without medical guidance.',
    contraindications: 'Certain health conditions where Kapalbhati should be avoided: pregnancy, high blood pressure, heart diseases, hernia, and recent abdominal surgery.',
    originHistory: 'Kapalbhati originated from ancient yogic texts in India (Hatha Yoga Pradipika). The word comes from Kapal (skull) and Bhati (shining).',
    order: 1,
    isActive: true
  },
  {
    title: 'Pranayama',
    subtitle: 'Vitality Breath • Balance & Clarity',
    badgeTag: 'VITALITY',
    category: 'Breathing',
    totalRounds: 3,
    durationMinutes: 7,
    heroImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    demoVideoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4',
    bgImageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    inhaleSeconds: 4,
    holdSeconds: 4,
    exhaleSeconds: 4,
    whatIs: 'Anulom Vilom (Alternate Nostril Breathing) balances the nervous system and harmonizes right and left brain hemispheres.',
    benefits: 'Calms anxiety, regulates blood pressure, balances autonomic nervous system, and improves sleep quality.',
    correctPosture: 'Sit upright with legs crossed in Padmasana or Siddhasana. Keep Vishnu Mudra on your right hand.',
    instructions: 'Close right nostril with thumb, inhale through left nostril. Close left nostril with ring finger, exhale through right.',
    howToDo: 'Inhale left 4s, hold 4s, exhale right 4s. Repeat continuously for 5 to 10 minutes.',
    whatItDoesntGuarantee: 'Helps stress management but does not replace prescription medical treatment for chronic illness.',
    contraindications: 'Do not force breath if suffering from acute nasal blockage or severe cold.',
    originHistory: 'Rooted in ancient Vedic traditions to purify the Nadis (energy channels) in the subtle body.',
    order: 2,
    isActive: true
  },
  {
    title: 'Deep Relaxation Breathing',
    subtitle: 'Restful Mind • Stress Relief',
    badgeTag: 'DEEP RELAXATION',
    category: 'Breathing',
    totalRounds: 3,
    durationMinutes: 10,
    heroImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
    demoVideoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
    bgImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    inhaleSeconds: 4,
    holdSeconds: 7,
    exhaleSeconds: 8,
    whatIs: 'The 4-7-8 breathing technique acts as a natural tranquilizer for the nervous system.',
    benefits: 'Lowers heart rate, promotes deep muscle relaxation, and helps ease sleep onset.',
    correctPosture: 'Lie down flat on back or sit comfortably with back supported.',
    instructions: 'Inhale silently through nose for 4s, hold breath for 7s, exhale audibly through mouth for 8s.',
    howToDo: 'Perform 4 full cycles before sleep or whenever feeling acute overwhelm.',
    whatItDoesntGuarantee: 'May cause mild lightheadedness if practiced too fast.',
    contraindications: 'Avoid holding breath if pregnant or if suffering from severe lung disorders.',
    originHistory: 'Popularized by Dr. Andrew Weil based on ancient Pranayama breath retention principles.',
    order: 3,
    isActive: true
  }
];

const MOCK_RECOMMENDATIONS_RULES = [
  {
    id: 'RULE-101',
    userState: 'Stressed / High Cortisol',
    triggerCondition: 'HRV < 45 ms OR User select "Stressed"',
    recommendedSequence: ['Box Breathing (5 min)', 'Gentle Yin Spine Reset (15 min)', 'Body Scan Meditation (10 min)'],
    priority: 'Urgent High',
    aiPromptTemplate: 'Generate a soothing restorative flow emphasizing parasympathetic activation with 4-7-8 breathing intervals.',
    status: 'Active',
    matchCount: 14250,
  },
  {
    id: 'RULE-102',
    userState: 'Sluggish / Low Energy',
    triggerCondition: 'Morning Routine OR Sleep Score < 70',
    recommendedSequence: ['Kapalabhati Breath (3 min)', 'Dynamic Sun Salutation B (12 min)', 'Focus Affirmations (5 min)'],
    priority: 'Medium',
    aiPromptTemplate: 'Inject energizing solar plexus flow with rhythmic breath counts to raise body temperature.',
    status: 'Active',
    matchCount: 22890,
  },
  {
    id: 'RULE-103',
    userState: 'Lower Back Tension',
    triggerCondition: 'Desk Work > 6 hours OR Desk Tag',
    recommendedSequence: ['Cat-Cow Flow (4 min)', 'Sphinx & Cobra Hold (6 min)', 'Hamstring Wall Stretch (8 min)'],
    priority: 'High',
    aiPromptTemplate: 'Decompress L1-L5 lumbar vertebrae using breath-guided axial extension poses.',
    status: 'Active',
    matchCount: 18900,
  },
  {
    id: 'RULE-104',
    userState: 'Insomnia / Mind Racing',
    triggerCondition: 'Time > 21:30 PM OR Night Mode',
    recommendedSequence: ['Left Nostril Chandra Breathing (6 min)', 'Yoga Nidra Deep Relaxation (20 min)'],
    priority: 'High',
    aiPromptTemplate: 'Synthesize delta wave frequency background audio with soothing slow cadence voice instructions.',
    status: 'Active',
    matchCount: 31200,
  }
];

const MOCK_LIVE_CLASSES = [
  {
    id: 'LIV-901',
    title: 'Sunrise Vinyasa Flow & Solar Energy',
    instructor: 'Master Yogini Ananya',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    dateTime: 'Today, 07:00 AM EST',
    duration: '45 mins',
    seatsBooked: 480,
    totalSeats: 500,
    status: 'Live Now',
    streamUrl: 'https://live.aura.io/stream/vinyasa-901',
    category: 'Vinyasa',
  },
  {
    id: 'LIV-902',
    title: 'Vagus Nerve Reset & Sound Bath Meditation',
    instructor: 'Dr. Michael Sterling',
    instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    dateTime: 'Today, 06:00 PM EST',
    duration: '60 mins',
    seatsBooked: 890,
    totalSeats: 1000,
    status: 'Scheduled',
    streamUrl: 'https://live.aura.io/stream/vagus-902',
    category: 'Meditation & Sound',
  },
  {
    id: 'LIV-903',
    title: 'Desk Worker Spine & Posture Masterclass',
    instructor: 'Elena Vance, PT',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    dateTime: 'Tomorrow, 12:00 PM EST',
    duration: '30 mins',
    seatsBooked: 320,
    totalSeats: 500,
    status: 'Scheduled',
    streamUrl: 'https://live.aura.io/stream/posture-903',
    category: 'Therapeutic',
  }
];

const MOCK_SMARTWATCH_STATS = [
  { device: 'Apple Watch Series 9/Ultra', users: 24500, syncRate: '99.2%', color: '#6366F1' },
  { device: 'Garmin Forerunner & Fenix', users: 12800, syncRate: '98.7%', color: '#06B6D4' },
  { device: 'Oura Ring Gen 3', users: 9400, syncRate: '99.5%', color: '#10B981' },
  { device: 'Pixel Watch / Wear OS', users: 8100, syncRate: '96.4%', color: '#F59E0B' },
  { device: 'Fitbit Sense 2', users: 6200, syncRate: '95.8%', color: '#EC4899' },
];

const MOCK_COUPONS = [
  { code: 'YOGA2026', discountPercent: 25, validUntil: '2026-12-31', maxRedemptions: 1000, redemptionsCount: 420, status: 'Active', planTier: 'Pro Annual' },
  { code: 'NAMASTE50', discountPercent: 50, validUntil: '2026-09-30', maxRedemptions: 500, redemptionsCount: 310, status: 'Active', planTier: 'Monthly Pro' },
  { code: 'BREATHE10', discountPercent: 10, validUntil: '2026-08-31', maxRedemptions: 200, redemptionsCount: 198, status: 'Active', planTier: 'All Plans' },
];

const MOCK_FEELINGS = [
  { name: 'Calm', emoji: '😊', description: 'Mindful, tranquil and centered state', order: 1, isActive: true },
  { name: 'Stressed', emoji: '🤯', description: 'High mental tension or anxiety', order: 2, isActive: true },
  { name: 'Tired', emoji: '😴', description: 'Physically or mentally fatigued', order: 3, isActive: true },
  { name: 'Unfocused', emoji: '🧠', description: 'Scatter-brained, needing clarity', order: 4, isActive: true },
  { name: 'Low energy', emoji: '⚡', description: 'Sluggish and in need of energy boost', order: 5, isActive: true },
  { name: 'Want to exercise', emoji: '🏋️', description: 'Ready for active physical flow', order: 6, isActive: true },
  { name: 'Stiff', emoji: '🧘', description: 'Tight muscles, joint stiffness', order: 7, isActive: true },
  { name: 'Need better sleep', emoji: '🌙', description: 'Preparing for deep restful sleep', order: 8, isActive: true }
];

const MOCK_FOCUS_AREAS = [
  { name: 'Belly / Core strength', icon: 'target', relatedFeelings: ['Calm', 'Want to exercise', 'Stiff', 'Low energy'], description: 'Abdominal stability & pelvic floor', order: 1, isActive: true },
  { name: 'Flexibility', icon: 'activity', relatedFeelings: ['Stressed', 'Stiff', 'Calm', 'Tired'], description: 'Deep muscle lengthening and range of motion', order: 2, isActive: true },
  { name: 'Back and posture', icon: 'spine', relatedFeelings: ['Stressed', 'Stiff', 'Unfocused'], description: 'Spinal decompression and posture alignment', order: 3, isActive: true },
  { name: 'Hips', icon: 'heart', relatedFeelings: ['Stressed', 'Stiff', 'Need better sleep'], description: 'Hip flexor release and emotional tension reset', order: 4, isActive: true },
  { name: 'Shoulders', icon: 'user', relatedFeelings: ['Stressed', 'Unfocused', 'Stiff'], description: 'Upper back and trap release', order: 5, isActive: true },
  { name: 'Balance', icon: 'compass', relatedFeelings: ['Calm', 'Unfocused', 'Want to exercise'], description: 'Single-leg stability and core equilibrium', order: 6, isActive: true },
  { name: 'Strength', icon: 'dumbbell', relatedFeelings: ['Want to exercise', 'Low energy'], description: 'Full body isometric muscle building', order: 7, isActive: true },
  { name: 'General fitness', icon: 'zap', relatedFeelings: ['Want to exercise', 'Calm'], description: 'Overall cardiovascular & yoga movement', order: 8, isActive: true },
  { name: 'Relaxation', icon: 'sun', relatedFeelings: ['Calm', 'Stressed', 'Need better sleep', 'Tired'], description: 'Parasympathetic nerve recovery', order: 9, isActive: true },
  { name: 'Sleep', icon: 'moon', relatedFeelings: ['Need better sleep', 'Tired', 'Calm'], description: 'Bedtime restorative Yoga Nidra flow', order: 10, isActive: true }
];

const MOCK_DURATIONS = [
  { label: '2 min', minutes: 2, order: 1, isActive: true },
  { label: '5 min', minutes: 5, order: 2, isActive: true },
  { label: '10 min', minutes: 10, order: 3, isActive: true },
  { label: '20 min', minutes: 20, order: 4, isActive: true },
  { label: '30 min', minutes: 30, order: 5, isActive: true },
  { label: '45 min', minutes: 45, order: 6, isActive: true }
];

const MOCK_SESSION_CONFIGS = [
  {
    feeling: 'Calm',
    focusArea: 'Belly / Core strength',
    durationMinutes: 20,
    title: '20-Minute Belly & Calm',
    badge: 'YOUR PERSONAL SESSION',
    steps: [
      { id: 'step-1', duration: '4 min', durationMinutes: 4, title: 'Breath preparation (Calm reset)', category: 'Breath', color: '#ECFDF5', icon: 'wind', description: 'Deep diaphragmatic breathing with 4-second hold.' },
      { id: 'step-2', duration: '11 min', durationMinutes: 11, title: 'Belly / Core strength flow', category: 'Yoga Flow', color: '#FFEDD5', icon: 'user', description: 'Navasana (Boat Pose), Plank holds and gentle core engagement.' },
      { id: 'step-3', duration: '3 min', durationMinutes: 3, title: 'Deep body relaxation', category: 'Relaxation', color: '#F3E8FF', icon: 'lotus', description: 'Recline spinal twist with slow exhalations.' },
      { id: 'step-4', duration: '2 min', durationMinutes: 2, title: 'Cooling breath', category: 'Cooling', color: '#FFE4E6', icon: 'heart', description: 'Sheetali cooling breath to lower body temperature.' }
    ],
    isActive: true
  },
  {
    feeling: 'Stressed',
    focusArea: 'Flexibility',
    durationMinutes: 15,
    title: '15-Minute Stressed & Flexibility Reset',
    badge: 'YOUR PERSONAL SESSION',
    steps: [
      { id: 'step-1', duration: '3 min', durationMinutes: 3, title: 'Nervous system calming breath', category: 'Breath', color: '#ECFDF5', icon: 'wind', description: 'Box breathing (4s in, 4s hold, 4s out, 4s hold).' },
      { id: 'step-2', duration: '8 min', durationMinutes: 8, title: 'Deep spine & hip flexibility flow', category: 'Yoga Flow', color: '#FFEDD5', icon: 'user', description: 'Gentle Cat-Cow and Pigeon Pose for hip flexors.' },
      { id: 'step-3', duration: '2 min', durationMinutes: 2, title: 'Muscle tension release', category: 'Relaxation', color: '#F3E8FF', icon: 'lotus', description: 'Progressive muscle relaxation from neck to feet.' },
      { id: 'step-4', duration: '2 min', durationMinutes: 2, title: 'Guided grounding breath', category: 'Cooling', color: '#FFE4E6', icon: 'heart', description: 'Grounding 4-7-8 exhale focus.' }
    ],
    isActive: true
  }
];

const MOCK_QUICK_PRACTICES = [
  {
    title: '2 min Quick Reset',
    subtitle: 'Mindful Breath • Inner Balance',
    category: 'quick_timer',
    icon: 'clock',
    durationMinutes: 2,
    badgeText: 'Quick Practice Session',
    bgImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a14f4e.mp3',
    phases: [
      { phase: 'INHALE', durationSeconds: 4, instruction: 'Breathe In Deeply' },
      { phase: 'HOLD', durationSeconds: 4, instruction: 'Retain Breath Gently' },
      { phase: 'EXHALE', durationSeconds: 4, instruction: 'Release Slowly' },
      { phase: 'HOLD', durationSeconds: 2, instruction: 'Rest & Pause' }
    ],
    order: 1
  },
  {
    title: '5 min Deep Calm Reset',
    subtitle: 'Nervous System Reset • Stress Release',
    category: 'quick_timer',
    icon: 'clock',
    durationMinutes: 5,
    badgeText: 'Quick Practice Session',
    bgImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: '',
    phases: [
      { phase: 'INHALE', durationSeconds: 4, instruction: 'Breathe In Deeply' },
      { phase: 'HOLD', durationSeconds: 7, instruction: 'Hold Breath Gently' },
      { phase: 'EXHALE', durationSeconds: 8, instruction: 'Exhale Completely' }
    ],
    order: 2
  },
  {
    title: '10 min Mindful Balance',
    subtitle: 'Full Body Alignment & Relaxation',
    category: 'quick_timer',
    icon: 'clock',
    durationMinutes: 10,
    badgeText: 'Quick Practice Session',
    bgImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: '',
    phases: [
      { phase: 'INHALE', durationSeconds: 5, instruction: 'Inhale Solar Energy' },
      { phase: 'EXHALE', durationSeconds: 5, instruction: 'Exhale Tension' }
    ],
    order: 3
  },

  // SOS Moment Breathing Items (Images 3 & 4)
  {
    title: 'Calm Me (Box Breathing 4-4-4-4)',
    subtitle: 'Instant Anxiety Relief • Equal Pace',
    category: 'sos_moment',
    icon: 'heart',
    durationMinutes: 3,
    badgeText: 'Breathing SOS',
    bgImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a14f4e.mp3',
    phases: [
      { phase: 'INHALE', durationSeconds: 4, instruction: 'Breathe In Deeply' },
      { phase: 'HOLD', durationSeconds: 4, instruction: 'Retain Breath Gently' },
      { phase: 'EXHALE', durationSeconds: 4, instruction: 'Exhale Smoothly' },
      { phase: 'HOLD', durationSeconds: 4, instruction: 'Pause at Bottom' }
    ],
    order: 1
  },
  {
    title: 'Help Me Sleep (4-7-8 Sleep Breath)',
    subtitle: 'Parasympathetic Activation • Deep Rest',
    category: 'sos_moment',
    icon: 'moon',
    durationMinutes: 5,
    badgeText: 'Breathing SOS',
    bgImageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: '',
    phases: [
      { phase: 'INHALE', durationSeconds: 4, instruction: 'Inhale Quietly Through Nose' },
      { phase: 'HOLD', durationSeconds: 7, instruction: 'Hold Your Breath Softly' },
      { phase: 'EXHALE', durationSeconds: 8, instruction: 'Whoosh Exhale Through Mouth' }
    ],
    order: 2
  },
  {
    title: 'Give Me Energy (Kapalabhati Breath)',
    subtitle: 'Skull-Shining Rapid Vitality Boost',
    category: 'sos_moment',
    icon: 'zap',
    durationMinutes: 3,
    badgeText: 'Breathing SOS',
    bgImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: '',
    phases: [
      { phase: 'INHALE', durationSeconds: 2, instruction: 'Passive Quick Inhale' },
      { phase: 'EXHALE', durationSeconds: 1, instruction: 'Active Sharp Exhale' }
    ],
    order: 3
  },
  {
    title: 'Help Me Focus (Coherent 5-5 Breath)',
    subtitle: 'Heart Rate Variability Alignment',
    category: 'sos_moment',
    icon: 'target',
    durationMinutes: 4,
    badgeText: 'Breathing SOS',
    bgImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: '',
    phases: [
      { phase: 'INHALE', durationSeconds: 5, instruction: 'Inhale Steadily (5 sec)' },
      { phase: 'EXHALE', durationSeconds: 5, instruction: 'Exhale Smoothly (5 sec)' }
    ],
    order: 4
  },
  {
    title: 'Box Breathing (4-4-4-4)',
    subtitle: 'Navy SEAL tactical breathing technique to rapidly calm the nervous system and heighten focus.',
    category: 'library',
    filterCategory: 'Calm',
    patternTag: 'Pattern: 4-4-4-4',
    icon: 'wind',
    durationMinutes: 5,
    badgeText: 'Pranayama Library',
    benefits: [
      'Lowers cortisol stress hormone',
      'Enhances mental clarity',
      'Balances autonomic nervous system'
    ],
    safetyCaution: 'If pregnant or experiencing high blood pressure, reduce hold phase to comfortable level.',
    bgImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a14f4e.mp3',
    phases: [
      { phase: 'INHALE', durationSeconds: 4, instruction: 'Breathe In Deeply' },
      { phase: 'HOLD', durationSeconds: 4, instruction: 'Retain Breath Gently' },
      { phase: 'EXHALE', durationSeconds: 4, instruction: 'Release Slowly' },
      { phase: 'HOLD', durationSeconds: 4, instruction: 'Rest & Pause' }
    ],
    order: 5
  },
  {
    title: '4-7-8 Relaxing Breath',
    subtitle: 'Dr. Andrew Weil natural tranquilizer for the nervous system.',
    category: 'library',
    filterCategory: 'Sleep',
    patternTag: 'Pattern: 4-7-8',
    icon: 'wind',
    durationMinutes: 4,
    badgeText: 'Pranayama Library',
    benefits: [
      'Helps transition to deep sleep',
      'Slowing heart rate & nervous system',
      'Relieves tension & insomnia'
    ],
    safetyCaution: 'Do not practice while driving or operating machinery.',
    bgImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: '',
    phases: [
      { phase: 'INHALE', durationSeconds: 4, instruction: 'Breathe In Through Nose' },
      { phase: 'HOLD', durationSeconds: 7, instruction: 'Hold Breath Calmly' },
      { phase: 'EXHALE', durationSeconds: 8, instruction: 'Whoosh Exhale Through Mouth' }
    ],
    order: 6
  },
  {
    title: 'Coherent Breathing (5-5)',
    subtitle: 'Optimal 6-breaths-per-minute rhythm that synchronizes heart rate variability.',
    category: 'library',
    filterCategory: 'Focus',
    patternTag: 'Pattern: 5-0-5',
    icon: 'wind',
    durationMinutes: 6,
    badgeText: 'Pranayama Library',
    benefits: [
      'Maximizes Heart Rate Variability (HRV)',
      'Optimizes brain function & focus',
      'Grounds emotional state'
    ],
    safetyCaution: 'Breathe naturally without straining.',
    bgImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    voiceGuidanceUrl: '',
    phases: [
      { phase: 'INHALE', durationSeconds: 5, instruction: 'Smooth Inhale' },
      { phase: 'EXHALE', durationSeconds: 5, instruction: 'Smooth Exhale' }
    ],
    order: 7
  }
];

const MOCK_YOGA_PROGRAMS = [
  {
    title: 'Core & Belly Strength',
    subtitle: 'Build a stronger core and improve stability & overall fitness.',
    goalCategory: 'Strength',
    totalDays: 30,
    difficultyLevel: 'Intermediate',
    enrolledCount: '8.5K+',
    heroImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    tags: ['Core Activation', 'Abdominal Strength'],
    freeDaysCount: 2,
    improvements: [
      { name: 'Core Stability', icon: 'grid' },
      { name: 'Abdominal Strength', icon: 'zap' },
      { name: 'Balance', icon: 'user' },
      { name: 'Breath Coordination', icon: 'wind' }
    ],
    dailySchedules: Array.from({ length: 30 }, (_, idx) => {
      const dayNum = idx + 1;
      return {
        dayNumber: dayNum,
        title: dayNum === 1 ? 'Core Awareness' : dayNum === 2 ? 'Breath + Core' : `Balance & Core Flow ${dayNum}`,
        focusTitle: dayNum === 1 ? 'Core Activation' : 'Core & Abdominal Strengthening',
        focusDescription: 'Activate your core, improve body awareness and connect with your breath.',
        durationMinutes: 12 + (dayNum % 5),
        estimatedCalories: 100 + (dayNum * 3),
        difficultyTag: 'Beginner Friendly',
        isFree: dayNum <= 2,
        steps: [
          {
            stepNumber: 1,
            title: 'Breath Preparation',
            subtitle: 'Deep breathing',
            durationSeconds: 180,
            instructionTitle: 'Inhale',
            instructionDetail: 'Breathe in slowly through your nose and fill your lungs and slowly release the air from your lungs.',
            videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
            poseImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
          },
          {
            stepNumber: 2,
            title: 'Cat Cow',
            subtitle: 'Spinal warm up',
            durationSeconds: 120,
            instructionTitle: 'Arch & Curve',
            instructionDetail: 'Inhale to drop your belly and lift your gaze. Exhale to round your spine toward the ceiling.',
            videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4',
            poseImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
          },
          {
            stepNumber: 3,
            title: 'Boat Pose (Navasana)',
            subtitle: 'Core isometric hold',
            durationSeconds: 150,
            instructionTitle: 'Engage Abdominals',
            instructionDetail: 'Balance on your sit bones, lift your chest and extend your legs to 45 degrees.',
            videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
            poseImageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop'
          },
          {
            stepNumber: 4,
            title: 'Forearm Plank',
            subtitle: 'Full body core stabilizer',
            durationSeconds: 120,
            instructionTitle: 'Keep Spine Neutral',
            instructionDetail: 'Press forearms into the mat, squeeze glutes, and draw navel toward your spine.',
            videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4',
            poseImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=800&auto=format&fit=crop'
          },
          {
            stepNumber: 5,
            title: 'Cool Down & Savasana',
            subtitle: 'Restorative relaxation',
            durationSeconds: 180,
            instructionTitle: 'Release Tension',
            instructionDetail: 'Lie flat on your back, close your eyes, and let your breath return to normal.',
            videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
            poseImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop'
          }
        ]
      };
    }),
    order: 1
  },
  {
    title: 'Better Posture',
    subtitle: 'Align your spine, open chest, and relieve desk strain.',
    goalCategory: 'Mobility',
    totalDays: 21,
    difficultyLevel: 'All Levels',
    enrolledCount: '12.1K+',
    heroImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    tags: ['Upper Back', 'Shoulders', 'Spinal Alignment'],
    freeDaysCount: 2,
    improvements: [
      { name: 'Spinal Mobility', icon: 'grid' },
      { name: 'Shoulder Openers', icon: 'heart' }
    ],
    dailySchedules: Array.from({ length: 21 }, (_, idx) => ({
      dayNumber: idx + 1,
      title: `Posture Alignment Day ${idx + 1}`,
      focusTitle: 'Shoulder & Chest Expansion',
      focusDescription: 'Open your chest muscles and strengthen upper back postural muscles.',
      durationMinutes: 15,
      estimatedCalories: 95,
      difficultyTag: 'All Levels',
      isFree: idx + 1 <= 2,
      steps: [
        {
          stepNumber: 1,
          title: 'Seated Spinal Twist',
          subtitle: 'Gentle spinal warm-up',
          durationSeconds: 180,
          instructionTitle: 'Inhale & Lengthen',
          instructionDetail: 'Inhale to sit tall, exhale to gently twist toward your right shoulder.',
          videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
          poseImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
        }
      ]
    })),
    order: 2
  },
  {
    title: 'Back Mobility',
    subtitle: 'Restore healthy spinal curvature and release lower back tightness.',
    goalCategory: 'Mobility',
    totalDays: 14,
    difficultyLevel: 'All Levels',
    enrolledCount: '6.4K+',
    heroImageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop',
    tags: ['Lower Back', 'Hip Flexors', 'Flexibility'],
    freeDaysCount: 2,
    improvements: [
      { name: 'Lower Back Release', icon: 'zap' }
    ],
    dailySchedules: Array.from({ length: 14 }, (_, idx) => ({
      dayNumber: idx + 1,
      title: `Back Decompression Day ${idx + 1}`,
      focusTitle: 'Lumbar Decompression',
      focusDescription: 'Decompress lumbar vertebrae and stretch tight hamstrings.',
      durationMinutes: 14,
      estimatedCalories: 85,
      difficultyTag: 'Gentle',
      isFree: idx + 1 <= 2,
      steps: [
        {
          stepNumber: 1,
          title: 'Child Pose (Balasana)',
          subtitle: 'Restorative decompression',
          durationSeconds: 180,
          instructionTitle: 'Rest Hips on Heels',
          instructionDetail: 'Extend arms forward on the mat and sink hips back onto your heels.',
          videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4',
          poseImageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop'
        }
      ]
    })),
    order: 3
  }
];

const getTodayDateStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MOCK_DAILY_SCHEDULES = [
  {
    title: 'Morning Mindful Breath',
    category: 'Breathing',
    scheduledDate: getTodayDateStr(),
    scheduledTime: '07:15 AM',
    durationMinutes: 10,
    status: 'Pending',
    icon: 'sun',
    bgImageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    order: 1
  },
  {
    title: 'Core Yoga Flow',
    category: 'Yoga',
    scheduledDate: getTodayDateStr(),
    scheduledTime: '05:00 PM',
    durationMinutes: 20,
    status: 'Pending',
    icon: 'yoga',
    bgImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    order: 2
  },
  {
    title: 'Sleep Journey Practice',
    category: 'Sleep',
    scheduledDate: getTodayDateStr(),
    scheduledTime: '10:00 PM',
    durationMinutes: 15,
    status: 'Pending',
    icon: 'moon',
    bgImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    order: 3
  }
];

const MOCK_EXERCISES = [
  {
    title: 'Balasana',
    subtitle: 'Restorative Decompression • Spine Extension',
    badgeTag: 'REST',
    category: 'Exercises',
    durationMinutes: 10,
    heroImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop',
    demoVideoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70860-536417743_large.mp4',
    bgImageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    whatIs: 'Balasana (Child Pose) is a gentle, restorative yoga posture that lengthens the spine and calms the central nervous system.',
    benefits: 'Gently stretches hips, thighs, and ankles. Relieves lower back strain while promoting deep mental relaxation.',
    correctPosture: 'Kneel on the mat, bring big toes together, sit on heels, and fold torso forward extending arms out long.',
    instructions: 'General instructions and alignment guidelines before beginning your movement flow.',
    howToDo: 'Rest forehead on mat, extend arms forward, and breathe deeply into lower back for 5-10 minutes.',
    whatItDoesntGuarantee: 'Provides immediate tension relief but is not a permanent substitute for professional orthopedic care.',
    contraindications: 'Avoid or use support if suffering from severe knee joint injury, ankle sprain, or late-stage pregnancy.',
    originHistory: 'Originated from traditional Hatha Yoga. Bala in Sanskrit means Child and Asana means Posture.',
    order: 1,
    isActive: true
  },
  {
    title: 'Padmasana',
    subtitle: 'Meditative Stability • Hip Opening',
    badgeTag: 'MEDITATION',
    category: 'Exercises',
    durationMinutes: 15,
    heroImageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
    demoVideoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425176161_large.mp4',
    bgImageUrl: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?q=80&w=1200&auto=format&fit=crop',
    frameDesignUrl: 'https://res.cloudinary.com/demo/image/upload/v1689000000/mandala_ring_frame.png',
    bgMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    whatIs: 'Padmasana (Lotus Pose) is the classic cross-legged posture designed for deep pranayama and meditation.',
    benefits: 'Opens hips, improves posture, keeps spine erect, and stabilizes the autonomic nervous system.',
    correctPosture: 'Sit on mat, place right foot on left thigh and left foot on right thigh. Chin parallel to ground.',
    instructions: 'Prepare hips with warm-up stretches before holding full lotus pose.',
    howToDo: 'Cross legs gently, rest hands on knees in Jnana Mudra, close eyes and focus on breath.',
    whatItDoesntGuarantee: 'Requires flexibility; do not force knees into position if tight.',
    contraindications: 'Avoid if suffering from severe knee or ankle injury.',
    originHistory: 'One of the oldest seated postures recorded in ancient Vedic and Upanishadic literature.',
    order: 2,
    isActive: true
  }
];

const MOCK_TICKETS = [
  {
    ticketNumber: '#TK-1001',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.sharma@example.com',
    subject: 'Unable to stream ambient music during Kapalbhati practice',
    category: 'TECHNICAL_ISSUE',
    priority: 'HIGH',
    status: 'OPEN',
    messages: [
      {
        sender: 'CUSTOMER',
        senderName: 'Ananya Sharma',
        text: 'Hi Support, whenever I tap start on Kapalbhati practice, the background music buffers for 30 seconds. Could you please check?'
      }
    ]
  },
  {
    ticketNumber: '#TK-1002',
    customerName: 'Rohan Verma',
    customerEmail: 'rohan.verma@example.com',
    subject: 'Subscription invoice request for Annual Premium Plan',
    category: 'SUBSCRIPTION_BILLING',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    messages: [
      {
        sender: 'CUSTOMER',
        senderName: 'Rohan Verma',
        text: 'Hello team, I need a tax invoice PDF for my $149 subscription payment from yesterday.'
      },
      {
        sender: 'ADMIN',
        senderName: 'AURA Support Team',
        text: 'Hi Rohan! We have sent your tax invoice PDF to rohan.verma@example.com.'
      }
    ]
  }
];

module.exports = {
  MOCK_USERS,
  MOCK_ASANAS,
  MOCK_BREATHING_TECHNIQUES,
  MOCK_RECOMMENDATIONS_RULES,
  MOCK_LIVE_CLASSES,
  MOCK_SMARTWATCH_STATS,
  MOCK_COUPONS,
  MOCK_FEELINGS,
  MOCK_FOCUS_AREAS,
  MOCK_DURATIONS,
  MOCK_SESSION_CONFIGS,
  MOCK_QUICK_PRACTICES,
  MOCK_YOGA_PROGRAMS,
  MOCK_DAILY_SCHEDULES,
  MOCK_EXERCISES,
  MOCK_TICKETS
};






