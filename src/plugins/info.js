export default {
  skills: [
    {
      id: 'reading',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 1 + level,
    },
    {
      id: 'accuracy',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 2 + level,
    },
    {
      id: 'focus',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 3 + level,
    },
    {
      id: 'technique',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 4 + level,
    },
    {
      id: 'jacks',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 5 + level,
    },
    {
      id: 'trilling',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 6 + level,
    },
  ],
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
      }
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
      }
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
      }
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
      }
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
      }
    ],
  },
  upgrades: [
    {
      id: '1',
      cost: 1,
      effect: 1
    },
    {
      id: '2',
      cost: 1,
      effect: 1
    },
    {
      id: '3',
      cost: 1,
      effect: 1
    }
  ],
  cheats: [
    {
      id: 'bot',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 1 + level,
    },
    {
      id: 'macro',
      ppRequirement: 0,
      effectFunction: (level) => 1 + level,
      costFunction: (level) => 2 + level,
    }
  ],
  achievements: [
    'foolmoon',
    'firststream',
    'firsttournament'
  ],
  genes: [
    {
      id: 'experience'
    }
  ]
}