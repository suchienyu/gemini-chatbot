import { Teacher, SupportedLanguage } from '@/lib/types';

export const TEACHER_CONFIG = {
  DEFAULT_LANGUAGE: 'en' as SupportedLanguage,
  AVAILABLE_TIME_RANGE: ["09:00", "10:00", "11:00", "12:00", "13:00"],
  BASE_HOURLY_RATE: 500,
  HOURLY_RATE_INCREMENT: 100,
  BASE_EXPERIENCE_YEARS: 5,
  // 修改這個名稱以匹配使用處
  TEACHER_COUNT: 3
} as const;

export const teacherData = {
    en: {
      teachers: [
        {
          id: 'teacher-1',
          name: 'Sarah Johnson',
          introduction: 'Experienced language teacher focusing on conversation skills. I believe in creating a comfortable learning environment where students can practice speaking naturally.',
          teachingStyle: 'Interactive & Conversation-focused',
          languages: ['English', 'Spanish'],
        },
        {
          id: 'teacher-2',
          name: 'Michael Chen',
          introduction: 'Specialized in business English with 8 years of corporate training experience. I help professionals improve their communication skills in business contexts.',
          teachingStyle: 'Business-oriented & Practical',
          languages: ['English', 'Chinese'],
        },
        {
          id: 'teacher-3',
          name: 'Emily Parker',
          introduction: 'Interactive teaching style perfect for beginners. I make learning fun and engaging through games, role-play, and real-life scenarios.',
          teachingStyle: 'Fun & Interactive',
          languages: ['English', 'French'],
        }
      ]
    },
    zh: {
      teachers: [
        {
          id: 'teacher-1',
          name: 'Sarah Johnson',
          introduction: '經驗豐富的語言教師，專注於會話技巧。我相信創造一個舒適的學習環境，讓學生能夠自然地練習口說。',
          teachingStyle: '互動式與會話導向',
          languages: ['英語', '西班牙語'],
        },
        {
          id: 'teacher-2',
          name: 'Michael Chen',
          introduction: '專精商業英語，擁有8年企業培訓經驗。我協助專業人士提升其商務溝通能力。',
          teachingStyle: '商務導向與實用性教學',
          languages: ['英語', '中文'],
        },
        {
          id: 'teacher-3',
          name: 'Emily Parker',
          introduction: '互動式教學特別適合初學者。我透過遊戲、角色扮演和真實場景讓學習變得有趣且引人入勝。',
          teachingStyle: '有趣且互動的教學方式',
          languages: ['英語', '法語'],
        }
      ]
    },
    ja: {
      teachers: [
        {
          id: 'teacher-1',
          name: 'Sarah Johnson',
          introduction: '会話力向上に重点を置いた経験豊富な語学講師です。生徒が自然に話せる快適な学習環境づくりを心がけています。',
          teachingStyle: 'インタラクティブ＆会話重視',
          languages: ['英語', 'スペイン語'],
        },
        {
          id: 'teacher-2',
          name: 'Michael Chen',
          introduction: 'ビジネス英語を専門とし、企業研修で8年の経験があります。ビジネスシーンでのコミュニケーション力向上をサポートします。',
          teachingStyle: 'ビジネス指向＆実践的',
          languages: ['英語', '中国語'],
        },
        {
          id: 'teacher-3',
          name: 'Emily Parker',
          introduction: '初心者に最適なインタラクティブな指導スタイル。ゲームやロールプレイ、実践的なシナリオを通じて、楽しく魅力的な学習を提供します。',
          teachingStyle: '楽しく双方向的な指導法',
          languages: ['英語', 'フランス語'],
        }
      ]
    },
    ko: {
      teachers: [
        {
          id: 'teacher-1',
          name: 'Sarah Johnson',
          introduction: '회화 실력 향상에 중점을 둔 경험 많은 어학 강사입니다. 학생들이 자연스럽게 말할 수 있는 편안한 학습 환경을 만드는 것을 지향합니다.',
          teachingStyle: '상호작용 및 회화 중심',
          languages: ['영어', '스페인어'],
        },
        {
          id: 'teacher-2',
          name: 'Michael Chen',
          introduction: '비즈니스 영어를 전문으로 하며 8년간의 기업 교육 경험이 있습니다. 비즈니스 상황에서의 의사소통 능력 향상을 도와드립니다.',
          teachingStyle: '비즈니스 지향 및 실용적 교육',
          languages: ['영어', '중국어'],
        },
        {
          id: 'teacher-3',
          name: 'Emily Parker',
          introduction: '초보자에게 완벽한 상호작용 교육 방식. 게임, 역할극, 실제 상황을 통해 재미있고 흥미로운 학습을 제공합니다.',
          teachingStyle: '즐겁고 상호작용적인 교육',
          languages: ['영어', '프랑스어'],
        }
      ]
    },
    es: {
      teachers: [
        {
          id: 'teacher-1',
          name: 'Sarah Johnson',
          introduction: 'Profesora de idiomas experimentada centrada en habilidades de conversación. Creo en crear un ambiente de aprendizaje cómodo donde los estudiantes puedan practicar hablar naturalmente.',
          teachingStyle: 'Interactivo y enfocado en la conversación',
          languages: ['Inglés', 'Español'],
        },
        {
          id: 'teacher-2',
          name: 'Michael Chen',
          introduction: 'Especializado en inglés de negocios con 8 años de experiencia en capacitación corporativa. Ayudo a profesionales a mejorar sus habilidades de comunicación en contextos empresariales.',
          teachingStyle: 'Orientado a negocios y práctico',
          languages: ['Inglés', 'Chino'],
        },
        {
          id: 'teacher-3',
          name: 'Emily Parker',
          introduction: 'Estilo de enseñanza interactivo perfecto para principiantes. Hago que el aprendizaje sea divertido y atractivo a través de juegos, juegos de roles y escenarios de la vida real.',
          teachingStyle: 'Divertido e interactivo',
          languages: ['Inglés', 'Francés'],
        }
      ]
    },
    fr: {
      teachers: [
        {
          id: 'teacher-1',
          name: 'Sarah Johnson',
          introduction: 'Professeure de langues expérimentée axée sur les compétences conversationnelles. Je crois en la création d\'un environnement d\'apprentissage confortable où les étudiants peuvent pratiquer la parole naturellement.',
          teachingStyle: 'Interactif et axé sur la conversation',
          languages: ['Anglais', 'Espagnol'],
        },
        {
          id: 'teacher-2',
          name: 'Michael Chen',
          introduction: 'Spécialisé dans l\'anglais des affaires avec 8 ans d\'expérience en formation d\'entreprise. J\'aide les professionnels à améliorer leurs compétences en communication dans des contextes commerciaux.',
          teachingStyle: 'Orienté business et pratique',
          languages: ['Anglais', 'Chinois'],
        },
        {
          id: 'teacher-3',
          name: 'Emily Parker',
          introduction: 'Style d\'enseignement interactif parfait pour les débutants. Je rends l\'apprentissage amusant et engageant grâce à des jeux, des jeux de rôle et des scénarios de la vie réelle.',
          teachingStyle: 'Amusant et interactif',
          languages: ['Anglais', 'Français'],
        }
      ]
    }
  };

  export function generateMockTeachers(
    count: number = TEACHER_CONFIG.TEACHER_COUNT, 
    language: SupportedLanguage = TEACHER_CONFIG.DEFAULT_LANGUAGE
  ): Teacher[] {
    if (!Object.keys(teacherData).includes(language)) {
      language = TEACHER_CONFIG.DEFAULT_LANGUAGE;
    }
  
    const teachers = teacherData[language].teachers.slice(0, count);
  
    return teachers.map((teacher, index) => ({
      ...teacher,
      email: `${teacher.name.toLowerCase().replace(' ', '.')}@example.com`,
      profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
      videoUrl: `https://example.com/videos/teacher${index + 1}`,
      yearsOfExperience: TEACHER_CONFIG.BASE_EXPERIENCE_YEARS + index,
      hourlyRate: TEACHER_CONFIG.BASE_HOURLY_RATE + (index * TEACHER_CONFIG.HOURLY_RATE_INCREMENT),
      languages: teacher.languages.map(lang => {
        // 根據當前語言返回對應的語言名稱
        const languageMap = {
          en: { English: 'English', Chinese: 'Chinese', Japanese: 'Japanese', French: 'French' },
          zh: { English: '英語', Chinese: '中文', Japanese: '日語', French: '法語' },
          ja: { English: '英語', Chinese: '中国語', Japanese: '日本語', French: 'フランス語' },
          ko: { English: '영어', Chinese: '중국어', Japanese: '일본어', French: '프랑스어' },
          es: { English: 'Inglés', Chinese: 'Chino', Japanese: 'Japonés', French: 'Francés' },
          fr: { English: 'Anglais', Chinese: 'Chinois', Japanese: 'Japonais', French: 'Français' }
        };
        return languageMap[language]?.[lang as keyof typeof languageMap.en] || lang;
      })
    }));
  }