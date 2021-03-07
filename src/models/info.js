export default {
  achievements: [
    'foolmoon',
    'firststream',
    'firsttournament'
  ],
  cheats: {
    bot: {
      id: 'bot',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 1 + level,
    },
    macro: {
      id: 'macro',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 2 + level,
    },
    pause: {
      id: 'pause',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 2 + level,
    },
  },
  genes: {
    experience: {
      id: 'experience'
    },
  },
  judgementWindows: {
    0: [16, 64, 97, 127, 151, 188],
    1: [16, 61, 94, 124, 148, 185],
    2: [16, 58, 91, 121, 145, 182],
    3: [16, 55, 88, 118, 142, 179],
    4: [16, 52, 85, 115, 139, 176],
    5: [16, 49, 82, 112, 136, 173],
    6: [16, 46, 79, 109, 133, 170],
    7: [16, 43, 76, 106, 130, 167],
    8: [16, 40, 73, 103, 127, 164],
    9: [16, 37, 70, 100, 124, 161],
    10: [16, 34, 67, 97, 121, 158],
  },
  setup: {
    pc: [
      {
        id: 'magalhaes',
        effect: 50,
        cost: 1,
      },
      {
        id: 'laptop',
        effect: 100,
        cost: 1,
      },
      {
        id: 'desktop',
        effect: 200,
        cost: 1,
      },
      {
        id: 'gamer',
        effect: 400,
        cost: 1,
      },
    ],
    keyboard: [
      {
        id: 'membrane',
        effect: 2,
        cost: 1,
      },
      {
        id: 'hybrid',
        effect: 4,
        cost: 1,
      },
      {
        id: 'mechanical',
        effect: 8,
        cost: 1,
      },
      {
        id: 'rgb',
        effect: 16,
        cost: 1,
      },
    ],
    monitor: [
      {
        id: '60',
        effect: 2,
        cost: 1,
      },
      {
        id: '100',
        effect: 4,
        cost: 1,
      },
      {
        id: '144',
        effect: 8,
        cost: 1,
      },
      {
        id: '240',
        effect: 16,
        cost: 1,
      },
    ],
    chair: [
      {
        id: 'plastic',
        effect: 2,
        cost: 1,
      },
      {
        id: 'wood',
        effect: 4,
        cost: 1,
      },
      {
        id: 'office',
        effect: 8,
        cost: 1,
      },
      {
        id: 'gamer',
        effect: 16,
        cost: 1,
      },
    ],
    headset: [
      {
        id: 'speakers',
        effect: 2,
        cost: 1,
      },
      {
        id: 'earphones',
        effect: 4,
        cost: 1,
      },
      {
        id: 'headphones',
        effect: 8,
        cost: 1,
      },
      {
        id: 'airpods',
        effect: 16,
        cost: 1,
      },
    ],
  },
  skills: {
    reading: {
      id: 'reading',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 1 + level,
    },
    accuracy: {
      id: 'accuracy',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 2 + level,
    },
    focus: {
      id: 'focus',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 3 + level,
    },
    technique: {
      id: 'technique',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 4 + level,
    },
    jacks: {
      id: 'jacks',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 5 + level,
    },
    trilling: {
      id: 'trilling',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 6 + level,
    },
  },
  skins: {
    arrows: {
      1: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/arrows/note-center.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/arrows/receptor-center-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/arrows/receptor-center.png'),
        ]
      },
      2: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/arrows/note-left-red.png'),
          require('@/assets/skins/arrows/note-right-red.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/arrows/receptor-left-pressed.png'),
          require('@/assets/skins/arrows/receptor-right-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/arrows/receptor-left.png'),
          require('@/assets/skins/arrows/receptor-right.png'),
        ]
      },
      3: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/arrows/note-left-red.png'),
          require('@/assets/skins/arrows/note-center.png'),
          require('@/assets/skins/arrows/note-right-red.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/arrows/receptor-left-pressed.png'),
          require('@/assets/skins/arrows/receptor-center-pressed.png'),
          require('@/assets/skins/arrows/receptor-right-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/arrows/receptor-left.png'),
          require('@/assets/skins/arrows/receptor-center.png'),
          require('@/assets/skins/arrows/receptor-right.png'),
        ]
      },
      4: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/arrows/note-left-red.png'),
          require('@/assets/skins/arrows/note-down-blue.png'),
          require('@/assets/skins/arrows/note-up-blue.png'),
          require('@/assets/skins/arrows/note-right-red.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/arrows/receptor-left-pressed.png'),
          require('@/assets/skins/arrows/receptor-down-pressed.png'),
          require('@/assets/skins/arrows/receptor-up-pressed.png'),
          require('@/assets/skins/arrows/receptor-right-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/arrows/receptor-left.png'),
          require('@/assets/skins/arrows/receptor-down.png'),
          require('@/assets/skins/arrows/receptor-up.png'),
          require('@/assets/skins/arrows/receptor-right.png'),
        ]
      },
      5: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/arrows/note-left-red.png'),
          require('@/assets/skins/arrows/note-down-blue.png'),
          require('@/assets/skins/arrows/note-center.png'),
          require('@/assets/skins/arrows/note-up-blue.png'),
          require('@/assets/skins/arrows/note-right-red.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/arrows/receptor-left-pressed.png'),
          require('@/assets/skins/arrows/receptor-upleft-pressed.png'),
          require('@/assets/skins/arrows/receptor-center-pressed.png'),
          require('@/assets/skins/arrows/receptor-upright-pressed.png'),
          require('@/assets/skins/arrows/receptor-right-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/arrows/receptor-left.png'),
          require('@/assets/skins/arrows/receptor-upleft.png'),
          require('@/assets/skins/arrows/receptor-center.png'),
          require('@/assets/skins/arrows/receptor-upright.png'),
          require('@/assets/skins/arrows/receptor-right.png'),
        ]
      },
      6: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/arrows/note-left-blue.png'),
          require('@/assets/skins/arrows/note-upleft-red.png'),
          require('@/assets/skins/arrows/note-down-blue.png'),
          require('@/assets/skins/arrows/note-up-blue.png'),
          require('@/assets/skins/arrows/note-upright-red.png'),
          require('@/assets/skins/arrows/note-right-blue.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/arrows/receptor-left-pressed.png'),
          require('@/assets/skins/arrows/receptor-upleft-pressed.png'),
          require('@/assets/skins/arrows/receptor-down-pressed.png'),
          require('@/assets/skins/arrows/receptor-up-pressed.png'),
          require('@/assets/skins/arrows/receptor-upright-pressed.png'),
          require('@/assets/skins/arrows/receptor-right-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/arrows/receptor-left.png'),
          require('@/assets/skins/arrows/receptor-upleft.png'),
          require('@/assets/skins/arrows/receptor-down.png'),
          require('@/assets/skins/arrows/receptor-up.png'),
          require('@/assets/skins/arrows/receptor-upright.png'),
          require('@/assets/skins/arrows/receptor-right.png'),
        ]
      },
      7: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/arrows/note-left-blue.png'),
          require('@/assets/skins/arrows/note-upleft-red.png'),
          require('@/assets/skins/arrows/note-down-blue.png'),
          require('@/assets/skins/arrows/note-center.png'),
          require('@/assets/skins/arrows/note-up-blue.png'),
          require('@/assets/skins/arrows/note-upright-red.png'),
          require('@/assets/skins/arrows/note-right-blue.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/arrows/receptor-left-pressed.png'),
          require('@/assets/skins/arrows/receptor-upleft-pressed.png'),
          require('@/assets/skins/arrows/receptor-down-pressed.png'),
          require('@/assets/skins/arrows/receptor-center-pressed.png'),
          require('@/assets/skins/arrows/receptor-up-pressed.png'),
          require('@/assets/skins/arrows/receptor-upright-pressed.png'),
          require('@/assets/skins/arrows/receptor-right-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/arrows/receptor-left.png'),
          require('@/assets/skins/arrows/receptor-upleft.png'),
          require('@/assets/skins/arrows/receptor-down.png'),
          require('@/assets/skins/arrows/receptor-center.png'),
          require('@/assets/skins/arrows/receptor-up.png'),
          require('@/assets/skins/arrows/receptor-upright.png'),
          require('@/assets/skins/arrows/receptor-right.png'),
        ]
      },
      comboImages: [
        require('@/assets/skins/0.png'),
        require('@/assets/skins/1.png'),
        require('@/assets/skins/2.png'),
        require('@/assets/skins/3.png'),
        require('@/assets/skins/4.png'),
        require('@/assets/skins/5.png'),
        require('@/assets/skins/6.png'),
        require('@/assets/skins/7.png'),
        require('@/assets/skins/8.png'),
        require('@/assets/skins/9.png'),
      ],
      effectImages: [
        require('@/assets/skins/blank.png'),
      ],
      hintImage: require('@/assets/skins/blank.png'),
      judgementImages: [
        require('@/assets/skins/arrows/judgement-rainbow.png'),
        require('@/assets/skins/arrows/judgement-300.png'),
        require('@/assets/skins/arrows/judgement-200.png'),
        require('@/assets/skins/arrows/judgement-100.png'),
        require('@/assets/skins/arrows/judgement-50.png'),
        require('@/assets/skins/arrows/judgement-miss.png'),
      ],
    },
    bars: {
      1: {
        lightingImages: [
          require('@/assets/skins/bars/lighting-yellow.png'),
        ],
        noteImages: [
          require('@/assets/skins/bars/note-yellow.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/bars/receptor-white-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/bars/receptor-white.png'),
        ],
      },
      2: {
        lightingImages: [
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-red.png'),
        ],
        noteImages: [
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-black.png'),
        ],
      },
      3: {
        lightingImages: [
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-yellow.png'),
          require('@/assets/skins/bars/lighting-red.png'),
        ],
        noteImages: [
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-yellow.png'),
          require('@/assets/skins/bars/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-white-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-white.png'),
          require('@/assets/skins/bars/receptor-black.png'),
        ],
      },
      4: {
        lightingImages: [
          require('@/assets/skins/bars/lighting-blue.png'),
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-blue.png'),
        ],
        noteImages: [
          require('@/assets/skins/bars/note-blue.png'),
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-blue.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/bars/receptor-white-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-white-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/bars/receptor-white.png'),
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-white.png'),
        ],
      },
      5: {
        lightingImages: [
          require('@/assets/skins/bars/lighting-blue.png'),
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-yellow.png'),
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-blue.png'),
        ],
        noteImages: [
          require('@/assets/skins/bars/note-blue.png'),
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-yellow.png'),
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-blue.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/bars/receptor-white-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-white-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-white-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/bars/receptor-white.png'),
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-white.png'),
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-white.png'),
        ],
      },
      6: {
        lightingImages: [
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-blue.png'),
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-blue.png'),
          require('@/assets/skins/bars/lighting-red.png'),
        ],
        noteImages: [
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-blue.png'),
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-blue.png'),
          require('@/assets/skins/bars/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-white-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-white-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-white.png'),
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-white.png'),
          require('@/assets/skins/bars/receptor-black.png'),
        ],
      },
      7: {
        lightingImages: [
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-blue.png'),
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-yellow.png'),
          require('@/assets/skins/bars/lighting-red.png'),
          require('@/assets/skins/bars/lighting-blue.png'),
          require('@/assets/skins/bars/lighting-red.png'),
        ],
        noteImages: [
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-blue.png'),
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-yellow.png'),
          require('@/assets/skins/bars/note-white.png'),
          require('@/assets/skins/bars/note-blue.png'),
          require('@/assets/skins/bars/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-white-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-white-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
          require('@/assets/skins/bars/receptor-white-pressed.png'),
          require('@/assets/skins/bars/receptor-black-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-white.png'),
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-white.png'),
          require('@/assets/skins/bars/receptor-black.png'),
          require('@/assets/skins/bars/receptor-white.png'),
          require('@/assets/skins/bars/receptor-black.png'),
        ],
      },
      comboImages: [
        require('@/assets/skins/0.png'),
        require('@/assets/skins/1.png'),
        require('@/assets/skins/2.png'),
        require('@/assets/skins/3.png'),
        require('@/assets/skins/4.png'),
        require('@/assets/skins/5.png'),
        require('@/assets/skins/6.png'),
        require('@/assets/skins/7.png'),
        require('@/assets/skins/8.png'),
        require('@/assets/skins/9.png'),
      ],
      effectImages: [
        require('@/assets/skins/bars/effect-0.png'),
        require('@/assets/skins/bars/effect-1.png'),
        require('@/assets/skins/bars/effect-2.png'),
        require('@/assets/skins/bars/effect-3.png'),
        require('@/assets/skins/bars/effect-4.png'),
        require('@/assets/skins/bars/effect-5.png'),
        require('@/assets/skins/bars/effect-6.png'),
        require('@/assets/skins/bars/effect-7.png'),
        require('@/assets/skins/bars/effect-8.png'),
      ],
      hintImage: require('@/assets/skins/bars/hint.png'),
      judgementImages: [
        require('@/assets/skins/judgement-rainbow.png'),
        require('@/assets/skins/judgement-300.png'),
        require('@/assets/skins/judgement-200.png'),
        require('@/assets/skins/judgement-100.png'),
        require('@/assets/skins/judgement-50.png'),
        require('@/assets/skins/judgement-miss.png'),
      ],
    },
    circles: {
      1: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/circles/note-yellow.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/circles/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/circles/receptor.png'),
        ],
      },
      2: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
        ],
      },
      3: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-yellow.png'),
          require('@/assets/skins/circles/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
        ],
      },
      4: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/circles/note-blue.png'),
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-blue.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
        ],
      },
      5: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/circles/note-blue.png'),
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-yellow.png'),
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-blue.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
        ],
      },
      6: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-blue.png'),
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-blue.png'),
          require('@/assets/skins/circles/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
        ],
      },
      7: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-blue.png'),
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-yellow.png'),
          require('@/assets/skins/circles/note-white.png'),
          require('@/assets/skins/circles/note-blue.png'),
          require('@/assets/skins/circles/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
          require('@/assets/skins/circles/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
          require('@/assets/skins/circles/receptor.png'),
        ],
      },
      comboImages: [
        require('@/assets/skins/0.png'),
        require('@/assets/skins/1.png'),
        require('@/assets/skins/2.png'),
        require('@/assets/skins/3.png'),
        require('@/assets/skins/4.png'),
        require('@/assets/skins/5.png'),
        require('@/assets/skins/6.png'),
        require('@/assets/skins/7.png'),
        require('@/assets/skins/8.png'),
        require('@/assets/skins/9.png'),
      ],
      effectImages: [
        require('@/assets/skins/blank.png'),
      ],
      hintImage: require('@/assets/skins/blank.png'),
      judgementImages: [
        require('@/assets/skins/judgement-rainbow.png'),
        require('@/assets/skins/judgement-300.png'),
        require('@/assets/skins/judgement-200.png'),
        require('@/assets/skins/judgement-100.png'),
        require('@/assets/skins/judgement-50.png'),
        require('@/assets/skins/judgement-miss.png'),
      ],
    },
    diamonds: {
      1: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/diamonds/note-yellow.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/diamonds/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/diamonds/receptor.png'),
        ],
      },
      2: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
        ],
      },
      3: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-yellow.png'),
          require('@/assets/skins/diamonds/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
        ],
      },
      4: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/diamonds/note-blue.png'),
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-blue.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
        ],
      },
      5: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/diamonds/note-blue.png'),
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-yellow.png'),
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-blue.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
        ],
      },
      6: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-blue.png'),
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-blue.png'),
          require('@/assets/skins/diamonds/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
        ],
      },
      7: {
        lightingImages: [
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
          require('@/assets/skins/blank.png'),
        ],
        noteImages: [
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-blue.png'),
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-yellow.png'),
          require('@/assets/skins/diamonds/note-white.png'),
          require('@/assets/skins/diamonds/note-blue.png'),
          require('@/assets/skins/diamonds/note-white.png'),
        ],
        pressedReceptorImages: [
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
          require('@/assets/skins/diamonds/receptor-pressed.png'),
        ],
        receptorImages: [
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
          require('@/assets/skins/diamonds/receptor.png'),
        ],
      },
      comboImages: [
        require('@/assets/skins/0.png'),
        require('@/assets/skins/1.png'),
        require('@/assets/skins/2.png'),
        require('@/assets/skins/3.png'),
        require('@/assets/skins/4.png'),
        require('@/assets/skins/5.png'),
        require('@/assets/skins/6.png'),
        require('@/assets/skins/7.png'),
        require('@/assets/skins/8.png'),
        require('@/assets/skins/9.png'),
      ],
      effectImages: [
        require('@/assets/skins/blank.png'),
      ],
      hintImage: require('@/assets/skins/blank.png'),
      judgementImages: [
        require('@/assets/skins/judgement-rainbow.png'),
        require('@/assets/skins/judgement-300.png'),
        require('@/assets/skins/judgement-200.png'),
        require('@/assets/skins/judgement-100.png'),
        require('@/assets/skins/judgement-50.png'),
        require('@/assets/skins/judgement-miss.png'),
      ],
    },
  },
  upgrades: {
    1: {
      id: '1',
      cost: 1,
      effect: 1
    },
    2: {
      id: '2',
      cost: 1,
      effect: 1
    },
    3: {
      id: '3',
      cost: 1,
      effect: 1
    },
  },
}