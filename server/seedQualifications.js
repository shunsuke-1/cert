const mongoose = require("mongoose");
const Qualification = require("./models/Qualification");
require("dotenv").config();

const qualifications = [
  // IT Qualifications
  {
    name: "基本情報技術者試験",
    category: "IT",
    difficulty: "Intermediate",
    description: "ITエンジニアとしての基本的な知識・技能を問う国家試験",
    isOfficial: true,
  },
  {
    name: "応用情報技術者試験",
    category: "IT",
    difficulty: "Advanced",
    description: "高度IT人材となるために必要な応用的知識・技能を問う国家試験",
    isOfficial: true,
  },
  {
    name: "AWS認定ソリューションアーキテクト",
    category: "IT",
    difficulty: "Advanced",
    description: "AWSクラウドでのソリューション設計能力を証明する認定資格",
    isOfficial: true,
  },
  {
    name: "Oracle Java SE 11 認定資格",
    category: "IT",
    difficulty: "Intermediate",
    description: "Java SE 11の知識とスキルを証明するOracle認定資格",
    isOfficial: true,
  },
  
  // Business Qualifications
  {
    name: "日商簿記検定2級",
    category: "Business",
    difficulty: "Intermediate",
    description: "商業簿記・工業簿記の基本的な知識を問う検定試験",
    isOfficial: true,
  },
  {
    name: "中小企業診断士",
    category: "Business",
    difficulty: "Expert",
    description: "経営コンサルタントの国家資格",
    isOfficial: true,
  },
  {
    name: "宅地建物取引士",
    category: "Business",
    difficulty: "Advanced",
    description: "不動産取引の専門家としての国家資格",
    isOfficial: true,
  },
  
  // Language Qualifications
  {
    name: "TOEIC L&R",
    category: "Language",
    difficulty: "Intermediate",
    description: "英語によるコミュニケーション能力を測定するテスト",
    isOfficial: true,
  },
  {
    name: "英検準1級",
    category: "Language",
    difficulty: "Advanced",
    description: "実用英語技能検定準1級",
    isOfficial: true,
  },
  {
    name: "日本語能力試験N1",
    category: "Language",
    difficulty: "Expert",
    description: "日本語を母語としない人の日本語能力を測定するテスト",
    isOfficial: true,
  },
  
  // Finance Qualifications
  {
    name: "FP技能士2級",
    category: "Finance",
    difficulty: "Intermediate",
    description: "ファイナンシャル・プランニング技能検定2級",
    isOfficial: true,
  },
  {
    name: "証券外務員一種",
    category: "Finance",
    difficulty: "Intermediate",
    description: "証券業務に従事するための資格",
    isOfficial: true,
  },
  
  // Medical Qualifications
  {
    name: "医療事務技能審査試験",
    category: "Medical",
    difficulty: "Beginner",
    description: "医療事務の基本的な知識・技能を問う試験",
    isOfficial: true,
  },
  
  // Legal Qualifications
  {
    name: "行政書士",
    category: "Legal",
    difficulty: "Advanced",
    description: "行政手続きの専門家としての国家資格",
    isOfficial: true,
  },
  
  // Engineering Qualifications
  {
    name: "第二種電気工事士",
    category: "Engineering",
    difficulty: "Intermediate",
    description: "一般住宅や店舗などの電気工事を行うための国家資格",
    isOfficial: true,
  },
];

async function seedQualifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/certstudy");
    console.log("Connected to MongoDB");

    // Clear existing qualifications
    await Qualification.deleteMany({ isOfficial: true });
    console.log("Cleared existing official qualifications");

    // Insert new qualifications
    await Qualification.insertMany(qualifications);
    console.log(`Inserted ${qualifications.length} qualifications`);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding qualifications:", error);
    process.exit(1);
  }
}

seedQualifications();