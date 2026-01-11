import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Center, Edges } from '@react-three/drei'
import { useState, useRef, Suspense, useEffect, useCallback, useMemo } from 'react'
import * as THREE from 'three'

type ModuleId = 'history' | 'satoshi' | 'crypto' | 'trading' | 'risk'

interface Concept {
  term: string
  definition: string
}

interface Timeline {
  year: string
  event: string
}

interface ModuleInfo {
  id: ModuleId
  title: string
  subtitle: string
  color: string
  accent: string
  icon: string
  description: string
  stats: { label: string; value: string }[]
  lesson: {
    title: string
    content: string[]
  }
  concepts: Concept[]
  timeline: Timeline[]
  quiz: { question: string; options: string[]; correct: number }
}

const MODULES: ModuleInfo[] = [
  { 
    id: 'history',
    title: 'L\'Origine de la Valeur', 
    subtitle: 'Histoire de la Monnaie', 
    color: '#FEF08A', // Comic Yellow
    accent: '#FDBA74',
    icon: '🪙',
    description: 'Du troc aux banques centrales : découvrez comment l\'humanité a cherché à stabiliser la confiance à travers l\'or et le papier.',
    stats: [{ label: 'Étalon Or', value: '1871-1914' }, { label: 'Fiat Era', value: 'Post-1971' }, { label: 'Inflation', value: '~3%/an' }],
    lesson: {
      title: "De l'Or au Papier",
      content: [
        "Le troc limitait les échanges. Si vous aviez du blé mais vouliez du poisson, il fallait trouver la bonne personne.",
        "L'or est devenu la monnaie ultime : Rare, Durable, Divisible, Transportable, Fongible.",
        "1944 : Bretton Woods établit le dollar comme monnaie mondiale, convertible en or.",
        "1971 : Nixon met fin à la convertibilité or. La monnaie devient pure confiance (Fiat).",
        "Depuis 1971, le dollar a perdu >85% de sa valeur. L'impression monétaire dilue votre épargne.",
        "La rareté est la clé. Bitcoin réintroduit la rareté numérique absolue."
      ]
    },
    concepts: [
      { term: 'Monnaie Fiat', definition: 'Monnaie basée sur la confiance en l\'État, sans valeur intrinsèque.' },
      { term: 'Inflation', definition: 'Perte de pouvoir d\'achat de la monnaie au fil du temps.' },
      { term: 'Étalon Or', definition: 'Système où la monnaie est adossée à une réserve d\'or physique.' },
      { term: 'Quantitative Easing', definition: 'La "planche à billets" moderne des banques centrales.' }
    ],
    timeline: [
      { year: '3000 BC', event: 'Premières pièces en Mésopotamie' },
      { year: '1944', event: 'Accords de Bretton Woods' },
      { year: '1971', event: 'Fin de l\'étalon or (Nixon Shock)' },
      { year: '2008', event: 'Crise des Subprimes' },
      { year: '2020', event: 'Impression monétaire record (COVID)' }
    ],
    quiz: { question: 'En quelle année la convertibilité or du dollar a-t-elle pris fin ?', options: ['1944', '1971', '2000', '1929'], correct: 1 }
  },
  { 
    id: 'satoshi',
    title: 'La Genèse Crypto', 
    subtitle: 'La Vision de Satoshi', 
    color: '#FDBA74', // Comic Orange
    accent: '#F9A8D4',
    icon: '₿',
    description: 'Bitcoin : la première monnaie numérique décentralisée, née de la crise de 2008. Une réponse technologique à la confiance brisée.',
    stats: [{ label: 'Bloc Genèse', value: '3 Jan 2009' }, { label: 'Supply Max', value: '21M BTC' }, { label: 'Halving', value: '4 Ans' }],
    lesson: {
      title: "L'Énigme Bitcoin",
      content: [
        "31 Oct 2008 : Satoshi Nakamoto publie le whitepaper Bitcoin. Une révolution en 9 pages.",
        "Le problème résolu : La 'Double Dépense' sans autorité centrale.",
        "La solution : La Blockchain. Un registre public infalsifiable partagé par tous.",
        "Proof of Work : L'énergie dépensée par les mineurs sécurise le réseau contre les attaques.",
        "Rareté absolue : 21 millions de BTC maximum. Jamais plus.",
        "Bitcoin est incensurable, ouvert 24/7, et n'appartient à personne."
      ]
    },
    concepts: [
      { term: 'Blockchain', definition: 'Registre public distribué et immuable des transactions.' },
      { term: 'Proof of Work', definition: 'Sécurisation du réseau par la dépense d\'énergie (minage).' },
      { term: 'Halving', definition: 'Division par 2 de l\'émission de BTC tous les 4 ans.' },
      { term: 'Décentralisation', definition: 'Absence de point de contrôle unique ou de chef.' }
    ],
    timeline: [
      { year: '2008', event: 'Publication du Whitepaper' },
      { year: '2009', event: 'Bloc Genesis miné' },
      { year: '2010', event: 'Pizza Day (10k BTC pour 2 pizzas)' },
      { year: '2017', event: 'Bitcoin atteint 20k$' },
      { year: '2024', event: 'Approbation des ETF Bitcoin Spot' }
    ],
    quiz: { question: 'Quelle est la limite maximale de Bitcoins qui existeront ?', options: ['100 Millions', '21 Millions', 'Illimité', '42 Millions'], correct: 1 }
  },
  { 
    id: 'crypto',
    title: 'L\'Écosystème Web3', 
    subtitle: 'DeFi & Smart Contracts', 
    color: '#67E8F9', // Comic Cyan
    accent: '#86EFAC',
    icon: '⛓️',
    description: 'Au-delà de la monnaie : la finance programmable. Découvrez Ethereum, les Smart Contracts et la différence CEX/DEX.',
    stats: [{ label: 'Réseaux', value: 'L1 & L2' }, { label: 'DeFi TVL', value: '$100B+' }, { label: 'Innovation', value: '∞' }],
    lesson: {
      title: "Le Monde des Smart Contracts",
      content: [
        "Ethereum a introduit les Smart Contracts : du code qui s'exécute automatiquement sur la blockchain.",
        "DApps (Applications Décentralisées) : Finance, Art, Jeux... sans intermédiaire.",
        "Wallet (Metamask, Ledger) : Votre clé d'accès au Web3. Vous êtes votre propre banque.",
        "Not your keys, not your coins : Si vous laissez vos cryptos sur un échange (CEX), elles ne vous appartiennent pas vraiment.",
        "DeFi (Finance Décentralisée) : Prêtez, empruntez, échangez sans banquier."
      ]
    },
    concepts: [
      { term: 'Smart Contract', definition: 'Code auto-exécutable sur la blockchain.' },
      { term: 'Wallet', definition: 'Outil de gestion de vos clés privées et adresses publiques.' },
      { term: 'DEX', definition: 'Échange Décentralisé (ex: Uniswap) sans intermédiaire.' },
      { term: 'Gas', definition: 'Frais payés au réseau pour exécuter une transaction.' }
    ],
    timeline: [
      { year: '2015', event: 'Lancement d\'Ethereum' },
      { year: '2017', event: 'Explosion des ICOs' },
      { year: '2020', event: 'DeFi Summer' },
      { year: '2021', event: 'Folie des NFTs' },
      { year: '2022', event: 'The Merge (Passage au PoS)' }
    ],
    quiz: { question: 'Qui détient vos cryptos sur un Ledger ?', options: ['La société Ledger', 'La Banque', 'Vous (via vos clés)', 'La Blockchain'], correct: 2 }
  },
  { 
    id: 'trading',
    title: 'Trading Masterclass', 
    subtitle: 'Analyse Technique', 
    color: '#86EFAC', // Comic Green
    accent: '#FEF08A',
    icon: '📊',
    description: 'Lisez les marchés comme un pro. Chandeliers, structures de marché et psychologie des foules.',
    stats: [{ label: 'Style', value: 'Price Action' }, { label: 'Outils', value: 'RSI, Vol' }, { label: 'Mental', value: 'Acier' }],
    lesson: {
      title: "L'Art du Trading",
      content: [
        "Le prix ne bouge pas au hasard. Il suit la liquidité et la psychologie des foules.",
        "Chandeliers Japonais : Chaque bougie raconte une bataille entre acheteurs et vendeurs.",
        "Support & Résistance : Les niveaux où le prix a rebondi par le passé.",
        "La Tendance est votre amie. Ne tradez pas contre le courant dominant.",
        "Volume : Le carburant du mouvement. Un mouvement sans volume est suspect."
      ]
    },
    concepts: [
      { term: 'Candlestick', definition: 'Représentation graphique des prix (Open, High, Low, Close).' },
      { term: 'Support', definition: 'Zone de prix où les acheteurs sont historiquement présents.' },
      { term: 'Resistance', definition: 'Plafond de prix où les vendeurs dominent.' },
      { term: 'Liquidity', definition: 'Facilité à acheter/vendre sans impacter le prix.' }
    ],
    timeline: [
      { year: '1700s', event: 'Chandeliers Japonais (Riz)' },
      { year: '1900s', event: 'Théorie de Dow' },
      { year: '1980s', event: 'Trading Informatisé' },
      { year: '2009', event: 'Trading Crypto 24/7' },
      { year: 'Futur', event: 'Trading Algorithmique AI' }
    ],
    quiz: { question: 'Que signifie une longue mèche haute sur une bougie ?', options: ['Forte pression acheteuse', 'Rejet du prix (Vendeurs)', 'Indécision', 'Rien'], correct: 1 }
  },
  { 
    id: 'risk',
    title: 'Gestion du Risque', 
    subtitle: 'Survivre & Prospérer', 
    color: '#F9A8D4', // Comic Pink
    accent: '#E9D5FF',
    icon: '🛡️',
    description: 'Le secret n\'est pas de gagner tout le temps, mais de ne pas tout perdre quand on a tort.',
    stats: [{ label: 'Risque Max', value: '1-2%' }, { label: 'R:R Min', value: '1:2' }, { label: 'Stop Loss', value: 'Toujours' }],
    lesson: {
      title: "Règles de Survie",
      content: [
        "Règle N°1 : Protéger son capital. Sans capital, pas de jeu.",
        "Ne risquez jamais plus de 1% à 2% de votre compte sur un seul trade.",
        "Stop Loss : Votre ceinture de sécurité. Obligatoire.",
        "Risk/Reward : Cherchez des trades où vous pouvez gagner 2x ou 3x votre risque.",
        "FOMO (Fear Of Missing Out) : L'ennemi du trader. N'achetez pas parce que ça monte.",
        "La patience paie plus que l'action."
      ]
    },
    concepts: [
      { term: 'Stop Loss', definition: 'Ordre de vente automatique pour limiter la perte.' },
      { term: 'Risk/Reward', definition: 'Ratio entre le gain potentiel et la perte potentielle.' },
      { term: 'Position Size', definition: 'Combien investir pour respecter son risque max.' },
      { term: 'FOMO', definition: 'Peur de rater une opportunité (cause de pertes).' }
    ],
    timeline: [
      { year: 'Phase 1', event: 'Apprentissage (Pertes)' },
      { year: 'Phase 2', event: 'Breakeven (Stagnation)' },
      { year: 'Phase 3', event: 'Consistance (Gains)' },
      { year: 'Phase 4', event: 'Maîtrise (Liberté)' }
    ],
    quiz: { question: 'Si vous risquez 100$ pour en gagner 300$, quel est votre R:R ?', options: ['1:1', '1:2', '1:3', '3:1'], correct: 2 }
  }
]

// --- Comic 3D Scene ---

interface ComicShapeProps {
  position: [number, number, number]
  color: string
  rotationSpeed: number
  scale: number
  type: 'box' | 'oct' | 'ico' | 'torus' | 'cone'
}

function ComicShape({ position, color, rotationSpeed, scale, type }: ComicShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed
      meshRef.current.rotation.y += delta * rotationSpeed
    }
  })

  const material = useMemo(() => new THREE.MeshToonMaterial({ color: color }), [color])

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef} scale={scale}>
          {type === 'box' && <boxGeometry args={[1, 1, 1]} />}
          {type === 'oct' && <octahedronGeometry args={[1, 0]} />}
          {type === 'ico' && <icosahedronGeometry args={[1, 0]} />}
          {type === 'torus' && <torusGeometry args={[0.6, 0.25, 16, 32]} />}
          {type === 'cone' && <coneGeometry args={[0.7, 1.2, 4]} />}
          <primitive object={material} attach="material" />
          <Edges
            scale={1.05}
            threshold={15}
            color="black"
          />
        </mesh>
      </Float>
    </group>
  )
}

function HeroObject({ module }: { module: ModuleInfo }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  const material = useMemo(() => new THREE.MeshToonMaterial({ color: module.color }), [module.color])

  return (
    <group position={[3, 0, 0]}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef} scale={2.5}>
          {module.id === 'history' && <cylinderGeometry args={[1, 1, 0.2, 32]} />}
          {module.id === 'satoshi' && <cylinderGeometry args={[1, 1, 0.2, 6]} />}
          {module.id === 'crypto' && <torusGeometry args={[0.8, 0.3, 16, 50]} />}
          {module.id === 'trading' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
          {module.id === 'risk' && <octahedronGeometry args={[1, 0]} />}
          <primitive object={material} attach="material" />
          <Edges scale={1.02} color="black" threshold={15} />
        </mesh>
        {/* Floating Particles */}
        <ComicShape position={[1, 1.5, 1]} color={module.accent} rotationSpeed={1} scale={0.4} type="box" />
        <ComicShape position={[-1, -1.5, 0.5]} color="#F3E5AB" rotationSpeed={-1} scale={0.3} type="oct" />
      </Float>
    </group>
  )
}

function ComicScene({ activeModule }: { activeModule: ModuleId }) {
  const currentModule = MODULES.find(m => m.id === activeModule) || MODULES[0]
  
  return (
    <>
      <color attach="background" args={['#1a1a1a']} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
      
      <Center>
        <group>
           {/* Background decorative shapes */}
           <ComicShape position={[-6, 2, -5]} color={currentModule.color} rotationSpeed={0.2} scale={2} type="ico" />
           <ComicShape position={[6, -2, -4]} color={currentModule.accent} rotationSpeed={0.3} scale={1.5} type="oct" />
           <ComicShape position={[-4, -3, -2]} color="#F3E5AB" rotationSpeed={0.1} scale={1} type="box" />
           <ComicShape position={[5, 3, -6]} color={currentModule.color} rotationSpeed={0.25} scale={1.2} type="ico" />
           
           {/* Hero Object representing the module */}
           <HeroObject module={currentModule} />
        </group>
      </Center>
      
      <Environment preset="city" />
    </>
  )
}

// --- UI Components ---

function ConceptCard({ concept, color, index }: { concept: Concept; color: string; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false)
  
  return (
    <div 
      className={`concept-card ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="concept-inner">
        <div className="concept-front borderlands-panel" style={{ backgroundColor: 'var(--comic-paper)' }}>
          <div className="concept-icon comic-tag" style={{ backgroundColor: color, color: '#000', transform: 'rotate(-5deg)' }}>?</div>
          <span className="concept-term comic-font" style={{ fontSize: '1.8rem', color: '#000', textShadow: `2px 2px 0 ${color}` }}>{concept.term}</span>
          <span className="concept-hint marker-font" style={{ color: '#666' }}>CLICK TO REVEAL</span>
        </div>
        <div className="concept-back borderlands-panel" style={{ backgroundColor: color }}>
          <div className="concept-back-header comic-font" style={{ color: '#000', fontSize: '1.4rem' }}>DEFINITION</div>
          <p style={{ fontFamily: '"Comic Neue", cursive', fontWeight: 'bold', color: '#000', fontSize: '1.1rem' }}>{concept.definition}</p>
        </div>
      </div>
    </div>
  )
}

function TimelineWidget({ timeline, color }: { timeline: Timeline[]; color: string }) {
  return (
    <div className="timeline-widget">
      {timeline.map((item, i) => (
        <div key={i} className="timeline-item" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="timeline-marker">
            <div className="timeline-dot" style={{ backgroundColor: color, border: '3px solid #000', width: 24, height: 24, boxShadow: '3px 3px 0 #000' }} />
            {i !== timeline.length - 1 && <div className="timeline-line" style={{ background: '#000', width: 4, left: 10 }} />}
          </div>
          <div className="timeline-content borderlands-panel" style={{ 
            padding: '20px', 
            transform: `rotate(${i % 2 === 0 ? 0.5 : -0.5}deg)`,
            marginBottom: '10px'
          }}>
            <span className="comic-font" style={{ 
              color: '#000', 
              fontSize: '1.4rem', 
              background: color, 
              padding: '4px 12px', 
              border: '3px solid #000', 
              display: 'inline-block',
              transform: 'skew(-5deg)',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
            }}>{item.year}</span>
            <span style={{ 
              color: '#000', 
              fontWeight: 'bold', 
              display: 'block', 
              marginTop: 10,
              fontFamily: '"Comic Neue", cursive',
              fontSize: '1.1rem'
            }}>{item.event}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function QuizWidget({ quiz, onAnswer }: { quiz: ModuleInfo['quiz']; onAnswer: (correct: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (index: number) => {
    if (revealed) return
    setSelected(index)
    setRevealed(true)
    onAnswer(index === quiz.correct)
  }

  const isCorrect = selected === quiz.correct

  return (
    <div className="quiz-widget borderlands-panel" style={{ padding: 25, transform: 'rotate(-1deg)' }}>
      <div className="quiz-header" style={{ marginBottom: 15, position: 'relative' }}>
        <span className="comic-tag" style={{ transform: 'rotate(2deg)', fontSize: '1.2rem', padding: '5px 15px' }}>
          QUIZ TIME!
        </span>
        
        {revealed && (
          <div className="pop-in-text" style={{ 
            position: 'absolute', 
            top: -20, 
            right: -10, 
            fontSize: '3rem', 
            color: isCorrect ? '#86EFAC' : '#F472B6', 
            fontFamily: '"Bangers", cursive',
            textShadow: '3px 3px 0 #000',
            zIndex: 20,
            transform: 'rotate(-10deg)',
            pointerEvents: 'none'
          }}>
            {isCorrect ? 'BOOM! CORRECT!' : 'OOPS! FAIL!'}
          </div>
        )}
      </div>
      <h4 className="comic-font" style={{ fontSize: '1.6rem', color: '#000', marginBottom: 20, lineHeight: 1.2 }}>{quiz.question}</h4>
      <div className="quiz-options">
        {quiz.options.map((option, i) => (
          <button
            key={i}
            className={`comic-btn`}
            onClick={() => handleSelect(i)}
            style={{ 
              width: '100%',
              textAlign: 'left',
              marginBottom: 12,
              backgroundColor: revealed && i === quiz.correct ? '#86EFAC' : (selected === i ? '#F9A8D4' : 'var(--comic-paper)'),
              transform: `skew(-2deg) ${selected === i ? 'scale(1.02)' : 'scale(1)'}`,
              opacity: revealed && i !== quiz.correct && selected !== i ? 0.6 : 1,
              fontSize: '1.1rem',
              padding: '12px 20px',
              border: revealed && i === quiz.correct ? '4px solid #000' : '3px solid #000'
            }}
          >
            <span style={{ marginRight: 15, fontWeight: '900' }}>{String.fromCharCode(65 + i)}.</span>
            <span style={{ fontWeight: 'bold', fontFamily: '"Comic Neue", cursive' }}>{option}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function LessonView({ lesson, color }: { lesson: ModuleInfo['lesson']; color: string }) {
  return (
    <div className="lesson-view">
      <div className="lesson-header" style={{ border: 'none', paddingBottom: 10 }}>
        <h4 className="comic-font" style={{ fontSize: '2.5rem', color: color, textShadow: '3px 3px 0 #000', WebkitTextStroke: '1.5px #000' }}>{lesson.title}</h4>
      </div>
      <div className="lesson-list">
        {lesson.content.map((paragraph, i) => (
          <div key={i} className="lesson-item-row">
            <div className="row-number" style={{ backgroundColor: color }}>{i + 1}</div>
            <p>{paragraph}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Section({ module, isActive, onQuizAnswer }: { module: ModuleInfo; isActive: boolean; onQuizAnswer: (id: ModuleId, correct: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<'lesson' | 'concepts' | 'timeline'>('lesson')
  
  return (
    <section 
      id={module.id} 
      className="exp-section"
      style={{ opacity: isActive ? 1 : 0.2, transition: 'all 0.5s', filter: isActive ? 'none' : 'grayscale(1) blur(2px)' }}
    >
      <div className="section-grid-v2">
        <div className="exp-widget main" style={{ borderColor: '#000' }}>
          <div className="module-header">
            <div className="header-icon-box borderlands-panel" style={{ backgroundColor: module.color, color: '#000', fontSize: '2.5rem' }}>
              {module.icon}
            </div>
            <div className="module-titles">
              <span className="module-id-label comic-font" style={{ color: '#000', fontSize: '1.2rem', background: module.accent, padding: '2px 8px', border: '2px solid #000', display: 'inline-block', width: 'fit-content', transform: 'rotate(-2deg)' }}>
                MODULE_0{MODULES.findIndex(m => m.id === module.id) + 1}
              </span>
              <h1 style={{ color: module.color }}>{module.title}</h1>
              <p className="module-desc">{module.description}</p>
            </div>
          </div>

          <div className="content-tabs">
            {(['lesson', 'concepts', 'timeline'] as const).map(tab => (
              <button 
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                style={activeTab === tab ? { backgroundColor: module.color } : {}}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {activeTab === 'lesson' && <LessonView lesson={module.lesson} color={module.color} />}
          
          {activeTab === 'concepts' && (
            <div className="concepts-grid">
              {module.concepts.map((concept, i) => (
                <ConceptCard key={i} concept={concept} color={module.color} index={i} />
              ))}
            </div>
          )}

          {activeTab === 'timeline' && <TimelineWidget timeline={module.timeline} color={module.color} />}
        </div>

        <div className="exp-widget side" style={{ height: 'fit-content', borderColor: '#000' }}>
          <div className="widget-inner">
            <div className="widget-header" style={{ marginBottom: 25 }}>
              <span className="comic-tag" style={{ backgroundColor: module.color, fontSize: '1.1rem', padding: '6px 12px' }}>MISSION STATS</span>
            </div>
            
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 25 }}>
              {module.stats.map((stat, i) => (
                <div key={i} className="stat-box borderlands-panel" style={{ padding: 12, backgroundColor: 'var(--comic-paper-warm)', color: '#000', transform: `rotate(${i % 2 === 0 ? 1 : -1}deg)` }}>
                  <div className="stat-label" style={{ fontSize: '0.9rem', fontWeight: 'bold', fontFamily: '"Comic Neue", cursive' }}>{stat.label}</div>
                  <div className="stat-value comic-font" style={{ fontSize: '1.3rem', color: '#000' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="quiz-section">
              <QuizWidget quiz={module.quiz} onAnswer={(correct) => onQuizAnswer(module.id, correct)} />
            </div>

            <div className="nav-controls" style={{ marginTop: 25, display: 'flex', gap: 15 }}>
              <button 
                className="comic-btn"
                style={{ flex: 1, backgroundColor: 'var(--comic-paper)', fontSize: '1.1rem' }}
                onClick={() => {
                  const prev = MODULES[MODULES.findIndex(m => m.id === module.id) - 1]
                  if (prev) document.getElementById(prev.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                disabled={module.id === MODULES[0].id}
              >
                PREV
              </button>
              <button 
                className="comic-btn"
                style={{ flex: 1, backgroundColor: module.color, fontSize: '1.1rem' }}
                onClick={() => {
                  const next = MODULES[MODULES.findIndex(m => m.id === module.id) + 1]
                  if (next) document.getElementById(next.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Academy() {
  const navigate = useNavigate()
  const [activeModule, setActiveModule] = useState<ModuleId>('history')
  const [quizScores, setQuizScores] = useState<Record<ModuleId, boolean | null>>({
    history: null, satoshi: null, crypto: null, trading: null, risk: null
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return
      const scrollPos = scrollRef.current.scrollTop
      const height = window.innerHeight
      const index = Math.round(scrollPos / height)
      if (MODULES[index]) {
        setActiveModule(MODULES[index].id)
      }
    }

    const currentScroll = scrollRef.current
    if (currentScroll) {
      currentScroll.addEventListener('scroll', handleScroll)
    }
    return () => currentScroll?.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleQuizAnswer = useCallback((moduleId: ModuleId, correct: boolean) => {
    setQuizScores(prev => ({ ...prev, [moduleId]: correct }))
  }, [])

  return (
    <div className="explore-v3 bd-mode">
      {/* 3D Environment Layer */}
      <div className="exp-3d-layer">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ComicScene activeModule={activeModule} />
          </Suspense>
        </Canvas>
      </div>

      {/* Comic Style Header */}
      <header style={{ 
        position: 'absolute', 
        top: 20, 
        left: 20, 
        right: 20, 
        zIndex: 100, 
        display: 'flex', 
        justifyContent: 'space-between',
        pointerEvents: 'none'
      }}>
        <div className="comic-btn" style={{ pointerEvents: 'auto', backgroundColor: '#FEF08A', transform: 'rotate(-2deg)' }} onClick={() => navigate('/')}>
          HOME
        </div>
        
        <div className="module-indicators" style={{ display: 'flex', gap: 10, pointerEvents: 'auto' }}>
          {MODULES.map((m, i) => {
            const isSolved = quizScores[m.id] === true
            const isFailed = quizScores[m.id] === false
            
            return (
              <div 
                key={m.id}
                className="comic-tag"
                style={{ 
                  backgroundColor: isSolved ? '#86EFAC' : (isFailed ? '#FCA5A5' : (activeModule === m.id ? m.color : 'var(--comic-paper)')),
                  cursor: 'pointer',
                  transform: `rotate(${i % 2 === 0 ? 2 : -2}deg) scale(${activeModule === m.id ? 1.2 : 1})`,
                  transition: 'all 0.2s',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  border: '3px solid #000',
                  boxShadow: activeModule === m.id ? '4px 4px 0 #000' : '2px 2px 0 #000',
                  color: '#000'
                }}
                onClick={() => scrollTo(m.id)}
              >
                {isSolved ? '✓' : (isFailed ? '✗' : i + 1)}
              </div>
            )
          })}
        </div>
      </header>

      {/* Main Content Viewport */}
      <div className="exp-scroll-container" ref={scrollRef}>
        {MODULES.map(m => (
          <Section 
            key={m.id} 
            module={m} 
            isActive={activeModule === m.id}
            onQuizAnswer={handleQuizAnswer}
          />
        ))}
      </div>
    </div>
  )
}
